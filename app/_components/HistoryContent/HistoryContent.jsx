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
      let containerTop = scrollContainer.scrollTop;
      console.log("Scrolling...");
      console.log("top", containerTop);

      if (containerTop === 0) {
        if (activeSection != 0) {
          setActiveSection(0);
        }
      }

      // const closestToTop = liElements
      //   .map((el) => {
      //     return {
      //       height: el.getBoundingClientRect().bottom - containerTop,
      //       id: el.id,
      //     };
      //   })
      //   .filter((e) => e.height > 0)[0];

      const elArray = [];
      let index = 0;
      for (const el of liElements) {
        elArray.push({
          height: el.getBoundingClientRect().bottom - containerTop,
          id: el.id,
          index: index,
        });
        index++;
      }

      const closestToTop = elArray.filter((e) => e.height > 0)[0];

      console.log(
        "Closest to top is",
        closestToTop.height,
        closestToTop.id,
        closestToTop.index,
      );

      if (activeSection !== closestToTop.index) {
        setActiveSection(closestToTop.index);
      }

      for (const el of liElements) {
        let stickyElem = document.getElementById(`${el.id}`);
        const currStickyPos =
          stickyElem.getBoundingClientRect().bottom - containerTop;

        // const currStickyPos =
        //   stickyElem.getBoundingClientRect().top + containerTop;
        // console.log(scrollContainer.scrollTop, el.offsetTop, el.id);
        console.log(
          "top bounding",
          stickyElem.getBoundingClientRect().top,
          "sticky pos",
          currStickyPos,
          el.id,
        );

        const itemHeader = document.getElementById(`${el.id}-header`);

        console.log(containerTop >= currStickyPos, containerTop, currStickyPos);

        // if (containerTop >= currStickyPos) {
        //   if (scrollContainer.scrollTop >= el.offsetTop) {
        //   console.log(
        //     "meets check",
        //     window.scrollY,
        //     el.offsetTop,
        //     el.id,
        //     "Pos",
        //     currStickyPos,
        //   );
        //   itemHeader.setHTMLUnsafe();
        //   document.getElementById(`${el.id}-header`).style.position = "fixed";
        //   itemHeader.style.top = `${scrollContainer.scrollTop}`;
        //   itemHeader.style.zIndex = 20;
        //   itemHeader.style.backgroundColor = "red";
        // } else {
        //   itemHeader.style.position = "relative";
        //   itemHeader.style.top = "initial";
        //   document.getElementById(`${el.id}-header`).style.zIndex = 0;
        //   document.getElementById(`${el.id}-header`).style.backgroundColor =
        //     "transparent";
        // }
      }
    };

    const scrollContainer = scrollContainerRef.current;
    scrollContainer.addEventListener("scroll", handleScroll);

    return () => {
      if (scrollContainer) {
        scrollContainer.removeEventListener("scroll", handleScroll);
      }
    };
  }, []);

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
