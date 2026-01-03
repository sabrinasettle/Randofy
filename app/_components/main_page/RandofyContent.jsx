"use client";
import { useState } from "react";
import { useSpotifyContext } from "../../context/spotify-context";
import { useMusicContext } from "../../context/music-context";
import FilterDrawer from "./FilterDrawer/FilterDrawer";
import SongListController from "./SongList/SongListController";
import Loader from "../ui/loading/Loader";
import ButtonsContainer from "./ButtonsContainer";

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
        <div className="w-full flex justify-end items-center sm:mt-8 md:mt-0">
          <SongListController />
        </div>
      );
    return null; // Return null when no content to show
  }

  return (
    // overflow-hidden
    <div className="overflow-hidden min-h-dvh">
      <div
        className={
          isMobile
            ? `flex flex-col h-full w-full pt-4 pb-4 relative overflow-hidden z-0`
            : `flex h-full ${musicContext.isLoading ? "w-screen" : "w-full"} pt-4 pb-4 md:pt-0 md:pb-6 flex-col justify-start sm:justify-center items-center relative overflow-hidden z-0`
        }
      >
        {/* Buttons Container - responsive behavior */}

        {/* Default state - centered text */}
        {!hasContent && (
          <div className="flex flex-col items-center justify-center max-w-[600px] px-4 h-full">
            {/* Add codtional text here for showing the username */}
            {spotifyUser && (
              <p className="font-body text-heading-2 text-gray-700 pb-7">{`Hi, ${spotifyUser?.display_name} `}</p>
            )}
            <h1 className="font-body text-display-1 text-gray-700 pb-16 text-center">
              5 totally random songs from Spotify
            </h1>
          </div>
        )}

        {/* Content Container - shows when loading or has songs */}
        {hasContent && (
          <div
            id="content-container"
            className={`w-full flex-1 min-h-0 flex justify-center items-center transition-all duration-700 ease-in-out opacity-100 md:order-1 ${
              hasContent ? "md:mt-5 xs:mt-7" : ""
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
