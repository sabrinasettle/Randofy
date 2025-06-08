"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import { useSongViewContext } from "../../context/song-view-context";
import { useGridContext } from "../../context/card-layout-context";
import { createArtists } from "../../utils/createArtists";

export default function SongCard({ song, index }) {
  const { songViewContext } = useSongViewContext();
  const { layoutContext } = useGridContext();
  const layout = layoutContext.layoutType;

  const [isActive, setIsActive] = useState(false);

  function checkIsActive() {
    return song.track_name === songViewContext.selectedSong?.song?.track_name;
  }

  // Update active state when selected song changes
  useEffect(() => {
    setIsActive(checkIsActive());
  }, [songViewContext.selectedSong, song.track_name]);

  function moveOrNot() {
    songViewContext.setSelectedSong({ index: index, song });
    songViewContext.openDetails();
  }

  let alt = `Album cover for ${song.album_name} by ${createArtists(song)}`;
  let keyString = `${song.track_name}${song.track_id}`;
  const artists = createArtists(song);

  const activeStyle = checkIsActive()
    ? "bg-gray-100 border-gray-700 hover:border-gray-700"
    : "border-gray-100 hover:border-gray-200";

  const activeTextStyle = checkIsActive()
    ? "text-gray-700"
    : "text-gray-600 group-hover:text-gray-700";

  const listItem = (
    <li
      className={`group transition-colors duration-100 flex flex-row items-center justify-between px-2 py-3 border-b border-gray-100 hover:border-gray-200 hover:bg-gray-100 ${activeStyle}`}
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
        <span
          className={`flex flex-row gap-1 text-body-sm font-normal ${activeTextStyle}`}
        >
          {song.is_explicit && <div className="explicit-flag">E</div>}
          <p>{artists}</p>
        </span>
      </div>
      <div
        className={`flex-1 text-body-sm text-gray-600 font-normal ${activeTextStyle}`}
      >
        <p>{song.album_name}</p>
        {/* {!checkIsActive() && (
          <div className={`hidden group-hover:block`}>
            <p className="text-gray-000 group-hover:text-gray-500 text-caption">
              Click to View More
            </p>
          </div>
        )} */}
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
