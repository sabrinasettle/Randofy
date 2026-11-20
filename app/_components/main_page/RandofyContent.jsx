"use client";
import { useState, useMemo, useEffect } from "react";
import Image from "next/image";
import previewAlbums from "../../../public/album-preview/albums.json";
import { useSpotifyContext } from "../../context/spotify-context";
import { useMusicContext } from "../../context/music-context";
import FilterDrawer from "./FilterDrawer/FilterDrawer";
import SongListController from "./SongList/SongListController";
import Loader from "../ui/loading/Loader";
import ButtonsContainer from "./ButtonsContainer";
import { createArtists } from "../../utils/createArtists";
import DefaultView from "../SongView/SongViews/DefaultView";
import { useIsMobile } from "../../_hooks/useIsMobile";

// Percentage coordinates keep the discovery collage stable across screen sizes.
const previewPositions = [
  [70, 15, 25], [44, 24, 20], [64, 48, 25], [79, 79, 24],
  [29, 70, 21], [13, 85, 17], [93, 24, 13], [12, 17, 12],
  [30, 12, 10], [48, 7, 9], [25, 33, 11], [10, 45, 9],
  [43, 49, 11], [88, 43, 10], [96, 60, 9], [45, 86, 14],
  [7, 65, 9], [61, 72, 10], [80, 61, 11], [29, 92, 9],
  [94, 88, 10], [56, 94, 8], [7, 31, 7], [36, 38, 7],
];

const mobilePreviewPositions = [
  [15, 34, 20], [40, 30, 24], [67, 40, 28], [89, 28, 15],
  [23, 79, 15], [47, 78, 18], [86, 78, 19],
];

function HomePreview() {
  return (
    <div className="randofy-album-preview" aria-hidden="true">
      {previewAlbums.map((album, index) => {
        const [x, y, size] = previewPositions[index % previewPositions.length];
        const mobile = mobilePreviewPositions[index];
        return (
          <div
            key={album.src}
            className="randofy-album-preview__circle"
            style={{
              left: `${x}%`, top: `${y}%`, width: `${size}%`,
              "--mobile-x": `${mobile?.[0] ?? 0}%`,
              "--mobile-y": `${mobile?.[1] ?? 0}%`,
              "--mobile-size": `${mobile?.[2] ?? 0}%`,
            }}
          >
            <Image src={album.src} alt="" fill sizes="(max-width: 900px) 25vw, 180px" />
          </div>
        );
      })}
    </div>
  );
}

function getSongTimestamp(song, dateKey, index) {
  const generatedAt = new Date(song?.generated_at).getTime();
  if (!Number.isNaN(generatedAt)) return generatedAt;

  const dateTime = new Date(dateKey).getTime();
  if (!Number.isNaN(dateTime)) return dateTime + index;

  return index;
}

function getRecentSongs(generationHistory, limit = 24) {
  if (!generationHistory || typeof generationHistory !== "object") return [];

  return Object.entries(generationHistory)
    .flatMap(([dateKey, songs]) => {
      if (!Array.isArray(songs)) return [];

      return songs.map((song, index) => ({
        ...song,
        historyDate: dateKey,
        historySort: getSongTimestamp(song, dateKey, index),
      }));
    })
    .filter((song) => song?.track_id && song?.album_image?.url)
    .sort((a, b) => b.historySort - a.historySort)
    .slice(0, limit);
}

function RecentSongDots({ songs, onSelectSong, isMobile }) {
  if (!songs.length) return null;

  const positions = isMobile ? mobilePreviewPositions : previewPositions;

  return (
    <div className="randofy-recent-dots randofy-recent-dots--collage" aria-label="Recently randomized songs">
      {songs.map((song, index) => {
        const artists = createArtists(song);
        const alt = `Album cover for ${song.album_name} by ${artists}`;
        const [x, y, size] = positions[index % positions.length];

        return (
          <a
            className="randofy-recent-dot"
            href={song.href}
            target="_blank"
            rel="noreferrer"
            key={`${song.track_id}-${index}`}
            data-dot-index={index}
            onClick={(event) => {
              event.preventDefault();
              onSelectSong(index);
            }}
            style={{
              "--dot-x": `${x}%`,
              "--dot-y": `${y}%`,
              "--dot-size": `${size}%`,
            }}
          >
            <span className="randofy-recent-dot__image">
              <Image
                src={song.album_image.url}
                alt={alt}
                fill
                sizes="(max-width: 900px) 100px, 180px"
                className="object-cover transition-transform duration-500"
              />
            </span>
            <span className="randofy-recent-dot__label">
              <p className="font-body text-body-sm text-gray-700 truncate">
                {song.track_name}
              </p>
              <p className="font-body text-caption text-gray-600 truncate">
                {artists}
              </p>
            </span>
          </a>
        );
      })}
    </div>
  );
}

