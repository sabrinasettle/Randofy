import { useState, useEffect } from "react";
import Image from "next/image";
import { X } from "lucide-react";
import { createArtists } from "../../../utils/createArtists.js";
import { useAccessibleAlpha } from "../../../_hooks/useAccessibleAlpha.js";
import { millisToMinutesAndSeconds } from "../../../utils/convertMilliseconds.js";
import AudioPlayer from "../AudioPlayer/AudioPlayer";
import AudioFeatureDrawers from "../AudioFeatureDrawers.jsx";
import { useSongViewContext } from "../../../context/song-view-context";
import { useMusicContext } from "../../../context/music-context.js";

export default function HistoryView() {
  const { songViewContext } = useSongViewContext();
  const { musicContext } = useMusicContext();

  const song = musicContext.selectedSong.song;
  const areDrawersOpen = musicContext.drawersOpen;

  const [activeSection, setActiveSection] = useState(null);
  // const [isVisible, setIsVisible] = useState(false);
  // const [animateIn, setAnimateIn] = useState(false);

  if (!song.track_name) {
    return <div id="song-drawer__inactive"></div>;
  }

  let alt = `Album cover for ${song.album_name} by ${createArtists()}`;

  // const handleClose = () => {
  //   songViewContext.closeDetails();
  //   songViewContext.setSelectedSong({});
  //   songViewContext.markDrawerOpen();
  // };

  function formatYear() {
    const yearRegex = /^\d{4}/;
    const match = song.release_year.match(yearRegex);
    return match ? match[0] : null;
  }

  const artists = createArtists(song);

  return (
    <>
      <div className="font-body">
        <h1
          className="text-heading-4 md:text-heading-6 text-semibold text-gray-700"
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
          <h2 className="text-gray-600">{artists}</h2>
        </div>
      </div>

      <div
        className={`flex flex-row items-start gap-4 w-full ${areDrawersOpen ? "pt-3 xl:py-4" : "pt-5 xl:py-6"} transition-all duration-500 min-h-min`}
      >
        {/* Album Image Wrapper */}
        <div
          className={`flex justify-start transition-all duration-500`}
          style={{
            width: "120px",
            height: "120px",
            transition: "width 0.5s ease, height 0.5s ease",
            overflow: "hidden",
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
        <AudioPlayer song={song} />
      </div>

      {/* Song Info - Only shows when section is collapsed */}
      <div
        className={`${areDrawersOpen ? "hidden" : "block"} space-y-2 transition-all duration-500 ease-in-out`}
        id="information-container"
      >
        <div className="justify-start flex flex-col">
          <div className="flex flex-row gap-1">
            <p
              className="font-body text-body-md md:text-body-sm text-gray-600"
              id="information-label"
            >
              Album:
            </p>
            <p
              className="font-body text-body-md md:text-body-sm text-gray-700"
              id="song-album"
            >
              {song.album_name}
            </p>
          </div>
          <div className="flex flex-row flex-1 justify-between">
            <div className="flex flex-row gap-1">
              <p className="font-body text-body-md md:text-body-sm text-gray-600">
                Length:
              </p>
              <p
                className="font-body text-body-sm text-gray-700"
                id="song-length"
              >
                {millisToMinutesAndSeconds(song.song_length)}
              </p>
            </div>
            <div className="flex flex-row gap-1">
              <p className="font-body text-body-md md:text-body-sm text-gray-600">
                Year:
              </p>
              <p
                className="font-body text-body-md md:text-body-sm text-gray-700"
                id="release_year"
              >
                {formatYear()}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1"></div>

      {/* AudioFeatureDrawers - only show in detailed views */}
      <AudioFeatureDrawers
        song={song}
        activeSection={songViewContext.activeSection}
        setActiveSection={songViewContext.setActiveSection}
      />
    </>
  );
}
