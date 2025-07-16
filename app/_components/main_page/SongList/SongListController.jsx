import React, { useState } from "react";
import AlbumCarousel from "./AlbumCarousel";
import SongViewController from "../../SongView/SongViewController";
import { useSongViewContext } from "../../../context/song-view-context";
import { useSpotifyContext } from "../../../context/spotify-context";

export default function SongListController({}) {
  const { spotifyClient } = useSpotifyContext();
  const { songViewContext } = useSongViewContext();
  const { setSelectedSong } = songViewContext;
  const [currentIndex, setCurrentIndex] = useState(0);
  // const isMobile = songViewContext.isMobile;

  const songs = React.useMemo(
    () => spotifyClient.currentSongs,
    [spotifyClient],
  );

  React.useEffect(() => {
    songViewContext.setSelectedSong({
      index: currentIndex,
      song: songs[currentIndex],
    });
  }, [setSelectedSong, currentIndex, songs]);

  return (
    <div className="flex flex-col items-center h-full w-screen">
      {/* Index number */}
      <div className="text-gray-600 font-mono text-body-md font-normal md:mb-1">
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
