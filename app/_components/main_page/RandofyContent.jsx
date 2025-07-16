"use client";
import { useState } from "react";
import { useSpotifyContext } from "../../context/spotify-context";
import FilterDrawer from "./FilterDrawer/FilterDrawer";
import SongListController from "./SongList/SongListController";
import LoadingBall from "../ui/loading/LoadingBall";
import ButtonsContainer from "./ButtonsContainer";

export default function RandofyContent() {
  const { spotifyClient } = useSpotifyContext();
  const [filtersOpen, setFilterOpen] = useState(false);
  const { spotifyUser } = spotifyClient;

  const hasContent =
    spotifyClient.isLoading || spotifyClient.currentSongs.length !== 0;

  function showItem() {
    if (spotifyClient.isLoading)
      return (
        <div className="w-full flex justify-center items-center">
          <LoadingBall isLoading={spotifyClient.isLoading} />
        </div>
      );
    else if (spotifyClient.currentSongs.length !== 0)
      return (
        <div className="w-full flex justify-end items-center mt-8 md:mt-0">
          {/* <LoadingBall isLoading={true} /> */}
          {/* <AlbumCarousel songs={spotifyClient.currentSongs} /> */}
          <SongListController />
        </div>
      );
    return null; // Return null when no content to show
  }

  return (
    // overflow-hidden
    <div>
      <div
        className={`flex h-screen ${spotifyClient.isLoading ? "w-screen" : "w-full"} md:pt-0 flex-col justify-center items-center relative pb-4 md:pb-6 overflow-hidden z-0`}
      >
        {/* Buttons Container - responsive behavior */}

        {/* Default state - centered text */}
        {!hasContent && (
          <div className="flex flex-col items-center justify-center max-w-[600px] px-4 h-min">
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
            className={`h-full w-screen flex justify-center items-center transition-all duration-700 ease-in-out opacity-100 md:order-1 ${
              hasContent ? "md:mt-5" : ""
            }`}
            id="content-container"
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
