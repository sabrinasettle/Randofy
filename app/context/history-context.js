"use client";
import { createContext, useContext, useEffect, useState } from "react";
import {
  getThisWeek,
  getThisMonth,
  getPast6Months,
} from "../utils/getDates.js";

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

  function filterByDate() {
    console.log("start at date filter", dateRangeFilter);
    const today = new Date();
    const songs = songHistory.allSongsChronological;

    if (dateRangeFilter === "This Week") {
      const thisWeek = getThisWeek(today);
      return filterSongsByDateRange(songs, thisWeek.start, thisWeek.end);
    }

    if (dateRangeFilter === "This Month") {
      const thisMonth = getThisMonth(today);
      return filterSongsByDateRange(songs, thisMonth.start, thisMonth.end);
    }

    if (dateRangeFilter === "Past 6 Months") {
      const past6Months = getPast6Months(today);
      return filterSongsByDateRange(songs, past6Months.start, past6Months.end);
    }

    return songs;
  }

  function lengthPrediction(genres, dates) {
    //predict the amount of songs they will get by using the filter
    let filteredSongs = songHistory.allSongsChronological;

    if (dates !== "All") {
      filteredSongs = filterByDate();
    }

    if (genres.size !== 0) {
      // console.log(genres, filteredSongs.length);
      const genreArray = [...genres];
      filteredSongs = filteredSongs.filter((song) =>
        song.genres.some((genre) => genreArray.includes(genre)),
      );
    }

    return filteredSongs.length;
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
