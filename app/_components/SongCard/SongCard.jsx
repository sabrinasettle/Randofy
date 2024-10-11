"use client";
import { useState } from "react";

export default function SongCard({
  song,
  index,
  activeCard,
  songIsActive,
  scrollTo,
}) {
  const [isHover, setIsHover] = useState(false);

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
      // i === len - 1 || i === 0
      if (i === 0 || i == len - 1) {
        artistString += artistArray[i];
      } else if (i !== len - 1) {
        artistString += artistArray[i] + ", ";
      }
    }

    return artistString;
  }

  function moveOrNot() {
    if (isActive()) {
      songIsActive(index);
    } else {
      scrollTo(index);
    }
  }

  function listItemClassname() {
    let string = "card songcard";

    if (isHover && isActive()) {
      string += " " + "songcard__active" + " " + "songcard__hover";
    } else if (isActive() && !isHover) {
      string += " " + "songcard__active";
    } else if (!isActive() && isHover) {
      string += " " + "songcard__hover";
    }

    return string;
  }

  return (
    <li
      className={listItemClassname()}
      key={`${song.track_name}` + `${song.track_id}`}
      onClick={moveOrNot}
      onMouseEnter={hoverOver}
      onMouseLeave={hoverOver}
    >
      <div className="content">
        <div className={isActive() ? `overlay overlay__active` : `overlay`}>
          <div className="album-image-container">
            <img className="album-image" src={song.album_image.url} />
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
