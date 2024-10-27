"use client";
import { useState, useEffect, useRef } from "react";
import { createArtists } from "../../utils/createArtists.js";
import ProgressBar from "./ProgressBar";

export default function AudioPlayer({ song }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef(null);
  const [currentTime, setCurrentTime] = useState(0);

  const [songInfo, setSongInfo] = useState({
    currentTime: 0,
    duration: 0,
    animationPercentage: 0,
  });

  // const duration = 30;

  // useEffect(() => {
  //   const intervalId = setInterval(() => {
  //     setCurrentTime((prevTime) => {
  //       if (prevTime >= duration) {
  //         clearInterval(intervalId);
  //         return duration;
  //       }
  //       return prevTime + 1;
  //     });
  //   }, 1000);

  //   return () => clearInterval(intervalId);
  // }, [duration]);

  // const progressPercent = (currentTime / duration) * 100;

  const playAudio = () => {
    if (audioRef.current && !isPlaying) {
      setIsPlaying(true);
      audioRef.current.play();
    } else {
      setIsPlaying(false);
      audioRef.current.pause();
    }
  };

  //If the audio file is hosted on a different domain than your React app, you may need to configure Cross-Origin Resource Sharing (CORS) on the server serving the audio file.
  const preview = song.preview_url;

  return (
    <div>
      <div className="song-details-container">
        <div style={{ paddingBottom: "8px" }}>
          <p className="song-title semi-bold text-md">{song.track_name}</p>
          <p className="song-artist reg text-md">{createArtists(song)}</p>

          <button>Share</button>
          <button>Add</button>
        </div>
        {preview ? (
          <div>
            <div>
              <ProgressBar />
              <audio ref={audioRef} src={preview} />
            </div>
            {/* Controls Component */}
            <div>
              <button onClick={playAudio}>
                {isPlaying ? "Pause" : "Play"}
              </button>
            </div>
          </div>
        ) : (
          <div>No Preview Available</div>
        )}
        <div>
          <p>{song.song_length}</p>
          <p>{song.release_year}</p>
          <p>{song.isExplicit ? "Explicit" : "Clean"}</p>
        </div>
      </div>
    </div>
  );
}
