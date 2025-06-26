"use client";
import { useState } from "react";
import { useSpotifyContext } from "../../context/spotify-context";
import Loading from "../layout/Loading";
// import DoubleEndedSlider from "../ui/DoubleEndedSlider";
import FilterDrawer from "./FilterDrawer/FilterDrawer";
import GetSongsButton from "./GetSongsButton";
import AlbumStack from "./SongList/AlbumStack";
import LoadingBall from "../ui/loading/LoadingBall";
import ButtonsContainer from "./ButtonsContainer";

// Have a cancel button that abandons the search?? if isLoading
const GenerateButton = ({ spotifyClient, isSmall }) => {
  return (
    <button
      id="generate"
      className={`bg-gray-700 text-gray-000 px-4 py-3 rounded-sm transition-all duration-700 ease-in-out ${
        isSmall ? "text-sm" : "text-heading-5"
      }`}
      onClick={spotifyClient.getSongs}
    >
      Get Songs
    </button>
  );
};

const FilterButton = ({ handleOpen, isSmall }) => {
  return (
    <button
      className={`font-body bg-gray-100 px-4 py-3 rounded-sm text-gray-700 border border-transparent hover:border-gray-200 transition-all duration-700 ease-in-out ${
        isSmall ? "text-sm" : "text-heading-5"
      }`}
      onClick={handleOpen}
    >
      Filter Songs
    </button>
  );
};

export default function RandofyContent() {
  const { spotifyClient } = useSpotifyContext();
  const [filtersOpen, setFilterOpen] = useState(false);

  const hasContent =
    spotifyClient.isLoading || spotifyClient.currentSongs.length !== 0;

  function showItem() {
    if (spotifyClient.isLoading)
      return (
        <div className="w-full">
          <LoadingBall isLoading={spotifyClient.isLoading} />
        </div>
      );
    else if (spotifyClient.currentSongs.length !== 0) return <AlbumStack />;
    return null; // Return null when no content to show
  }

  return (
    <div className="flex h-full w-full flex-col items-center relative overflow-hidden">
      {/* Buttons Container - responsive behavior */}
      <ButtonsContainer
        hasContent={hasContent}
        filtersOpen={filtersOpen}
        setFilterOpen={setFilterOpen}
      />

      {/* Default state - centered text */}
      {!hasContent && (
        <div className="flex-1 flex flex-col items-center justify-center max-w-[600px] px-4">
          <h1 className="font-display text-display-1 text-gray-700 pb-16 text-center">
            5 totally random songs from Spotify
          </h1>
          {/* Spacer for buttons on larger screens */}
          <div className="hidden md:block h-16"></div>
        </div>
      )}

      {/* Content Container - shows when loading or has songs */}
      {hasContent && (
        <div
          className={`w-full transition-all duration-700 ease-in-out opacity-100 ${
            hasContent ? "flex-1 md:mt-20" : ""
          }`}
          id="content-container"
        >
          {showItem()}
        </div>
      )}

      <FilterDrawer
        isOpen={filtersOpen}
        onClose={() => setFilterOpen(!filtersOpen)}
      />
    </div>
  );
}
