"use client";
import {} from "react";
import DoubleEndedSlider from "../../ui/DoubleEndedSlider";
import { ArrowLeft } from "lucide-react";
import { useSpotifyContext } from "../../../context/spotify-context";

export default function SongDetailsSection({
  navigateBack,
  songDetailsFilters,
  onFilterChange,
  changed,
}) {
  const { spotifyClient } = useSpotifyContext();
  const valueStrings = spotifyClient?.valueStrings;

  const handleSongDetailsFilterChange = (filterName, range) => {
    onFilterChange(filterName, range);
  };

  return (
    <>
      <div className="p-4 flex flex-row justify-between">
        <button
          onClick={navigateBack}
          className="flex items-center gap-4 text-gray-400 hover:text-white"
        >
          <ArrowLeft size={20} />
          <h1 className="text-white text-lg font-medium">Song Details</h1>
        </button>
        {changed === 0 ? (
          <span className="text-lg font-normal text-gray-600">[{changed}]</span>
        ) : (
          <span className="text-lg font-semibold text-gray-700">
            [{changed}]
          </span>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 p-4 overflow-y-auto">
        <div className="flex flex-col gap-6">
          {Object.keys(songDetailsFilters).map((key) => (
            <DoubleEndedSlider
              key={key}
              label={key.charAt(0).toUpperCase() + key.slice(1)} // Capitalizes the label
              value={songDetailsFilters[key]} // Use the actual key
              onChange={(newRange) =>
                handleSongDetailsFilterChange(key, newRange)
              } // Pass key to handler
              valueStrings={valueStrings}
            />
          ))}
        </div>
      </div>
    </>
  );
}
