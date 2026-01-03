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

  const hasContent =
    musicContext.isLoading || musicContext.currentSongs.length !== 0;

  function showItem() {
    if (musicContext.isLoading) return <Loader isLoading />;
    if (musicContext.currentSongs.length !== 0) {
      return (
        <div className="w-full flex justify-end items-center sm:mt-8 md:mt-0">
          <SongListController />
        </div>
      );
    }
    return null;
  }

  return (
    <div className="min-h-dvh w-full overflow-hidden">
      {/* Two-row layout: main (flex-1) + buttons (stable) */}
      <div className="flex min-h-dvh flex-col">
        {/* MAIN AREA */}
        <main className="flex-1 min-h-0 w-full overflow-hidden flex items-center justify-center relative">
          {!hasContent && (
            <div className="flex flex-col items-center justify-center max-w-[600px] px-4 text-center">
              {spotifyUser && (
                <p className="font-body text-heading-2 text-gray-700 pb-7">
                  {`Hi, ${spotifyUser?.display_name}`}
                </p>
              )}
              <h1 className="font-body text-display-1 text-gray-700 pb-16">
                5 totally random songs from Spotify
              </h1>
            </div>
          )}

          {hasContent && (
            <div
              id="content-container"
              className="w-full h-full flex items-center justify-center transition-all duration-700 ease-in-out"
            >
              {showItem()}
            </div>
          )}
        </main>

        {/* BUTTONS AREA (stable) */}
        <footer className="w-full shrink-0 pb-[env(safe-area-inset-bottom)]">
          <ButtonsContainer
            hasContent={hasContent}
            filtersOpen={filtersOpen}
            setFilterOpen={setFilterOpen}
          />
        </footer>
      </div>

      <FilterDrawer
        isOpen={filtersOpen}
        onClose={() => setFilterOpen((v) => !v)}
      />
    </div>
  );
}
