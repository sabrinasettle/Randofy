import React, { useState } from "react";
import AlbumCarousel from "./AlbumCarousel";
import SongViewController from "../../SongView/SongViewController";
import { useSongViewContext } from "../../../context/song-view-context";
import { useSpotifyContext } from "../../../context/spotify-context";

export default function SongListController({ songs, len }) {
  const { songViewContext } = useSongViewContext();
  const { setSelectedSong } = songViewContext;
  const [currentIndex, setCurrentIndex] = useState(0);
  const isMobile = songViewContext.isMobile;

  React.useEffect(() => {
    songViewContext.setSelectedSong({
      index: currentIndex,
      song: songs[currentIndex],
    });
  }, [setSelectedSong, currentIndex]);

  return (
    <div className="flex flex-col items-center h-full">
      {/* Index number */}
      <div className="text-gray-600 font-mono text-body-md font-normal mb-1">
        {currentIndex + 1} / {songs.length}
      </div>

      <AlbumCarousel
        songs={songs}
        onIndexChange={setCurrentIndex} // Make sure AlbumCarousel calls this
      />
      <SongViewController />
    </div>
  );
}
