import React, { useState, useRef, useEffect, useCallback } from "react";
import Image from "next/image";
import { useSpotifyContext } from "../../../context/spotify-context";
import { useSongViewContext } from "../../../context/song-view-context.js";
import SongViewController from "../../SongView/SongViewController";
import { createArtists } from "../../../utils/createArtists";

export default function AlbumStack() {
  const { spotifyClient } = useSpotifyContext();
  const { songViewContext } = useSongViewContext();

  const [activeIndex, setActiveIndex] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollOffset, setScrollOffset] = useState(0);

  const containerRef = useRef(null);
  const itemWidth = 372 + 60; // width + gap

  const albums = spotifyClient.currentSongs || [];
  if (albums.length > 0) {
    songViewContext.setSelectedSong({
      index: 0,
      song: albums[0],
    });
  }

  // Set initial selected song
  useEffect(() => {
    if (albums.length > 0) {
      songViewContext.setSelectedSong({
        index: 0,
        song: albums[0],
      });
    }
  }, [albums]);

  // Handle scroll and update active index + selected song
  const handleScroll = useCallback(() => {
    if (!containerRef.current) return;
    const scrollLeft = containerRef.current.scrollLeft;
    const index = Math.round(scrollLeft / itemWidth);
    setActiveIndex(index);

    const song = albums[index];
    if (song) {
      songViewContext.setSelectedSong({ index, song });
    }
  }, [albums, songViewContext]);

  // Attach scroll handler
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    el.addEventListener("scroll", handleScroll, { passive: true });
    return () => el.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  // Drag behavior
  const handleMouseDown = (e) => {
    setIsDragging(true);
    setStartX(e.clientX);
  };

  const handleMouseMove = (e) => {
    if (!isDragging || !containerRef.current) return;
    const dx = startX - e.clientX;
    containerRef.current.scrollLeft += dx;
    setStartX(e.clientX);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleTouchStart = (e) => setStartX(e.touches[0].clientX);

  const handleTouchMove = (e) => {
    if (!containerRef.current) return;
    const dx = startX - e.touches[0].clientX;
    containerRef.current.scrollLeft += dx;
    setStartX(e.touches[0].clientX);
  };

  return (
    <div
      className="flex flex-col items-center justify-center text-white px-4 select-none"
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onTouchEnd={handleMouseUp}
    >
      {/* Counter */}
      <div className="mb-8 text-sm opacity-60 font-medium">
        {activeIndex + 1} / {albums.length}
      </div>

      {/* Album Carousel */}
      <div className="relative w-full max-w-[95vw] h-80 flex items-center justify-center perspective-[1200px]">
        <div className="w-[578px]">
          <SongViewController />
        </div>
      </div>
    </div>
  );
}

// <div
//   ref={containerRef}
//   className="absolute w-full overflow-x-auto scrollbar-hide cursor-grab active:cursor-grabbing"
//   style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
//   onScroll={handleScroll}
//   onMouseDown={handleMouseDown}
//   onTouchStart={handleTouchStart}
//   onTouchMove={handleTouchMove}
// >
//   <div className="flex flex-row items-center whitespace-nowrap gap-6 px-[calc(50vw-186px)]">
//     {albums.map((song, index) => {
//       if (!song) return null;

//       const offset = index - activeIndex;
//       const rotateY = offset * -10;
//       const scale = offset === 0 ? 1 : 0.9;
//       const zIndex = 100 - Math.abs(offset);

//       return (
//         <div
//           key={song.id || index}
//           className="snap-center relative shrink-0 overflow-hidden"
//           style={{
//             width: "372px",
//             height: "372px",
//             transformStyle: "preserve-3d",
//             transform: `rotateY(${rotateY}deg) scale(${scale})`,
//             transition: "transform 0.3s ease",
//             zIndex,
//           }}
//         >
//           <div className="relative w-36 h-36">
//             <Image
//               src={song.album_image?.url ?? "/fallback.jpg"}
//               alt={`Album cover for ${song.title ?? "Unknown"} by ${createArtists(song)}`}
//               fill
//               className="object-cover"
//               loading="eager"
//             />

//             {/* Hover overlay for non-active items */}
//             {index !== activeIndex && (
//               <div className="absolute inset-0 bg-white/10 opacity-0 hover:opacity-100 transition-opacity cursor-pointer flex items-center justify-center">
//                 <div className="w-12 h-12 bg-white/20 backdrop-blur-sm flex items-center justify-center">
//                   <div className="w-0 h-0 border-l-[8px] border-l-white border-t-[6px] border-t-transparent border-b-[6px] border-b-transparent ml-1" />
//                 </div>
//               </div>
//             )}
//           </div>
//         </div>
//       );
//     })}
//   </div>
// </div>
