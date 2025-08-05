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
      className="flex flex-col px-3 pt-[72px] md:px-4 pb-2"
    >
      <div className="flex flex-col h-full ">
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
            </div>
            <FilterDrawer
              isOpen={filtersOpen}
              onClose={() => setFilterOpen(!filtersOpen)}
            />
            <HistoryView />
          </div>
        )}

        {!isAtTop && (
          <button
            className="z-30 fixed bottom-6 right-6 bg-[#191919e6] text-gray-700 font-body text-body-md px-2 py-1 rounded-sm border border-transparent hover:border-gray-400 transition-all duration-400 ease-in-out"
            onClick={handleBackToTop}
          >
            Back To Top
          </button>
        )}
      </div>
    </div>
  );
}
