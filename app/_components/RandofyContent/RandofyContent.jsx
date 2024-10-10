"use client";

import { useState } from "react";
import SongList from "./SongList/SongList";
import { useSpotifyContext } from "../../context/spotify-context";

// Have a cancel button that abandons the search?? if isLoading
const GenerateButton = ({ isLoading, setIsLoading }) => {
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

  return (
    <button
      id="generate"
      className="btn btn__overlay btn__cta text-md"
      onClick={generateSongs}
    >
      Generate Songs
    </button>
  );
};

export default function RandofyContent() {
  const [isLoading, setIsLoading] = useState(false);
  // const { spotifyClient } = useSpotifyContext();

  // async function getRandomSongs() {
  //   setIsLoading(!isLoading);
  //   const songs = await spotifyClient.getSongs();

  //   // const songs = spotifyClient.currentSongs;
  //   // console.log(songs);
  //   setIsLoading(!isLoading);
  // }

  return (
    <>
      <GenerateButton isLoading={isLoading} setIsLoading={setIsLoading} />
      <SongList isLoading={isLoading} setIsLoading={setIsLoading} />
    </>
  );
}
