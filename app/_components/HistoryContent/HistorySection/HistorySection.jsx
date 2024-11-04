"use client";
import { useState, useEffect } from "react";
import { ChevronUp, ChevronDown } from "lucide-react";
import styles from "../History.module.scss";
import CardGrid from "../../CardGrid/CardGrid";
// import { useGridContext } from "../../../context/card-layout-context";

export default function HistorySection({ date, songs }) {
  const [isOpen, setIsOpen] = useState(true);

  function toggleSection() {
    setIsOpen(!isOpen);
  }

  useEffect(() => console.log("mounted"), []);

  function isToday() {
    const today = new Date();
    let dateString = today.toLocaleDateString();
    return date === dateString;
  }

  // To Do
  // Animate the date getting bigger as the user scrolls
  //  // add listener to scroll
  // animate the close and open of the section
  // Add loader to view so that the user gets something

  // Change the string of today's date to today

  return (
    <li className={styles["history-list-item"]}>
      <div className={styles["section-header"]}>
        <div className={styles["date-selection-selector"]}>
          <h2>{isToday() ? "Today" : `${date}`}</h2>
          <button className={styles[`header-btn`]} onClick={toggleSection}>
            {isOpen ? <ChevronUp /> : <ChevronDown />}
          </button>
        </div>
        <p className={styles["list-item-song-amount"]}>{songs.length} songs</p>
      </div>
      {isOpen && <CardGrid songs={songs} />}
    </li>
  );
}
