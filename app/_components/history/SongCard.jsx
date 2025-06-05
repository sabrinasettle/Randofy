"use client";
import { useState } from "react";
import Image from "next/image";
import { useSpotifyContext } from "../../context/spotify-context";
import { useGridContext } from "../../context/card-layout-context";
import { createArtists } from "../../utils/createArtists";
// import { millisToMinutesAndSeconds } from "../../utils/convertMilliseconds.js";
// import { hexToRGBA } from "../../utils/convertHexToRGBA.js";
import useWindowDimensions from "../../_hooks/useWindowDimensions";

// To do!!!
// Add is Active when
// Add Hover -> "See details" with Icon

export default function SongCard({ song, index, songIsActive }) {
  // const [isHover, setIsHover] = useState(false);
  const { spotifyClient } = useSpotifyContext();

  const { layoutContext } = useGridContext();
  const layout = layoutContext.layoutType;

  const { width, height } = useWindowDimensions();
  const isSmallScreen = width <= 628;
  const isMedScreen = width <= 1024;

  // function hoverOver() {
  //   setIsHover(true);
  // }

  // function mouseLeave() {
  //   setIsHover(false);
  // }

  function isActive() {
    console.log(
      spotifyClient.setSelectedSong,
      spotifyClient.setSelectedSong.track_name,
    );
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

  let alt = `Album cover for ${song.album_name} by ${createArtists()}`;
  let keyString = `${song.track_name}` + `${song.track_id}`;
  const artists = createArtists(song);

  const listItem = (
    <li
      className="group flex flex-row items-center justify-between px-2 py-3 border-b border-gray-200 hover:bg-gray-100"
      id={`${song.track_name}-${song.album_name}`}
      key={keyString}
      onClick={moveOrNot}
    >
      <div className="w-16 h-16 bg-gray-100">
        <Image src={song.album_image.url} width={70} height={70} alt={alt} />
      </div>
      <div className="flex-1 flex flex-col pl-20 gap-1">
        <p className="text-body-md md:text-body-sm text-gray-700 font-semibold">
          {song.track_name}
        </p>

        <p className="flex flex-row gap-1text-body-sm text-gray-600 group-hover:text-gray-700 font-normal">
          {song.is_explicit && <div className="explicit-flag">E</div>}
          {artists}
        </p>
      </div>

      <div className="flex-1 text-body-sm text-gray-600 group-hover:text-gray-700 font-normal">
        {song.album_name}
      </div>
    </li>
  );

  const squareItem = (
    <li onClick={moveOrNot}>
      <div className="relative w-56 h-56 bg-gray-100 border border-gray-100">
        <Image
          src={song.album_image.url}
          fill
          alt={alt}
          className="object-cover"
        />
      </div>
    </li>
  );

  return <div>{layout === "list-grid" ? listItem : squareItem}</div>;
}
