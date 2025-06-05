"use client";

import React, { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
const SongViewContext = React.createContext(null);
export default SongViewContext;

export function SongViewProvider({ children }) {
  const pathname = usePathname();
  const [error, setError] = useState(null);
  const [selectedSong, setSelectedSong] = useState({});
  // const [pageActive, setPageActive] = useState(null);
  const [isMobile, setIsMobile] = useState(null);
  const [isDefault, setDefault] = useState(true);
  const [isDetailsOpen, setIsDetailsOpen] = React.useState(false);

  //setGenerationHistory = { key: song[]} where song is {title,...}

  useEffect(() => {
    const [width, height] = useWindowDimensions();
    setIsMobile(width <= 768);

    if (pathname === "/history") isDefault(false);
    else isDefault(true);
  }, []);

  function openSongView(page) {
    // setPageActive(page);
    isDetailsOpen(true);
  }

  function closeSongView() {
    setIsDetailsOpen(false);
  }

  const songView = {
    setCurrentSongs,
    setSelectedSong,
    selectedSong,
    isMobile,
    openSongView,
    closeSongView,
  };

  const context = {
    songView,
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
