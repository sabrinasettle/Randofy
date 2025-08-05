import { useState, useEffect, useMemo } from "react";
import { ArrowRight, X } from "lucide-react";
import GenresSection from "./GenresSection";
import SongDetailsSection from "./SongDetsSection";
import { useHistoryContext } from "../../../context/history-context";
import TagList from "./TagList";
import DateFilterTabs from "./DateFilter";

export default function FilterDrawer({ isOpen, onClose }) {
  // from History Content
  const { historyContext } = useHistoryContext();
  const { dateRangeFilter } = historyContext;

  const [activePanel, setActivePanel] = useState("main");
  const [isVisible, setIsVisible] = useState(false);
  const [animateIn, setAnimateIn] = useState(false);

  const songDetailsFilters = historyContext.songFeaturesFilters;
  const selectedGenres = historyContext.genreFilters;
  const valueStrings = historyContext?.songFeatureStrings || {};
  const allSongs = historyContext.songHistory.allSongsChronological;

  function updateDateFilter(filterString) {
    historyContext.setDateRangeFilter(filterString);
  }

  // Debug: Log valueStrings to see what keys are available
  // console.log("valueStrings:", valueStrings);

  // Define default filters consistently in one place
  const defaultFilters = {
    popularity: { min: 0.0, max: 1.0 },
    acoustics: { min: 0.0, max: 1.0 },
    energy: { min: 0.0, max: 1.0 },
    vocals: { min: 0.0, max: 1.0 },
    danceability: { min: 0.0, max: 1.0 },
    mood: { min: 0.0, max: 1.0 },
  };

  // Safe valueStrings access helper
  const getSafeValueStrings = () => {
    if (!valueStrings || typeof valueStrings !== "object") {
      return {};
    }

    // Ensure all filter keys have safe arrays
    const safeValueStrings = {};
    Object.keys(defaultFilters).forEach((key) => {
      const keyLower = key.toLowerCase();
      if (valueStrings[keyLower] && Array.isArray(valueStrings[keyLower])) {
        safeValueStrings[keyLower] = valueStrings[keyLower];
      } else {
        // Provide fallback array if missing
        safeValueStrings[keyLower] = ["Low", "Medium", "High"];
      }
    });

    return safeValueStrings;
  };

  // Remove functions for TagList
  const removeGenre = (genre) => {
    historyContext.setGenreFilters((prev) => {
      const newSet = new Set(prev);
      newSet.delete(genre);
      return newSet;
    });
  };

  const removeSongDetailFilter = (filterName) => {
    // Ensure we have a valid filter name
    if (!filterName || !defaultFilters[filterName]) {
      console.warn(`Invalid filter name: ${filterName}`);
      return;
    }

    historyContext.setSongFeaturesFilters((prev) => ({
      ...prev,
      [filterName]: { ...defaultFilters[filterName] }, // Use the consistent default
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

  const navigateToPanel = (panel) => {
    setActivePanel(panel);
  };

  const navigateBack = () => {
    setActivePanel("main");
  };

  const closeAndFilter = () => {
    // update and filter the song on hitting this button
    onClose();
  };

  const clearFilters = () => {
    switch (activePanel) {
      case "genres":
        historyContext.setGenreFilters(new Set());
        break;
      case "songDetails":
        historyContext.setSongFeaturesFilters({ ...defaultFilters }); // Use consistent defaults
        break;
      case "main":
      default:
        // Clear all filters
        historyContext.setGenreFilters(new Set());
        historyContext.setSongFeaturesFilters({ ...defaultFilters }); // Use consistent defaults
        historyContext.setDateRangeFilter("All");
        break;
    }
  };

  // changes the state in the context
  const handleSongDetailsFilterChange = (filterName, range) => {
    historyContext.setSongFeaturesFilters((prev) => ({
      ...prev,
      [filterName]: range,
    }));
  };

  //count of the changed Song details
  const changedSongDetailsCount = useMemo(() => {
    return Object.keys(songDetailsFilters).filter((key) => {
      const current = songDetailsFilters[key];
      const defaultRange = defaultFilters[key];
      return (
        current.min !== defaultRange?.min || current.max !== defaultRange?.max
      );
    }).length;
  }, [songDetailsFilters]);

  //get a total of filters changed
  const totalChangedFilters = useMemo(() => {
    return (
      changedSongDetailsCount +
      selectedGenres.size +
      (dateRangeFilter !== "All" ? 1 : 0)
    );
  }, [changedSongDetailsCount, selectedGenres, dateRangeFilter]);

  // Get changed song detail filters for TagList
  const changedSongDetailFilters = useMemo(() => {
    const changedFilters = new Set();
    Object.keys(historyContext.setSongFeaturesFilters).forEach((key) => {
      const current = historyContext.setSongFeaturesFilters[key];
      const defaultRange = defaultFilters[key];
      if (
        current.min !== defaultRange?.min ||
        current.max !== defaultRange?.max
      ) {
        changedFilters.add(key);
      }
    });
    return changedFilters;
  }, [historyContext.setSongFeaturesFilters]);

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
        <h1 className="text-gray-700 text-body-lg font-body">
          Filter Song History
        </h1>
        <button onClick={onClose} className="text-gray-400 hover:text-white">
          <X size={24} />
        </button>
      </div>
      {/* Content */}
      <div className="flex-1 p-4">
        {/* Filters */}
        <div className="mb-8">
          <DateFilterTabs
            updateFilter={updateDateFilter}
            historyFilter={dateRangeFilter}
          />
        </div>

        {/* Navigation Items */}
        <div className="space-y-0">
          <div>
            <button
              onClick={() => navigateToPanel("songDetails")}
              className="group w-full h-12 bg-gray-000 hover:text-gray-700 border-t border-gray-200 flex items-center justify-between px-0 transition-colors"
            >
              <span className="text-gray-700 font-body">
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
                <p className="pb-2  text-gray-700 font-body text-body-md">
                  Feeling and sounding like:
                </p>

                <TagList
                  items={songDetailsFilters} // Pass the full songDetailsFilters object
                  onRemove={removeSongDetailFilter}
                  valueStrings={getSafeValueStrings()}
                  defaultFilters={defaultFilters} // Pass defaultFilters so TagList can filter internally
                />
              </div>
            )}
          </div>

          <div>
            <button
              onClick={() => navigateToPanel("genres")}
              className="group w-full h-12 bg-gray-000 hover:text-gray-700 border-t border-gray-200 flex items-center justify-between px-0 transition-colors"
            >
              <span className="text-gray-700 font-body">
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
                <p className="pb-2  text-gray-700 font-body text-body-md">
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
    <div className="fixed inset-0 z-50 h-full flex justify-end">
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
              className="py-2 px-1 text-gray-400 hover:text-white transition-colors font-body"
              onClick={clearFilters}
            >
              Clear
            </button>
            <button
              className="px-6 py-2 bg-gray-600 border border-transparent hover:border-gray-600 hover:bg-gray-700 text-gray-000 rounded transition-colors duration-400 ease-in-out font-body"
              onClick={() => closeAndFilter()}
            >
              View (number)
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
