import { useEffect } from "react";
import { X } from "lucide-react";
import { useAccessibleAlpha } from "../../_hooks/useAccessibleAlpha.js";
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
  };

  const promColor = song.color;
  const alpha = useAccessibleAlpha(promColor);

  // Determine the view state
  // Determine the view state
  const isContainedDrawer = isOpen && !isMobile; // Desktop home page
  const isFullScreenOverlay = isMobile && isOpen; // Mobile overlay

  useEffect(() => {
    const mainScrollContainer = document.getElementById("history-column");
    const songListContainer = document.getElementById(
      "history-songlist-container",
    );

    if (isFullScreenOverlay) {
      // 1️⃣ Lock BODY
      const scrollY = window.scrollY;
      document.body.style.position = "fixed";
      document.body.style.top = `-${scrollY}px`;
      document.body.style.left = "0";
      document.body.style.right = "0";
      document.body.style.width = "100%";
      document.body.style.overflow = "hidden";

      // 2️⃣ Lock song list scroll container too
      if (songListContainer) {
        songListContainer.classList.add("overflow-hidden");
      }

      return () => {
        // Unlock BODY
        document.body.style.position = "";
        document.body.style.top = "";
        document.body.style.left = "";
        document.body.style.right = "";
        document.body.style.width = "";
        document.body.style.overflow = "";
        window.scrollTo(0, scrollY);

        // Unlock song list container
        if (songListContainer) {
          songListContainer.classList.remove("overflow-hidden");
        }
      };
    } else if (isContainedDrawer && mainScrollContainer) {
      // Desktop: lock history column only
      mainScrollContainer.classList.add("overflow-hidden");
      return () => {
        mainScrollContainer.classList.remove("overflow-hidden");
      };
    }
  }, [isFullScreenOverlay, isContainedDrawer]);

  const getContainerStyles = () => {
    let className = "";
    let style = {
      backgroundImage: `radial-gradient(at 50% 45%, ${promColor}${alpha}, #0A0A0A 80%)`,
    };

    if (isFullScreenOverlay) {
      className =
        "fixed top-0 left-0 right-0 -bottom-px z-50 overflow-y-auto backdrop-blur-sm";
    } else if (isContainedDrawer) {
      className = "h-full border border-gray-200 rounded-sm backdrop-blur-md";
    }
    return { className, style };
  };

  const containerStyles = getContainerStyles();
  const iconSize = isMobile ? 32 : 24;

  return (
    <div className={containerStyles.className}>
      {isFullScreenOverlay && (
        <>
          {/* 1️⃣: Semi-transparent gray-000/70 with blur */}
          <div className="absolute inset-0 bg-gray-000/90 backdrop-blur-sm"></div>

          {/* 2️⃣: Radial gradient on top of gray */}
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `radial-gradient(at 50% 45%, ${promColor}${alpha}, transparent 80%)`,
            }}
          ></div>
        </>
      )}

      {isContainedDrawer && (
        <>
          {/* For contained drawer: keep radial inside */}
          <div
            className="absolute inset-0 rounded-sm"
            style={{
              backgroundImage: `radial-gradient(at 50% 45%, ${promColor}${alpha}, #0A0A0A 80%)`,
            }}
          ></div>
        </>
      )}

      {/* 3️⃣: Main content */}
      <div className="relative z-10 h-full flex flex-col px-4 pt-3 pb-1 box-border">
        {isOpen && (
          <div className="w-full flex flex-row justify-end">
            <button
              onClick={handleClose}
              className="text-gray-400 hover:text-gray-700 pb-2"
            >
              <X size={iconSize} />
            </button>
          </div>
        )}
        {isDefault ? <DefaultView /> : <HistoryView />}
      </div>
    </div>
  );
}
