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
      className={`group w-full transition-colors duration-100 flex flex-row items-center justify-start md:justify-between px-1 md:px-2 py-3 border-b border-gray-100 hover:border-gray-200 hover:bg-gray-100 ${activeStyle}`}
      id={`${song.track_name}-${song.album_name}`}
      key={keyString}
      onClick={moveOrNot}
    >
      {/* Mobile: smaller image */}
      <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gray-100 flex-shrink-0">
        <Image
          src={song.album_image.url}
          width={imageSize}
          height={imageSize}
          alt={alt}
          className="w-full h-full object-cover rounded"
        />
      </div>

      {/* Mobile: reduced left padding and adjusted layout */}
      <div className="flex flex-col md:flex-1 pl-3 sm:pl-4 md:pl-20 gap-0 md:gap-1 min-w-0">
        <p className="text-body-md text-gray-700 font-semibold truncate">
          {song.track_name}
        </p>
        <span
          className={`flex flex-row gap-1 text-body-sm md:text-body-md font-normal ${activeTextStyle}`}
        >
          {song.is_explicit && <div className="explicit-flag">E</div>}
          <p className={`text-body-sm md:text-body-md ${activeTextStyle}`}>
            {artists}
          </p>
        </span>
      </div>

      {/* Mobile: hide album name on very small screens, show on sm+ */}
      <div
        className={`hidden md:flex md:flex-1 text-body-sm md:text-body-md font-normal ${activeTextStyle} min-w-0`}
      >
        <p className="truncate">{song.album_name}</p>
      </div>
    </li>
  );

  const squareItem = (
    <li onClick={moveOrNot} className="w-full">
      {/* Mobile: responsive square sizing - 2 columns on mobile, maintains desktop size on larger screens */}
      <div
        className={`relative bg-gray-100 border border-gray-100 sm:w-40 sm:h-40 md:w-48 md:h-48 lg:w-56 lg:h-56 sm:aspect-auto`}
        style={{
          width: "100%",
          aspectRatio: "1 / 1",
        }}
      >
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
