"use client";
import { useState } from "react";
import SongCard from "../../SongCard/SongCard";

export default function HistorySection({ date, songs }) {
  const [isOpen, setIsOpen] = useState(true);
  //  {history?.[key]?.map((song, songIndex) => (
  // //     <>{song?.track_name}</>
  // //   ))}
  //

  function scrollTo() {
    console.log("scroll");
  }

  function songIsActive() {
    console.log("active");
  }

  function toggleSection() {
    setIsOpen(!isOpen);
  }

  // To Do
  // Animate the date getting bigger as the user scrolls
  // animate the close and open of the section
  // Align the list of songs card to be horiziontal

  return (
    <li>
      <h2>{date}</h2>
      <button onClick={toggleSection}>Toggle</button>
      {isOpen && (
        <ul>
          {/* newest song first */}
          {songs.reverse().map((song, index) => (
            <SongCard
              song={song}
              index={index}
              scrollTo={scrollTo}
              songIsActive={songIsActive}
            />
          ))}
        </ul>
      )}
    </li>
  );
}
