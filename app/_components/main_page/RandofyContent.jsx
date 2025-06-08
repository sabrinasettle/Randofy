"use client";
import { useState } from "react";
import { useSpotifyContext } from "../../context/spotify-context";
import Loading from "../layout/Loading";
// import DoubleEndedSlider from "../ui/DoubleEndedSlider";
import FilterDrawer from "./FilterDrawer/FilterDrawer";
import GetSongsButton from "./GetSongsButton";
import AlbumStack from "./SongList/AlbumStack";

// Have a cancel button that abandons the search?? if isLoading
const GenerateButton = ({ spotifyClient }) => {
  return (
    <button
      id="generate"
      className="bg-gray-700 text-gray-000 text-heading-5 px-4 py-3 rounded-sm"
      onClick={spotifyClient.getSongs}
    >
      Get Songs
    </button>
  );
};

const FilterButton = ({ handleOpen }) => {
  return (
    <button
      className="bg-gray-100 px-4 py-3 rounded-sm text-gray-700 text-heading-5"
      onClick={handleOpen}
    >
      Filter Songs
    </button>
  );
};

const DefaultHome = () => {
  return (
    <div className="h-full max-w-[600px]">
      <h1 className="text-display-1 text-gray-700 pb-16">
        5 totally random songs from Spotify
      </h1>
    </div>
  );
};

export default function RandofyContent() {
  const { spotifyClient } = useSpotifyContext();
  const [filtersOpen, setFilterOpen] = useState(false);

  function showItem() {
    if (spotifyClient.isLoading) return <Loading />;
    // else if (spotifyClient.currentSongs.length !== 0) return <SongList />;
    else if (spotifyClient.currentSongs.length !== 0) return <AlbumStack />;

    return (
      <div className="h-full max-w-[600px]">
        <h1 className="text-display-1 text-gray-700 pb-16">
          5 totally random songs from Spotify
        </h1>
      </div>
    );
  }

  return (
    <>
      <div className="w-full" id="content-container">
        {showItem()}
      </div>
      <div className="flex flex-row gap-4">
        <GetSongsButton isSmall={false} />
        <FilterButton handleOpen={() => setFilterOpen(!filtersOpen)} />
      </div>
      <FilterDrawer
        isOpen={filtersOpen}
        onClose={() => setFilterOpen(!filtersOpen)}
      />
    </>
  );
}
