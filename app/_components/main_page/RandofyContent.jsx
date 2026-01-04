"use client";
import { useState } from "react";
import { useSpotifyContext } from "../../context/spotify-context";
import { useMusicContext } from "../../context/music-context";
import FilterDrawer from "./FilterDrawer/FilterDrawer";
import SongListController from "./SongList/SongListController";
import Loader from "../ui/loading/Loader";
import ButtonsContainer from "./ButtonsContainer";
import { useActiveFilterLabels } from "../../_hooks/useActiveFilterLabels";

const TEXT_SIZES = [
  "text-display-1",
  "text-display-2",
  "text-display-3",
  "text-body-lg", // 👈 minimum allowed
];

const getTextSizeClass = (len) => {
  let index = 0;

  if (len < 60) index = 0;
  else if (len < 90) index = 1;
  else if (len < 120) index = 2;
  else index = 3;

  // 🔒 clamp (blocker)
  const MIN_INDEX = 3; // text-body-lg
  return TEXT_SIZES[Math.min(index, MIN_INDEX)];
};

const getTextLength = ({ num, baseText, genres, dets }) => {
  let length = String(num).length + baseText.length;

  if (genres.length) length += genres.join(", ").length + 7; // " genres"
  if (dets.length) length += dets.join(", ").length + 9; // " that are"

  return length;
};

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

  const showDynamicText = () => {
    const num = musicContext.songLimit;
    const genres = Array.from(musicContext.genres);
    const dets = useActiveFilterLabels(musicContext.songDetails);

    const genresExist = genres.length > 0;
    const detsExist = dets.length > 0;

    const baseText =
      genresExist || detsExist
        ? "random songs from Spotify from"
        : "totally random songs from Spotify";

    const textLength = getTextLength({
      num,
      baseText,
      genres,
      dets,
    });

    const sizeClass = getTextSizeClass(textLength);

    return (
      <h1
        className={`font-body ${sizeClass} text-gray-700 pb-16 text-center transition-all`}
      >
        {num} {baseText}{" "}
        {genresExist && (
          <>
            <em>{genres.join(", ")}</em> genres{" "}
          </>
        )}
        {detsExist && (
          <>
            that are <em>{dets.join(", ")}</em>
          </>
        )}
      </h1>
    );
  };

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
            {/* Dynmaic text in size and length */}
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
