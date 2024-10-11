import { useState } from "react";
import { useSpotifyContext } from "../../../context/spotify-context";
import styles from "../SongList/SongList.module.scss";
import GhostCard from "./GhostCard";

export default function GhostList() {
  const { spotifyClient } = useSpotifyContext();
  const [isHover, setIsHover] = useState(false);

  const defaultCards = Array.from({ length: 5 }).map((_, index) => (
    <GhostCard key={index} value={index + 1} hover={isHover} />
  ));
  return (
    <div
      className={styles["list-container"]}
      onMouseEnter={() => setIsHover(true)}
      onMouseLeave={() => setIsHover(false)}
      onClick={spotifyClient.getSongs}
    >
      {isHover && (
        <div className={styles["overlay-text"]}>
          <p>Click to Generate</p>
        </div>
      )}

      <ul className="song-list">{defaultCards}</ul>
    </div>
  );
}
