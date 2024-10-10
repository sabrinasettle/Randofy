"use client";
import { useState, useRef } from "react";
import GhostCard from "../GhostCard/GhostCard";
import SongCard from "../../SongCard/SongCard";
import styles from "./SongList.module.scss";
import { useSpotifyContext } from "../../../context/spotify-context";

// add isLoading from RandofyContent
const DefaultSongList = ({ generateSongs }) => {
  const [isHover, setIsHover] = useState(false);

  const defaultCards = Array.from({ length: 5 }).map((_, index) => (
    <GhostCard key={index} value={index + 1} hover={isHover} />
  ));

  return (
    <div
      className={styles["list-container"]}
      onMouseEnter={() => setIsHover(true)}
      onMouseLeave={() => setIsHover(false)}
      onClick={generateSongs}
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

export default function SongList({ isLoading, setIsLoading }) {
  const { spotifyClient } = useSpotifyContext();

  async function generateSongs() {
    setIsLoading(!isLoading);
    const songs = await spotifyClient.getSongs();
    if (songs && songs.length !== 0) {
      spotifyClient.setCurrentSongs(songs.recommendedTracks);
      // setSonglist(songs.recommendedTracks);
    }
    setIsLoading(!isLoading);

    //isLoading
  }

  // Generated Song List
  const GeneratedSongList = ({}) => {
    // const [scroll, setScroll] = useState(false);
    const [activeCard, setActiveCard] = useState(0);
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

    function onScroll() {}

    function songIsActive(index) {
      setActiveCard(index);
    }

    return (
      <>
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
      </>
    );
  };

  // Scroll Bar
  return (
    <div>
      <div className="scrollbar"></div>
      <div className={styles["list-container"]}>
        {spotifyClient.currentSongs.length === 0 ? (
          <DefaultSongList generateSongs={generateSongs} />
        ) : (
          <GeneratedSongList />
        )}
      </div>
      <div className="Music Player"></div>
    </div>
  );
}
