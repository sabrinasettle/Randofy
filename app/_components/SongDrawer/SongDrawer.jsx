import styles from "../HistoryContent/History.module.scss";
import Image from "next/image";
import AudioPlayer from "../AudioPlayer/AudioPlayer";
import CloseButton from "./CloseButton";
import { useGridContext } from "../../context/card-layout-context";
import { createArtists } from "../../utils/createArtists.js";
import { hexToRGBA } from "../../utils/convertHexToRGBA.js";
import { millisToMinutesAndSeconds } from "../../utils/convertMilliseconds.js";

export default function SongDrawer({ song, isOpen }) {
  const { layoutContext } = useGridContext();

  if (!song.track_name) {
    return <div id={styles["song-drawer__inactive"]}></div>;
  }

  let alt = `Album cover for ${song.album_name} by ${createArtists()}`;

  function formatYear() {
    //format can be 1986 or 2007-09-18
    const yearRegex = /^\d{4}/;
    const match = song.release_year.match(yearRegex);
    return match ? match[0] : null;
  }

  console.log(song.track_name, song.genres);

  return (
    <div
      className="song-drawer"
      id={
        isOpen ? styles["song-drawer__active"] : styles["song-drawer__inactive"]
      }
      style={{
        backgroundColor: hexToRGBA(song.color, 0.2),
        border: `${hexToRGBA(song.color, 0.1)}, 1px, solid`,
      }}
    >
      <div style={{ padding: "12px" }}>
        {song.track_name && (
          <>
            <div className={styles["drawer-header"]}>
              {/* <button
                className={styles["close-drawer"]}
                onClick={layoutContext.closeDrawer}
              >
                <X />
              </button> */}
              <CloseButton closeFunction={layoutContext.closeDrawer} />
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
            <div className="information-container">
              <div className="information-details-container">
                {/* <div>
                  <>Album </>
                  <p id="song-album text-sm">{song.album_name}</p>
                </div> */}
                {/* <div>
                  <>Full Song Length </>
                  <p id="song-length text-sm">
                    {millisToMinutesAndSeconds(song.song_length)}
                  </p>
                </div> */}
                {/* <div id="genre-information">
                  <div>Sub Genres</div>
                  <div>{song.genres}</div>
                </div> */}
                <div id="genre-information">
                  <div className="information-label">Sub Genres</div>
                  <ul className="genre-list">
                    {song.genres.map((genre) => (
                      <li className="genre-tag text-xs">
                        <p>{genre}</p>
                      </li>
                    ))}
                  </ul>
                </div>
                {/* <div>
                  <div className="information-label">Release Year</div>
                  <p id="release_year text-sm">{formatYear()}</p>
                </div> */}
              </div>
              {/* <div id="genre-information">
                <div>Sub Genres</div>
                <ul>
                  {song.genres.map((genre) => (
                    <li>
                      <p>{genre}</p>
                    </li>
                  ))}
                </ul>
              </div> */}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
