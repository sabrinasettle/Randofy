import styles from "../History.module.scss";
import { createArtists } from "../../../utils/createArtists.js";
import Image from "next/image";

export default function SongDrawer({ song, isOpen, closeDrawer }) {
  console.log(song);
  // const [track_name, album_image] = song;
  //

  if (!song) {
    return <div id={styles["song-drawer__inactive"]}></div>;
  }

  return (
    <div
      className="song-drawer"
      id={
        isOpen ? styles["song-drawer__active"] : styles["song-drawer__inactive"]
      }
    >
      {song && (
        <>
          <div>
            <button onClick={closeDrawer}>Close</button>
          </div>
          <div className="album-image-container">
            {/* <Image
          className="album-image"
          src={song.album_image.url}
          height={298}
          width={298}
          alt={alt}
        /> */}
          </div>
          <div>
            <p className="song-title semi-bold text-md">{song.track_name}</p>
            <p className="song-artist reg text-md">{createArtists(song)}</p>
          </div>
        </>
      )}
    </div>
  );
}
