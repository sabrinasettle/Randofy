"use client";

import React, { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import useWindowDimensions from "../_hooks/useWindowDimensions";

const SongViewContext = React.createContext(null);
export default SongViewContext;

export function SongViewProvider({ children }) {
  const pathname = usePathname();
  const [error, setError] = useState(null);
  const [selectedSong, setSelectedSong] = useState({});
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  // const [pageActive, setPageActive] = useState(null);
  const [isMobile, setIsMobile] = useState(null);
  const [isDefault, setIsDefault] = useState(true);
  const [drawersOpen, setDrawersOpen] = useState(false);
  const { width, height } = useWindowDimensions();

  //setGenerationHistory = { key: song[]} where song is {title,...}

  useEffect(() => {
    setIsMobile(width <= 768);
  }, []);

  function openDetails() {
    // setPageActive(page);
    setIsDetailsOpen(true);
  }

  function closeDetails() {
    setIsDetailsOpen(false);
  }

  function markDrawerOpen() {
    setDrawersOpen(!drawersOpen);
  }
  // const isTrackSelected = (track_name) => {
  //   return track_name === selectedSong.song.track_name;
  // };

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
    markDrawerOpen,
    drawersOpen,
    // isTrackSelected,
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

// first attempt
// const ContextProvider = (props) => {
//     const [isLoading, setIsLoading] = useState(true);

//     return (
//         <Context.Provider value={{
//                 isLoading,
//                 // setIsLoading,
//             }}>
//             {props.children}
//         </Context.Provider>
//     );
// };

// export default ContextProvider;
