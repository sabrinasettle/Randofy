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
  imageSize,
}) {
  const [isHover, setIsHover] = useState(false);
  const { spotifyClient } = useSpotifyContext();

  const { layoutContext } = useGridContext();
  const layout = layoutContext.layoutType;

  function hoverOver() {
    setIsHover(!isHover);
  }

  function isActive() {
    // console.log(
    //   spotifyClient.setSelectedSong,
    //   spotifyClient.setSelectedSong.track_name,
    // );
    return song.track_name === spotifyClient.setSelectedSong.track_name;
  }

  isActive();

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

    // if layout === list
    // if (isHover && isActive()) {
    //   string += " " + "songcard__active" + " " + "songcard__hover";
    // } else if (isActive() && !isHover) {
    //   string += " " + "songcard__active";
    // } else if (!isActive() && isHover) {
    //   string += " " + "songcard__hover";
    // }
    //
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

  function handleImageSize() {
    if (!imageSize && !isActive()) {
      return "240";
    } else if (!imageSize && isActive()) {
      return "298";
    }

    if (isActive() && layout === "list-grid") {
      return "64";
    } else if (layout === "list-grid") {
      return "56";
    }

    // if (!imageSize) return "189";
    return imageSize.toString();
  }

  // console.log(song.track_name, song.is_explicit);

  // Include changes on hover and selection
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
          {/* <p className="song-title semi-bold text-md">{song.track_name}</p>
          <p className="song-artist reg text-md">{artists}</p> */}
          <div className="name-artist-container">
            <p className="song-title semi-bold text-md">{song.track_name}</p>
            <span className="flag-artists-container">
              {song.is_explicit && <div className="explicit-flag">E</div>}
              <p className="song-artist reg text-sm">{artists}</p>
            </span>
          </div>
        </div>
      );
    }
    return;
  }

  let squareImage = handleImageSize();
  let alt = `Album cover for ${song.album_name} by ${createArtists()}`;
  let keyString = `${song.track_name}` + `${song.track_id}`;
  const artists = createArtists(song);
  const domColor = hexToRGBA(song.color, 0.1);

  function handleColor(name) {
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
      onMouseLeave={hoverOver}
      style={{
        backgroundColor: handleColor(song.track_name),
      }}
    >
      <div className={contentClassname()}>
        {layout === "list-grid" && (
          <div className="song-index">{index + 1}</div>
        )}
        <div
          className="album-image-container"
          style={{
            height: `${squareImage}px`,
            width: `${squareImage}px`,
          }}
        >
          <Image
            className="album-image"
            src={song.album_image.url}
            height={squareImage}
            width={squareImage}
            alt={alt}
          />
        </div>
        {handleShowDetails()}
      </div>
    </li>
  );
}
