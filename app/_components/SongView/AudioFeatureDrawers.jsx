import { ArrowUp } from "lucide-react";
import { useSongViewContext } from "../../context/song-view-context";

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
            {[0.25, 0.5, 0.75, 1.0].map((multiplier) => (
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

export default function AudioFeatureDrawers({
  song,
  activeSection,
  setActiveSection,
}) {
  const { songViewContext } = useSongViewContext();

  return (
    <>
      {/* Genres Expandable Section */}
      <div className="border-t border-gray-200">
        <button
          onClick={() => {
            if (activeSection === "genres") {
              setActiveSection(null);
              songViewContext.markDrawerOpen();
            } else {
              setActiveSection("genres");
              songViewContext.markDrawerOpen();
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
                  className="px-3 py-1 bg-gray-200 text-white text-body-sm rounded-full hover:bg-gray-600 transition-colors cursor-pointer"
                >
                  {genre}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
      {/* Song Details Expandable Section */}
      <div className="justify-end border-t border-gray-200">
        {/* Song Details Button */}
        <button
          onClick={() => {
            if (activeSection === "details") {
              setActiveSection(null);
              songViewContext.markDrawerOpen();
            } else {
              setActiveSection("details");
              songViewContext.markDrawerOpen();
            }
          }}
          className="group w-full h-12 hover:text-gray-300 flex items-center justify-between px-0 transition-colors"
        >
          <span className="text-body-md md:text-body-sm text-gray-700">
            Song Details
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
                acoustics: song.acoustics,
                energy: song.energy,
                vocals: song.vocals,
                danceability: song.danceability,
                mood: song.mood,
              }}
              size={280}
            />
          </div>
        </div>
      </div>
    </>
  );
}
