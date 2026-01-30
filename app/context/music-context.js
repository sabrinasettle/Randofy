"use client";
import React, { useState, useEffect } from "react";
import { useIsMobile } from "../_hooks/useIsMobile";

const MusicContext = React.createContext(null);

export default MusicContext;

export function MusicProvider({ children }) {
  const [currentSongs, setCurrentSongs] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [generationHistory, setGenerationHistory] = useState({});
  const [error, setError] = useState(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  // Is an object = index: number, song: songs[number]
  const [selectedSong, setSelectedSong] = useState({});

  // Filters
  const [songLimit, setSongLimit] = useState(5);
  const [songDetails, setSongDetails] = useState({
    popularity: { min: 0, max: 1.0 },
    acoustics: { min: 0.0, max: 1.0 },
    energy: { min: 0.0, max: 1.0 },
    vocals: { min: 0.0, max: 1.0 },
    danceability: { min: 0.0, max: 1.0 },
    mood: { min: 0.0, max: 1.0 },
  });
  const [genres, setGenres] = useState(new Set());
  const [filtersTotal, setFiltersTotal] = useState(0);

  const isMobile = useIsMobile();

  const filterValueStrings = {
    popularity: ["Unknown", "Kinda Known", "Known", "Famous"],
    acoustics: [
      "All Electric",
      "Mostly Electric",
      "Some Acoustic",
      "All Acoustic",
    ],
    energy: ["Super Chill", "Kinda Chill", "Kinda Hype", "Super Hype"],
    vocals: ["No Vocals", "Some Vocals", "Lots of Vocals", "All Vocals"],
    danceability: ["No Groove", "Almost a Bop", "Bop", "Dance Party"],
    mood: ["Real Low", "Kinda Low", "Kinda High", "Real High"],
  };

  useEffect(() => {
    const history = JSON.parse(localStorage.getItem("history"));

    if (history) {
      setGenerationHistory(history);
    }
  }, []);

  const updateSongHistory = async (songs) => {
    // localStorage.removeItem("history");
    // check if local storage can be reached else return
    const songHistory = JSON.parse(localStorage.getItem("history"));
    const date = new Date();
    const dateKey = date.toLocaleDateString();

    if (!songHistory) {
      localStorage.setItem("history", JSON.stringify({ [dateKey]: songs }));
    } else {
      if (!songHistory[dateKey]) {
        songHistory[dateKey] = [];
      }
      const songList = [...songHistory[dateKey], ...songs];
      songHistory[dateKey] = songList;
      localStorage.setItem("history", JSON.stringify(songHistory));

      setGenerationHistory(songHistory);
    }
  };

  const getSongs = async () => {
    setIsLoading(true);

    const params = new URLSearchParams();

    // The state from above for reference
    // const [songDetails, setSongDetails] = useState({
    //   popularity: { min: 0, max: 100 },
    //   acoustics: { min: 0.0, max: 1.0 },
    //   energy: { min: 0.0, max: 1.0 },
    //   vocals: { min: 0.0, max: 1.0 },
    //   danceability: { min: 0.0, max: 1.0 },
    //   mood: { min: 0.0, max: 1.0 },
    // });
    //

    params.set("limit", songLimit);

    params.set("min_popularity", Math.ceil(songDetails.popularity.min * 100));
    params.set("max_popularity", Math.ceil(songDetails.popularity.max * 100));

    params.set("min_energy", songDetails.energy.min);
    params.set("max_energy", songDetails.energy.max);

    params.set("min_danceability", songDetails.danceability.min);
    params.set("max_danceability", songDetails.danceability.max);

    params.set("min_acousticness", songDetails.acoustics.min);
    params.set("max_acousticness", songDetails.acoustics.max);

    params.set("min_speechiness", songDetails.vocals.min);
    params.set("max_speechiness", songDetails.vocals.max);

    params.set("min_valence", songDetails.mood.min);
    params.set("max_valence", songDetails.mood.max);

    let fiveGenres;
    if (genres.size !== 0) {
      fiveGenres = genres.size > 5 ? genres.slice(0, 5) : genres;
      params.set("seed_genres", Array.from(fiveGenres));
    }

    console.log(fiveGenres);
    const res = await fetch("/api/random?" + params.toString());

    const trackAnalytics = async (selectedGenres, songDetails) => {
      try {
        await fetch("/api/analytics", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            genres: Array.from(selectedGenres), // Convert Set to Array
            songDetails: songDetails,
          }),
        });
      } catch (error) {
        console.error("Failed to track analytics:", error);
      }
    };

    await trackAnalytics(genres, songDetails);

    if (!res.ok) {
      setError(await res.json());
      setIsLoading(false);
    } else {
      const data = await res.json();
      let song = data.recommendedTracks[0];
      setCurrentSongs(data.recommendedTracks);
      setSelectedSong({ index: 0, song });
      updateSongHistory(data.recommendedTracks);
      setIsLoading(false);
      return data;
    }
  };

  // len = 5
  // 0, 1, 2, 3, 4
  function moveForward() {
    let len = currentSongs.length;
    const index = (selectedSong.index + 1) % len;
    setSelectedSong({
      index: index,
      song: currentSongs[index],
    });
  }

  function moveBackward() {
    let len = currentSongs.length;

    let index = (selectedSong.index - 1 + len) % len;
    setSelectedSong({
      index: index,
      song: currentSongs[index],
    });
  }

  function openDetails() {
    // setPageActive(page);
    setIsDetailsOpen(!isDetailsOpen);
  }

  function closeDetails() {
    setIsDetailsOpen(false);
    setDrawersOpen(false);
  }

  const musicContext = {
    filterValueStrings,
    isLoading,
    // State
    isDetailsOpen,
    setIsDetailsOpen,
    currentSongs,
    setCurrentSongs,
    selectedSong,
    setSelectedSong,
    generationHistory,
    // General Functions
    getSongs,
    moveForward,
    moveBackward,
    openDetails,
    closeDetails,
    // Generated Values
    isMobile,
    // Filters
    songLimit,
    setSongLimit,
    songDetails,
    setSongDetails,
    genres,
    setGenres,
    filtersTotal,
    setFiltersTotal,
  };

  const context = {
    musicContext,
  };

  return (
    <MusicContext.Provider value={context}>{children}</MusicContext.Provider>
  );
}

export function useMusicContext() {
  const context = React.useContext(MusicContext);
  if (!context) {
    throw new Error("useMusicContext must be used within a MusicProvider");
  }
  return context;
}
