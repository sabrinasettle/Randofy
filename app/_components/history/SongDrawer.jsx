import styles from "../HistoryContent/History.module.scss";
import Image from "next/image";
import AudioPlayer from "../AudioPlayer/AudioPlayer";
import CloseButton from "../Buttons/CloseButton";
import { ArrowRight, X } from "lucide-react";
import { useGridContext } from "../../context/card-layout-context";
import { createArtists } from "../../utils/createArtists.js";
import { hexToRGBA } from "../../utils/convertHexToRGBA.js";

export default function SongDrawer({ song, isOpen }) {
  const { layoutContext } = useGridContext();

  if (!song.track_name) {
    return <div id={styles["song-drawer__inactive"]}></div>;
  }

  let alt = `Album cover for ${song.album_name} by ${createArtists()}`;

  // function handleColor() {
  //   // console.log(isHover, name);
  //   if (isHover) return hexToRGBA(song.color, 0.3);
  //   // `rgba(251, 254, 247, 16%)`;
  //   return `rgba(251, 254, 247, 4%)`;
  // }

  // function handleBorder() {
  //   if (isHover) return hexToRGBA(song.color, 0.3);
  //   return `rgba(251, 254, 247, 8%)`;
  // }
  //

  function formatYear() {
    //format can be 1986 or 2007-09-18
    const yearRegex = /^\d{4}/;
    const match = song.release_year.match(yearRegex);
    return match ? match[0] : null;
  }

  // console.log(song.track_name, song.genres);
  //
  const artists = createArtists(song);

  console.log(`${hexToRGBA(song.color, 1)}`, song.color);

  // const radial = `bg-radial-[at_25%_25%] from-gray-000 from-40% to-[#93532d]`;
  // const radial = `bg-radial from-gray-100 from-40% to-[${song.color}]`;
  // const radial = `bg-radial from-[${song.color}]/60 from-0% to-gray-100 to-60%`;
  const radial = `bg-[radial-gradient(circle,_${song.color}cc_0%,_theme('colors.gray.100')_60%)]`;
  // const radial = `bg-radial from-[${song.color}] to-gray-100 from-40%`;

  // to-fuchsia-700
  //
  //   const radial = `bg-radial-[at_25%_25%] from-gray-000 from-40% to-[${song.color}]`;
  //
  console.log(song);

  function msToMinutesSeconds(ms) {
    // Convert milliseconds to seconds
    let seconds = Math.floor(ms / 1000);

    // Get the minutes
    let minutes = Math.floor(seconds / 60);

    // Get the remaining seconds after extracting minutes
    seconds = seconds % 60;

    // Pad the seconds with a leading zero if needed
    seconds = seconds < 10 ? "0" + seconds : seconds;

    return minutes + ":" + seconds;
  }

  // console.log(msToMinutesSeconds(song.song_length));

  return (
    <div
      className={`w-full border rounded-sm text-gray-600 border-gray-200 z-10 ${radial}`}
      // className={`w-full border rounded-sm text-gray-600 border-gray-200 z-10`}
      id={isOpen ? "" : ""}
      style={{
        height: "calc(100vh - 100px)",

        // backgroundColor: hexToRGBA(song.color, 0.2),
        // border: `${hexToRGBA(song.color, 0.1)}, 1px, solid`,
      }}
    >
      <div style={{ height: "100%" }}>
        <div
          className="h-full flex flex-col px-4 pt-3 pb-1"
          style={{
            boxSizing: "border-box",
          }}
        >
          {song.track_name && (
            <>
              <div className={styles["drawer-header"]}>
                <CloseButton closeFunction={layoutContext.closeDrawer} />
              </div>
              <div>
                <div className="">
                  <div className="">
                    <h1
                      className="text-heading-4 md:text-heading-5 text-semibold text-gray-700"
                      id="song-title"
                    >
                      {song.track_name}
                    </h1>
                    <div className="flag-artists-container">
                      {song.is_explicit && (
                        <div className="explicit-flag">E</div>
                      )}
                      <h2 className="song-artist reg text-sm">{artists}</h2>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex w-full items-center justify-center pt-3 xl:pt-4 pb-5 xl:pb-11">
                <Image
                  className="album-image"
                  src={song.album_image.url}
                  height={240}
                  width={240}
                  alt={alt}
                />
              </div>
              {/* <div
                  style={{
                    height: "100%",
                    display: "flex",
                    justifyContent: "space-between",
                    flexDirection: "column",
                  }}
                >
                  <AudioPlayer song={song} />
                </div> */}
              <div
                className="h-full flex flex-col justify-between"
                id="information-container"
              >
                <div className="justify-start flex flex-col">
                  <div className="flex flex-row gap-1">
                    <div className="text-body-md md:text-body-sm text-gray-600">
                      Album:
                    </div>
                    <p
                      className="text-body-md md:text-body-sm text-gray-700"
                      id="song-album"
                    >
                      {song.album_name}
                    </p>
                  </div>
                  <div className="flex flex-row gap-1">
                    <div className="information-label">Length:</div>
                    <p className="text-body-sm text-gray-700" id="song-length">
                      {msToMinutesSeconds(song.song_length)}
                    </p>
                  </div>
                  <div className="flex flex-row gap-1">
                    <div
                      className="text-body-md md:text-body-sm text-gray-600"
                      id="information-label"
                    >
                      Year:
                    </div>
                    <p
                      className="text-body-md md:text-body-sm text-gray-700"
                      id="release_year"
                    >
                      {formatYear()}
                    </p>
                  </div>
                </div>

                {/* Navigation */}
                <div className="justify-end">
                  <div id="song_details">
                    <button
                      // onClick={() => navigateToPanel("songDetails")}
                      className="group w-full h-12 hover:text-gray-700 border-t border-gray-200 flex items-center justify-between px-0 transition-colors"
                    >
                      <span className="text-gray-700">
                        Song Details{" "}
                        {/* {changedSongDetailsCount !== 0 && (
                            <span>[{changedSongDetailsCount}]</span>
                          )} */}
                      </span>
                      <ArrowRight
                        size={20}
                        className="text-gray-500 group-hover:text-gray-700 transition-colors"
                      />
                    </button>
                  </div>
                  <div id="genres">
                    <button
                      // onClick={() => navigateToPanel("songDetails")}
                      className="group w-full h-12 hover:text-gray-700 border-t border-gray-200 flex items-center justify-between px-0 transition-colors"
                    >
                      <span className="text-gray-700">Genres</span>
                      <ArrowRight
                        size={20}
                        className="text-gray-500 group-hover:text-gray-700 transition-colors"
                      />
                    </button>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

{
  /* <div id="genre-information">
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
                  </div> */
}
