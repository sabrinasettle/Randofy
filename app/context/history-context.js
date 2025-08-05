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

  function filterObjectByDateRange(obj, startDate, endDate) {
    const filteredObj = {};
    // console.log(historyFilter, startDate, endDate);

    Object.keys(obj)
      .filter((tDate) => {
        const date = new Date(tDate);
        // console.log(date);
        if (date >= startDate && date <= endDate) {
          return true;
        }
        return false;
      })
      .map((key) => {
        filteredObj[key] = obj[key];
      });

    return filteredObj;
  }

  function filterByDate() {
    const now = new Date();
    const today = new Date();
    const startOfDay = new Date(now.setHours(0, 0, 0, 0));
    const endOfDay = new Date(now.setHours(23, 59, 59, 59));

    switch (dateRangeFilter) {
      case dateRangeFilter === "Today":
        return filterObjectByDateRange(songHistory, startOfDay, endOfDay);
      case dateRangeFilter === "This Week":
        let thisWeek = getThisWeek(today);
        return filterObjectByDateRange(
          songHistory,
          thisWeek.start,
          thisWeek.end,
        );
      case dateRangeFilter === "This Month":
        let thisMonth = getThisMonth(today);
        return filterObjectByDateRange(
          songHistory,
          thisMonth.start,
          thisMonth.end,
        );
      case dateRangeFilter === "Past 6 Months":
        let past6Months = getPast6Months(today);
        return filterObjectByDateRange(
          history,
          past6Months.start,
          past6Months.end,
        );
      default:
        return songHistory;
    }

    if (dateRangeFilter === "Today") {
      return filterObjectByDateRange(songHistory, startOfDay, endOfDay);
    } else if (dateRangeFilter === "This Week") {
      let thisWeek = getThisWeek(today);
      return filterObjectByDateRange(songHistory, thisWeek.start, thisWeek.end);
    } else if (dateRangeFilter === "This Month") {
      let thisMonth = getThisMonth(today);
      return filterObjectByDateRange(
        songHistory,
        thisMonth.start,
        thisMonth.end,
      );
    } else if (dateRangeFilter === "Past 6 Months") {
      let past6Months = getPast6Months(today);
      return filterObjectByDateRange(
        history,
        past6Months.start,
        past6Months.end,
      );
    }
    return history;
  }

  function filterByGenre() {}

  function filterBySongFeatures() {}

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
