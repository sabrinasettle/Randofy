import { useSpotifyContext } from "../../../context/spotify-context";
import { createArtists } from "../../../utils/createArtists";
import Image from "next/image";

export default function Player() {
  const { spotifyClient } = useSpotifyContext();

  return (
    <div className="song-player">
      <div>
        <Image
          width={128}
          height={128}
          className="album-image-sm"
          src={spotifyClient.selectedSong.song.album_image.url}
        />
      </div>
      {spotifyClient.currentSongs.length > 0 && (
        <div className="player-song-data">
          <div>
            <div className="song-title semi-bold text-md">
              {spotifyClient.selectedSong.song.track_name}
            </div>
            <div className="song-title reg text-md">
              {createArtists(spotifyClient.selectedSong.song)}
            </div>
          </div>
          {spotifyClient.selectedSong.song.preview_url && (
            <div className="song-preview">
              <button>Play</button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
