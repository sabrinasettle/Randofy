"use client";
import { useState, useRef, useEffect } from "react";
import { useSpotifyContext } from "../../context/spotify-context";
import { useGridContext } from "../../context/card-layout-context";
import BackLink from "../BackLink";
import HistorySection from "./HistorySection/HistorySection";
import HistoryFilters from "./HistoryFilters/HistoryFilters";
import SongDrawer from "../SongDrawer/SongDrawer";
import CardLayoutOptions from "../ChangeLayout/CardLayoutOptions";
import {
  getThisWeek,
  getThisMonth,
  getPast6Months,
} from "../../utils/getDates.js";
import styles from "./History.module.scss";

export default function HistoryContent() {
  const { spotifyClient } = useSpotifyContext();
  const { layoutContext } = useGridContext();
  const scrollContainerRef = useRef(null);

  const [historyFilter, setHistoryFilter] = useState("All");
  const [sortFilter, setSortFilter] = useState("newest");
  const [activeSection, setActiveSection] = useState(0);

  let history = spotifyClient.generationHistory;
  let selectedSong = spotifyClient.selectedSong.song;
  const isDrawerOpen = layoutContext.isDrawerOpen;

  const sortOptions = ["newest to oldest", "oldest to newest"];

  useEffect(() => {
    // history-songlist-container

    // get the ul element
    const ulElement = document.getElementById("history-songlist");
    //get the list items in the ul
    const liElements = ulElement.getElementsByClassName("history-list-item");
    // console.log(ulElement, liElements);

    const handleScroll = () => {
      if (!scrollContainerRef.current) return;

      const containerTop =
        scrollContainerRef.current.getBoundingClientRect().top;
      const containerBottom =
        scrollContainerRef.current.getBoundingClientRect().bottom;
      const maxDistance = containerBottom - containerTop; // Max scrollable distance

      let closestSectionIndex = null;

      Array.from(liElements).forEach((el, index) => {
        // const rect = el.getBoundingClientRect();
        // const distanceFromTop = Math.abs(rect.top - containerTop);
        const headerElement = el.querySelector(`#section-${index}-header`); // Select the child div

        // Adjust the scaling factor based on proximity to the top
        // Example scaling range: 1.0 for closest to top, down to 0.8
        // const fontSize =
        //   18 + (1 - Math.min(1, distanceFromTop / maxDistance)) * 14;

        // // Apply dynamic font size and line height to the child header element
        // headerElement.style.fontSize = `${fontSize}px`;
        // headerElement.style.lineHeight = `${fontSize * 1.5}px`; // Adjust line height proportionally

        if (headerElement) {
          const rect = el.getBoundingClientRect();
          const distanceFromTop = Math.abs(rect.top - containerTop);

          // Scale font size based on proximity, ranging from 18px to 32px
          const fontSize =
            18 + (1 - Math.min(1, distanceFromTop / maxDistance)) * 14;

          // Apply dynamic font size and line height to the child header element
          headerElement.style.fontSize = `${fontSize}px`;
          headerElement.style.lineHeight = `${fontSize * 1.5}px`; // Adjust line height proportionally

          // Determine which section is closest to the top of the container
          if (
            distanceFromTop < maxDistance / 2 &&
            closestSectionIndex === null
          ) {
            closestSectionIndex = index;
          }
        }

        // if (index === activeSection) {
        //   headerElement.classList.remove("section-header");
        //   headerElement.classList.add("section-header__active");
        // } else {
        //   headerElement.classList.remove("section-header__active");
        //   headerElement.classList.add("section-header");
        // }
      });

      if (
        closestSectionIndex !== null &&
        closestSectionIndex !== activeSection
      ) {
        setActiveSection(closestSectionIndex);
      }
    };

    const scrollContainer = scrollContainerRef.current;
    scrollContainer.addEventListener("scroll", handleScroll);

    return () => {
      if (scrollContainer) {
        scrollContainer.removeEventListener("scroll", handleScroll);
      }
    };
  }, [activeSection, scrollContainerRef]);

  function filteredSongHistory() {
    const now = new Date();
    const today = new Date();
    const startOfDay = new Date(now.setHours(0, 0, 0, 0));
    const endOfDay = new Date(now.setHours(23, 59, 59, 59));

    // let dateString = today.toLocaleDateString();
    // console.log("today", dateString, historyFilter);
    if (historyFilter === "Today") {
      return filterObjectByDateRange(history, startOfDay, endOfDay);
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

    // Object.keys(obj).map((key) => {
    //   var [month, day, year] = key.split("/");
    //   // this can be new Date(key) as key is a locale date string (defaults to start of day)
    //   let date = new Date(year, month - 1, day, 0, 0, 0, 0);
    //   // console.log("start", startDate, "end", endDate);
    //   // console.log(date, year, month - 1, day);

    //   const startDateString = startDate.toLocaleDateString();
    //   const endDateString = endDate.toLocaleDateString();

    //   // 4/22/2024 which is werid

    //   // if the start and the end are the same, its today
    //   if (startDateString === key && endDateString === key) {
    //     filteredObj[key] = obj[key];
    //     return filteredObj;
    //   }
    //   if (date >= startDate && date <= endDate) {
    //     filteredObj[key] = obj[key];
    //   }
    // });
    return filteredObj;
  }

  function updateFilter(filterString) {
    setHistoryFilter(filterString);
  }

  const filteredHistory = filteredSongHistory();
  // console.log(filteredHistory);

  return (
    <div className={styles["history-content"]}>
      <div id={styles["history-header"]}>
        <BackLink />
      </div>
      <section id={styles["history-section"]}>
        {!history ? (
          <div>No History Yet!</div>
        ) : (
          <div id={styles["columns-container"]}>
            <div id={styles["history-column"]}>
              <div className="content-controls">
                {history && (
                  <HistoryFilters
                    updateFilter={updateFilter}
                    historyFilter={historyFilter}
                  />
                )}
                {history && <CardLayoutOptions />}
              </div>
              <div
                id="history-songlist-container"
                className={styles["history-section-list"]}
                ref={scrollContainerRef}
              >
                <ul id="history-songlist">
                  {Object.keys(filteredHistory)
                    .reverse()
                    .map((key, index) => (
                      <HistorySection
                        key={`history ` + `${index}` + `${key}`}
                        date={key}
                        songs={history[key]}
                        idIndex={`section-${index}`}
                        isActive={activeSection === index}
                      />
                    ))}
                </ul>
              </div>
            </div>
            {selectedSong && (
              <div id={styles["drawer-column"]}>
                <SongDrawer song={selectedSong} isOpen={isDrawerOpen} />
              </div>
            )}
          </div>
        )}
      </section>
    </div>
  );
}
