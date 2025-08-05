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
  const [filters, setFilters] = useState({
    dateRange: "all",
    artist: "",
    album: "",
    genre: "",
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
    // setPageActive(page);
    console.log("openDetails");
    setIsDetailsOpen(!isDetailsOpen);
  }

  //Pagination
  const [songsPerPage, setSongsPerPage] = useState(50);
  const [visibleCount, setVisibleCount] = useState(50);
  const [currentPage, setCurrentPage] = useState(0);
  // const [totalPages, setTotalPages] = useState(1);

  const loadMoreSongs = () => {
    setVisibleCount((prev) => prev + songsPerPage);
  };

  // const handlePageChange = (page) => {
  //   setCurrentPage(page);
  // };

  // const handlePrevPage = () => {
  //   if (currentPage > 1) {
  //     handlePageChange(currentPage - 1);
  //   }
  // };

  // const handleNextPage = () => {
  //   if (currentPage < totalPages) {
  //     handlePageChange(currentPage + 1);
  //   }
  // };

  // const handlePageSizeChange = (size) => {
  //   setSongsPerPage(size);
  // };

  // const handleFirstPage = () => {
  //   handlePageChange(1);
  // };

  // const handleLastPage = () => {
  //   handlePageChange(totalPages);
  // };

  // Layout change, Filter and Sort
  const [layoutType, setLayoutType] = useState("list-grid");

  function changeLayout(element) {
    if (element.id == "" || element.id === layoutType) return;
    setLayoutType(element.id);
  }

  const updateFilters = (newFilters) => {
    setFilters((prevFilters) => ({ ...prevFilters, ...newFilters }));
  };

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

    if (historyFilter === "Today") {
      return filterObjectByDateRange(songHistory, startOfDay, endOfDay);
    } else if (historyFilter === "This Week") {
      let thisWeek = getThisWeek(today);
      return filterObjectByDateRange(songHistory, thisWeek.start, thisWeek.end);
    } else if (historyFilter === "This Month") {
      let thisMonth = getThisMonth(today);
      return filterObjectByDateRange(
        songHistory,
        thisMonth.start,
        thisMonth.end,
      );
    } else if (historyFilter === "Past 6 Months") {
      let past6Months = getPast6Months(today);
      return filterObjectByDateRange(
        history,
        past6Months.start,
        past6Months.end,
      );
    }
    return history;
  }

  const historyContext = {
    isLoading,
    // Songs
    selectedSong,
    setSelectedSong,
    songHistory,
    isDetailsOpen,
    openDetails,
    // Filters
    filters,
    updateFilters,
    layoutType,
    changeLayout,
    filterByDate,
    //Pagination
    songsPerPage,
    visibleCount,
    setVisibleCount,
    currentPage,
    setCurrentPage,
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
