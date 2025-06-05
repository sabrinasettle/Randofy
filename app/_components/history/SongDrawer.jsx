import { useState } from "react";
import Image from "next/image";
import { ArrowUp, ArrowDown, X } from "lucide-react";
import { useGridContext } from "../../context/card-layout-context";
import { createArtists } from "../../utils/createArtists.js";
import { useAccessibleAlpha } from "../../utils/useAccessibleAlpha.js";
import { millisToMinutesAndSeconds } from "../../utils/convertMilliseconds.js";
import Drawers from "./AudioFeatureDrawers";
import AudioPlayer from "../SongView/AudioPlayer/AudioPlayer";
import AudioFeatureDrawers from "./AudioFeatureDrawers";
import { useSongViewContext } from "../../context/song-view-context";

// import AudioPlayer from "../player/AudioPlayer/AudioPlayer.jsx";

// To do!!!
// Add AudioPlayer
// Add back to song
// Replace the msToMinutesSeconds funtion with the util
// Fix closing the drawer
// Add Charts and drawers

export default function SongDrawer({ song, isOpen }) {
  const { songViewContext } = useSongViewContext();

  // const { layoutContext } = useGridContext();
  const [activeSection, setActiveSection] = useState(null); // 'details' or 'genres' or null

  if (!song.track_name) {
    return <div id={styles["song-drawer__inactive"]}></div>;
  }

  let alt = `Album cover for ${song.album_name} by ${createArtists()}`;

  const handleClose = () => {
    songViewContext.closeDrawer();
  };

  function formatYear() {
    //format can be 1986 or 2007-09-18
    const yearRegex = /^\d{4}/;
    const match = song.release_year.match(yearRegex);
    return match ? match[0] : null;
  }

  // function msToMinutesSeconds(ms) {
  //   // Convert milliseconds to seconds
  //   let seconds = Math.floor(ms / 1000);

  //   // Get the minutes
  //   let minutes = Math.floor(seconds / 60);

  //   // Get the remaining seconds after extracting minutes
  //   seconds = seconds % 60;

  //   // Pad the seconds with a leading zero if needed
  //   seconds = seconds < 10 ? "0" + seconds : seconds;

  //   return minutes + ":" + seconds;
  // }

  const artists = createArtists(song);
  const promColor = song.color;
  const alpha = useAccessibleAlpha(promColor);
  console.log(song);

  return (
    <div
      className={`w-full border rounded-sm text-gray-600 border-gray-200 z-10`}
      id={isOpen ? "" : ""}
      style={{
        height: "calc(100vh - 98px)",
        backgroundImage: `radial-gradient(at 50% 45%, ${promColor}${alpha} , #0A0A0A 80%)`,
      }}
    >
      <div className="h-full flex flex-col px-4 pt-3 pb-1 box-border">
        {/* Header with close button */}
        <div className="w-full flex flex-row justify-end">
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-700 pb-2"
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

        <div
          className={`flex ${
            activeSection
              ? "flex-row items-start gap-4"
              : "flex-col items-center"
          } w-full ${activeSection ? "pt-3 xl:py-4" : "pt-5 xl:py-6"} transition-all duration-500 min-h-min`}
        >
          {/* Album Image Wrapper */}
          <div
            className={`flex ${
              activeSection ? "justify-start" : "justify-center items-center"
            } transition-all duration-500`}
            style={{
              width: activeSection ? "88px" : "240px", // Animate actual size
              height: activeSection ? "88px" : "240px",
              transition: "width 0.5s ease, height 0.5s ease",
              overflow: "hidden", // Prevent layout jank during resize
            }}
          >
            <Image
              className="album-image"
              src={song.album_image.url}
              width={240}
              height={240}
              alt={alt}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                transition: "all 0.5s ease",
              }}
            />
          </div>
          {/* Controller placeholder */}
          <div>
            <AudioPlayer song={song} />
          </div>
        </div>

        {/* Song Info - Only shows when section is collapsed */}
        <div
          className={`${activeSection ? "hidden" : "block"} space-y-2 transition-all duration-500 ease-in-out`}
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
                {millisToMinutesAndSeconds(song.song_length)}
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
        </div>

        <div className="flex-1"></div>

        <AudioFeatureDrawers
          song={song}
          activeSection={activeSection}
          setActiveSection={setActiveSection}
        />

        {/* Song Details Expandable Section */}

        {/* Genres Expandable Section */}
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
