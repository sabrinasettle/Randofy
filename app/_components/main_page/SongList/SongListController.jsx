import React, { useState } from "react";
import AlbumCarousel from "./AlbumCarousel";
import DefaultView from "../../SongView/SongViews/DefaultView";
import SongViewController from "../../SongView/SongViewController";
import { useSongViewContext } from "../../../context/song-view-context";
import { useSpotifyContext } from "../../../context/spotify-context";
import { useMusicContext } from "../../../context/music-context";

export default function SongListController({}) {
  const { spotifyClient } = useSpotifyContext();
  const { songViewContext } = useSongViewContext();
  const { musicContext } = useMusicContext();
  const { setSelectedSong } = songViewContext;
  // const index = songViewContext.currentIndex;
  const [currentIndex, setCurrentIndex] = useState(0);

  const songs = React.useMemo(() => musicContext.currentSongs, [musicContext]);

  React.useEffect(() => {
    musicContext.setSelectedSong({
      index: currentIndex,
      song: songs[currentIndex],
    });
  }, [setSelectedSong, currentIndex, songs]);

  return (
    <div className="flex flex-col items-center md:h-full w-screen">
      {/* Index number */}
      <div className="text-gray-600 font-mono text-body-md font-normal md:mb-1">
        {currentIndex + 1} / {songs.length}
      </div>

      <AlbumCarousel
        songs={songs}
        onIndexChange={setCurrentIndex} // Make sure AlbumCarousel calls this
      />
      <DefaultView />
    </div>
  );
}
