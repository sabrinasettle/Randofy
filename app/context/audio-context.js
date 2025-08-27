"use client";
import { createContext, useContext, useEffect, useRef, useState } from "react";

const AudioContext = createContext(null);

// fallback used for spotify previews so progress moves even if metadata isn't available
const PREVIEW_FALLBACK = 29;

export function AudioProvider({ children }) {
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [song, setSong] = useState(null);

  const safeNumber = (v) => (Number.isFinite(v) ? v : 0);

  // reattach listeners when src changes
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const onTimeUpdate = () => setCurrentTime(safeNumber(audio.currentTime));
    const onLoadedMetadata = () =>
      setDuration(
        safeNumber(audio.duration) ||
          (song?.preview_url ? PREVIEW_FALLBACK : 0),
      );
    const onDurationChange = () =>
      setDuration(
        safeNumber(audio.duration) ||
          (song?.preview_url ? PREVIEW_FALLBACK : 0),
      );
    const onEnded = () => {
      setIsPlaying(false);
      setCurrentTime(0);
    };

    audio.addEventListener("timeupdate", onTimeUpdate);
    audio.addEventListener("loadedmetadata", onLoadedMetadata);
    audio.addEventListener("durationchange", onDurationChange);
    audio.addEventListener("ended", onEnded);

    // reset state for new src; set fallback for previews so progress starts moving
    setCurrentTime(0);
    setDuration(song?.preview_url ? PREVIEW_FALLBACK : 0);

    // force reload metadata for new src
    if (song?.preview_url) {
      try {
        audio.load();
      } catch (e) {
        // ignore load errors
      }
    }

    return () => {
      audio.removeEventListener("timeupdate", onTimeUpdate);
      audio.removeEventListener("loadedmetadata", onLoadedMetadata);
      audio.removeEventListener("durationchange", onDurationChange);
      audio.removeEventListener("ended", onEnded);
    };
  }, [song?.preview_url]);

  const play = async () => {
    const audio = audioRef.current;
    if (!audio) return;
    try {
      await audio.play();
      setIsPlaying(true);
    } catch (e) {
      // autoplay restrictions — ignore or surface to UI
    }
  };

  const pause = () => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.pause();
    setIsPlaying(false);
  };

  const seek = (time) => {
    const audio = audioRef.current;
    if (!audio) return;
    // clamp to either known duration or fallback if preview
    const dur =
      safeNumber(duration) || (song?.preview_url ? PREVIEW_FALLBACK : 0);
    const clamped = Math.max(0, Math.min(dur || time, time));
    audio.currentTime = clamped;
    setCurrentTime(clamped);
  };

  return (
    <AudioContext.Provider
      value={{
        isPlaying,
        currentTime,
        duration,
        play,
        pause,
        seek,
        song,
        setSong,
        audioRef,
        setCurrentTime,
      }}
    >
      {/* audio always mounted, but omit src when none to avoid empty-string warning */}
      <audio
        ref={audioRef}
        src={song?.preview_url || undefined}
        preload="metadata"
        crossOrigin="anonymous"
      />
      {children}
    </AudioContext.Provider>
  );
}

export const useAudio = () => useContext(AudioContext);
