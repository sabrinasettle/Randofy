"use client";
import { useState, useMemo, useRef, useEffect } from "react";
import Image from "next/image";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useSpotifyContext } from "../../context/spotify-context";
import { useMusicContext } from "../../context/music-context";
import FilterDrawer from "./FilterDrawer/FilterDrawer";
import SongListController from "./SongList/SongListController";
import Loader from "../ui/loading/Loader";
import ButtonsContainer from "./ButtonsContainer";
import { createArtists } from "../../utils/createArtists";
import DefaultView from "../SongView/SongViews/DefaultView";
import { useIsMobile } from "../../_hooks/useIsMobile";

function EntropyParticles() {
  const particlesRef = useRef();
  const particleCount = 130;

  const { settled, scattered, current } = useMemo(() => {
    const settledPositions = new Float32Array(particleCount * 3);
    const scatteredPositions = new Float32Array(particleCount * 3);
    const currentPositions = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount; i += 1) {
      const i3 = i * 3;
      const angle = i * 2.399963229728653;
      const settledRadius = Math.sqrt(i / particleCount) * 3.2;
      const scatteredAngle = angle + Math.sin(i * 1.7) * 1.8;
      const scatteredRadius = 1.2 + ((i * 37) % 100) / 18;
      const z = Math.sin(i * 0.67) * 0.45;

      settledPositions[i3] = Math.cos(angle) * settledRadius;
      settledPositions[i3 + 1] = Math.sin(angle) * settledRadius;
      settledPositions[i3 + 2] = z;

      scatteredPositions[i3] = Math.cos(scatteredAngle) * scatteredRadius;
      scatteredPositions[i3 + 1] = Math.sin(scatteredAngle) * scatteredRadius;
      scatteredPositions[i3 + 2] = Math.cos(i * 0.41) * 1.1;

      currentPositions[i3] = settledPositions[i3];
      currentPositions[i3 + 1] = settledPositions[i3 + 1];
      currentPositions[i3 + 2] = settledPositions[i3 + 2];
    }

    return {
      settled: settledPositions,
      scattered: scatteredPositions,
      current: currentPositions,
    };
  }, []);

  useFrame(({ clock }) => {
    if (!particlesRef.current) return;

    const t = clock.getElapsedTime();
    const wave = (Math.sin(t * 0.42) + 1) / 2;
    const entropy = wave * wave * (3 - 2 * wave);
    const breath = Math.sin(t * 0.62) * 0.12;
    const positions = particlesRef.current.geometry.attributes.position.array;

    for (let i = 0; i < particleCount; i += 1) {
      const i3 = i * 3;
      const phase = i * 0.19;
      const driftX = Math.sin(t * 0.7 + phase) * 0.16 * entropy;
      const driftY = Math.cos(t * 0.58 + phase) * 0.16 * entropy;
      const targetX = THREE.MathUtils.lerp(settled[i3], scattered[i3], entropy);
      const targetY = THREE.MathUtils.lerp(
        settled[i3 + 1],
        scattered[i3 + 1],
        entropy,
      );
      const targetZ = THREE.MathUtils.lerp(
        settled[i3 + 2],
        scattered[i3 + 2],
        entropy,
      );

      positions[i3] = THREE.MathUtils.lerp(
        positions[i3],
        targetX + driftX,
        0.08,
      );
      positions[i3 + 1] = THREE.MathUtils.lerp(
        positions[i3 + 1],
        targetY + driftY,
        0.08,
      );
      positions[i3 + 2] = THREE.MathUtils.lerp(
        positions[i3 + 2],
        targetZ,
        0.08,
      );
    }

    particlesRef.current.geometry.attributes.position.needsUpdate = true;
    particlesRef.current.rotation.z = t * 0.035;
    particlesRef.current.scale.setScalar(1 + breath);
  });

  return (
    <points ref={particlesRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={particleCount}
          array={current}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.075}
        color="#b2b2b2"
        transparent
        opacity={0.74}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

function HomePreview() {
  return (
    <div className="randofy-entropy-preview" aria-hidden="true">
      <Canvas
        camera={{ position: [0, 0, 8.5], fov: 50 }}
        gl={{
          alpha: true,
          antialias: true,
          powerPreference: "high-performance",
        }}
      >
        <EntropyParticles />
      </Canvas>
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

function getRecentSongs(generationHistory, limit = 18) {
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

const dotPositions = [
  { x: 18, y: 16, size: 42 },
  { x: 44, y: 11, size: 34 },
  { x: 78, y: 21, size: 46 },
  { x: 30, y: 38, size: 36 },
  { x: 60, y: 43, size: 40 },
  { x: 87, y: 48, size: 34 },
  { x: 15, y: 65, size: 46 },
  { x: 42, y: 69, size: 36 },
  { x: 70, y: 73, size: 42 },
  { x: 90, y: 79, size: 38 },
  { x: 25, y: 88, size: 32 },
  { x: 56, y: 90, size: 44 },
  { x: 82, y: 92, size: 34 },
  { x: 10, y: 28, size: 30 },
  { x: 51, y: 27, size: 32 },
  { x: 74, y: 58, size: 30 },
  { x: 34, y: 54, size: 30 },
  { x: 63, y: 14, size: 30 },
];

const mobileDotPositions = [
  { x: 24, y: 20, size: 58 },
  { x: 68, y: 24, size: 46 },
  { x: 48, y: 48, size: 64 },
  { x: 26, y: 76, size: 44 },
  { x: 74, y: 78, size: 52 },
];

function RecentSongDots({ songs, onSelectSong, isMobile }) {
  if (!songs.length) return null;

  const positions = isMobile ? mobileDotPositions : dotPositions;

  return (
    <div className="randofy-recent-dots" aria-label="Recently randomized songs">
      {songs.map((song, index) => {
        const artists = createArtists(song);
        const alt = `Album cover for ${song.album_name} by ${artists}`;
        const position = positions[index % positions.length];

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
              "--dot-x": `${position.x}%`,
              "--dot-y": `${position.y}%`,
              "--dot-size": `${position.size}px`,
            }}
          >
            <span className="randofy-recent-dot__image">
              <Image
                src={song.album_image.url}
                alt={alt}
                fill
                sizes="48px"
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
    ? "Your latest random pulls are waiting. Start fresh, tune the filters, or revisit the tracks."
    : "Start fresh, tune the filters, or let Randofy pull something unexpected from the catalog.";

  return (
    <div className="randofy-home-hero randofy-home-hero--returning w-full max-w-[1120px] px-4 h-full">
      <div className="randofy-home-hero__copy">
        <div className="flex flex-col gap-3">
          <p className="font-body text-heading-5 text-gray-600">
            {name ? `Welcome back, ${name}` : "Welcome back"}
          </p>
          <h1 className="font-body text-display-2 text-gray-700 text-left transition-all duration-200">
            Pick up where the last shuffle left off.
          </h1>
          <p className="font-body text-body-lg text-gray-600 max-w-[560px] md:text-left">
            {bodyText}
          </p>
        </div>
      </div>

      {hasRecentSongs ? (
        <RecentSongDots
          songs={recentSongs}
          onSelectSong={onSelectSong}
          isMobile={isMobile}
        />
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
    () => recentSongs.slice(0, isCompactRecentLayout ? 5 : 12),
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
                      Randomize the full Spotify catalog.
                    </h1>
                    <p className="font-body text-body-lg text-gray-600 max-w-[560px] text-center md:text-left">
                      Pull deep cuts, forgotten tracks, and strange little
                      corners from any discography.
                    </p>
                  </div>

                  <p className="font-mono text-caption text-gray-500 uppercase">
                    choose filters or let it wander
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
