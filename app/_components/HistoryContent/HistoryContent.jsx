"use client";
import Link from "next/link";
import { useState } from "react";
import { useSpotifyContext } from "../../context/spotify-context";
import HistorySection from "./HistorySection/HistorySection";
import HistoryFilters from "./HistoryFilters/HistoryFilters";
import {
  getThisWeek,
  getThisMonth,
  getPast6Months,
} from "../../utils/getDates.js";

export default function HistoryContent() {
  const { spotifyClient } = useSpotifyContext();
  const [historyFilter, setHistoryFilter] = useState("All");
  const [sortFilter, setSortFilter] = useState("newest");

  let history = spotifyClient.generationHistory;

  //see if content has loaded as well
  // To Do
  // Create Filters for the history (All, Today, This Week, This Month, Past 6 Months)
  //

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
    // move to array after lookup?
    // look at the state when ordering it?
    console.log(startDate, endDate);
    const filteredObj = {};

    console.log(historyFilter);
    Object.keys(obj).map((key) => {
      //split the key to vars
      // parseInt()?
      var [month, day, year] = key.split("/");
      let date = new Date(year, month - 1, day, 0, 0, 0, 0);
      console.log("start", startDate, "end", endDate);
      console.log(date, year, month - 1, day);

      const startDateString = startDate.toLocaleDateString();
      const endDateString = endDate.toLocaleDateString();
      // 4/22/2024 which is werid

      // if the start and the end are the same, its today
      if (startDateString === key && endDateString === key) {
        filteredObj[key] = obj[key];
        return filteredObj;
      }

      // if not we are here
      // console.log(
      //   startDate,
      //   endDate,
      //   date,
      //   "is more or eq",
      //   date >= startDate,
      //   "is less or eq",
      //   date <= endDate,
      // );
      if (date >= startDate && date <= endDate) {
        filteredObj[key] = obj[key];
      }
    });
    return filteredObj;
  }

  function updateFilter(filterString) {
    setHistoryFilter(filterString);
  }

  const fhistory = filteredSongHistory();

  return (
    <main>
      <Link href={"/"}>Back</Link>
      {!history ? (
        <div>No History Yet!</div>
      ) : (
        <div>
          <HistoryFilters
            updateFilter={updateFilter}
            historyFilter={historyFilter}
          />
          <div>
            <ul>
              {Object.keys(fhistory).map((key, index) => (
                <HistorySection
                  key={`history ` + `${key}`}
                  date={key}
                  songs={history[key]}
                />
              ))}
            </ul>
          </div>
        </div>
      )}
    </main>
  );
}
