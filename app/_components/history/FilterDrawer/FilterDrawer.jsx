import { useState, useEffect, useMemo } from "react";
import { ArrowRight, X } from "lucide-react";
import GenresSection from "./GenresSection";
import SongDetailsSection from "./SongDetsSection";
import { useHistoryContext } from "../../../context/history-context";
import TagList from "./TagList";
import DateFilterTabs from "./DateFilter";

// ...imports stay the same

export default function FilterDrawer({ isOpen, onClose }) {
  // Context
  const { historyContext } = useHistoryContext();
  const { dateRangeFilter } = historyContext;

  // Temp filter states
  const [tempDateRange, setTempRangeDate] = useState("All");
  const [tempGenres, setTempGenres] = useState(new Set());
  const [tempSongFeaturesFilters, setTempSongFeaturesFilters] = useState({
    popularity: { min: 0, max: 1.0 },
    acoustics: { min: 0.0, max: 1.0 },
    energy: { min: 0.0, max: 1.0 },
    vocals: { min: 0.0, max: 1.0 },
    danceability: { min: 0.0, max: 1.0 },
    mood: { min: 0.0, max: 1.0 },
  });

  const [activePanel, setActivePanel] = useState("main");
  const [isVisible, setIsVisible] = useState(false);
  const [animateIn, setAnimateIn] = useState(false);

  const songDetailsFilters = historyContext.songFeaturesFilters;
  const selectedGenres = historyContext.genreFilters;
  const valueStrings = historyContext?.songFeatureStrings || {};

  useEffect(() => {
    if (isOpen) {
      setTempRangeDate(dateRangeFilter);
      setTempGenres(new Set(selectedGenres));
      setTempSongFeaturesFilters({ ...songDetailsFilters });
    }
  }, [isOpen]);

  const predictedAmount = useMemo(() => {
    return historyContext.lengthPrediction(
      tempGenres,
      tempDateRange,
      tempSongFeaturesFilters,
    );
  }, [tempGenres, tempDateRange, tempSongFeaturesFilters]);

  const updateDateFilter = (filterString) => {
    setTempRangeDate(filterString);
  };

  const defaultFilters = {
    popularity: { min: 0.0, max: 1.0 },
    acoustics: { min: 0.0, max: 1.0 },
    energy: { min: 0.0, max: 1.0 },
    vocals: { min: 0.0, max: 1.0 },
    danceability: { min: 0.0, max: 1.0 },
    mood: { min: 0.0, max: 1.0 },
  };

  const getSafeValueStrings = () => {
    if (!valueStrings || typeof valueStrings !== "object") {
      return {};
    }

    const safeValueStrings = {};
    Object.keys(defaultFilters).forEach((key) => {
      const keyLower = key.toLowerCase();
      if (valueStrings[keyLower] && Array.isArray(valueStrings[keyLower])) {
        safeValueStrings[keyLower] = valueStrings[keyLower];
      } else {
        safeValueStrings[keyLower] = ["Low", "Medium", "High"];
      }
    });

    return safeValueStrings;
  };

  const removeGenre = (genre) => {
    setTempGenres((prev) => {
      const newSet = new Set(prev);
      newSet.delete(genre);
      return newSet;
    });
  };

  const removeSongDetailFilter = (filterName) => {
    if (!filterName || !defaultFilters[filterName]) return;
    tempSongFeaturesFilters((prev) => ({
      ...prev,
      [filterName]: { ...defaultFilters[filterName] },
    }));
  };

  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setAnimateIn(true);
        });
      });
    } else {
      setAnimateIn(false);
      const timeout = setTimeout(() => {
        setIsVisible(false);
      }, 500);
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
    historyContext.setDateRangeFilter(tempDateRange);
    historyContext.setGenreFilters(tempGenres);
    historyContext.setSongFeaturesFilters(tempSongFeaturesFilters); // ✅ ← STORE TEMP FEATURES
    onClose();
  };

  const clearFilters = () => {
    switch (activePanel) {
      case "genres":
        setTempGenres(new Set());
        historyContext.setGenreFilters(new Set());
        break;
      case "songDetails":
        setTempSongFeaturesFilters({ ...defaultFilters });
        historyContext.setSongFeaturesFilters({ ...defaultFilters });
        break;
      case "main":
      default:
        setTempGenres(new Set());
        historyContext.setGenreFilters(new Set());
        setTempSongFeaturesFilters({ ...defaultFilters });
        historyContext.setSongFeaturesFilters({ ...defaultFilters });
        setTempRangeDate("All");
        historyContext.setDateRangeFilter("All");
        break;
    }
  };

  const handleSongDetailsFilterChange = (filterName, range) => {
    setTempSongFeaturesFilters((prev) => ({
      ...prev,
      [filterName]: range,
    }));
  };

  const changedSongDetailsCount = useMemo(() => {
    console.log("changedSongDetailsCount", tempSongFeaturesFilters);
    return Object.keys(tempSongFeaturesFilters).filter((key) => {
      const current = tempSongFeaturesFilters[key];
      const defaultRange = defaultFilters[key];
      return (
        current.min !== defaultRange?.min || current.max !== defaultRange?.max
      );
    }).length;
  }, [tempSongFeaturesFilters]);

  const changedSongDetailFilters = useMemo(() => {
    const changedFilters = new Set();
    Object.keys(tempSongFeaturesFilters).forEach((key) => {
      const current = tempSongFeaturesFilters[key];
      const defaultRange = defaultFilters[key];
      if (
        current.min !== defaultRange?.min ||
        current.max !== defaultRange?.max
      ) {
        changedFilters.add(key);
      }
    });
    return changedFilters;
  }, [tempSongFeaturesFilters]);

  if (!isVisible) return null;

  const renderMainView = () => (
    <div className="h-full flex flex-col">
      <div className="flex justify-between items-center p-4">
        <h1 className="text-gray-700 text-body-lg font-body">
          Filter Song History
        </h1>
        <button onClick={onClose} className="text-gray-400 hover:text-white">
          <X size={24} />
        </button>
      </div>
      <div className="flex-1 p-4">
        {/* Date Filter */}
        <div className="mb-8">
          <DateFilterTabs
            updateFilter={updateDateFilter}
            historyFilter={tempDateRange}
          />
        </div>

        <div className="space-y-0">
          {/* Song Details */}
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
                  items={tempSongFeaturesFilters} // Pass the full songDetailsFilters object
                  onRemove={removeSongDetailFilter}
                  valueStrings={getSafeValueStrings()}
                  defaultFilters={defaultFilters} // Pass defaultFilters so TagList can filter internally
                />
              </div>
            )}
          </div>

          {/* Genres */}
          <div>
            <button
              onClick={() => navigateToPanel("genres")}
              className="group w-full h-12 bg-gray-000 hover:text-gray-700 border-t border-gray-200 flex items-center justify-between px-0 transition-colors"
            >
              <span className="text-gray-700 font-body">
                Genres{" "}
                {tempGenres.size !== 0 && <span>[{tempGenres.size}]</span>}
              </span>
              <ArrowRight
                size={20}
                className="text-gray-500 group-hover:text-gray-700 transition-colors"
              />
            </button>
            <TagList items={tempGenres} onRemove={removeGenre} />
          </div>
        </div>
      </div>
    </div>
  );

  const renderSongDetails = () => (
    <div className="h-full flex flex-col">
      <SongDetailsSection
        navigateBack={navigateBack}
        songDetailsFilters={tempSongFeaturesFilters}
        onFilterChange={handleSongDetailsFilterChange}
        changed={changedSongDetailsCount}
      />
    </div>
  );

  const renderGenres = () => (
    <div className="h-full flex flex-col">
      <GenresSection
        navigateBack={navigateBack}
        selectedGenres={tempGenres}
        setTempGenres={setTempGenres}
      />
    </div>
  );

  return (
    <div className="fixed inset-0 z-50 h-full flex justify-end">
      <div className="absolute inset-0" onClick={onClose} />
      <div
        className={`relative w-full md:w-lg h-full bg-gray-000 transform transition-transform duration-500 [ease:cubic-bezier(0.16,1,0.3,1)] ${
          animateIn ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="relative w-full h-full flex flex-col border-l border-gray-300">
          <div className="flex-1 relative overflow-hidden">
            <div
              className={`absolute inset-0 w-full h-full overflow-auto bg-gray-000 transition-transform duration-300 ease-in-out ${
                activePanel === "main" ? "translate-x-0" : "-translate-x-full"
              }`}
            >
              {renderMainView()}
            </div>

            <div
              className={`absolute inset-0 w-full h-full overflow-auto bg-gray-000 transition-transform duration-300 ease-in-out ${
                activePanel === "songDetails"
                  ? "translate-x-0"
                  : "translate-x-full"
              }`}
            >
              {renderSongDetails()}
            </div>

            <div
              className={`absolute inset-0 w-full h-full overflow-auto bg-gray-000 transition-transform duration-300 ease-in-out ${
                activePanel === "genres" ? "translate-x-0" : "translate-x-full"
              }`}
            >
              {renderGenres()}
            </div>
          </div>

          <div className="w-full flex flex-row justify-between px-4 py-4">
            <button
              className="py-2 px-1 text-gray-400 hover:text-white transition-colors font-body"
              onClick={clearFilters}
            >
              Clear
            </button>
            <button
              className="px-6 py-2 bg-gray-600 border border-transparent hover:border-gray-600 hover:bg-gray-700 text-gray-000 rounded transition-colors duration-400 ease-in-out font-body"
              onClick={closeAndFilter}
            >
              View {predictedAmount}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
