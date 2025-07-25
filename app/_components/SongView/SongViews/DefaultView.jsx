import { useState } from "react";
import { createPortal } from "react-dom";
import { createArtists } from "../../../utils/createArtists.js";
import { useAccessibleAlpha } from "../../../_hooks/useAccessibleAlpha.js";
import { millisToMinutesAndSeconds } from "../../../utils/convertMilliseconds.js";
import AudioPlayer from "../AudioPlayer/AudioPlayer.jsx";
import AudioFeatureDrawers from "../AudioFeatureDrawers.jsx";
import { useSongViewContext } from "../../../context/song-view-context.js";
import ScrollingTitle from "../../ui/ScrollingTitle.jsx";
import { ArrowRight, ArrowLeft, X } from "lucide-react";
import Image from "next/image";
import AudioFeatureTabs from "../AudioFeatureTabs.jsx";

export default function DefaultView() {
  const { songViewContext } = useSongViewContext();
  const song = songViewContext.selectedSong.song;
  const isMobile = songViewContext.isMobile;
  const isDefault = songViewContext.isDefault; // true = home page, false = other pages
  const isOpen = songViewContext.isDetailsOpen; // true = detailed view, false = not detailed

  const [activeSection, setActiveSection] = useState(null);

  if (!song.track_name) {
    return <div id="song-drawer__inactive"></div>;
  }

  let alt = `Album cover for ${song.album_name} by ${createArtists()}`;

  const artists = createArtists(song);
  const promColor = song.color;
  const alpha = useAccessibleAlpha(promColor);

  // Compact player styles only
  const getContainerStyles = () => {
    return {
      className:
        "w-full flex flex-col justify-between min-h-[180px] lg:w-[564px] lg:min-h-[160px] p-3 border border-gray-200 rounded-sm backdrop-blur-sm",
      style: {
        // backgroundImage: `radial-gradient(at 50% 45%, ${promColor}${alpha}, #0A0A0A 80%)`,
      },
    };
  };

  const iconSize = isMobile ? 32 : 24;

  // Full-screen portal component
  const renderFullScreenPlayer = () => {
    if (!isOpen) return null;

    function moveForward() {}

    function moveBackward() {}

    return createPortal(
      <div
        className="fixed inset-0 z-[9998] backdrop-blur-xs"
        // style={{
        //   backgroundImage: `radial-gradient(at 50% 45%, ${promColor}${alpha}, #0A0A0A 80%)`,
        // }}
      >
        <div
          className="fixed inset-0 backdrop-blur-sm md:m-7 lg:m-10 xl:m-12 border md:border-gray-200 md:rounded-sm bg-gray-000 md:opacity-95"
          style={
            {
              // backgroundImage: `radial-gradient(at 50% 45%, ${promColor}${alpha}, #0A0A0A 80%)`,
            }
          }
        >
          <div className="w-full h-full p-4">
            {/* Portal Controls */}
            <div className="absolute top-4 right-4 ">
              <div className="flex flex-row justify-between md:justify-end gap-3">
                <div className="flex flex-row">
                  <button
                    onClick={() => songViewContext.setIsDetailsOpen(false)}
                    className=" text-gray-600 hover:text-gray-700 hover:bg-gray-200 p-2 rounded-sm"
                  >
                    <ArrowLeft size={iconSize} />
                  </button>
                  <button
                    onClick={() => songViewContext.setIsDetailsOpen(false)}
                    className=" text-gray-600 hover:text-gray-700 hover:bg-gray-200 p-2 rounded-sm"
                  >
                    <ArrowRight size={iconSize} />
                  </button>
                </div>
                <button
                  onClick={() => songViewContext.setIsDetailsOpen(false)}
                  className=" text-gray-600 hover:text-gray-700 hover:bg-gray-200 p-2 rounded-sm"
                >
                  <X size={iconSize} />
                </button>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row w-full h-full">
              {/* left column */}
              <div className="w-full flex md:items-center md:justify-center">
                <div
                  className={`flex justify-start transition-all duration-500`}
                  style={{
                    width: isMobile ? "20vw" : "38vw",
                    height: isMobile ? "20vw" : "38vw",
                    transition: "width 0.5s ease, height 0.5s ease",
                    overflow: "hidden",
                  }}
                >
                  <Image
                    className="album-image"
                    src={song.album_image.url}
                    width={240}
                    height={240}
                    alt={alt}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      transition: "all 0.5s ease",
                    }}
                  />
                </div>
              </div>

              {/* right column */}
              <div className="w-full md:w-2/3 lg:w-[48%] md:pt-8 md:pb-6">
                <div className="w-full flex flex-col justify-between gap-4 md:h-full md:border-l md:border-gray-200 px-5">
                  <div>
                    <div className="pt-2">
                      <ScrollingTitle
                        text={song.track_name}
                        className="text-gray-700 font-medium text-heading-5"
                      />
                      <div className="flex flex-row items-center gap-2">
                        {song.is_explicit && (
                          <div className="font-mono w-4 h-[18px] flex justify-center items-center text-gray-000 bg-gray-700 rounded-sm">
                            E
                          </div>
                        )}
                        <h2 className="text-gray-600 font-body text-heading-6 truncate">
                          {artists}
                        </h2>
                      </div>
                    </div>
                    {/* Audio player centered */}
                    <div className="flex-1 flex items-center justify-center mt-2">
                      <div className="w-full">
                        <AudioPlayer song={song} />
                      </div>
                    </div>
                  </div>

                  {/* Audio feature tabs*/}
                  <div className="pb-4 h-full">
                    <AudioFeatureTabs song={song} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>,
      document.body,
    );
  };

  const containerStyles = getContainerStyles();
  const preview = song.preview_url;

  return (
    <>
      {/* Compact player - only shows when not in full-screen mode */}
      <div className={containerStyles.className} style={containerStyles.style}>
        <div>
          <div>
            <ScrollingTitle
              text={song.track_name}
              className="text-gray-700 font-medium text-heading-5 md:text-body-md"
            />
            <div className="flex flex-row items-center gap-2">
              {song.is_explicit && (
                <div className="font-mono w-4 h-[18px] flex justify-center items-center text-gray-000 bg-gray-700 rounded-sm">
                  E
                </div>
              )}
              <h2 className="text-gray-600 font-body text-heading-6 md:text-body-sm truncate">
                {artists}
              </h2>
            </div>
          </div>
        </div>

        <div className={`${preview && "pt-3"}`}>
          <AudioPlayer song={song} />
        </div>
      </div>

      {/* Full-screen player rendered via portal */}
      {renderFullScreenPlayer()}
    </>
  );
}
