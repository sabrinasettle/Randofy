// import { useState, useEffect } from "react";
// import Image from "next/image";
import { X } from "lucide-react";
import { useAccessibleAlpha } from "../../_hooks/useAccessibleAlpha.js";
// import { createArtists } from "../../utils/createArtists.js";
// import { millisToMinutesAndSeconds } from "../../utils/convertMilliseconds.js";
// import AudioPlayer from "./AudioPlayer/AudioPlayer.jsx";
// import AudioFeatureDrawers from "./AudioFeatureDrawers.jsx";
import { useSongViewContext } from "../../context/song-view-context.js";
import { usePathname } from "next/navigation";
import DefaultView from "./SongViews/DefaultView.jsx";
import HistoryView from "./SongViews/HistoryView.jsx";

export default function SongViewController() {
  const { songViewContext } = useSongViewContext();
  const song = songViewContext.selectedSong.song;
  const isMobile = songViewContext.isMobile;
  const isDefault = songViewContext.isDefault; // true = home page, false = other pages
  const isOpen = songViewContext.isDetailsOpen; // true = detailed view, false = not detailed
  const pathname = usePathname();

  if (pathname !== "/") songViewContext.setIsDefault(false);
  else songViewContext.setIsDefault(true);

  if (!song.track_name) {
    return <div id="song-drawer__inactive"></div>;
  }

  const handleClose = () => {
    songViewContext.closeDetails();
    songViewContext.setSelectedSong({});
    songViewContext.markDrawerOpen();
  };

  const promColor = song.color;
  const alpha = useAccessibleAlpha(promColor);

  // Determine the view state
  // const isFullScreenOverlay = !isDefault && isOpen; // Not default (other pages) + detailed = full-screen overlay
  const isContainedDrawer = isDefault && isOpen; // Default (home page) + detailed = contained in parent

  // Animation effect - only for full-screen overlay
  // useEffect(() => {
  //   if (isFullScreenOverlay) {
  //     if (isOpen) {
  //       setIsVisible(true);
  //       requestAnimationFrame(() => {
  //         requestAnimationFrame(() => {
  //           setAnimateIn(true);
  //         });
  //       });
  //     } else {
  //       setAnimateIn(false);
  //       const timeout = setTimeout(() => {
  //         setIsVisible(false);
  //       }, 500);
  //       return () => clearTimeout(timeout);
  //     }
  //   } else {
  //     // For contained drawer and minimal views, always visible
  //     setIsVisible(true);
  //     setAnimateIn(true);
  //   }
  // }, [isOpen, isFullScreenOverlay]);

  // Don't render full-screen overlay when not visible

  // Determine container styles based on view state
  // ${animateIn ? "translate-x-0" : "translate-x-full"}
  const getContainerStyles = () => {
    return {
      className:
        "w-full h-full border border-gray-200 rounded-sm backdrop-blur-sm",
      style: {
        backgroundImage: `radial-gradient(at 50% 45%, ${promColor}${alpha}, #0A0A0A 80%)`,
      },
    };
  };

  const containerStyles = getContainerStyles();

  return (
    <div className={containerStyles.className} style={containerStyles.style}>
      <div className="h-full flex flex-col px-4 pt-3 pb-1 box-border">
        {/* Header with close button - only show in detailed views */}
        {isOpen && (
          <div className="w-full flex flex-row justify-end">
            <button
              onClick={handleClose}
              className="text-gray-400 hover:text-gray-700 pb-2"
            >
              <X size={24} />
            </button>
          </div>
        )}
      </div>
      {isDefault ? <DefaultView /> : <HistoryView />}
    </div>
  );
}
