"use client";
import { useState, useMemo } from "react";
import { useSpotifyContext } from "../../context/spotify-context";
import { useMusicContext } from "../../context/music-context";
import FilterDrawer from "./FilterDrawer/FilterDrawer";
import SongListController from "./SongList/SongListController";
import Loader from "../ui/loading/Loader";
import ButtonsContainer from "./ButtonsContainer";
import { useActiveFilterLabels } from "../../_hooks/useActiveFilterLabels";

export default function RandofyContent() {
  const { spotifyClient } = useSpotifyContext();
  const { musicContext } = useMusicContext();
  const { spotifyUser } = spotifyClient;
  const [filtersOpen, setFilterOpen] = useState(false);
  const isMobile = spotifyClient.isMobile;

  const hasContent =
    musicContext.isLoading || musicContext.currentSongs.length !== 0;

  function showItem() {
    if (musicContext.isLoading)
      return <Loader isLoading={musicContext.isLoading} />;
    else if (musicContext.currentSongs.length !== 0)
      return (
        <div className="w-full flex justify-end items-center pt-8 md:pt-0">
          <SongListController />
        </div>
      );
    return null; // Return null when no content to show
  }

  // ✅ Helpers (no hooks here)
  const getTextSizeClass = (len) => {
    // Bigger when short, smaller when long — but NEVER below heading-2
    if (len < 60) return "text-display-1";
    if (len < 90) return "text-display-2";
    if (len < 120) return "text-heading-1";
    return "text-heading-2"; // 🔒 minimum
  };

  // ✅ Hook must be top-level
  const dets = useActiveFilterLabels(musicContext.songDetails);

  // Memoize text pieces so they don't recompute unnecessarily
  const dynamicText = useMemo(() => {
    const num = musicContext.songLimit;
    const genres = Array.from(musicContext.genres);
    const hasFilters = genres.length > 0 || dets.length > 0;

    const baseText = hasFilters
      ? "somewhat random songs from Spotify"
      : "totally random songs from Spotify";

    const textLength = String(num).length + baseText.length;
    const sizeClass = getTextSizeClass(textLength);

    return { num, baseText, sizeClass };
  }, [musicContext.songLimit, musicContext.genres, dets]);

  const showDynamicText = () => {
    const { num, baseText, sizeClass } = dynamicText;

    return (
      <h1
        className={`font-body ${sizeClass} text-gray-700 pb-16 text-center transition-all duration-200`}
      >
        {num} {baseText}
      </h1>
    );
  };

  return (
    <div className="overflow-hidden min-h-dvh">
      <div
        className={
          isMobile
            ? `flex flex-col h-full w-full pt-4 pb-4 relative overflow-hidden z-0`
            : `flex h-full ${
                musicContext.isLoading ? "w-screen" : "w-full"
              } pt-4 pb-4 md:pt-0 md:pb-6 flex-col justify-start sm:justify-center items-center relative overflow-hidden z-0`
        }
      >
        {/* Default state - centered text */}
        {!hasContent && (
          <div className="flex flex-col items-center justify-center max-w-[600px] px-4 h-full">
            {spotifyUser && (
              <p className="font-body text-heading-2 text-gray-700 pb-7">{`Hi, ${spotifyUser?.display_name} `}</p>
            )}
            {showDynamicText()}
          </div>
        )}

        {/* Content Container - shows when loading or has songs */}
        {hasContent && (
          <div
            id="content-container"
            className={`w-full flex-1 min-h-0 flex justify-center items-center transition-all duration-700 ease-in-out opacity-100 md:order-1 ${
              hasContent ? "md:mt-5 mt-7" : ""
            }`}
          >
            {showItem()}
          </div>
        )}

        <ButtonsContainer
          hasContent={hasContent}
          filtersOpen={filtersOpen}
          setFilterOpen={setFilterOpen}
        />
      </div>

      <FilterDrawer
        isOpen={filtersOpen}
        onClose={() => setFilterOpen(!filtersOpen)}
      />
    </div>
  );
}
