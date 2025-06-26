import { ArrowUp } from "lucide-react";
import { useSongViewContext } from "../../context/song-view-context";

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
              className="absolute text-xs text-gray-600 whitespace-nowrap"
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

export default function AudioFeatureDrawers({
  song,
  activeSection,
  setActiveSection,
}) {
  const { songViewContext } = useSongViewContext();

  return (
    <>
      {/* Genres Expandable Section */}
      {song.genres.length > 0 && (
        <div className="border-t border-gray-200">
          <button
            onClick={() => {
              if (activeSection === "genres") {
                // setActiveSection(null);
                songViewContext.handleDrawerClosed(); // ✅ Closing section
              } else {
                // setActiveSection("genres");
                songViewContext.handleDrawerOpen("genres"); // ✅ Opening section
              }
            }}
            className="group w-full h-12 hover:text-gray-300 flex items-center justify-between px-0 transition-colors"
          >
            <span className="text-body-md md:text-body-sm text-gray-700">
              Genres
            </span>
            <ArrowUp
              size={20}
              className={` group-hover:text-gray-600 transition-all duration-300 ${
                activeSection === "genres" ? "rotate-180" : ""
              } ${activeSection === "genres" ? "text-gray-700" : "text-gray-400"}`}
            />
          </button>

          {/* Genres Expandable Content */}
          <div
            className="overflow-hidden transition-all duration-500 ease-out"
            style={{
              height: activeSection === "genres" ? "120px" : "0px",
            }}
          >
            <div className="py-4">
              <div className="flex flex-wrap gap-2">
                {song.genres.map((genre, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-gray-200 text-white text-body-sm rounded-full"
                  >
                    {genre}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
      {/* Song Details Expandable Section */}
      <div className="justify-end border-t border-gray-200">
        {/* Song Details Button */}
        <button
          onClick={() => {
            if (activeSection === "details") {
              // setActiveSection(null);
              songViewContext.handleDrawerClosed(); // ✅ Closing section
            } else {
              // setActiveSection("details");
              songViewContext.handleDrawerOpen("details"); // ✅ Opening section
            }
          }}
          className="group w-full h-12 hover:text-gray-300 flex items-center justify-between px-0 transition-colors"
        >
          <span className="text-body-md md:text-body-sm text-gray-700">
            Audio Details
          </span>
          <ArrowUp
            size={20}
            className={`group-hover:text-gray-600 transition-all duration-300 ${
              activeSection === "details" ? "rotate-180" : ""
            } ${
              activeSection === "details" ? "text-gray-700" : "text-gray-400"
            }`}
          />
        </button>

        {/* Song Details Expandable Content */}
        <div
          className="overflow-hidden transition-all duration-500 ease-out"
          style={{
            height: activeSection === "details" ? "min-content" : "0px",
          }}
        >
          <div className="">
            {/* Radar Chart */}
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
        </div>
      </div>
    </>
  );
}
