"use client";
import { useState } from "react";
import Image from "next/image";
import { useColor } from "color-thief-react";
import { useSpotifyContext } from "../../context/spotify-context";
import { useGridContext } from "../../context/card-layout-context";

// list card
// oblong card
// grid card
//

// const Background = ({ title }) => {
//   if (title) {
//     useTitle(title);
//   }
//   return null; // Renderless component
// };
//

export default function SongCard({
  song,
  index,
  activeCard = -1,
  songIsActive,
  scrollTo,
  imageSize,
  type,
}) {
  const [isHover, setIsHover] = useState(false);
  const { spotifyClient } = useSpotifyContext();
  // const { data, loading, error } = useColor(song.album_image.url, "rgbString", {
  //   crossOrigin: "Anonymous",
  // });
  const { layoutContext } = useGridContext();

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
      layoutContext.openSongDetails();
    } else {
      spotifyClient.setSelectedSong({ index: index, song });
      layoutContext.openSongDetails();
      // scrollTo(index);
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
    if (!imageSize && !isActive()) {
      return "240";
    } else if (!imageSize && isActive()) {
      return "298";
    }

    if (!imageSize) return "189";
    return imageSize.toString();
  }

  let squareImage = handleImageSize();

  // console.log(data);
  //
  let keyString = `${song.track_name}` + `${song.track_id}`;

  // function handleBackgrdColor() {
  //   // if (song.color || song.color !== "") return song.color;

  //   const { data, loading, error } = useColor(
  //     song.album_image.url,
  //     "rgbString",
  //     {
  //       crossOrigin: "Anonymous",
  //     },
  //   );
  //   if (!song.color || song.color === "") {
  //     song["color"] = data;
  //   }
  //   return song.color;
  // }

  // let color = handleBackgrdColor();
  //
  console.log("song color", song.color);

  return (
    <li
      className={listItemClassname()}
      key={keyString}
      onClick={moveOrNot}
      onMouseEnter={hoverOver}
      onMouseLeave={hoverOver}
      style={{
        // backgroundColor: color,
        height: `${squareImage}`,
        width: `${squareImage}`,
      }}
    >
      <div className="content">
        <div className={isActive() ? `overlay overlay__active` : `overlay`}>
          <div className="album-image-container">
            <Image
              className="album-image"
              src={song.album_image.url}
              height={squareImage}
              width={squareImage}
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
