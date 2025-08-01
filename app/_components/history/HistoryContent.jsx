"use client";
import { useState, useRef, useEffect } from "react";
import { useSpotifyContext } from "../../context/spotify-context";
import { useGridContext } from "../../context/card-layout-context";
import { useSongViewContext } from "../../context/song-view-context";
import { useMusicContext } from "../../context/music-context";
import { useHistoryContext } from "../../context/history-context";
import HistorySection from "./HistorySection";
import SongViewController from "../SongView/SongViewController";
import CardLayoutOptions from "./PageHeader/CardLayoutOptions";
import LoadingBall from "../ui/loading/LoadingBall";
import FilterDrawer from "./FilterDrawer/FilterDrawer";
import PaginatedHistory from "./PaginatedHistory";
import SongCard from "./SongCard";
import HistoryView from "../SongView/SongViews/HistoryView";

export default function HistoryContent() {
  const { spotifyClient } = useSpotifyContext();
  const { songViewContext } = useSongViewContext();
  const { musicContext } = useMusicContext();
  const { historyContext } = useHistoryContext();
  const isMobile = songViewContext.isMobile;

  const [filtersOpen, setFilterOpen] = useState(false);

  const [historyFilter, setHistoryFilter] = useState("All");
  const [isAtTop, setIsAtTop] = useState(true);
  // const [isLoading, setIsloading] = useState(true);

  let history = historyContext.songHistory;
  const isLoading = historyContext.isLoading;

  // const sortOptions = ["newest to oldest", "oldest to newest"];
  // filter Options
  const scrollContainerRef = useRef(null);

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

  // const filteredHistory = filteredSongHistory();
  const isEmptyObject = (obj) => Object.keys(obj).length === 0;

  return (
    <div
      id="history-content"
      className="h-screen flex flex-col px-3 pt-[72px] md:px-4 pb-2"
    >
      <section className="flex flex-col h-full ">
        <div className="flex flex-row w-full justify-between">
          <CardLayoutOptions />
          <button
            className="text-gray-700"
            onClick={() => setFilterOpen(!filtersOpen)}
          >
            Filter
          </button>
        </div>
        {isLoading ? (
          <div className="w-full h-full flex justify-center items-center">
            <LoadingBall isLoading={isLoading} />
          </div>
        ) : !isLoading && (!history || isEmptyObject(history)) ? (
          <div className="w-full flex justify-center items-center text-gray-700">
            <p>No History Yet! Lets get you started!</p>
          </div>
        ) : (
          <div>
            <div>
              <PaginatedHistory />
              {/* {Object.keys(history)
                  .reverse()
                  .map((key, index) => (
                    <HistorySection
                      key={`history ` + `${index}` + `${key}`}
                      date={key}
                      songs={history[key]}
                      idIndex={`section-${index}`}
                    />
                  ))}*/}
            </div>
            {/* <Pagination />*/}
            <FilterDrawer
              isOpen={filtersOpen}
              onClose={() => setFilterOpen(!filtersOpen)}
            />
            <HistoryView />
          </div>
          // <div className="mt-1 flex flex-row w-full h-full pb-4">
          //   <div
          //     id="history-column"
          //     ref={scrollContainerRef}
          //     className={`flex flex-col flex-1 ${isMobile && isDrawerOpen ? `w-full` : `w-full`} ${
          //       isDrawerOpen ? "sm:mr-0 md:mr-4" : "mr-0"
          //     }`}
          //   >
          //     {/* Your existing header with filters */}
          //     <div className="w-full flex flex-col md:flex-row items-start gap-3 md:gap-0 md:items-center justify-between flex-shrink-0 pb-2">
          //       {history && (
          //         <HistoryFilters
          //           updateFilter={updateFilter}
          //           historyFilter={historyFilter}
          //         />
          //       )}
          //       <div className="flex flex-row gap-3" id="right_controls">
          //         {!isAtTop && (
          //           <button className="text-gray-700" onClick={handleBackToTop}>
          //             Back to Top
          //           </button>
          //         )}

          //         {history && <CardLayoutOptions />}
          //       </div>
          //     </div>

          //     {/* Your existing scrollable content */}
          //     <div
          //       id="history-songlist-container"
          //       className="mt-8 overflow-y-auto"
          //     >
          //       <ul className="flex flex-col gap-24" id="history-songlist">
          //         {Object.keys(filteredHistory)
          //           .reverse()
          //           .map((key, index) => (
          //             <HistorySection
          //               key={`history ` + `${index}` + `${key}`}
          //               date={key}
          //               songs={history[key]}
          //               idIndex={`section-${index}`}
          //               isActive={activeSection === index}
          //             />
          //           ))}
          //       </ul>
          //     </div>
          //   </div>
          // </div>
        )}
        {/* {!isAtTop && (
              <button className="btn btn__overlay back-to-top">To Top</button>
            )} */}
      </section>
    </div>
  );
}
