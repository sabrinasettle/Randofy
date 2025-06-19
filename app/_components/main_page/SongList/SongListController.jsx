import { useState } from "react";
import AlbumCarousel from "./AlbumCarousel";
import SongViewController from "../../SongView/SongViewController";
import { useSongViewContext } from "../../../context/song-view-context";
import { useSpotifyContext } from "../../../context/spotify-context";

export default function SongListController({ songs, len }) {
  const { spotifyClient } = useSpotifyContext;
  const { songView } = useSongViewContext();
  const [currentIndex, setCurrentIndex] = useState(0);
  // const songs = spotifyClient.currentSongs;

  return (
    <div className="flex flex-col items-center">
      {/* Index number */}
      <div className="text-white text-xl font-bold mb-2">
        {currentIndex + 1} / {songs.length}
      </div>

      {/* Carousel container with a tight height */}
      {/* <div className="w-full h-[70vh] relative"> */}
      <AlbumCarousel
        songs={songs}
        onIndexChange={setCurrentIndex} // Make sure AlbumCarousel calls this
      />
      {/* </div> */}
    </div>
  );
}
