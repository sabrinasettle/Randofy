import { useState } from "react";
import { createPortal } from "react-dom";
import { createArtists } from "../../../utils/createArtists.js";
import { useSongViewContext } from "../../../context/song-view-context.js";
import { useMusicContext } from "../../../context/music-context.js";
import { useStyleContext } from "../../../context/style-context.js";
import { useHistoryContext } from "../../../context/history-context.js";
import AudioPlayer from "../AudioPlayer/AudioPlayer.jsx";
import ScrollingTitle from "../../ui/ScrollingTitle.jsx";
import { ArrowRight, ArrowLeft, X } from "lucide-react";
import Image from "next/image";
import AudioFeatureTabs from "../AudioFeatureTabs.jsx";

export default function HistoryView() {
  const { styleContext } = useStyleContext();
  const { historyContext } = useHistoryContext();
  const song = historyContext.selectedSong.song;
  const isOpen = historyContext.isDetailsOpen; // true = detailed view, false = not detailed
  const isMobile = styleContext.isMobile;
  console.log("isOpen", isOpen);

  if (!song) {
    return <div id="song-drawer__inactive"></div>;
  }

  let alt = `Album cover for ${song.album_name} by ${createArtists()}`;

  const artists = createArtists(song);

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

  const containerStyles = getContainerStyles();
  const preview = song.preview_url;

  const iconSize = isMobile ? 32 : 24;

  // Full-screen portal component
  const renderFullScreenPlayer = () => {
    if (!isOpen) return null;

    return createPortal(
      <div
        className="fixed inset-0 z-[9998] backdrop-blur-xs"
        // style={{
        //   backgroundImage: `radial-gradient(at 50% 45%, ${promColor}${alpha}, #0A0A0A 80%)`,
        // }}
      >
        <div
          className="fixed inset-0 backdrop-blur-sm md:m-7 lg:m-10 xl:m-12 border md:border-gray-200 md:rounded-sm "
          style={{ background: "#0A0A0Af2" }}
        >
          <div className="w-full h-full p-4">
            {/* Portal Controls */}
            <div className="absolute top-4 right-4 ">
              <div className="flex flex-row justify-between md:justify-end gap-3">
                <div className="flex flex-row">
                  <button
                    // onClick={() => musicContext.moveBackward()}
                    className=" text-gray-600 hover:text-gray-700 hover:bg-gray-200 p-2 rounded-sm"
                  >
                    <ArrowLeft size={iconSize} />
                  </button>
                  <button
                    // onClick={() => musicContext.moveForward()}
                    className=" text-gray-600 hover:text-gray-700 hover:bg-gray-200 p-2 rounded-sm"
                  >
                    <ArrowRight size={iconSize} />
                  </button>
                </div>
                <button
                  onClick={() => historyContext.openDetails()}
                  className=" text-gray-600 hover:text-gray-700 hover:bg-gray-200 p-2 rounded-sm"
                >
                  <X size={iconSize} />
                </button>
              </div>
            </div>

            <div className="flex flex-col md:flex-row w-full h-full">
              {/* left column */}
              <div className="w-full flex md:items-center md:justify-center">
                <div
                  className={`flex justify-start transition-all duration-500`}
                  style={{
                    width: isMobile ? "28vw" : "38vw",
                    height: isMobile ? "28vw" : "38vw",
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
              <div className="w-full lg:w-[48%] md:pt-8 md:pb-6 pt-6">
                <div className="w-full flex flex-col justify-between gap-4 md:h-full md:border-l md:border-gray-200 lg:pl-5 lg:pr-2">
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
                    <div className="flex-1 flex items-center justify-center mt-4">
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

  return (
    <>
      {/* Full-screen player rendered via portal */}
      {renderFullScreenPlayer()}
    </>
  );
}
