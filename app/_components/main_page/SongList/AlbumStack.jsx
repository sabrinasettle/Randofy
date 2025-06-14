import Image from "next/image";
import { useSpotifyContext } from "../../../context/spotify-context";
import { createArtists } from "../../../utils/createArtists";
import React, { useState, useRef, useEffect, useCallback } from "react";

export default function AlbumStack() {
  const { spotifyClient } = useSpotifyContext();
  const [activeIndex, setActiveIndex] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollOffset, setScrollOffset] = useState(0);

  const albums = spotifyClient.currentSongs;

  return (
    <div className="flex flex-col items-center justify-center text-white px-4 select-none">
      {/* Counter */}
      <div className="mb-8 text-sm opacity-60 font-medium">
        {activeIndex + 1} / {albums.length}
      </div>

      {/* 3D Album Carousel */}
      <div className="relative w-full max-w-[95vw] h-80 flex items-center justify-center perspective-[1200px] ">
        <div
          // ref={containerRef}
          className="absolute w-full overflow-x-auto scrollbar-hide cursor-grab active:cursor-grabbing"
          style={{
            scrollbarWidth: "none",
            msOverflowStyle: "none",
            WebkitScrollbar: { display: "none" },
          }}
          // onScroll={handleScroll}
          // onMouseDown={handleMouseDown}
          // onTouchStart={handleTouchStart}
        >
          <div
            className="flex flex-row items-center whitespace-nowrap gap-6 px-[calc(50vw-72px)]"
            style={
              {
                // width: `${albums.length * itemWidth + 2000}px`,
              }
            }
          >
            {/* <AnimatePresence> */}
            {albums.map((song, index) => {
              return (
                <div
                  key={`${song.id || index}`}
                  className="relative shrink-0 overflow-hidden"
                  style={{
                    width: "372px",
                    height: "372px",
                    transformStyle: "preserve-3d",
                  }}
                >
                  {/* Album cover */}
                  <div className="relative w-36 h-36">
                    <Image
                      src={song.album_image.url}
                      alt={`Album cover for ${song.title} by ${createArtists(song)}`}
                      fill
                      className="object-cover"
                      // priority={Math.abs(offset) <= 1}
                      loading={"eager"}
                    />

                    {/* Hover overlay for non-active items */}
                    {index !== activeIndex && (
                      <div
                        className="absolute inset-0 bg-white/10  opacity-0 hover:opacity-100 transition-opacity cursor-pointer flex items-center justify-center"
                        whileHover={{ opacity: 1 }}
                      >
                        <div className="w-12 h-12  bg-white/20 backdrop-blur-sm flex items-center justify-center">
                          <div className="w-0 h-0 border-l-[8px] border-l-white border-t-[6px] border-t-transparent border-b-[6px] border-b-transparent ml-1" />
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
            {/* </AnimatePresence> */}
          </div>
        </div>
      </div>
    </div>
  );
}
