"use client";

import { useState } from "react";
import SongList from "./SongList/SongList";
import GhostList from "./GhostCard/GhostList";
import { useSpotifyContext } from "../../context/spotify-context";
import Loading from "../Loading/Loading";

// Have a cancel button that abandons the search?? if isLoading
const GenerateButton = ({ spotifyClient }) => {
  return (
    <button
      id="generate"
      className="btn btn__overlay btn__cta text-md"
      onClick={spotifyClient.getSongs}
    >
      Generate Songs
    </button>
  );
};

export default function RandofyContent() {
  const { spotifyClient } = useSpotifyContext();

  function showItem() {
    if (spotifyClient.isLoading) return <Loading />;
    else if (spotifyClient.currentSongs.length !== 0) return <SongList />;
    return <GhostList />;
  }
  return (
    <>
      <GenerateButton spotifyClient={spotifyClient} />
      <div className="content-container">{showItem()}</div>
    </>
  );
}
