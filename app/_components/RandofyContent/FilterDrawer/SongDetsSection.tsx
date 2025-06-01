"use client";
import {} from "react";
import DoubleEndedSlider from "../../ui/DoubleEndedSlider";
import { ArrowLeft } from "lucide-react";

export default function GenresSection({
  navigateBack,
  songDetailsFilters,
  onFilterChange,
}) {
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
        {/* {selectedGenres.size === 0 ? (
          <span className="text-lg font-normal text-gray-600">[]</span>
        ) : (
          <span className="font-semibold text-gray-700">[]</span>
        )} */}
      </div>

      {/* Content */}
      <div className="flex-1 p-4 overflow-y-auto">
        <DoubleEndedSlider
          label="Popularity"
          min={0}
          max={1}
          defaultMin={songDetailsFilters.popularity.min}
          defaultMax={songDetailsFilters.popularity.max}
          formatValue={(v) =>
            v === 0.1
              ? "Small dive bars"
              : v === 0.9
                ? "Massive concerts"
                : `${(v * 100).toFixed(0)}%`
          }
          onChange={(range) =>
            handleSongDetailsFilterChange("popularity", range)
          }
        />

        <DoubleEndedSlider
          label="Acoustics"
          min={0}
          max={1}
          defaultMin={songDetailsFilters.acoustics.min}
          defaultMax={songDetailsFilters.acoustics.max}
          formatValue={(v) =>
            v === 0.2
              ? "Completely electronic"
              : v === 0.8
                ? "Totally acoustic"
                : `${(v * 100).toFixed(0)}%`
          }
          onChange={(range) =>
            handleSongDetailsFilterChange("acoustics", range)
          }
        />

        <DoubleEndedSlider
          label="Energy"
          min={0}
          max={1}
          defaultMin={songDetailsFilters.energy.min}
          defaultMax={songDetailsFilters.energy.max}
          formatValue={(v) =>
            v === 0.3
              ? "Low and Moody"
              : v === 0.7
                ? "High and Joyful"
                : `${(v * 100).toFixed(0)}%`
          }
          onChange={(range) => handleSongDetailsFilterChange("energy", range)}
        />

        <DoubleEndedSlider
          label="Vocals"
          min={0}
          max={1}
          defaultMin={songDetailsFilters.vocals.min}
          defaultMax={songDetailsFilters.vocals.max}
          formatValue={(v) =>
            v === 0.1
              ? "No vocals"
              : v === 0.9
                ? "Only vocals"
                : `${(v * 100).toFixed(0)}%`
          }
          onChange={(range) => handleSongDetailsFilterChange("vocals", range)}
        />

        <DoubleEndedSlider
          label="Danceability"
          min={0}
          max={1}
          defaultMin={songDetailsFilters.danceability.min}
          defaultMax={songDetailsFilters.danceability.max}
          formatValue={(v) =>
            v === 0.2
              ? "No rhythm"
              : v === 0.8
                ? "Made for dancing"
                : `${(v * 100).toFixed(0)}%`
          }
          onChange={(range) =>
            handleSongDetailsFilterChange("danceability", range)
          }
        />

        <DoubleEndedSlider
          label="Mood"
          min={0}
          max={1}
          defaultMin={songDetailsFilters.mood.min}
          defaultMax={songDetailsFilters.mood.max}
          formatValue={(v) =>
            v === 0.3
              ? "Low Energy"
              : v === 0.7
                ? "High Energy"
                : `${(v * 100).toFixed(0)}%`
          }
          onChange={(range) => handleSongDetailsFilterChange("mood", range)}
        />
      </div>
    </>
  );
}
