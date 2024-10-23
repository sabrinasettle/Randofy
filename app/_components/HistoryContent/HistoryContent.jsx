"use client";
// import Link from "next/link";
import { useState } from "react";
import { useSpotifyContext } from "../../context/spotify-context";
import BackLink from "../BackLink";
import HistorySection from "./HistorySection/HistorySection";
import HistoryFilters from "./HistoryFilters/HistoryFilters";
import SongDrawer from "./SongDrawer/SongDrawer";
import {
  getThisWeek,
  getThisMonth,
  getPast6Months,
} from "../../utils/getDates.js";
import styles from "./History.module.scss";

export default function HistoryContent() {
  const { spotifyClient } = useSpotifyContext();
  const [historyFilter, setHistoryFilter] = useState("All");
  const [sortFilter, setSortFilter] = useState("newest");
  const [selectedSong, setSelectedSong] = useState({});
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  let history = spotifyClient.generationHistory;
  const sortOptions = ["newest to oldest", "oldest to newest"];

  //see if content has loaded as well
  // To Do
  // Create Drawer and Song content in drawer
  // Ability to close drawer

  function filteredSongHistory() {
    const today = new Date();
    let dateString = today.toLocaleDateString();
    console.log("today", dateString, historyFilter);
    if (historyFilter === "Today") {
      return filterObjectByDateRange(history, today, today);
    } else if (historyFilter === "This Week") {
      let thisWeek = getThisWeek(today);
      return filterObjectByDateRange(history, thisWeek.start, thisWeek.end);
    } else if (historyFilter === "This Month") {
      let thisMonth = getThisMonth(today);
      return filterObjectByDateRange(history, thisMonth.start, thisMonth.end);
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

  function filterObjectByDateRange(obj, startDate, endDate) {
    // console.log(startDate, endDate);
    const filteredObj = {};

    console.log(historyFilter);
    Object.keys(obj).map((key) => {
      var [month, day, year] = key.split("/");
      let date = new Date(year, month - 1, day, 0, 0, 0, 0);
      // console.log("start", startDate, "end", endDate);
      // console.log(date, year, month - 1, day);

      const startDateString = startDate.toLocaleDateString();
      const endDateString = endDate.toLocaleDateString();
      // 4/22/2024 which is werid

      // if the start and the end are the same, its today
      if (startDateString === key && endDateString === key) {
        filteredObj[key] = obj[key];
        return filteredObj;
      }
      if (date >= startDate && date <= endDate) {
        filteredObj[key] = obj[key];
      }
    });
    return filteredObj;
  }

  function updateFilter(filterString) {
    setHistoryFilter(filterString);
  }

  function openSongDetails(song) {
    setSelectedSong(song);
    setIsDrawerOpen(true);
  }

  function closeDrawer() {
    setIsDrawerOpen(false);
  }

  const filteredHistory = filteredSongHistory();
  console.log(filteredHistory);

  return (
    <div className={styles["history-content"]}>
      <div id={styles["history-header"]}>
        <BackLink />
      </div>
      <section id={styles["history-list-section"]}>
        {!history ? (
          <div>No History Yet!</div>
        ) : (
          <div id={styles["columns-container"]}>
            <div id={styles["history-column"]}>
              {history && (
                <HistoryFilters
                  updateFilter={updateFilter}
                  historyFilter={historyFilter}
                />
              )}
              <ul id={styles["history-section-list"]}>
                {Object.keys(filteredHistory)
                  .reverse()
                  .map((key, index) => (
                    <HistorySection
                      key={`history ` + `${index}` + `${key}`}
                      date={key}
                      songs={history[key]}
                      openSongDetails={openSongDetails}
                    />
                  ))}
                {/* {filteredHistory.map((day, index) => (
                <HistorySection
                  key={`history ` + `${key}`}
                  date={key}
                  songs={history[key]}
                />
              ))} */}
              </ul>
            </div>
            {selectedSong && (
              <div id={styles["drawer-column"]}>
                <SongDrawer
                  song={selectedSong}
                  isOpen={isDrawerOpen}
                  closeDrawer={closeDrawer}
                />
              </div>
            )}
          </div>
        )}
      </section>
    </div>
  );
}
