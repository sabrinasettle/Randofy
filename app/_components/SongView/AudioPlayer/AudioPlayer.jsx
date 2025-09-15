import React, { useEffect } from "react";
import { useAudio } from "../../../context/audio-context.js";
import ProgressBar from "./ProgressBar.jsx";
import Controls from "./Controls/Controls.jsx";
import AddSongButton from "./AddSongButton.jsx";
import ShareButton from "./ShareButton.jsx";
import OpenDetailsButton from "./OpenDetailsButton.jsx";
import { useSongViewContext } from "../../../context/song-view-context.js";

export default function AudioPlayer({ song }) {
  const { songViewContext } = useSongViewContext();
  const { isPlaying, setIsPlaying, play, pause, currentTime, setSong } =
    useAudio();

  const isDefault = songViewContext.isDefault;
  const isOpen = songViewContext.isDetailsOpen;

  // when song prop changes, tell context
  useEffect(() => {
    setSong(song);
  }, [song, setSong]);

  const togglePlay = () => {
    if (isPlaying) {
      pause();
    } else {
      play();
    }
  };

  return (
    <div className="flex-1 pt-0">
      {song.preview_url ? (
        <div className="w-full pb-4 md:pb-3">
          <ProgressBar
            isPlaying={isPlaying}
            currentTime={currentTime}
            // pass seek if ProgressBar needs it
          />
        </div>
      ) : (
        <div className="flex flex-row justify-between flex-1 pt-0 text-gray-600">
          <a
            className="font-body text-body-lg md:text-body-sm pt-2 pb-2 hover:text-gray-700"
            href={song.href}
          >
            Open in Spotify
          </a>
        </div>
      )}

      <div
        className={`w-full flex flex-row items-center ${isDefault ? `justify-between` : `pb-5`}`}
      >
        <div
          className={`flex flex-row items-center ${
            isDefault ? `gap-2` : `justify-between w-full gap-0`
          }`}
        >
          {song.preview_url && (
            <Controls isPlaying={isPlaying} playAudio={togglePlay} />
          )}
          <div className="flex flex-row gap-1">
            <AddSongButton song={song} />
            <ShareButton song={song} />
          </div>
        </div>
        {isDefault && !isOpen && <OpenDetailsButton />}
      </div>
    </div>
  );
}
