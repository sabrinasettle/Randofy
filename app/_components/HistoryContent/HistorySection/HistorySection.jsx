"use client";
import { useState } from "react";
import SongCard from "../../SongCard/SongCard";
import { ChevronUp, ChevronDown } from "lucide-react";
import styles from "../History.module.scss";

export default function HistorySection({ date, songs, openSongDetails }) {
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

  function setSong(song) {
    openSongDetails(song);
  }

  // To Do
  // Animate the date getting bigger as the user scrolls
  //  // add listener to scroll
  // animate the close and open of the section
  // Fix Ordering of the list
  // Change the string of today's date to today
  //

  return (
    <li className={styles["history-list-item"]}>
      <div className={styles["section-header"]}>
        <h2>{date}</h2>
        <button className={styles[`header-btn`]} onClick={toggleSection}>
          {isOpen ? <ChevronUp /> : <ChevronDown />}
        </button>
      </div>
      {isOpen && (
        <ul className={styles["list-group"]}>
          {/* newest song first */}
          {songs.reverse().map((song, index) => (
            // set size to 168
            <div onClick={() => setSong(song)}>
              <SongCard
                song={song}
                index={index}
                scrollTo={scrollTo}
                songIsActive={songIsActive}
                key={`song ` + `${song.track_name}`}
                size={189}
              />
            </div>
          ))}
        </ul>
      )}
    </li>
  );
}
