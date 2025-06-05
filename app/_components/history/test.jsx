import React, { useState } from "react";
import {
  ArrowRight,
  X,
  Play,
  Plus,
  Share2,
  Calendar,
  Clock,
  Disc3,
} from "lucide-react";

// Mock data for demonstration - replace with your actual props
const mockSong = {
  track_name: "Cross My Heart I Hope U Die",
  album_name: "Cross My Heart I Hope U Die",
  album_image: { url: "/api/placeholder/240/240" },
  is_explicit: true,
  song_length: 169000, // 2:49 in milliseconds
  release_year: "2020",
  color: "#D2506B",
  // Song details for radar chart
  popularity: 0.7,
  acoustics: 0.3,
  energy: 0.8,
  vocals: 0.6,
  danceability: 0.9,
  mood: 0.4,
  genres: ["Pop", "Electronic", "Indie"],
  // Additional song details
  bpm: 128,
  key: "C Major",
  producer: "Sarah Johnson",
  label: "Indie Records",
};

const mockArtists = "Meg Smith";

// Custom Hexagonal Radar Chart Component
const RadarChart = ({ data, size = 200 }) => {
  const center = size / 2;
  const radius = size * 0.35;

  const attributes = [
    { key: "energy", label: "Energy", angle: 0 },
    { key: "danceability", label: "Danceability", angle: 60 },
    { key: "acoustics", label: "Acoustics", angle: 120 },
    { key: "vocals", label: "Vocals", angle: 180 },
    { key: "mood", label: "Mood", angle: 240 },
    { key: "popularity", label: "Popularity", angle: 300 },
  ];

  const getPoint = (angle, distance) => {
    const radian = (angle - 90) * (Math.PI / 180);
    return {
      x: center + Math.cos(radian) * distance,
      y: center + Math.sin(radian) * distance,
    };
  };

  // Create hexagon points for grid lines
  const createHexagon = (radiusMultiplier) => {
    return attributes
      .map((attr) => getPoint(attr.angle, radius * radiusMultiplier))
      .map((point) => `${point.x},${point.y}`)
      .join(" ");
  };

  // Create data polygon
  const dataPoints = attributes.map((attr) => {
    const value = data[attr.key] || 0;
    return getPoint(attr.angle, radius * value);
  });

  const dataPolygon = dataPoints
    .map((point) => `${point.x},${point.y}`)
    .join(" ");

  return (
    <div className="flex justify-center items-center py-8">
      <div className="relative">
        <svg width={size} height={size} className="overflow-visible">
          {/* Grid lines */}
          <g className="opacity-30">
            {[0.2, 0.4, 0.6, 0.8, 1.0].map((multiplier) => (
              <polygon
                key={multiplier}
                points={createHexagon(multiplier)}
                fill="none"
                stroke="rgba(255,255,255,0.3)"
                strokeWidth="1"
              />
            ))}

            {/* Axis lines */}
            {attributes.map((attr) => {
              const endPoint = getPoint(attr.angle, radius);
              return (
                <line
                  key={attr.key}
                  x1={center}
                  y1={center}
                  x2={endPoint.x}
                  y2={endPoint.y}
                  stroke="rgba(255,255,255,0.3)"
                  strokeWidth="1"
                />
              );
            })}
          </g>

          {/* Data polygon */}
          <polygon
            points={dataPolygon}
            fill="rgba(210, 80, 107, 0.3)"
            stroke="rgba(210, 80, 107, 0.8)"
            strokeWidth="2"
          />

          {/* Data points */}
          {dataPoints.map((point, index) => (
            <circle
              key={index}
              cx={point.x}
              cy={point.y}
              r="3"
              fill="rgba(210, 80, 107, 1)"
            />
          ))}
        </svg>

        {/* Labels */}
        {attributes.map((attr) => {
          const labelPoint = getPoint(attr.angle, radius + 25);
          return (
            <div
              key={attr.key}
              className="absolute text-xs text-gray-300 transform -translate-x-1/2 -translate-y-1/2"
              style={{
                left: labelPoint.x,
                top: labelPoint.y,
                transform: `translate(-50%, -50%) rotate(${attr.angle > 90 && attr.angle < 270 ? attr.angle + 180 : attr.angle}deg)`,
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

export default function SongDrawer({ song = mockSong, isOpen = true }) {
  const [activeSection, setActiveSection] = useState(null); // 'details' or 'genres' or null

  if (!song.track_name) {
    return <div className="hidden"></div>;
  }

  const handleClose = () => {
    console.log("Close drawer");
  };

  function formatYear() {
    const yearRegex = /^\d{4}/;
    const match = song.release_year?.match(yearRegex);
    return match ? match[0] : null;
  }

  function msToMinutesSeconds(ms) {
    let seconds = Math.floor(ms / 1000);
    let minutes = Math.floor(seconds / 60);
    seconds = seconds % 60;
    seconds = seconds < 10 ? "0" + seconds : seconds;
    return minutes + ":" + seconds;
  }

  const artists = mockArtists;
  const promColor = song.color;

  return (
    <div
      className="w-full border rounded-sm text-gray-600 border-gray-200 z-10 relative overflow-hidden"
      style={{
        height: "calc(100vh - 100px)",
        backgroundImage: `radial-gradient(at 50% 45%, ${promColor}40, #0A0A0A 80%)`,
      }}
    >
      <div className="h-full flex flex-col px-4 pt-3 pb-1 box-border">
        {/* Header with close button */}
        <div className="w-full flex flex-row justify-end">
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-white pb-2"
          >
            <X size={24} />
          </button>
        </div>

        {/* Song title and artist */}
        <div className="mb-5">
          <h1 className="text-2xl md:text-3xl font-semibold text-white mb-2">
            {song.track_name}
          </h1>
          <div className="flex flex-row items-center gap-2">
            {song.is_explicit && (
              <div className="w-4 h-[18px] flex justify-center items-center text-white bg-gray-700 rounded-sm text-xs">
                E
              </div>
            )}
            <h2 className="text-sm text-gray-300">{artists}</h2>
          </div>
        </div>

        {/* Album cover */}
        <div className="flex w-full items-center justify-center pb-5">
          <img
            className="rounded-lg"
            src={song.album_image.url}
            height={activeSection ? 120 : 240}
            width={activeSection ? 120 : 240}
            alt={`Album cover for ${song.album_name} by ${artists}`}
            style={{
              transition: "all 0.5s ease",
              height: activeSection ? "120px" : "240px",
              width: activeSection ? "120px" : "240px",
            }}
          />
        </div>

        {/* Audio controls */}
        <div className="mb-6">
          {/* Progress bar */}
          <div className="w-full bg-gray-600 rounded-full h-1 mb-4">
            <div
              className="bg-white h-1 rounded-full relative"
              style={{ width: "30%" }}
            >
              <div className="absolute right-0 top-1/2 transform translate-x-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full"></div>
            </div>
          </div>

          {/* Control buttons */}
          <div className="flex items-center justify-between">
            <button className="w-12 h-12 bg-white rounded-full flex items-center justify-center hover:bg-gray-100 transition-colors">
              <Play size={20} className="text-black ml-1" fill="black" />
            </button>

            <div className="flex gap-4">
              <button className="text-gray-300 hover:text-white transition-colors">
                <Plus size={24} />
              </button>
              <button className="text-gray-300 hover:text-white transition-colors">
                <Share2 size={24} />
              </button>
            </div>
          </div>
        </div>

        {/* Song basic info - visible when sections are closed */}
        <div
          className="mb-4 space-y-2 transition-all duration-500 ease-out overflow-hidden"
          style={{
            height: activeSection ? "0px" : "auto",
            opacity: activeSection ? 0 : 1,
            marginBottom: activeSection ? "0px" : "16px",
          }}
        >
          <div className="flex items-center gap-3 text-gray-300">
            <Disc3 size={16} />
            <span className="text-sm">{song.album_name}</span>
          </div>
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2 text-gray-300">
              <Clock size={16} />
              <span className="text-sm">
                {msToMinutesSeconds(song.song_length)}
              </span>
            </div>
            <div className="flex items-center gap-2 text-gray-300">
              <Calendar size={16} />
              <span className="text-sm">{formatYear()}</span>
            </div>
          </div>
        </div>

        {/* Spacer to push content to bottom */}
        <div className="flex-1"></div>

        {/* Song Details Expandable Section */}
        <div className="border-t border-gray-600">
          {/* Song Details Button */}
          <button
            onClick={() => {
              if (activeSection === "details") {
                setActiveSection(null);
              } else {
                setActiveSection("details");
              }
            }}
            className="group w-full h-12 hover:text-gray-300 flex items-center justify-between px-0 transition-colors"
          >
            <span className="text-white">Song Details</span>
            <ArrowRight
              size={20}
              className={`text-gray-400 group-hover:text-gray-300 transition-all duration-300 ${
                activeSection === "details" ? "rotate-90" : ""
              }`}
            />
          </button>

          {/* Song Details Expandable Content */}
          <div
            className="overflow-hidden transition-all duration-500 ease-out"
            style={{
              height: activeSection === "details" ? "450px" : "0px",
            }}
          >
            <div className="py-4">
              {/* Radar Chart */}
              <RadarChart
                data={{
                  popularity: song.popularity,
                  acoustics: song.acoustics,
                  energy: song.energy,
                  vocals: song.vocals,
                  danceability: song.danceability,
                  mood: song.mood,
                }}
                size={280}
              />

              {/* Additional song details */}
              <div className="mt-4 space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-400">BPM</span>
                  <span className="text-white">{song.bpm}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Key</span>
                  <span className="text-white">{song.key}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Producer</span>
                  <span className="text-white">{song.producer}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Label</span>
                  <span className="text-white">{song.label}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Genres Expandable Section */}
        <div className="border-t border-gray-600">
          <button
            onClick={() => {
              if (activeSection === "genres") {
                setActiveSection(null);
              } else {
                setActiveSection("genres");
              }
            }}
            className="group w-full h-12 hover:text-gray-300 flex items-center justify-between px-0 transition-colors"
          >
            <span className="text-white">Genres</span>
            <ArrowRight
              size={20}
              className={`text-gray-400 group-hover:text-gray-300 transition-all duration-300 ${
                activeSection === "genres" ? "rotate-90" : ""
              }`}
            />
          </button>

          <div className="border-t border-gray-600">
            <button
              onClick={() => {
                if (activeSection === "genres") {
                  setActiveSection(null);
                } else {
                  setActiveSection("genres");
                }
              }}
              className="group w-full h-12 hover:text-gray-300 flex items-center justify-between px-0 transition-colors"
            >
              <span className="text-white">Genres</span>
              <ArrowRight
                size={20}
                className={`text-gray-400 group-hover:text-gray-300 transition-all duration-300 ${
                  activeSection === "genres" ? "rotate-90" : ""
                }`}
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
                      className="px-3 py-1 bg-gray-700 text-white text-sm rounded-full hover:bg-gray-600 transition-colors cursor-pointer"
                    >
                      {genre}
                    </span>
                  ))}
                </div>
                <div className="mt-4 text-xs text-gray-400">
                  Tap on a genre to explore similar music
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
