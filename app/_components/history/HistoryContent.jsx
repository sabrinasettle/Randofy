"use client";
import { useState, useEffect } from "react";
import { useSongViewContext } from "../../context/song-view-context";
import { useHistoryContext } from "../../context/history-context";
import CardLayoutOptions from "./PageHeader/CardLayoutOptions";
import Loader from "../ui/loading/Loader";
import FilterDrawer from "./FilterDrawer/FilterDrawer";
import PaginatedHistory from "./PaginatedHistory";
import HistoryView from "../SongView/SongViews/HistoryView";

const SortButton = () => {
  const { historyContext } = useHistoryContext();

  // const string =
  //   historyContext.sortTotal > 0
  //     ? `Sort Songs [${historyContext.sortTotal}]`
  //     : "Sort Songs";

  return (
    <select
      value={historyContext.sortOption}
      onChange={(e) => historyContext.setSortOption(e.target.value)}
      className="font-body rounded-sm text-gray-600 border border-transparent hover:text-gray-700 transition-all duration-700 ease-in-out min-w-fit px-1 py-1"
    >
      <option value="time-recent">Date: Most recent first</option>
      <option value="time-early">Date: Oldest first</option>
      <option value="alpha-asc">Name: A → Z</option>
      <option value="alpha-desc">Name: Z → A</option>
    </select>
  );
};

const FilterButton = ({ handleOpen }) => {
  const { historyContext } = useHistoryContext();

  const string =
    historyContext.filtersTotal > 0
      ? `Filter Songs [${historyContext.filtersTotal}]`
      : "Filter Songs";

  return (
    <button
      className="font-body rounded-sm text-gray-600 border border-transparent hover:text-gray-700 transition-all duration-700 ease-in-out min-w-fit px-1 py-1"
      onClick={handleOpen}
    >
      {string}
    </button>
  );
};

export default function HistoryContent() {
  const { historyContext } = useHistoryContext();

  const [filtersOpen, setFilterOpen] = useState(false);
  const [isAtTop, setIsAtTop] = useState(true);

  let history = historyContext.songHistory;
  const isLoading = historyContext.isLoading;

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      setIsAtTop(scrollTop <= 0);
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll(); // run once on mount

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  function handleBackToTop() {
    window.scrollTo({ top: 0, behavior: "smooth" });
    setIsAtTop(true);
  }

  const isEmptyObject = (obj) => Object.keys(obj).length === 0;

  return (
    <div
      id="history-content"
      className={`flex flex-col px-3 pt-[72px] md:px-4 pb-2 ${isLoading ? "h-screen" : "h-full"}`}
    >
      <div className="flex flex-col h-full ">
        <div className="flex flex-row w-full justify-between">
          <CardLayoutOptions />
          <div className="flex flex-row items-center gap-2">
            <FilterButton handleOpen={() => setFilterOpen(true)} />
            <SortButton />
          </div>
        </div>
        {isLoading ? (
          <div className="w-full h-full flex justify-center items-center">
            <Loader isLoading={isLoading} />
          </div>
        ) : !history || isEmptyObject(history) ? (
          <div className="w-full h-full flex flex-col justify-center items-center text-gray-700">
            <p>No History Yet! Lets get you started!</p>
            <button>Generate Songs</button>
          </div>
        ) : (
          <div>
            <div>
              <PaginatedHistory />
            </div>
            <FilterDrawer
              isOpen={filtersOpen}
              onClose={() => setFilterOpen(false)}
            />
            <HistoryView />
          </div>
        )}

        {!isAtTop && (
          <button
            className="z-30 fixed bottom-6 right-4 bg-[#191919e6] text-gray-700 font-body text-body-md px-4 py-2 rounded-sm border border-transparent hover:border-gray-400 transition-all duration-400 ease-in-out"
            onClick={handleBackToTop}
          >
            Back To Top
          </button>
        )}
      </div>
    </div>
  );
}
