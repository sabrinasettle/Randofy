"use client";
import { useState, useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useSpotifyContext } from "../../context/spotify-context";
import { useMusicContext } from "../../context/music-context";
import FilterDrawer from "./FilterDrawer/FilterDrawer";
import SongListController from "./SongList/SongListController";
import Loader from "../ui/loading/Loader";
import ButtonsContainer from "./ButtonsContainer";
import { useActiveFilterLabels } from "../../_hooks/useActiveFilterLabels";

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

    return { num, baseText };
  }, [musicContext.songLimit, musicContext.genres, dets]);

  const showDynamicText = () => {
    const { num, baseText } = dynamicText;

    return (
      <p className="font-mono text-caption uppercase text-gray-500 transition-all duration-200">
        {num} {baseText}
      </p>
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
          <div className="randofy-home-hero w-full max-w-[1120px] px-4 h-full">
            <div className="randofy-home-hero__copy">
              {spotifyUser && (
                <p className="font-body text-heading-5 text-gray-600">
                  {`Hi, ${spotifyUser?.display_name}`}
                </p>
              )}

              <div className="flex flex-col gap-4">
                {/* {showDynamicText()}*/}
                <h1 className="font-body text-display-1 text-gray-700 text-center md:text-left transition-all duration-200">
                  Randomize the full Spotify catalog.
                </h1>
                <p className="font-body text-body-lg text-gray-600 max-w-[560px] text-center md:text-left">
                  Pull deep cuts, forgotten tracks, and strange little corners
                  from any discography.
                </p>
              </div>

              <p className="font-mono text-caption text-gray-500 uppercase">
                choose filters or let it wander
              </p>
            </div>

            <HomePreview />
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
