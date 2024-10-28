import styles from "../HistoryContent/History.module.scss";
import { createArtists } from "../../utils/createArtists.js";
import Image from "next/image";
import AudioPlayer from "../AudioPlayer/AudioPlayer";
import { useGridContext } from "../../context/card-layout-context";
import { X } from "lucide-react";

export default function SongDrawer({ song, isOpen }) {
  const { layoutContext } = useGridContext();

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
            <div style={{ padding: "4px 0px 20px" }}>
              <button
                className={styles["close-drawer"]}
                onClick={layoutContext.closeDrawer}
              >
                <X />
              </button>
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
            <AudioPlayer song={song} />
          </>
        )}
      </div>
    </div>
  );
}
