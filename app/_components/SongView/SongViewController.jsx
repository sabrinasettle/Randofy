import { useEffect } from "react";
import { X } from "lucide-react";
import { useAccessibleAlpha } from "../../_hooks/useAccessibleAlpha.js";
import { useSongViewContext } from "../../context/song-view-context.js";
import { usePathname } from "next/navigation";
import DefaultView from "./SongViews/DefaultView.jsx";
import HistoryView from "./SongViews/HistoryView.jsx";

export default function SongViewController() {
  const { songViewContext } = useSongViewContext();
  if (!songViewContext) return null;

  const song = songViewContext.selectedSong.song;
  const isMobile = songViewContext.isMobile;
  const isDefault = songViewContext.isDefault;
  const isOpen = songViewContext.isDetailsOpen;
  const pathname = usePathname();

  const promColor = song?.color;
  const alpha = useAccessibleAlpha(promColor);

  // ✅ Update default view based on path (runs after mount)
  useEffect(() => {
    songViewContext.setIsDefault(pathname === "/");
  }, [pathname]);

  // ✅ Scroll locking logic, runs after all hooks
  const isContainedDrawer = isOpen && !isMobile;
  const isFullScreenOverlay = isMobile && isOpen;

  useEffect(() => {
    const mainScrollContainer = document.getElementById("history-column");
    const songListContainer = document.getElementById(
      "history-songlist-container",
    );

    if (isFullScreenOverlay) {
      const scrollY = window.scrollY;
      document.body.style.position = "fixed";
      document.body.style.top = `-${scrollY}px`;
      document.body.style.left = "0";
      document.body.style.right = "0";
      document.body.style.width = "100%";
      document.body.style.overflow = "hidden";

      if (songListContainer) {
        songListContainer.classList.add("overflow-hidden");
      }

      return () => {
        document.body.style.position = "";
        document.body.style.top = "";
        document.body.style.left = "";
        document.body.style.right = "";
        document.body.style.width = "";
        document.body.style.overflow = "";
        window.scrollTo(0, scrollY);

        if (songListContainer) {
          songListContainer.classList.remove("overflow-hidden");
        }
      };
    } else if (isContainedDrawer && mainScrollContainer) {
      mainScrollContainer.classList.add("overflow-hidden");
      return () => {
        mainScrollContainer.classList.remove("overflow-hidden");
      };
    }
  }, [isFullScreenOverlay, isContainedDrawer]);

  // ✅ Bail only after all hooks
  if (!song) {
    return (
      <div id="song-drawer__inactive" className="text-gray-700">
        No Song Available
      </div>
    );
  }

  if (!alpha) return null;

  const handleClose = () => {
    songViewContext.closeDetails();
    songViewContext.setSelectedSong({});
  };

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
          <div className="absolute inset-0 bg-gray-000/90 backdrop-blur-sm"></div>
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `radial-gradient(at 50% 45%, ${promColor}${alpha}, transparent 80%)`,
            }}
          ></div>
        </>
      )}

      {isContainedDrawer && (
        <div
          className="absolute inset-0 rounded-sm"
          style={{
            backgroundImage: `radial-gradient(at 50% 45%, ${promColor}${alpha}, #0A0A0A 80%)`,
          }}
        ></div>
      )}

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
