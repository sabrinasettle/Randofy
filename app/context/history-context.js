"use client";
import { createContext, useContext, useEffect, useState } from "react";
import {
  getThisWeek,
  getThisMonth,
  getPast6Months,
} from "../utils/getDates.js";
import { networkInterfaces } from "os";

const HistoryContext = createContext();

export const HistoryProvider = ({ children }) => {
  const [isLoading, setIsloading] = useState(true);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [songHistory, setSongHistory] = useState([]);
  const [selectedSong, setSelectedSong] = useState({});

  const [sortValue, setSortValue] = useState("Default");

  const songFeatureStrings = {
    popularity: ["Unknown", "Kinda Known", "Known", "Famous"],
    acoustics: [
      "All Electric",
      "Mostly Electric",
      "Some Acoustic",
      "All Acoustic",
    ],
    energy: ["Super Chill", "Kinda Chill", "Kinda Hype", "Super Hype"],
    vocals: ["No Vocals", "Some Vocals", "Lots of Vocals", "All Vocals"],
    danceability: ["No Groove", "Almost a Bop", "Bop", "Dance Party"],
    mood: ["Real Low", "Kinda Low", "Kinda High", "Real High"],
  };

  const [dateRangeFilter, setDateRangeFilter] = useState("All");
  const [genreFilters, setGenreFilters] = useState(new Set());
  const [songFeaturesFilters, setSongFeaturesFilters] = useState({
    popularity: { min: 0, max: 1.0 },
    acoustics: { min: 0.0, max: 1.0 },
    energy: { min: 0.0, max: 1.0 },
    vocals: { min: 0.0, max: 1.0 },
    danceability: { min: 0.0, max: 1.0 },
    mood: { min: 0.0, max: 1.0 },
  });

  useEffect(() => {
    const history = JSON.parse(localStorage.getItem("history"));
    if (history) {
      const sortedDates = Object.keys(history).reverse();

      const allSongsChronological = [];

      sortedDates.forEach((date) => {
        const songs = history[date].map((song) => ({
          ...song,
          date,
        }));
        allSongsChronological.push(...songs);
      });
      setSongHistory({
        totalSongs: allSongsChronological.length,
        allSongsChronological,
      });
      setIsloading(false);
    }
  }, []);

  function openDetails() {
    console.log("openDetails");
    setIsDetailsOpen(true);
  }

  function closeDetails() {
    setIsDetailsOpen(false);
  }

  //Pagination
  // change name of first var?
  const [songsPerLoad, setSongsPerLoad] = useState(30);
  const [visibleCount, setVisibleCount] = useState(30);

  const loadMoreSongs = () => {
    setVisibleCount((prev) => prev + songsPerLoad);
  };

  // Layout change, Filter and Sort
  const [layoutType, setLayoutType] = useState("list-grid");

  function changeLayout(element) {
    if (element.id == "" || element.id === layoutType) return;
    setLayoutType(element.id);
  }

  // const updateFilters = (newFilters) => {
  //   setFilters((prevFilters) => ({ ...prevFilters, ...newFilters }));
  // };

  function filterSongsByDateRange(songs, startDate, endDate) {
    const startTs = startDate.getTime();
    const endTs = endDate.getTime();

    // console.log(
    //   "Start Date:",
    //   startDate.toISOString(),
    //   "| Timestamp:",
    //   startTs,
    // );
    // console.log("End Date:", endDate.toISOString(), "| Timestamp:", endTs);

    const results = [];

    for (let i = 0; i < songs.length; i++) {
      const song = songs[i];
      const genTimeStr = song.generated_at;
      const genTime = new Date(genTimeStr).getTime();

      // console.log(
      //   `Checking song: ${song.track_name || "Untitled"} | generated_at: ${genTimeStr} (${genTime})`,
      // );

      if (genTime >= startTs && genTime <= endTs) {
        // console.log("✅ Passes filter");
        results.push(song);
      }
    }

    console.log(`Filtered ${results.length} / ${songs.length} songs.`);
    return results;
  }

  function filterByDate(dateRange) {
    // console.log("start at date filter", dateRange); // corrected
    const today = new Date();
    const songs = songHistory.allSongsChronological;

    if (dateRange === "This Week") {
      const thisWeek = getThisWeek(today);
      return filterSongsByDateRange(songs, thisWeek.start, thisWeek.end);
    }

    if (dateRange === "This Month") {
      const thisMonth = getThisMonth(today);
      return filterSongsByDateRange(songs, thisMonth.start, thisMonth.end);
    }

    if (dateRange === "Past 6 Months") {
      const past6Months = getPast6Months(today);
      return filterSongsByDateRange(songs, past6Months.start, past6Months.end);
    }

    return songs;
  }

  function filterByGenres(selectedGenres, songs) {
    if (!selectedGenres || selectedGenres.size === 0) return songs;

    return songs.filter((song) =>
      song.genres?.some((genre) => selectedGenres.has(genre)),
    );
  }

  function filterBySongFeatures(featureFilters, songs) {
    return songs.filter((song) => {
      return Object.entries(featureFilters).every(([feature, { min, max }]) => {
        const value = song[feature];
        return typeof value === "number" && value >= min && value <= max;
      });
    });
  }

  function lengthPrediction(genres, dateRange, featureFilters) {
    let songs = songHistory.allSongsChronological;
    songs = filterByDate(dateRange, songs);
    songs = filterByGenres(genres, songs);
    // issue here because it returns 0 on having default values
    // songs = filterBySongFeatures(featureFilters, songs);
    return songs.length;
  }

  function moveForward(index) {
    console.log(
      "Moving forward",
      index,
      songHistory.allSongsChronological[index + 1],
    );
    if (index < songHistory.allSongsChronological.length - 1) {
      let newIndex = index + 1;
      setSelectedSong({
        index: newIndex,
        song: songHistory.allSongsChronological[newIndex],
      });
    }
  }

  function moveBackward(index) {
    console.log("Moving backward", index);
    if (index > 0) {
      let newIndex = index - 1;
      setSelectedSong({
        index: newIndex,
        song: songHistory.allSongsChronological[newIndex],
      });
    }
  }

  const historyContext = {
    isLoading,
    // Songs
    selectedSong,
    setSelectedSong,
    songHistory,
    isDetailsOpen,
    openDetails,
    closeDetails,
    // Filters
    songFeatureStrings,
    songFeaturesFilters,
    setSongFeaturesFilters,
    dateRangeFilter,
    setDateRangeFilter,
    genreFilters,
    setGenreFilters,
    layoutType,
    changeLayout,
    filterByDate,
    lengthPrediction,
    //Pagination
    songsPerLoad,
    visibleCount,
    setVisibleCount,
    loadMoreSongs,
    //portal
    moveForward,
    moveBackward,
  };

  const context = {
    historyContext,
  };

  return (
    <HistoryContext.Provider value={context}>
      {children}
    </HistoryContext.Provider>
  );
};

export function useHistoryContext() {
  const context = useContext(HistoryContext);
  if (!context) {
    throw new Error("useHistoryContext must be used within a HistoryProvider");
  }
  return context;
}
