"use client";
import { useState } from "react";
import { ChevronUp, ChevronDown } from "lucide-react";
import styles from "../History.module.scss";
import CardGrid from "../../CardGrid/CardGrid";
// import { useGridContext } from "../../../context/card-layout-context";

export default function HistorySection({ date, songs }) {
  const [isOpen, setIsOpen] = useState(true);

  function toggleSection() {
    setIsOpen(!isOpen);
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
      {isOpen && <CardGrid songs={songs} />}
    </li>
  );
}
