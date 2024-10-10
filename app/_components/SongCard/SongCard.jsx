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
    let string = "content";

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
    // active and hover will affect the li element
    <li
      //   className={isActive ? `song-card` : `song-card active`}
      className={listItemClassname()}
      key={`${song.track_name}` + `${song.track_id}`}
      onClick={moveOrNot}
      onMouseEnter={hoverOver}
      onMouseLeave={hoverOver}
    >
      <div>
        <img src={song.album_image.url} />
        {isActive() && (
          <div>
            <h2 className="song-title">{song.track_name}</h2>
            <h3 className="song-artist">{createArtists()}</h3>
          </div>
        )}
      </div>
    </li>
  );
}
