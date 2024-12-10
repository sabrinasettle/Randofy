"use client";
import { useState } from "react";
import Image from "next/image";
import { useSpotifyContext } from "../../context/spotify-context";
import { useGridContext } from "../../context/card-layout-context";
import { createArtists } from "../../utils/createArtists";
import { millisToMinutesAndSeconds } from "../../utils/convertMilliseconds.js";
import { hexToRGBA } from "../../utils/convertHexToRGBA.js";

export default function SongCard({
  song,
  index,
  activeCard = -1,
  songIsActive,
}) {
  const [isHover, setIsHover] = useState(false);
  const { spotifyClient } = useSpotifyContext();

  const { layoutContext } = useGridContext();
  const layout = layoutContext.layoutType;

  function hoverOver() {
    setIsHover(true);
  }

  function mouseLeave() {
    setIsHover(false);
  }

  function isActive() {
    // console.log(
    //   spotifyClient.setSelectedSong,
    //   spotifyClient.setSelectedSong.track_name,
    // );
    return song.track_name === spotifyClient.setSelectedSong.track_name;
  }

  // isActive();

  function moveOrNot() {
    if (isActive()) {
      spotifyClient.setSelectedSong({ index: index, song: { song } });
      songIsActive(song);
      layoutContext.openSongDetails();
    } else {
      spotifyClient.setSelectedSong({ index: index, song });
      layoutContext.openSongDetails();
      // scrollTo(index);
    }
  }

  function listItemClassname() {
    let string = "card btn-action";

    if (layout === "list-grid") {
      string += " " + "list-card";
      if (isHover) {
        string += " " + "card__hover";
      }
    } else if (layout === "square-grid") {
      string += " " + "grid-card";
      if (isHover) {
        string += " " + "card__hover";
      }
    } else if (layout === "oblong-grid") {
      string += " " + "oblong-card";
      if (isHover) {
        string += " " + "card__hover";
      }
    }
    return string;
  }

  function contentClassname() {
    let string = "content";
    if (layout === "list-grid") {
      string += " " + "list-layout";
    } else if (layout === "square-grid") {
      string += " " + "grid-layout";
    } else if (layout === "oblong-grid") {
      string += " " + "oblong-layout";
    }
    return string;
  }

  function handleShowDetails() {
    if (layout === "list-grid") {
      return (
        <div className={"song-details" + " " + "list-details"}>
          <div className="name-artist-container__list">
            <p className="song-title semi-bold text-md">{song.track_name}</p>
            <span className="flag-artists-container">
              {song.is_explicit && <div className="explicit-flag">E</div>}
              <p className="song-artist reg text-sm">{artists}</p>
            </span>
          </div>

          <p className="song-ablum reg text-sm">{song.album_name}</p>

          <p className="song-length reg text-sm">
            {millisToMinutesAndSeconds(song.song_length)}
          </p>
        </div>
      );
    } else if (layout === "oblong-grid") {
      return (
        <div className={"song-details" + " " + "square-details"}>
          <div className="name-artist-container__square">
            <p className="song-title semi-bold text-lg">{song.track_name}</p>
            <span className="flag-artists-container">
              {song.is_explicit && <div className="explicit-flag">E</div>}
              <p className="song-artist reg text-md">{artists}</p>
            </span>
          </div>
        </div>
      );
    }
    return;
  }

  let alt = `Album cover for ${song.album_name} by ${createArtists()}`;
  let keyString = `${song.track_name}` + `${song.track_id}`;
  const artists = createArtists(song);

  function handleColor() {
    // console.log(isHover, name);
    if (isHover) return `rgba(251, 254, 247, 16%)`;
    return hexToRGBA(song.color, 0.2);
  }

  return (
    <li
      className={listItemClassname()}
      id={`${song.track_name}-${song.album_name}`}
      key={keyString}
      onClick={moveOrNot}
      onMouseEnter={hoverOver}
      onMouseLeave={mouseLeave}
      style={{
        backgroundColor: handleColor(song.track_name),
      }}
    >
      <div className={contentClassname()}>
        {layout === "list-grid" ? (
          <>
            <div className="song-index">{index + 1}</div>
            <div>
              <div className="album-image-container">
                {!isHover && (
                  <div
                    style={{
                      width: "100%",
                      height: "100%",
                      backgroundColor: "rgba(0, 0, 0, 38%)",
                      zIndex: "3",
                      position: "absolute",
                      top: "0",
                    }}
                  />
                )}
                <Image
                  className="album-image"
                  src={song.album_image.url}
                  fill={true}
                  alt={alt}
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
              </div>
            </div>
            <div style={{ paddingLeft: "16px", flexGrow: 1 }}>
              {handleShowDetails()}
            </div>
          </>
        ) : (
          <>
            <div className="album-image-container">
              {!isHover && (
                <div
                  style={{
                    width: "100%",
                    height: "100%",
                    backgroundColor: "rgba(0, 0, 0, 38%)",
                    zIndex: "3",
                    position: "absolute",
                    top: "0",
                  }}
                />
              )}
              <Image
                className="album-image"
                src={song.album_image.url}
                fill={true}
                alt={alt}
                sizes="(max-width: 768px) 100vw, 33vw"
              />
            </div>
            {handleShowDetails()}
          </>
        )}
      </div>
    </li>
  );
}
