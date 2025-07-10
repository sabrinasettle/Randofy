"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import { useSongViewContext } from "../../context/song-view-context";
import { useGridContext } from "../../context/card-layout-context";
import { createArtists } from "../../utils/createArtists";
import ScrollingTitle from "../ui/ScrollingTitle";

export default function SongCard({ song, index }) {
  const { songViewContext } = useSongViewContext();
  const { layoutContext } = useGridContext();
  const layout = layoutContext.layoutType;
  const isMobile = songViewContext.isMobile;
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
    ? "md:bg-gray-100 md:border-gray-700 hover:border-gray-700"
    : "border-gray-100 hover:border-gray-200";
  const activeTextStyle = checkIsActive()
    ? "text-gray-700"
    : "text-gray-600 group-hover:text-gray-700";

  const imageSize = isMobile ? 64 : 74;

  const listItem = (
    <li
      className={`font-body group w-full transition-colors duration-100 flex flex-row items-center justify-start md:justify-between px-1 md:px-2 py-3 border-b border-gray-100 hover:border-gray-200 hover:bg-gray-100 ${activeStyle}`}
      id={`${song.track_name}-${song.album_name}`}
      key={keyString}
      onClick={moveOrNot}
    >
      {/* Mobile: smaller image */}
      <div className="relative aspect-square w-12 sm:w-16 bg-gray-100 flex-shrink-0 overflow-hidden">
        <Image
          src={song.album_image.url}
          fill
          alt={alt}
          className="object-cover"
        />
      </div>

      {/* Track and artist info */}
      <div className="flex flex-col md:flex-1 pl-3 sm:pl-4 lg:pl-20 gap-0 md:gap-1 min-w-0">
        <ScrollingTitle
          title={song.track_name}
          className="text-body-lg md:text-body-md text-gray-700 font-semibold"
        />
        {/* <p className="text-body-md text-gray-700 font-semibold truncate">
          {song.track_name}
        </p> */}
        <span
          className={`flex flex-row gap-1 text-body-sm md:text-body-md font-normal ${activeTextStyle}`}
        >
          {song.is_explicit && <div className="explicit-flag">E</div>}
          <p
            className={`text-body-sm md:text-body-md ${activeTextStyle} truncate`}
          >
            {artists}
          </p>
        </span>
      </div>

      {/* Optional album name on md+ screens */}
      {/* <div
          className={`hidden md:flex md:flex-1 text-body-sm md:text-body-md font-normal ${activeTextStyle} min-w-0`}
        >
          <p className="truncate">{song.album_name}</p>
        </div> */}
    </li>
  );

  const squareItem = (
    <li onClick={moveOrNot} className="font-body w-full cursor-pointer">
      {/* Mobile: responsive square sizing - 2 columns on mobile, maintains desktop size on larger screens */}
      <div className="relative bg-gray-100 borderborder-gray-100 aspect-square min-w-[120px]">
        <Image
          src={song.album_image.url}
          fill
          alt={alt}
          className="object-cover"
          sizes="(max-width: 640px) 50vw, (max-width: 768px) 160px, (max-width: 1024px) 192px, 224px"
        />
      </div>
    </li>
  );

  return <div>{layout === "list-grid" ? listItem : squareItem}</div>;
}
