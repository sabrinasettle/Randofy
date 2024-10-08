"use client";

import { useState } from "react";
import SongList from "./SongList/SongList";
import { useSpotifyContext } from "../../context/spotify-context";

// Have a cancel button that abandons the search?? if isLoading
const GenerateButton = ({ getSongs }) => {
  // const { spotifyClient } = useSpotifyContext();
  // async function handleClick() {
  //   setIsLoading(true);
  //   spotifyClient.getSongs();
  // }
  return (
    <button
      id="generate"
      className="btn btn__overlay btn__cta text-md"
      onClick={getSongs}
    >
      Generate Songs
    </button>
  );
};

export default function RandofyContent() {
  const [isLoading, setIsLoading] = useState(false);
  const { spotifyClient } = useSpotifyContext();

  async function getRandomSongs() {
    setIsLoading(!isLoading);
    const songs = await spotifyClient.getSongs();

    // const songs = spotifyClient.currentSongs;
    // console.log(songs);
    setIsLoading(!isLoading);
  }

  return (
    <>
      <GenerateButton getSongs={getRandomSongs} />
      <SongList setIsLoading={setIsLoading} />
    </>
  );
}
