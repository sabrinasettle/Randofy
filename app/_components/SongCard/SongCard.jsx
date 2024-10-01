"use client";
import { useState } from "react";

export default function SongCard({ title, artist, image }) {
  const [isActive, setIsActive] = useState(false);
  // becomes active on click and on scroll position
  return (
    <div className={isActive ? `song-card` : `song-card active`}>
      <div className="content">
        <img src={image} />
        <div>
          <h2 className="song-title">{title}</h2>
          <h3 className="song-artist">{artist}</h3>
        </div>
      </div>
    </div>
  );
}
