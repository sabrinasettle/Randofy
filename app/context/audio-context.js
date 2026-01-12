"use client";
import { createContext, useContext, useEffect, useRef, useState } from "react";

const AudioContext = createContext(null);
const PREVIEW_FALLBACK = 29;

const DEFAULT_PREVIEW_VOLUME = 0.2;
const MIN_PREVIEW_VOLUME = 0.08;
const VOLUME_KEY = "previewVolume";

export function AudioProvider({ children }) {
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [song, setSong] = useState(null);

  const safeNumber = (v) => (Number.isFinite(v) ? v : 0);
  const clamp01 = (n) => Math.max(0, Math.min(1, n));

  const getSavedVolume = () => {
    try {
      const v = Number(localStorage.getItem(VOLUME_KEY));
      if (!Number.isFinite(v)) return null;
      const clamped = clamp01(v);
      return clamped < MIN_PREVIEW_VOLUME ? null : clamped; // ✅ ignore silent/tiny saved values
    } catch {
      return null;
    }
  };

  const setVolume = (v) => {
    const audio = audioRef.current;
    if (!audio) return;
    const clamped = clamp01(Number(v));
    audio.volume = clamped;
    try {
      localStorage.setItem(VOLUME_KEY, String(clamped));
    } catch {}
  };

  // ✅ Keep React state in sync with the REAL audio element state
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const onPlay = () => setIsPlaying(true);
    const onPause = () => setIsPlaying(false);
    const onEnded = () => {
      setIsPlaying(false);
      setCurrentTime(0);
    };

    audio.addEventListener("play", onPlay);
    audio.addEventListener("pause", onPause);
    audio.addEventListener("ended", onEnded);

    return () => {
      audio.removeEventListener("play", onPlay);
      audio.removeEventListener("pause", onPause);
      audio.removeEventListener("ended", onEnded);
    };
  }, []);

  // ✅ Handle src changes: stop old audio, reset state, load new metadata
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    // Stop whatever was happening before switching src
    audio.pause();
    setIsPlaying(false);

    // Reset progress immediately
    setCurrentTime(0);
    audio.currentTime = 0;

    // Duration fallback for previews
    setDuration(song?.preview_url ? PREVIEW_FALLBACK : 0);

    // Apply base volume for previews
    if (song?.preview_url) {
      const saved = getSavedVolume();
      audio.volume = saved ?? DEFAULT_PREVIEW_VOLUME;

      // Force reload metadata for new src
      try {
        audio.load();
      } catch {}
    } else {
      // No preview URL -> nothing to play
      setDuration(0);
    }
  }, [song?.preview_url]);

  // Keep time/duration updated (separate from src-change reset)
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

    const onVolumeChange = () => {
      try {
        localStorage.setItem(VOLUME_KEY, String(clamp01(audio.volume)));
      } catch {}
    };

    audio.addEventListener("timeupdate", onTimeUpdate);
    audio.addEventListener("loadedmetadata", onLoadedMetadata);
    audio.addEventListener("durationchange", onDurationChange);
    audio.addEventListener("volumechange", onVolumeChange);

    return () => {
      audio.removeEventListener("timeupdate", onTimeUpdate);
      audio.removeEventListener("loadedmetadata", onLoadedMetadata);
      audio.removeEventListener("durationchange", onDurationChange);
      audio.removeEventListener("volumechange", onVolumeChange);
    };
  }, [song?.preview_url]); // ok to key off src

  const play = async () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (!song?.preview_url) return;

    // Ensure we never start above base volume
    const saved = getSavedVolume();
    const base = saved ?? DEFAULT_PREVIEW_VOLUME;
    if (!Number.isFinite(audio.volume) || audio.volume > base)
      audio.volume = base;

    try {
      await audio.play();
      // isPlaying will flip via "play" event listener
    } catch {
      // autoplay restrictions — ignore or surface to UI
    }
  };

  const pause = () => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.pause();
    // isPlaying will flip via "pause" event listener
  };

  const seek = (time) => {
    const audio = audioRef.current;
    if (!audio) return;

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
        setVolume,
      }}
    >
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
