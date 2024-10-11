"use client";
import { useState, useRef } from "react";
import GhostCard from "../GhostCard/GhostCard";
import SongCard from "../../SongCard/SongCard";
import styles from "./SongList.module.scss";
import { useSpotifyContext } from "../../../context/spotify-context";

export default function SongList() {
  const [activeCard, setActiveCard] = useState(0);
  const { spotifyClient } = useSpotifyContext();
  const itemRefs = useRef([]);

  // track_name: item.name,
  // is_explicit: item.explicit,
  // album_name: item.album?.name,
  // album_image: item.album.images[1],
  // track_id: item.id,

  function scrollTo(index) {
    //scroll to the clicked Song Card
    setActiveCard(index);
  }

  function handleScroll() {}

  function songIsActive(index) {
    setActiveCard(index);
  }

  return (
    <div>
      <div className="scrollbar"></div>
      <div className={styles["list-container"]}>
        <ul>
          {spotifyClient.currentSongs.length > 0 &&
            spotifyClient.currentSongs.map((song, index) => (
              <SongCard
                song={song}
                index={index}
                activeCard={activeCard}
                songIsActive={songIsActive}
                scrollTo={scrollTo}
              />
            ))}
        </ul>
      </div>
      <div className="Music Player"></div>
    </div>
  );
}
