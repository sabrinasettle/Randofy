"use client";
import { useState } from "react";
import SongCard from "../../SongCard/SongCard";
import { ChevronUp, ChevronDown } from "lucide-react";
import styles from "../History.module.scss";

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
      <div className={styles[`section-header`]}>
        <h2>{date}</h2>
        <button className={styles[`header-btn`]} onClick={toggleSection}>
          {isOpen ? <ChevronUp /> : <ChevronDown />}
        </button>
      </div>
      {isOpen && (
        <ul className={styles["list-group"]}>
          {/* newest song first */}
          {songs.reverse().map((song, index) => (
            <SongCard
              song={song}
              index={index}
              scrollTo={scrollTo}
              songIsActive={songIsActive}
              key={`history ` + `${song.track_name}`}
            />
          ))}
        </ul>
      )}
    </li>
  );
}
