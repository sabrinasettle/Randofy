"use client";
import { useState, useEffect, useMemo } from "react";
import { ChevronUp, ChevronDown } from "lucide-react";
import styles from "../History.module.scss";
import CardGrid from "../../CardGrid/CardGrid";
// import { useGridContext } from "../../../context/card-layout-context";

export default function HistorySection({ date, songs, idIndex, isActive }) {
  const [isOpen, setIsOpen] = useState(true);

  function toggleSection() {
    setIsOpen(!isOpen);
  }

  // useEffect(() => console.log("mounted"), []);

  function isToday() {
    const today = new Date();
    let dateString = today.toLocaleDateString();
    return date === dateString;
  }

  const styled = useMemo(() => {
    if (isActive) {
      return "section-header__active";
    } else {
      return "section-header";
    }
  }, [isActive]);

  // To Do
  // Animate the date getting bigger as the user scrolls
  //  // add listener to scroll
  // animate the close and open of the section
  // Add loader to view so that the user gets something

  // Change the string of today's date to today

  return (
    <li id={idIndex} className="history-list-item">
      <div id={`${idIndex}-header`} className={styled}>
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
