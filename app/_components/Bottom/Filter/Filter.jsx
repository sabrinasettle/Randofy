"use client";
import styles from "../Bottom.module.scss";
import { useState } from "react";

// filter box is fixed, z-index 50,
// button is absolute
export default function Filter() {
  const [isOpen, setIsOpen] = useState(false);
  const [isActive, setIsActive] = useState(false);

  function handleOpen() {
    setIsActive(!isActive);
    setIsOpen(!isOpen);
  }

  return (
    <>
      {isOpen && (
        <div className={styles["filter-modal"]}>
          <div>
            <input type="range" id="volume" name="volume" min="0" max="11" />
            <label for="volume">Volume</label>
          </div>
        </div>
      )}
      <button
        id={styles["filter-btn"]}
        className={
          !isActive
            ? `btn btn__overlay text-sm`
            : `btn btn__overlay btn__active text-sm`
        }
        onClick={handleOpen}
      >
        Filter
      </button>
    </>
  );
}
