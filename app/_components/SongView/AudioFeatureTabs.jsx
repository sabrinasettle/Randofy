import React, { useState, useRef, useEffect } from "react";
// import { useSongViewContext } from "../../context/song-view-context";
import { millisToMinutesAndSeconds } from "../../utils/convertMilliseconds.js";
import { formatYear } from "../../utils/formatYear.js";

const RadarChart = ({ data, size = 200 }) => {
  const center = size / 2;
  const radius = size * 0.35;

  // 5 attributes, evenly spaced (360 / 5 = 72 degrees apart)
  const attributes = [
    { key: "energy", label: "Energy", angle: 0 },
    { key: "danceability", label: "Danceability", angle: 72 },
    { key: "acoustics", label: "Acoustics", angle: 144 },
    { key: "mood", label: "Mood", angle: 216 },
    { key: "popularity", label: "Popularity", angle: 288 },
  ];

  const getPoint = (angle, distance) => {
    const rad = (angle - 90) * (Math.PI / 180);
    return {
      x: center + Math.cos(rad) * distance,
      y: center + Math.sin(rad) * distance,
    };
  };

  const createPolygon = (radiusMultiplier) => {
    return attributes
      .map((attr) => getPoint(attr.angle, radius * radiusMultiplier))
      .map((pt) => `${pt.x},${pt.y}`)
      .join(" ");
  };

  const dataPoints = attributes.map((attr) => {
    const rawValue = data[attr.key] || 0;
    const value = attr.key === "popularity" ? rawValue / 100 : rawValue;
    return getPoint(attr.angle, radius * value);
  });

  const dataPolygon = dataPoints.map((pt) => `${pt.x},${pt.y}`).join(" ");

  return (
    <div className="flex justify-center items-center py-5">
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="absolute left-0 top-0">
          {/* Grid lines and axes */}
          <g className="opacity-30">
            {[0.25, 0.5, 0.75, 1].map((multiplier) => (
              <polygon
                key={multiplier}
                points={createPolygon(multiplier)}
                fill="none"
                stroke="#E5E5E5"
                strokeWidth="1"
              />
            ))}
            {attributes.map((attr) => {
              const end = getPoint(attr.angle, radius);
              return (
                <line
                  key={attr.key}
                  x1={center}
                  y1={center}
                  x2={end.x}
                  y2={end.y}
                  stroke="#E5E5E5"
                  strokeWidth="1"
                />
              );
            })}
          </g>

          {/* Data polygon */}
          <polygon
            points={dataPolygon}
            fill="rgba(229, 229, 229, 0.3)"
            stroke="#E5E5E5"
            strokeWidth="2"
          />

          {/* Data points */}
          {dataPoints.map((pt, i) => (
            <circle key={i} cx={pt.x} cy={pt.y} r="3" fill="#E5E5E5" />
          ))}
        </svg>

        {/* Labels */}
        {attributes.map((attr) => {
          const labelDistance = radius + 20;
          const labelPoint = getPoint(attr.angle, labelDistance);
          const alignment =
            attr.angle === 0
              ? "center"
              : attr.angle < 180
                ? "left"
                : attr.angle === 180
                  ? "center"
                  : "right";

          return (
            <div
              key={attr.key}
              className="absolute font-body text-xs text-gray-600 whitespace-nowrap"
              style={{
                left: labelPoint.x,
                top: labelPoint.y,
                transform:
                  alignment === "center"
                    ? "translate(-50%, -50%)"
                    : alignment === "left"
                      ? "translateY(-50%)"
                      : "translate(-100%, -50%)",
              }}
            >
              {attr.label}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default function AudioFeatureTabs({ song }) {
  const [activeTab, setActiveTab] = useState(0); // Track which tab is selected
  const [hoveredTab, setHoveredTab] = useState(null); // Track which tab is hovered
  const [hoverStyle, setHoverStyle] = useState({ x: 0, width: 0 }); // Style for hover background
  const [activeStyle, setActiveStyle] = useState({ x: 0, width: 0 }); // Style for active tab underline

  const tabsRef = useRef([]); // Reference each tab button
  const containerRef = useRef(null); // Reference the tab container

  // Define the tab labels and content
  const tabs = [
    {
      label: "Song Details",
      content: (
        <div className="py-2 space-y-4">
          {/* Song metadata */}
          <div className="flex flex-col gap-2">
            <span className="text-sm font-medium text-gray-700">General:</span>

            <div className="space-y-1">
              <div className="flex gap-2 text-gray-600 text-sm">
                <span>Album:</span>
                <span className="text-gray-700">{song.album_name}</span>
              </div>
              <div className="flex gap-2 text-gray-600 text-sm">
                <span>Length:</span>
                <span className="text-gray-700">
                  {millisToMinutesAndSeconds(song.song_length)}
                </span>
              </div>
              <div className="flex gap-2 text-gray-600 text-sm">
                <span>Year:</span>
                <span className="text-gray-700">{formatYear(song)}</span>
              </div>
              <div className="flex gap-2 text-gray-600 text-sm">
                <span>Randomized On:</span>
                <span className="text-gray-700">{song.date}</span>
              </div>
            </div>
          </div>
          {/* Song genres */}
          <div className="flex flex-col gap-2">
            <span className="text-sm font-medium text-gray-700">Genres:</span>
            {song.genres.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {song.genres.map((g, i) => (
                  <span
                    key={i}
                    className="text-sm text-gray-700 bg-gray-200 px-3 py-1 rounded-sm"
                  >
                    {g}
                  </span>
                ))}
              </div>
            ) : (
              <span className="text-sm text-gray-700">No genres available</span>
            )}
          </div>
        </div>
      ),
    },
    {
      label: "Song Features",
      content: (
        <div>
          <RadarChart
            data={{
              popularity: song.popularity,
              acoustics: song.audioFeatures.acousticness,
              energy: song.audioFeatures.energy,
              danceability: song.audioFeatures.danceability,
              mood: song.audioFeatures.valence,
            }}
            size={280}
          />
        </div>
      ),
    },
  ];

  // Update hover or active style based on tab's position and width
  const updateStyle = (index, setter) => {
    const tab = tabsRef.current[index];
    const container = containerRef.current;
    if (!tab || !container) return;

    const tabRect = tab.getBoundingClientRect();
    const containerRect = container.getBoundingClientRect();
    const x = tabRect.left - containerRect.left;
    const width = tabRect.width;

    setter({ x, width });
  };

  // Update active tab underline style when tab changes
  useEffect(() => {
    updateStyle(activeTab, setActiveStyle);
  }, [activeTab]);

  // Update positions on resize
  useEffect(() => {
    const handleResize = () => {
      updateStyle(activeTab, setActiveStyle);
      if (hoveredTab != null) updateStyle(hoveredTab, setHoverStyle);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [hoveredTab, activeTab]);

  return (
    <div className="w-full h-full mt-4 mx-auto">
      <div className="relative flex w-full pb-2" ref={containerRef}>
        {/* Overall bottom border */}
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gray-300 z-0 pointer-events-none" />

        {/* Hover indicator pill */}
        <div
          className={`absolute bg-gray-100 rounded-md transition-all duration-300 ease-out z-10 pointer-events-none ${
            hoveredTab === null ? "opacity-0" : "opacity-100"
          }`}
          style={{
            top: "0px",
            bottom: "8px",
            transform: `translateX(${hoverStyle.x}px)`,
            width: `${hoverStyle.width}px`,
          }}
        />

        {/* Active tab indicator — overrides gray line */}
        <div
          className="absolute bottom-0 h-px bg-gray-700 transition-all duration-300 ease-out z-20 pointer-events-none"
          style={{
            transform: `translateX(${activeStyle.x}px)`,
            width: `${activeStyle.width}px`,
          }}
        />

        {/* Tab buttons */}
        {tabs.map((tab, i) => (
          <button
            key={i}
            ref={(el) => (tabsRef.current[i] = el)}
            className={`relative z-30 px-4 py-2 text-sm font-medium transition-colors duration-150 ${
              activeTab === i
                ? "text-gray-700"
                : "text-gray-600 hover:text-gray-700"
            }`}
            onClick={() => {
              setActiveTab(i);
              updateStyle(i, setActiveStyle);
            }}
            onMouseEnter={() => {
              setHoveredTab(i);
              updateStyle(i, setHoverStyle);
            }}
            onMouseLeave={() => {
              setHoveredTab(null);
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="mt-4 h-full">{tabs[activeTab].content}</div>
    </div>
  );
}
