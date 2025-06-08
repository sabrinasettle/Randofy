"use client";
import { useState, useEffect, useRef } from "react";
// import { createArtists } from "../../../utils/createArtists.js";
import Controls from "./Controls/Controls.jsx";
import ProgressBar from "./ProgressBar.jsx";
import { Share2, Plus, Eye } from "lucide-react";
import { useSongViewContext } from "../../../context/song-view-context.js";
import Tooltip from "../../ui/ToolTip.jsx";

export default function AudioPlayer({
  song,
  // setOpenInformation: _setOpenInfoermation = null,
}) {
  const { songViewContext } = useSongViewContext();
  const [isPlaying, setIsPlaying] = useState(false);
  const [openInformation, setOpenInformation] = useState(false);
  const audioRef = useRef(null);
  const [currentTime, setCurrentTime] = useState(0);
  const isMobile = songViewContext.isMobile;
  const isDefault = songViewContext.isDefault;
  const areDrawersOpen = songViewContext.drawersOpen;

  console.log(song);

  // Reset currentTime and stop playing when song changes
  useEffect(() => {
    setCurrentTime(0);
    setIsPlaying(false);
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
  }, [song]); // Add song as dependency

  function onSongEnd() {
    setCurrentTime(0);
    setIsPlaying(false);
  }

  function playAudio() {
    if (audioRef.current && !isPlaying) {
      setIsPlaying(true);
      audioRef.current.play();
    } else {
      setIsPlaying(false);
      audioRef.current.pause();
    }
  }

  //If the audio file is hosted on a different domain than your React app, you may need to configure Cross-Origin Resource Sharing (CORS) on the server serving the audio file.
  const preview = song.preview_url;

  const buttonStyle = `hover:bg-gray-100 border border-transparent hover:border-gray-200 hover:text-gray-700 text-gray-600 p-2 rounded-sm ${!isMobile ? "h-[42px] w-[42px]" : "h-[48px] w-[48px]"}`;
  const shareIconHeight = isMobile ? 28 : 20;
  const addIconHeight = isMobile ? 32 : 24;
  const eyeIconHeight = isMobile ? 32 : 24;

  return (
    <div className={`${areDrawersOpen ? "flex-1 pt-0" : "pt-4 w-full"}`}>
      {preview ? (
        <div className="w-full pb-3">
          <ProgressBar
            isPlaying={isPlaying}
            onSongEnd={onSongEnd}
            currentTime={currentTime}
            setCurrentTime={setCurrentTime}
            audioRef={audioRef}
          />
          <audio ref={audioRef} src={preview} />
        </div>
      ) : (
        <div
          className={`flex flex-row justify-between ${areDrawersOpen ? "flex-1 pt-0" : "w-full"} text-gray-600`}
        >
          <p className="pb-2">No Preview Available</p>
          <a id="open-spotify" href="/">
            Open in Spotify
          </a>
        </div>
      )}
      {/* Controls Component */}
      <div
        className={`w-full pb-5 flex flex-row items-center ${isDefault ? `justify-between` : ``}`}
      >
        <div
          className={`flex flex-row items-center ${isDefault ? `gap-2` : `justify-between w-full gap-0`}`}
        >
          {preview && <Controls isPlaying={isPlaying} playAudio={playAudio} />}
          <div className="flex flex-row gap-1">
            {/* If Logged in have the button available */}
            {/* toast suggesting to be logged in iif not? */}
            <Tooltip text="Login to Add">
              <button
                id="add-song"
                className={`${buttonStyle}`}
                disabled={true}
              >
                {/* 44px at mobile */}
                <Plus width={addIconHeight} height={addIconHeight} />
              </button>
            </Tooltip>
            {/* <div className="relative inline-block">
            <button
              id="share-song"
              className="group hover:bg-gray-200 hover:text-gray-700 text-gray-600 p-2"
            >
              <Share2 width={28} height={28} />
            </button>
            <div className="absolute top-full mt-4 left-1/2 transform -translate-x-1/2 bg-gray-200 text-white px-2 py-1 rounded text-sm whitespace-nowrap transition-opacity duration-200 pointer-events-none z-40">
              Share song
            </div>
          </div> */}
            <div>
              <Tooltip text="Share song">
                <button id="share-song" className={`${buttonStyle}`}>
                  <Share2 width={shareIconHeight} height={shareIconHeight} />
                </button>
              </Tooltip>
            </div>
          </div>
        </div>
        {isDefault && (
          <div className="text-gray-600">
            <Tooltip text="See Details">
              <button id="share-song" className={`${buttonStyle}`}>
                <Eye width={eyeIconHeight} height={eyeIconHeight} />
              </button>
            </Tooltip>
          </div>
        )}
      </div>
    </div>
  );
}
