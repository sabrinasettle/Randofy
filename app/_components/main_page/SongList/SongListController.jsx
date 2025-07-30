import React, { useState } from "react";
import AlbumCarousel from "./AlbumCarousel";
import DefaultView from "../../SongView/SongViews/DefaultView";
import SongViewController from "../../SongView/SongViewController";
import { useMusicContext } from "../../../context/music-context";

export default function SongListController({}) {
  const { musicContext } = useMusicContext();
  const index = musicContext.selectedSong.index + 1;

  const songs = React.useMemo(() => musicContext.currentSongs, [musicContext]);

  return (
    <div className="flex flex-col items-center md:h-full w-screen">
      {/* Index number */}
      <div className="text-gray-600 font-mono text-body-md font-normal md:mb-1">
        {index} / {songs.length}
      </div>

      <AlbumCarousel />
      <DefaultView />
    </div>
  );
}
