import { useState, useEffect } from "react";
import Image from "next/image";
import { X } from "lucide-react";
import { createArtists } from "../../utils/createArtists.js";
import { useAccessibleAlpha } from "../../_hooks/useAccessibleAlpha.js";
import { millisToMinutesAndSeconds } from "../../utils/convertMilliseconds.js";
import AudioPlayer from "./AudioPlayer/AudioPlayer";
import AudioFeatureDrawers from "./AudioFeatureDrawers.jsx";
import { useSongViewContext } from "../../context/song-view-context";
import { usePathname } from "next/navigation";

export default function Default() {
  const { songViewContext } = useSongViewContext();
  const song = songViewContext.selectedSong.song;
  const isMobile = songViewContext.isMobile;
  const isDefault = songViewContext.isDefault; // true = home page, false = other pages
  const isOpen = songViewContext.isDetailsOpen; // true = detailed view, false = not detailed
  const pathname = usePathname();

  if (pathname !== "/") songViewContext.setIsDefault(false);
  else songViewContext.setIsDefault(true);

  const [activeSection, setActiveSection] = useState(null);
  const [isVisible, setIsVisible] = useState(false);
  const [animateIn, setAnimateIn] = useState(false);

  if (!song.track_name) {
    return <div id="song-drawer__inactive"></div>;
  }

  let alt = `Album cover for ${song.album_name} by ${createArtists()}`;

  const handleClose = () => {
    songViewContext.closeDetails();
    songViewContext.setSelectedSong({});
    songViewContext.markDrawerOpen();
  };

  function formatYear() {
    const yearRegex = /^\d{4}/;
    const match = song.release_year.match(yearRegex);
    return match ? match[0] : null;
  }

  const artists = createArtists(song);
  const promColor = song.color;
  const alpha = useAccessibleAlpha(promColor);

  const showImage = () => {
    return isMobile || !isDefault;
  };

  const mainDiv = isDefault
    ? `border rounded-sm border-gray-200 backdrop-blur-sm`
    : `relative w-full md:w-lg h-full bg-gray-000  transform transition-transform duration-500 [ease:cubic-bezier(0.16,1,0.3,1)]
        top-0 right-0 md:static w-full h-full mb-2 md:mb-3 border border-transparent md:border-gray-200 md:rounded-sm z-50 backdrop-blur-sm
`;

  const imageBool = showImage();
  // Determine the view state
  const isFullScreenOverlay = !isDefault && isOpen; // Not default (other pages) + detailed = full-screen overlay
  const isContainedDrawer = isDefault && isOpen; // Default (home page) + detailed = contained in parent
  const isMinimal = isDefault && !isOpen; // Default (home page) + not detailed = minimal view

  // Animation effect - only for full-screen overlay
  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);

      // Ensure the drawer is rendered before transitioning
      requestAnimationFrame(() => {
    if (isFullScreenOverlay) {
      if (isOpen) {
        setIsVisible(true);
        requestAnimationFrame(() => {
          setAnimateIn(true);
          requestAnimationFrame(() => {
            setAnimateIn(true);
          });
        });
      } else {
        setAnimateIn(false);
        const timeout = setTimeout(() => {
          setIsVisible(false);
        }, 500);
        return () => clearTimeout(timeout);
      }
    } else {
      // For contained drawer and minimal views, always visible
      setIsVisible(true);
      setAnimateIn(true);
    }
  }, [isOpen, isFullScreenOverlay]);

  // Don't render full-screen overlay when not visible

  const imageBool = showImage();

  // Determine container styles based on view state
  const getContainerStyles = () => {
    if (isFullScreenOverlay) {
      // Full-screen overlay with slide animation (other pages)
      return {
        className: `fixed inset-0 z-50 w-full h-full backdrop-blur-sm transform transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
          animateIn ? "translate-x-0" : "translate-x-full"
        }`,
        style: {
          backgroundImage: `radial-gradient(at 50% 45%, ${promColor}${alpha}, #0A0A0A 80%)`,
        },
      };
    } else if (isContainedDrawer) {
      // Contained within parent drawer (home page, detailed)
      return {
        className:
          "w-full h-full border border-gray-200 rounded-sm backdrop-blur-sm",
        style: {
          backgroundImage: `radial-gradient(at 50% 45%, ${promColor}${alpha}, #0A0A0A 80%)`,
        },
      };
    } else {
      // Minimal view (home page, not detailed)
      return {
        className: "w-full border border-gray-200 rounded-sm backdrop-blur-sm",
        style: {
          backgroundImage: `radial-gradient(at 50% 45%, ${promColor}${alpha}, #0A0A0A 80%)`,
        },
      };
    }
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

        <div>
          <div className="">
            <div className="">
              <h1
                className="text-heading-4 md:text-heading-5 text-semibold text-gray-700"
                id="song-title"
              >
                {song.track_name}
              </h1>
              <div className="flex flex-row items-center gap-2">
                {song.is_explicit && (
                  <div
                    className="w-4 h-[18px] flex justify-center items-center text-gray-000 bg-gray-700 rounded-sm"
                    id="explicit-flag"
                  >
                    E
                  </div>
                )}
                <h2 className="text-gray-600">{artists}</h2>
              </div>
            </div>
          </div>
        </div>




          <div>
            <AudioPlayer song={song} />
          </div>


        {/* Song Info - Only shows when section is collapsed */}
        <div
          className={`${activeSection ? "hidden" : "block"} space-y-2 transition-all duration-500 ease-in-out`}
          id="information-container"
        >
          <div className="justify-start flex flex-col">
            <div className="flex flex-row gap-1">
              <p
                className="text-body-md md:text-body-sm text-gray-600"
                id="information-label"
              >
                Album:
              </p>
              <p
                className="text-body-md md:text-body-sm text-gray-700"
                id="song-album"
              >
                {song.album_name}
              </p>
            </div>
            <div className="flex flex-row gap-1">
              <p className="text-body-md md:text-body-sm text-gray-600">
                Length:
              </p>
              <p className="text-body-sm text-gray-700" id="song-length">
                {millisToMinutesAndSeconds(song.song_length)}
              </p>
            </div>
            <div className="flex flex-row gap-1">
              <p className="text-body-md md:text-body-sm text-gray-600">
                Year:
              </p>
              <p
                className="text-body-md md:text-body-sm text-gray-700"
                id="release_year"
              >
                {formatYear()}
              </p>
            </div>
          </div>
        </div>

        <div className="flex-1"></div>

        {/* AudioFeatureDrawers - only show in detailed views */}
        {isOpen && (
          <AudioFeatureDrawers
            song={song}
            activeSection={activeSection}
            setActiveSection={setActiveSection}
          />
        )}
      </div>
    </div>
  );
}
