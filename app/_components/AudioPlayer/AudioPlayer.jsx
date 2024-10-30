"use client";
import { useState, useEffect, useRef } from "react";
import { createArtists } from "../../utils/createArtists.js";
import { millisToMinutesAndSeconds } from "../../utils/convertMilliseconds.js";
import Controls from "./Controls/Controls";
import ProgressBar from "./ProgressBar";
import { Share2, Plus } from "lucide-react";

export default function AudioPlayer({ song }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [openInformation, setOpenInformation] = useState(false);
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
  //

  function handleOpenInformation() {
    setOpenInformation(!openInformation);
  }

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
  const artists = createArtists(song);

  return (
    <div>
      <div className="song-details-container">
        <div
          style={{
            paddingBottom: "8px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div className="name-artist-container">
            <p className="song-title semi-bold text-md">{song.track_name}</p>
            <span className="flag-artists-container">
              {song.is_explicit && <div className="explicit-flag">E</div>}
              <p className="song-artist reg text-sm">{artists}</p>
            </span>
          </div>
        </div>
        {preview ? (
          <div>
            <div>
              <ProgressBar />
              <audio ref={audioRef} src={preview} />
            </div>
            {/* Controls Component */}
            <Controls isPlaying={isPlaying} playAudio={playAudio} />
            <div style={{ display: "flex", gap: "8px" }}>
              <button
                id="add-song"
                className="song-action-btn icon-btn"
                disabled={true}
              >
                <Plus width={20} height={20} />
              </button>
              <button id="share-song" className="song-action-btn icon-btn">
                <Share2 width={16} height={16} />
              </button>
              {/* If Logged in have the button available */}
              {/* toast suggesting to be logged in iif not? */}
            </div>
            {/* <div>
              <button onClick={playAudio}>
                {isPlaying ? <Pause fill="#1c1c1c" /> : <Play fill="#1c1c1c" />}
              </button>
            </div> */}
          </div>
        ) : (
          <div>No Preview Available</div>
        )}
        <div onClick={handleOpenInformation}>More information</div>
        {openInformation && (
          <div className="information-container">
            <div className="information-details-container">
              <div>
                <>Full Song Length </>
                <p id="song-length">
                  {millisToMinutesAndSeconds(song.song_length)}
                </p>
              </div>
              <div>
                <>Year</>
                <p id="release_year">{song.release_year}</p>
              </div>
              {/* <div>
                <>Explicit</>
                <p id="explicit-tag">
                  {song.isExplicit ? "Explicit" : "Clean"}
                </p>
              </div> */}
            </div>
            <div id="genre-information">
              <div>Genres</div>
              <div>List of genres</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
