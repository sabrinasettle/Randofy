"use client";

import React, { useState, useEffect } from "react";
import { useIsMobile } from "../_hooks/useIsMobile";

const SongViewContext = React.createContext(null);
export default SongViewContext;

export function SongViewProvider({ children }) {
  const [selectedSong, setSelectedSong] = useState({});
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isDefault, setIsDefault] = useState(true);
  const [drawersOpen, setDrawersOpen] = useState(false);
  const [activeSection, setActiveSection] = useState(null);

  //setGenerationHistory = { key: song[]} where song is {title,...}
  //
  useEffect(() => {
    console.log("drawersOpen changed to:", drawersOpen);
  }, [drawersOpen]);

  const isMobile = useIsMobile();

  function openDetails() {
    // setPageActive(page);
    setIsDetailsOpen(true);
  }

  function closeDetails() {
    setIsDetailsOpen(false);
    setDrawersOpen(false);
  }

  function handleDrawerOpen(string) {
    setDrawersOpen(true);
    setActiveSection(string);
  }

  function handleDrawerClosed() {
    setDrawersOpen(false);
    setActiveSection(null);
  }

  const songViewContext = {
    setSelectedSong,
    selectedSong,
    isMobile,
    openDetails,
    closeDetails,
    isDetailsOpen,
    setIsDetailsOpen,
    isDefault,
    setIsDefault,
    setDrawersOpen,
    handleDrawerOpen,
    handleDrawerClosed,
    drawersOpen,
    activeSection,
    setActiveSection,
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
