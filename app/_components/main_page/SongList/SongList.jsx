"use client";
import { useState, useRef } from "react";
import Player from "../Player/Player";
import SongCard from "../../SongCard/SongCard";
import { createArtists } from "../../../utils/createArtists";
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

  function createArtists(song) {
    let artistArray = [];
    let len = song.track_artists.length;
    song.track_artists.map((item) => {
      artistArray.push(item.name);
    });

    let artistString = "";
    for (let i = 0; i < len; i++) {
      if ((i === 0 && i == len - 1) || i == len - 1) {
        artistString += artistArray[i];
      } else if (i !== len - 1) {
        artistString += artistArray[i] + ", ";
      }
    }

    return artistString;
  }

  // console.log(spotifyClient.selectedSong.song.track_name);

  return (
    <div>
      <div className="scrollbar"></div>
      <div className={styles["list-container"]}>
        <ul className="song-list">
          {/* song-list */}
          {spotifyClient.currentSongs.length > 0 &&
            spotifyClient.currentSongs.map((song, index) => (
              <SongCard
                song={song}
                index={index}
                activeCard={activeCard}
                songIsActive={songIsActive}
                scrollTo={scrollTo}
                createArtists={createArtists}
              />
            ))}
        </ul>
      </div>
      <Player />
      {/* <div className="song-player">
        <div>
          <Image
            width={128}
            height={128}
            className="album-image-sm"
            src={spotifyClient.selectedSong.song.album_image.url}
          />
        </div>
        {spotifyClient.currentSongs.length > 0 && (
          <div className="player-song-data">
            <div>
              <div className="song-title semi-bold text-md">
                {spotifyClient.selectedSong.song.track_name}
              </div>
              <div className="song-title reg text-md">
                {createArtists(spotifyClient.selectedSong.song)}
              </div>
            </div>
            {spotifyClient.selectedSong.song.preview_url && (
              <div className="song-preview">
                <button>Play</button>
              </div>
            )}
          </div>
        )}
      </div> */}
    </div>
  );
}
