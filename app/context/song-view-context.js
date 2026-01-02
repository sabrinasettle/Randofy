"use client";

import React, { useState, useEffect } from "react";
import { useIsMobile } from "../_hooks/useIsMobile";

const SongViewContext = React.createContext(null);
export default SongViewContext;

export function SongViewProvider({ children }) {
  // const [selectedSong, setSelectedSong] = useState({}); // index: currentIndex, song: songs[currentIndex],
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isDefault, setIsDefault] = useState(true);
  // const [drawersOpen, setDrawersOpen] = useState(false);
  // const [activeSection, setActiveSection] = useState(null);
  // const [currentIndex, setCurrentIndex] = useState(0);

  //setGenerationHistory = { key: song[]} where song is {title,...}
  //
  // useEffect(() => {
  //   console.log("drawersOpen changed to:", drawersOpen);
  // }, [drawersOpen]);

  const isMobile = useIsMobile();

  const songViewContext = {
    // setSelectedSong,
    // selectedSong,
    isMobile,
    // handleOpenDetails,
    // closeDetails,
    // isDetailsOpen,
    // setIsDetailsOpen,
    isDefault,
    setIsDefault,
    isDetailsOpen,
    setIsDetailsOpen,
    // setDrawersOpen,
    // handleDrawerOpen,
    // handleDrawerClosed,
    // drawersOpen,
    // activeSection,
    // setActiveSection,
  };

  const context = {
    songViewContext,
  };

  return (
    <SongViewContext.Provider value={context}>
      {children}
    </SongViewContext.Provider>
  );
}

export function useSongViewContext() {
  const context = React.useContext(SongViewContext);
  if (!context) {
    throw new Error("useSpotifyContext must be used within a SpotifyProvider");
  }
  return context;
}
