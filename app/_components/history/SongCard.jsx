"use client";
import Image from "next/image";
import { useStyleContext } from "../../context/style-context";
import { useHistoryContext } from "../../context/history-context";
import { createArtists } from "../../utils/createArtists";
import ScrollingTitle from "../ui/ScrollingTitle";
import { ArrowUpRight } from "lucide-react";

export default function SongCard({ song, index }) {
  const { styleContext } = useStyleContext();
  const { historyContext } = useHistoryContext();

  const sortOption = historyContext.sortOption;
  const layout = historyContext.layoutType;
  const isMobile = styleContext.isMobile;

  function openSelectedSong() {
    historyContext.setSelectedSong({ index: index, song });
    historyContext.openDetails();
  }

  let alt = `Album cover for ${song.album_name} by ${createArtists(song)}`;
  let keyString = `${song.track_name}${song.track_id}`;
  const artists = createArtists(song);

  let isAlpha = sortOption === "alpha-asc" || sortOption === "alpha-desc";

  const listItem = (
    <li
      className={`font-body cursor-pointer group w-full transition-colors duration-100 flex flex-row items-center justify-start md:justify-between px-1 md:px-2 py-3 border-b border-gray-100 hover:border-gray-200 hover:bg-gray-100`}
      id={`${song.track_name}-${song.album_name}`}
      key={keyString}
      onClick={openSelectedSong}
    >
      {/* Mobile: smaller image */}
      <div className="relative aspect-square w-14 sm:w-16 lg:w-20 bg-gray-100 flex-shrink-0 overflow-hidden">
        <Image
          src={song.album_image.url}
          fill
          alt={alt}
          className="object-cover"
          sizes="(max-width: 640px) 50vw, (max-width: 768px) 160px, (max-width: 1024px) 192px, 224px"
        />
      </div>

      {/* Track and artist info */}
      <div className="flex flex-col md:flex-1 pl-3 sm:pl-4 lg:pl-20 gap-0 md:gap-1 min-w-0">
        {isMobile ? (
          <ScrollingTitle
            text={song.track_name}
            className="text-body-lg text-gray-700 font-medium"
          />
        ) : (
          <p className="text-body-md text-gray-700 font-semibold truncate">
            {song.track_name}
          </p>
        )}
        <span
          className={`flex flex-row gap-1 text-body-sm md:text-body-md font-normal`}
        >
          {song.is_explicit && <div className="explicit-flag">E</div>}
          <p className={`text-body-sm md:text-body-md truncate`}>{artists}</p>
        </span>
      </div>

      {isAlpha && (
        <div className="hidden md:flex md:flex-1 text-gray-600 text-body-sm md:text-body-md font-normal min-w-0">
          <p>{song.date}</p>
        </div>
      )}
      <div
        className="
          ml-auto flex items-center pr-5 gap-2
          md:invisible md:opacity-0
          md:group-hover:visible md:group-hover:opacity-100
          transition-opacity duration-200
        "
      >
        <p className="hidden md:block text-body-sm md:text-body-md font-normal text-gray-600">
          Click to see details
        </p>
        <ArrowUpRight className="text-gray-600 group-hover:text-gray-700" />
      </div>
    </li>
  );

  const squareItem = (
    <li
      onClick={openSelectedSong}
      className="font-body w-full cursor-pointer group"
    >
      {/* Mobile: responsive square sizing - 2 columns on mobile, maintains desktop size on larger screens */}
      <div className="relative bg-gray-100 border border-gray-100 aspect-square min-w-[120px] overflow-hidden transition-all duration-300 ease-out group-hover:scale-[1.02]">
        <Image
          src={song.album_image.url}
          fill
          alt={alt}
          className="object-cover transition-all duration-300 ease-out group-hover:scale-105"
          sizes="(max-width: 640px) 50vw, (max-width: 768px) 160px, (max-width: 1024px) 192px, 224px"
        />
        {/* Play button in bottom left */}
        <div className="absolute bottom-2 right-2 opacity-0 transition-all duration-300 ease-out group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0">
          <button className="bg-gray-100 backdrop-blur-sm rounded-full p-2 shadow-lg">
            <ArrowUpRight />
          </button>
        </div>
      </div>
    </li>
  );

  return <div>{layout === "list-grid" ? listItem : squareItem}</div>;
}
