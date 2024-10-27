"use client";
import { useState } from "react";
import Image from "next/image";
import { useColor } from "color-thief-react";
import { useSpotifyContext } from "../../context/spotify-context";

// list card
// oblong card
// grid card

export default function SongCard({
  song,
  index,
  activeCard = -1,
  songIsActive,
  scrollTo,
  size,
  type,
}) {
  const [isHover, setIsHover] = useState(false);
  const { spotifyClient } = useSpotifyContext();
  const { data, loading, error } = useColor(song.album_image.url, "rgbString", {
    crossOrigin: "Anonymous",
  });

  // console.log(data);

  function hoverOver() {
    setIsHover(!isHover);
  }

  function isActive() {
    return index === activeCard;
  }

  function createArtists() {
    let artistArray = [];
    let len = song.track_artists.length;
    song.track_artists.map((item) => {
      artistArray.push(item.name);
    });

    let artistString = "";
    for (let i = 0; i < len; i++) {
      if ((i === 0 && i == len - 1) || i == len - 1) {
        artistString += artistArray[i];
      } else if (i !== len - 1) {
        artistString += artistArray[i] + ", ";
      }
    }

    return artistString;
  }

  function moveOrNot() {
    if (isActive()) {
      spotifyClient.setSelectedSong({ index: index, song: { song } });
      songIsActive(index);
    } else {
      spotifyClient.setSelectedSong({ index: index, song });
      scrollTo(index);
    }
  }

  function listItemClassname() {
    let string = "card songcard btn-action";

    if (isHover && isActive()) {
      string += " " + "songcard__active" + " " + "songcard__hover";
    } else if (isActive() && !isHover) {
      string += " " + "songcard__active";
    } else if (!isActive() && isHover) {
      string += " " + "songcard__hover";
    }
    return string;
  }

  let alt = `Album cover for ${song.album_name} by ${createArtists()}`;

  function handleImageSize() {
    if (!size && !isActive()) {
      return "240";
    } else if (!size && isActive()) {
      return "298";
    }

    if (!size) return "189";
    return size.toString();
  }

  let imageSize = handleImageSize();

  // console.log(data);
  //
  let keyString = `${song.track_name}` + `${song.track_id}`;

  return (
    <li
      className={listItemClassname()}
      key={keyString}
      onClick={moveOrNot}
      onMouseEnter={hoverOver}
      onMouseLeave={hoverOver}
      style={{
        backgroundColor: data,
        height: `${imageSize}`,
        width: `${imageSize}`,
      }}
    >
      <div className="content">
        <div className={isActive() ? `overlay overlay__active` : `overlay`}>
          <div className="album-image-container">
            <Image
              className="album-image"
              src={song.album_image.url}
              height={imageSize}
              width={imageSize}
              alt={alt}
            />
          </div>
        </div>
        {isActive() && (
          <div className="song-details">
            <p className="song-title semi-bold text-md">{song.track_name}</p>
            <p className="song-artist reg text-md">{createArtists()}</p>
          </div>
        )}
      </div>
    </li>
  );
}
