import styles from "../History.module.scss";
import { createArtists } from "../../../utils/createArtists.js";
import Image from "next/image";

export default function SongDrawer({ song, isOpen, closeDrawer }) {
  if (!song.track_name) {
    return <div id={styles["song-drawer__inactive"]}></div>;
  }

  let alt = `Album cover for ${song.album_name} by ${createArtists()}`;

  return (
    <div
      className="song-drawer"
      id={
        isOpen ? styles["song-drawer__active"] : styles["song-drawer__inactive"]
      }
    >
      <div style={{ padding: "12px" }}>
        {song.track_name && (
          <>
            <div>
              <button onClick={closeDrawer}>Close</button>
            </div>
            <div className="album-image-container">
              <Image
                className="album-image"
                src={song.album_image.url}
                height={384}
                width={384}
                alt={alt}
              />
            </div>
            <div>
              <p className="song-title semi-bold text-md">{song.track_name}</p>
              <p className="song-artist reg text-md">{createArtists(song)}</p>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
