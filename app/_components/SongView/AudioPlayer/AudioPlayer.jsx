"use client";
import { useState, useEffect, useRef } from "react";
import { useSongViewContext } from "../../../context/song-view-context.js";
import { useSpotifyContext } from "../../../context/spotify-context";
import { useToast } from "../../../context/toast-context";

import Controls from "./Controls/Controls.jsx";
import ProgressBar from "./ProgressBar.jsx";
import { Share2, Plus, Eye } from "lucide-react";
import Tooltip from "../../ui/ToolTip.jsx";
import AddSongButton from "./AddSongButton.jsx";
import ShareButton from "./ShareButton.jsx";
import OpenDetailsButton from "./OpenDetailsButton.jsx";

export default function AudioPlayer({ song }) {
  const { songViewContext } = useSongViewContext();
  const { spotifyClient } = useSpotifyContext();
  const { showToast } = useToast();
  const { spotifyUser } = spotifyClient;

  const [isPlaying, setIsPlaying] = useState(false);
  const [openInformation, setOpenInformation] = useState(false);
  const audioRef = useRef(null);
  const [currentTime, setCurrentTime] = useState(0);
  const isMobile = songViewContext.isMobile;
  const isDefault = songViewContext.isDefault;
  const areDrawersOpen = songViewContext.drawersOpen;

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
  // const shareIconHeight = isMobile ? 28 : 20;
  // const addIconHeight = isMobile ? 32 : 24;
  const eyeIconHeight = isMobile ? 32 : 24;

  // const addTooltipString = spotifyUser ? "Add to Playlist" : "Login to Add";
  return (
    <div className={`flex-1 pt-0`}>
      {preview ? (
        <div className="w-full pb-4 md:pb-3">
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
          className={`flex flex-row justify-between flex-1 pt-0 text-gray-600`}
        >
          {/* <p className="pb-2">No Preview Available</p> */}
          <a
            className="font-body text-body-lg md:text-body-md pt-2 pb-2 hover:text-gray-700"
            id="open-spotify"
            href={song.href}
          >
            Open in Spotify
          </a>
        </div>
      )}
      {/* Controls Component */}
      <div
        className={`w-full flex flex-row items-center ${isDefault ? `justify-between` : `pb-5`}`}
      >
        <div
          className={`flex flex-row items-center ${isDefault ? `gap-2` : `justify-between w-full gap-0`}`}
        >
          {preview && <Controls isPlaying={isPlaying} playAudio={playAudio} />}
          <div className="flex flex-row gap-1">
            {/* If Logged in have the button available */}
            {/* toast suggesting to be logged in iif not? */}
            <AddSongButton song={song} />

            <ShareButton song={song} />
          </div>
        </div>
        {isDefault && <OpenDetailsButton />}
      </div>
    </div>
  );
}
