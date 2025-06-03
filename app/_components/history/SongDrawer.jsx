import Image from "next/image";
import { ArrowRight, X } from "lucide-react";
import { useGridContext } from "../../context/card-layout-context";
import { createArtists } from "../../utils/createArtists.js";
import { useAccessibleAlpha } from "../../utils/useAccessibleAlpha.js";
// import AudioPlayer from "../player/AudioPlayer/AudioPlayer.jsx";

export default function SongDrawer({ song, isOpen }) {
  const { layoutContext } = useGridContext();

  if (!song.track_name) {
    return <div id={styles["song-drawer__inactive"]}></div>;
  }

  let alt = `Album cover for ${song.album_name} by ${createArtists()}`;

  const handleClose = () => {
    layoutContext.closeDrawer();
  };

  function formatYear() {
    //format can be 1986 or 2007-09-18
    const yearRegex = /^\d{4}/;
    const match = song.release_year.match(yearRegex);
    return match ? match[0] : null;
  }

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

  const artists = createArtists(song);
  const promColor = song.color;
  const alpha = useAccessibleAlpha(promColor);

  return (
    <div
      className={`w-full border rounded-sm text-gray-600 border-gray-200 z-10`}
      id={isOpen ? "" : ""}
      style={{
        height: "calc(100vh - 100px)",
        backgroundImage: `radial-gradient(at 50% 45%, ${promColor}${alpha} , #0A0A0A 80%)`,
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
              <div className="w-full flex flex-row justify-end">
                <button
                  onClick={() => handleClose}
                  className="text-gray-400 hover:text-white pb-2"
                >
                  <X size={24} />
                </button>
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
                    <div className="flex flex-row items-center gap-2">
                      {song.is_explicit && (
                        <div
                          className="w-4 h-[18px] flex justify-center items-center text-gray-000 bg-gray-700 rounded-sm"
                          id="explicit-flag"
                        >
                          E
                        </div>
                      )}
                      <h2 className="song-artist reg text-sm">{artists}</h2>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex w-full items-center justify-center pt-5 xl:pt-6 pb-5 xl:pb-11">
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
