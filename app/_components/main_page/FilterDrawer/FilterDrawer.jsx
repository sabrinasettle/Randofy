import { useState, useEffect, useMemo } from "react";
import { ArrowRight, X } from "lucide-react";
import GenresSection from "./GenresSection";
import SongDetailsSection from "./SongDetsSection";
import { useSpotifyContext } from "../../../context/spotify-context";

// Reusable TagList component
function TagList({ items, onRemove, className = "" }) {
  if (!items || items.size === 0) return null;

  const tagElements = Array.from(items, (item, index) => (
    <div
      key={index}
      className="group inline-flex items-center gap-2 pl-2 pr-1 py-1 border border-gray-300 hover:border-gray-700 rounded-md text-sm"
    >
      <span className="text-body-md text-gray-600 group-hover:text-gray-700">
        {item
          .split("-")
          .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
          .join(" ")}
      </span>
      <button
        onClick={() => onRemove(item)}
        className="text-gray-600 group-hover:text-gray-700 rounded-full transition-colors"
        aria-label={`Remove ${item}`}
      >
        <X size={20} />
      </button>
    </div>
  ));

  return (
    <div className={`flex flex-wrap gap-2 mt-2 ${className}`}>
      {tagElements}
    </div>
  );
}

export default function FilterDrawer({ isOpen, onClose }) {
  const [activePanel, setActivePanel] = useState("main");
  // const [sliderValue, setSliderValue] = useState(5);
  const [isVisible, setIsVisible] = useState(false);
  const [animateIn, setAnimateIn] = useState(false);

  // Filter states
  // const [selectedGenres, setSelectedGenres] = useState(new Set());

  // const [songDetailsFilters, setSongDetailsFilters] = useState({
  //   popularity: { min: 0.0, max: 1.0 },
  //   acoustics: { min: 0.0, max: 1.0 },
  //   energy: { min: 0.0, max: 1.0 },
  //   vocals: { min: 0.0, max: 1.0 },
  //   danceability: { min: 0.0, max: 1.0 },
  //   mood: { min: 0.0, max: 1.0 },
  // });

  const { spotifyClient } = useSpotifyContext();
  const songDetailsFilters = spotifyClient.songDetails;
  const selectedGenres = spotifyClient.genres;
  const sliderValue = spotifyClient.songLimit;

  // Remove functions for TagList
  const removeGenre = (genre) => {
    spotifyClient.setGenres((prev) => {
      prev.delete(genre);
      return prev;
    });
  };

  const removeSongDetailFilter = (filterName) => {
    spotifyClient.setSongDetails((prev) => ({
      // add the if statement back for logicing the popularity value
      ...prev,
      [filterName]: { min: 0.0, max: 1.0 },
    }));
  };

  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);

      // Ensure the drawer is rendered before transitioning
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setAnimateIn(true);
        });
      });
    } else {
      setAnimateIn(false);

      // Delay unmount to let transition play
      const timeout = setTimeout(() => {
        setIsVisible(false);
      }, 500); // matches transition duration

      return () => clearTimeout(timeout);
    }
  }, [isOpen]);

  const handleSliderChange = (e) => {
    spotifyClient.setSongLimit(parseInt(e.target.value));
    // update the filters through spotifyClient
  };

  const navigateToPanel = (panel) => {
    setActivePanel(panel);
  };

  const navigateBack = () => {
    setActivePanel("main");
  };

  const closeAndGet = () => {
    // spotifyClient.getSongs();
    onClose();
  };

  const clearFilters = () => {
    switch (activePanel) {
      case "genres":
        spotifyClient.setGenres(new Set());
        break;
      case "songDetails":
        spotifyClient.setSongDetails({
          popularity: { min: 0, max: 100 },
          acoustics: { min: 0.0, max: 1.0 },
          energy: { min: 0.0, max: 1.0 },
          vocals: { min: 0.0, max: 1.0 },
          danceability: { min: 0.0, max: 1.0 },
          mood: { min: 0.0, max: 1.0 },
        });
        break;
      case "main":
      default:
        // Clear all filters
        spotifyClient.setGenres(new Set());
        spotifyClient.setSongDetails({
          popularity: { min: 0, max: 100 },
          acoustics: { min: 0.0, max: 1.0 },
          energy: { min: 0.0, max: 1.0 },
          vocals: { min: 0.0, max: 1.0 },
          danceability: { min: 0.0, max: 1.0 },
          mood: { min: 0.0, max: 1.0 },
        });
        spotifyClient.setSongLimit(5);
        break;
    }
  };

  const handleSongDetailsFilterChange = (filterName, range) => {
    spotifyClient.setSongDetails((prev) => ({
      ...prev,
      [filterName]: range,
    }));
  };

  const changedSongDetailsCount = useMemo(() => {
    const defaultFilters = {
      popularity: { min: 0, max: 100 },
      acoustics: { min: 0.0, max: 1.0 },
      energy: { min: 0.0, max: 1.0 },
      vocals: { min: 0.0, max: 1.0 },
      danceability: { min: 0.0, max: 1.0 },
      mood: { min: 0.0, max: 1.0 },
    };

    return Object.keys(songDetailsFilters).filter((key) => {
      const current = songDetailsFilters[key];
      const defaultRange = defaultFilters[key];
      return (
        current.min !== defaultRange.min || current.max !== defaultRange.max
      );
    }).length;
  }, [songDetailsFilters]);

  // Get changed song detail filters for TagList
  const changedSongDetailFilters = useMemo(() => {
    const defaultFilters = {
      popularity: { min: 0, max: 100 },
      acoustics: { min: 0.0, max: 1.0 },
      energy: { min: 0.0, max: 1.0 },
      vocals: { min: 0.0, max: 1.0 },
      danceability: { min: 0.0, max: 1.0 },
      mood: { min: 0.0, max: 1.0 },
    };

    const changedFilters = new Set();
    Object.keys(songDetailsFilters).forEach((key) => {
      const current = songDetailsFilters[key];
      const defaultRange = defaultFilters[key];
      if (
        current.min !== defaultRange.min ||
        current.max !== defaultRange.max
      ) {
        changedFilters.add(key);
      }
    });
    return changedFilters;
  }, [songDetailsFilters]);

  // Views -------------------------------------------------------------------------------------------
  if (!isVisible) return null;

  const numberSongText =
    changedSongDetailFilters.size !== 0 || selectedGenres.size !== 0
      ? "random songs"
      : "Totally random songs";

  const renderMainView = () => (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="flex justify-between items-center p-4">
        <h1 className="text-gray-700 text-lg font-medium">Filter Songs</h1>
        <button onClick={onClose} className="text-gray-400 hover:text-white">
          <X size={24} />
        </button>
      </div>
      {/* Content */}
      <div className="flex-1 p-4">
        {/* Random Songs Slider */}
        <div className="mb-8">
          <label
            htmlFor="custom-range"
            className="flex flex-row items-center gap-2 pb-3"
          >
            <div className="py-1 px-2 border border-gray-300 rounded-sm text-gray-700 text-heading-4 min-w-[3rem] text-center">
              {sliderValue}
            </div>
            <p className="text-gray-700 text-heading-4">{numberSongText}</p>
          </label>

          <div className="relative">
            <input
              id="custom-range"
              type="range"
              min="5"
              max="100"
              value={sliderValue}
              onChange={handleSliderChange}
              className="w-full h-1 bg-gray-400 rounded-lg appearance-none cursor-pointer  slider"
            />
            <style jsx>{`
              .slider::-webkit-slider-thumb {
                appearance: none;
                height: 16px;
                width: 16px;
                border-radius: 50%;
                background: #e5e5e5;
                cursor: pointer;
                border: none;
              }
              .slider::-moz-range-thumb {
                height: 16px;
                width: 16px;
                border-radius: 50%;
                background: #e5e5e5;
                cursor: pointer;
                border: none;
              }
              .slider {
                background: linear-gradient(
                  to right,
                  #b2b2b2 0%,
                  #b2b2b2 ${((sliderValue - 5) / 95) * 100}%,
                  #4b4b4b ${((sliderValue - 5) / 95) * 100}%,
                  #4b4b4b 100%
                );
              }
            `}</style>
          </div>
        </div>

        {/* Navigation Items */}
        <div className="space-y-0">
          <div>
            <button
              onClick={() => navigateToPanel("songDetails")}
              className="group w-full h-12 bg-gray-000 hover:text-gray-700 border-t border-gray-200 flex items-center justify-between px-0 transition-colors"
            >
              <span className="text-gray-700">
                Song Details{" "}
                {changedSongDetailsCount !== 0 && (
                  <span>[{changedSongDetailsCount}]</span>
                )}
              </span>
              <ArrowRight
                size={20}
                className="text-gray-500 group-hover:text-gray-700 transition-colors"
              />
            </button>

            {changedSongDetailFilters.size !== 0 && (
              <div className="pt-4 pb-7">
                <p className="pb-2 text-heading-5 text-gray-700 font-medium">
                  Feeling and sounding like:
                </p>

                <TagList
                  items={changedSongDetailFilters}
                  onRemove={removeSongDetailFilter}
                />
              </div>
            )}
          </div>

          <div>
            <button
              onClick={() => navigateToPanel("genres")}
              className="group w-full h-12 bg-gray-000 hover:text-gray-700 border-t border-gray-200 flex items-center justify-between px-0 transition-colors"
            >
              <span className="text-gray-700">
                Genres{" "}
                {selectedGenres.size !== 0 && (
                  <span>[{selectedGenres.size}]</span>
                )}
              </span>
              <ArrowRight
                size={20}
                className="text-gray-500 group-hover:text-gray-700 transition-colors"
              />
            </button>

            {selectedGenres.size !== 0 && (
              <div className="pt-4">
                <p className="pb-2 text-heading-5 text-gray-700 font-medium">
                  From the genres of:
                </p>
                <TagList items={selectedGenres} onRemove={removeGenre} />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  const renderSongDetails = () => (
    <div className="h-full flex flex-col">
      <SongDetailsSection
        navigateBack={navigateBack}
        songDetailsFilters={songDetailsFilters}
        onFilterChange={handleSongDetailsFilterChange}
        changed={changedSongDetailsCount}
      />
    </div>
  );

  const renderGenres = () => (
    <div className="h-full flex flex-col">
      <GenresSection
        navigateBack={navigateBack}
        selectedGenres={selectedGenres}
      />
    </div>
  );

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop for main content */}
      <div className="absolute inset-0" onClick={onClose} />

      {/* Drawer Container */}
      <div
        className={`relative w-full md:w-lg h-full bg-gray-000 transform transition-transform duration-500 [ease:cubic-bezier(0.16,1,0.3,1)] ${
          animateIn ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Panel Container with full-height layout and left border */}
        <div className="relative w-full h-full flex flex-col border-l border-gray-300">
          {/* Sliding Panels Wrapper (scrollable area) */}
          <div className="flex-1 relative overflow-hidden">
            {/* Main Panel */}
            <div
              className={`absolute inset-0 w-full h-full overflow-auto bg-gray-000 transition-transform duration-300 ease-in-out ${
                activePanel === "main" ? "translate-x-0" : "-translate-x-full"
              }`}
            >
              {renderMainView()}
            </div>

            {/* Song Details Panel */}
            <div
              className={`absolute inset-0 w-full h-full overflow-auto bg-gray-000 transition-transform duration-300 ease-in-out ${
                activePanel === "songDetails"
                  ? "translate-x-0"
                  : "translate-x-full"
              }`}
            >
              {renderSongDetails()}
            </div>

            {/* Genres Panel */}
            <div
              className={`absolute inset-0 w-full h-full overflow-auto bg-gray-000 transition-transform duration-300 ease-in-out ${
                activePanel === "genres" ? "translate-x-0" : "translate-x-full"
              }`}
            >
              {renderGenres()}
            </div>
          </div>

          {/* Footer */}
          <div className="w-full flex flex-row justify-between px-4 py-4">
            <button
              className="py-2 px-1 text-gray-400 hover:text-white transition-colors"
              onClick={clearFilters}
            >
              Clear
            </button>
            <button
              className="px-6 py-2 bg-gray-600 border border-transparent hover:border-gray-600 hover:bg-gray-700 text-gray-000 rounded transition-colors duration-400 ease-in-out"
              onClick={() => closeAndGet()}
            >
              Get Songs
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