function WelcomeBackHero({ spotifyUser, recentSongs, onSelectSong, isMobile }) {
  const hasRecentSongs = recentSongs.length > 0;
  const name = spotifyUser?.display_name;
  const bodyText = hasRecentSongs
    ? "Revisit your latest finds, or shuffle again to discover something new."
    : "Start fresh, tune the filters, or let Randofy pull something unexpected from the catalog.";

  return (
    <div className="randofy-home-hero randofy-home-hero--returning w-full max-w-[1120px] px-4 h-full">
      <div className="randofy-home-hero__copy">
        <div className="flex flex-col gap-3">
          <p className="font-body text-heading-5 text-gray-600">
            {name ? `Welcome back, ${name}` : "Welcome back"}
          </p>
          <h1 className="font-body text-display-2 text-gray-700 text-left transition-all duration-200">
            {hasRecentSongs
              ? "Pick up where the last shuffle left off."
              : "Find your next favorite song."}
          </h1>
          <p className="font-body text-body-lg text-gray-600 max-w-[560px] md:text-left">
            {bodyText}
          </p>
        </div>
      </div>

      {hasRecentSongs ? (
        <RecentSongDots songs={recentSongs} onSelectSong={onSelectSong} isMobile={isMobile} />
      ) : (
        <HomePreview />
      )}
    </div>
  );
}

export default function RandofyContent() {
  const { spotifyClient } = useSpotifyContext();
  const { musicContext } = useMusicContext();
  const { spotifyUser } = spotifyClient;
  const [filtersOpen, setFilterOpen] = useState(false);
  const [recentDetailsOpen, setRecentDetailsOpen] = useState(false);
  const [recentSelectedIndex, setRecentSelectedIndex] = useState(0);
  const isMobile = spotifyClient.isMobile;
  const isCompactRecentLayout = useIsMobile(900);

  const hasContent =
    musicContext.isLoading || musicContext.currentSongs.length !== 0;
  const recentSongs = useMemo(
    () => getRecentSongs(musicContext.generationHistory),
    [musicContext.generationHistory],
  );
  const visibleRecentSongs = useMemo(
    () => recentSongs.slice(
      0,
      isCompactRecentLayout ? mobilePreviewPositions.length : previewPositions.length,
    ),
    [isCompactRecentLayout, recentSongs],
  );
  const shouldShowWelcomeBack = Boolean(spotifyUser) || recentSongs.length > 0;

  useEffect(() => {
    setRecentSelectedIndex((index) =>
      Math.min(index, Math.max(visibleRecentSongs.length - 1, 0)),
    );
  }, [visibleRecentSongs.length]);

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

  function openRecentSong(index) {
    setRecentSelectedIndex(index);
    setRecentDetailsOpen(true);
  }

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
          <>
            {shouldShowWelcomeBack ? (
              <WelcomeBackHero
                spotifyUser={spotifyUser}
                recentSongs={visibleRecentSongs}
                onSelectSong={openRecentSong}
                isMobile={isCompactRecentLayout}
              />
            ) : (
              <div className="randofy-home-hero w-full max-w-[1120px] px-4 h-full">
                <div className="randofy-home-hero__copy">
                  <div className="flex flex-col gap-4">
                    <h1 className="font-body text-display-1 text-gray-700 text-center md:text-left transition-all duration-200">
                      Find your next favorite song.
                    </h1>
                    <p className="font-body text-body-lg text-gray-600 max-w-[560px] text-center md:text-left">
                      Generate unexpected songs from Spotify's catalog, tune
                      filters by genre and audio features, and save the tracks
                      worth replaying.
                    </p>
                  </div>

                  <p className="font-mono text-caption text-gray-500 uppercase">
                    choose filters or let randomness lead you to new finds
                  </p>
                </div>

                <HomePreview />
              </div>
            )}
          </>
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

        {!hasContent && visibleRecentSongs[recentSelectedIndex] && (
          <DefaultView
            portalOnly
            songOverride={visibleRecentSongs[recentSelectedIndex]}
            songsOverride={visibleRecentSongs}
            selectedIndexOverride={recentSelectedIndex}
            onSelectIndexOverride={setRecentSelectedIndex}
            isOpenOverride={recentDetailsOpen}
            onCloseOverride={() => setRecentDetailsOpen(false)}
          />
        )}
      </div>

      <FilterDrawer
        isOpen={filtersOpen}
        onClose={() => setFilterOpen(!filtersOpen)}
      />
    </div>
  );
}
