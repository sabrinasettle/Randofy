"use client";
import { useState, useEffect, useRef } from "react";
import { createArtists } from "../../../utils/createArtists.js";
import Controls from "./Controls/Controls.jsx";
import ProgressBar from "./ProgressBar.jsx";
import { Share2, Plus } from "lucide-react";
import { useSongViewContext } from "../../../context/song-view-context.js";

export default function AudioPlayer({
  song,
  hasInformation,
  setOpenInformation: _setOpenInfoermation = null,
}) {
  const { songViewContext } = useSongViewContext();
  const [isPlaying, setIsPlaying] = useState(false);
  const [openInformation, setOpenInformation] = useState(false);
  const audioRef = useRef(null);
  const [currentTime, setCurrentTime] = useState(0);

  // const [songInfo, setSongInfo] = useState({
  //   currentTime: 0,
  //   duration: 0,
  //   animationPercentage: 0,
  // });
  //
  // const duration = 29;
  // useEffect(() => {
  //   // Only run the interval if `isPlaying` is true
  //   if (isPlaying) {
  //     const intervalId = setInterval(() => {
  //       setCurrentTime((prevTime) => {
  //         if (prevTime >= duration) {
  //           clearInterval(intervalId);
  //           onSongEnd();
  //           return duration;
  //         }
  //         return prevTime + 1;
  //       });
  //     }, 1000);

  //     // Clear the interval when `isPlaying` changes or component unmounts
  //     return () => clearInterval(intervalId);
  //   }
  // }, [isPlaying, duration]);

  useEffect(() => {
    setCurrentTime(0);
  }, []);

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
  // const artists = createArtists(song);

  return (
    <div>
      {preview ? (
        <div>
          <div>
            <ProgressBar
              isPlaying={isPlaying}
              onSongEnd={onSongEnd}
              currentTime={currentTime}
              setCurrentTime={setCurrentTime}
            />
            <audio ref={audioRef} src={preview} />
          </div>
          <div className="song-actions">
            {/* Controls Component */}
            <Controls isPlaying={isPlaying} playAudio={playAudio} />
            <div style={{ display: "flex", gap: "8px", height: "min-content" }}>
              {/* If Logged in have the button available */}
              {/* toast suggesting to be logged in iif not? */}
              <button
                id="add-song"
                className="hover:bg-gray-200 hover:text-gray-700 text-gray-600"
                disabled={true}
              >
                {/* 44px at mobile */}
                <Plus width={20} height={20} />
              </button>
              <button
                id="share-song"
                className="hover:bg-gray-200 hover:text-gray-700 text-gray-600"
              >
                <Share2 width={16} height={16} />
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div id="no-preview">No Preview Available</div>
      )}
      {/* <div onClick={handleOpenInformation}>More information</div> */}

      {/* // )} */}
    </div>
  );
}
