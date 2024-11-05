import styles from "../HistoryContent/History.module.scss";
import Image from "next/image";
import AudioPlayer from "../AudioPlayer/AudioPlayer";
import CloseButton from "./CloseButton";
import { useGridContext } from "../../context/card-layout-context";
import { createArtists } from "../../utils/createArtists.js";
import { hexToRGBA } from "../../utils/convertHexToRGBA.js";

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

  // console.log(song.track_name, song.genres);
  //
  const artists = createArtists(song);

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
              <CloseButton closeFunction={layoutContext.closeDrawer} />
            </div>

            {/* <div className="album-image__overlay-container"> */}
            <div className="album-image-container">
              <Image
                className="album-image"
                src={song.album_image.url}
                height={364}
                width={364}
                alt={alt}
              />
              {/* <div className="overlay">
                <div className="song-details-container">
                <div className="name-artist__overlay-container">
                  <p className="song-title semi-bold text-md">
                    {song.track_name}
                  </p>
                  <div className="flag-artists-container">
                    {song.is_explicit && <div className="explicit-flag">E</div>}
                    <p className="song-artist reg text-sm">{artists}</p>
                  </div>
                </div>
                <div className="overlay-background" />
                </div>
              </div> */}
            </div>
            <div className="song-details-container">
              <div className="name-artist-container">
                <p className="song-title semi-bold text-lg">
                  {song.track_name}
                </p>
                <div className="flag-artists-container">
                  {song.is_explicit && <div className="explicit-flag">E</div>}
                  <p className="song-artist reg text-sm">{artists}</p>
                </div>
              </div>
            </div>
            <AudioPlayer song={song} />
            <div className="information-container">
              <div className="information-details-container">
                <div>
                  <div className="information-label">Album</div>
                  <p className="song-info text-sm" id="song-album">
                    {song.album_name}
                  </p>
                </div>
                <div>
                  <div className="information-label">Release Year</div>
                  <p className="song-info text-sm" id="release_year">
                    {formatYear()}
                  </p>
                </div>
              </div>
              <div id="genre-information">
                <div className="information-label">
                  Sub Genres{" "}
                  <span className="text-sm">({song.genres.length})</span>
                </div>
                <ul className="genre-list">
                  {song.genres.map((genre) => (
                    <li className="genre-tag text-xs">
                      <p>{genre}</p>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
