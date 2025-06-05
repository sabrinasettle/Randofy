"use client";
import { useState, useRef, useEffect } from "react";
import { useSpotifyContext } from "../../context/spotify-context";
import { useGridContext } from "../../context/card-layout-context";
import HistorySection from "./HistorySection";
import HistoryFilters from "./filters/HistoryFilters";
import SongDrawer from "./SongDrawer";
import CardLayoutOptions from "./filters/CardLayoutOptions";
import {
  getThisWeek,
  getThisMonth,
  getPast6Months,
} from "../../utils/getDates.js";
import useWindowDimensions from "../../_hooks/useWindowDimensions";
import { ChevronUp, ChevronDown } from "lucide-react";

export default function HistoryContent() {
  const { spotifyClient } = useSpotifyContext();
  const { layoutContext } = useGridContext();
  const scrollContainerRef = useRef(null);

  const [historyFilter, setHistoryFilter] = useState("All");
  const [sortFilter, setSortFilter] = useState("newest");
  const [activeSection, setActiveSection] = useState(0);
  const [isAtTop, setIsAtTop] = useState(true);

  let history = spotifyClient.generationHistory;
  let selectedSong = spotifyClient.selectedSong.song;
  const isDrawerOpen = layoutContext.isDrawerOpen;

  const sortOptions = ["newest to oldest", "oldest to newest"];

  const { width, height } = useWindowDimensions();
  const isSmallScreen = width <= 628;
  const isMedScreen = width <= 1024;

  // import { millisToMinutesAndSeconds } from "../../utils/convertMilliseconds.js";
  // import { hexToRGBA } from "../../utils/convertHexToRGBA.js";

  useEffect(() => {
    // history-songlist-container
    // get the ul element
    // const ulElement = document.getElementById("history-songlist");
    //get the list items in the ul
    // const liElements = ulElement.getElementsByClassName("history-list-item");
    // console.log(ulElement, liElements);
    //
    // const controlSection = document.querySelector(`.content-controls`);
    // const controlsHeight =
    //   controlSection.getBoundingClientRect().bottom -
    //   controlSection.getBoundingClientRect().top -
    //   1;
    // console.log(controlsHeight);
    // const handleScroll = () => {
    //   if (!scrollContainerRef.current) return;
    //   const containerTop =
    //     scrollContainerRef.current.getBoundingClientRect().top;
    //   const containerBottom =
    //     scrollContainerRef.current.getBoundingClientRect().bottom;
    //   const maxDistance = containerBottom - containerTop; // Max scrollable distance
    //   // console.log(scrollContainerRef.current.scrollTop === 0);
    //   setIsAtTop(scrollContainerRef.current.scrollTop === 0);
    //   let closestSectionIndex = null;
    //   Array.from(liElements).forEach((el, index) => {
    //     // const rect = el.getBoundingClientRect();
    //     // const distanceFromTop = Math.abs(rect.top - containerTop);
    //     const headerElement = el.querySelector(`#section-${index}-header`); // Select the child div
    //     // Adjust the scaling factor based on proximity to the top
    //     // Example scaling range: 1.0 for closest to top, down to 0.8
    //     // const fontSize =
    //     //   18 + (1 - Math.min(1, distanceFromTop / maxDistance)) * 14;
    //     // // Apply dynamic font size and line height to the child header element
    //     // headerElement.style.fontSize = `${fontSize}px`;
    //     // headerElement.style.lineHeight = `${fontSize * 1.5}px`; // Adjust line height proportionally
    //     if (headerElement) {
    //       const rect = el.getBoundingClientRect();
    //       const distanceFromTop = Math.abs(rect.top - containerTop);
    //       // Scale font size based on proximity, ranging from 18px to 32px
    //       const fontSize =
    //         18 + (1 - Math.min(1, distanceFromTop / maxDistance)) * 14;
    //       // Apply dynamic font size and line height to the child header element
    //       headerElement.style.fontSize = `${fontSize}px`;
    //       headerElement.style.lineHeight = `${fontSize * 1.5}px`; // Adjust line height proportionally
    //       headerElement.style.top = `${controlsHeight}px`;
    //       // Determine which section is closest to the top of the container
    //       if (
    //         distanceFromTop < maxDistance / 2 &&
    //         closestSectionIndex === null
    //       ) {
    //         closestSectionIndex = index;
    //       }
    //     }
    //     // if (index === activeSection) {
    //     //   headerElement.classList.remove("section-header");
    //     //   headerElement.classList.add("section-header__active");
    //     // } else {
    //     //   headerElement.classList.remove("section-header__active");
    //     //   headerElement.classList.add("section-header");
    //     // }
    //   });
    //   if (
    //     closestSectionIndex !== null &&
    //     closestSectionIndex !== activeSection
    //   ) {
    //     setActiveSection(closestSectionIndex);
    //   }
    // };
    // const scrollContainer = scrollContainerRef.current;
    // scrollContainer.addEventListener("scroll", handleScroll);
    // return () => {
    //   if (scrollContainer) {
    //     scrollContainer.removeEventListener("scroll", handleScroll);
    //   }
    // };
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

  function handleBackToTop() {
    // console.log("to top clicked", scrollContainerRef.current);
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTo(0, 0, { behavior: "smooth" });
      // scrollContainerRef.current.scrollIntoView({
      //   behavior: "smooth",
      //   block: "start",
      // });
    }
  }

  const filteredHistory = filteredSongHistory();
  // console.log(filteredHistory);

  return (
    <div className="px-5 mt-1 h-screen flex flex-col">
      <section className="pb-16 flex flex-row flex-1 overflow-hidden">
        {!history ? (
          <div>No History Yet!</div>
        ) : (
          <div className="flex flex-row w-full h-full">
            <div
              id="history-column"
              ref={scrollContainerRef}
              className={`flex-1 flex flex-col transition-all duration-300 ${
                selectedSong && !isMedScreen ? "mr-4" : ""
              }`}
            >
              {/* Your existing header with filters */}
              <div className="w-full flex flex-row items-center justify-between flex-shrink-0 pb-4">
                {history && (
                  <HistoryFilters
                    updateFilter={updateFilter}
                    historyFilter={historyFilter}
                  />
                )}
                <div className="flex flex-row gap-3" id="right_controls">
                  {!isAtTop && (
                    <button className="text-gray-700" onClick={handleBackToTop}>
                      Back to Top
                    </button>
                  )}
                  <button className="flex flex-row items-center bg-gray-100 text-gray-700 px-2 py-1 rounded-sm gap-1">
                    <span>Sort</span>
                    <ChevronUp size={16} />
                  </button>
                  {history && <CardLayoutOptions />}
                </div>
              </div>

              {/* Your existing scrollable content */}
              <div
                id="history-songlist-container"
                className="mt-8 flex-1 overflow-y-auto"
              >
                <ul className="flex flex-col gap-24" id="history-songlist">
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

            {/* {!isAtTop && (
              <button className="btn btn__overlay back-to-top">To Top</button>
            )} */}

            {/* Your existing drawer */}
            {selectedSong && (
              <div
                id="drawer"
                className="w-96 flex-shrink-0 transition-all duration-300"
              >
                <SongDrawer song={selectedSong} isOpen={isDrawerOpen} />
              </div>
            )}
          </div>
        )}
      </section>
    </div>
  );
}
