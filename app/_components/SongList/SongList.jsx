"use client";
import { useState } from "react";
import GhostCard from "../GhostCard/GhostCard";
import SongCard from "../SongCard/SongCard";
import styles from "./SongList.module.scss";
import { useSpotifyContext } from "../../context/spotify-context";

const DefaultSongList = () => {
  const [isHover, setIsHover] = useState(false);

  const { spotifyClient } = useSpotifyContext();

  function hoverOver() {
    setIsHover(!isHover);
  }

  const defaultCards = Array.from({ length: 5 }).map((_, index) => (
    <GhostCard key={index} value={index + 1} hover={isHover} />
  ));

  return (
    <div
      className={styles["list-container"]}
      onMouseEnter={() => setIsHover(true)}
      onMouseLeave={() => setIsHover(false)}
    >
      {isHover && (
        <div className={styles["overlay-text"]}>
          <p>Click to Generate</p>
        </div>
      )}

      <ul className={styles["song-list"]}>{defaultCards}</ul>
    </div>
  );
};

export default function SongList({ list }) {
  return (
    <div className={styles["list-container"]}>
      {!list ? <DefaultSongList /> : <ul></ul>}
      {/* <ul className={styles["song-list"]}>{defaultCards}</ul> */}
    </div>
  );
}
