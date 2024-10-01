"use client";
import styles from "../Bottom.module.scss";
import { useState } from "react";

// filter box is fixed, z-index 50,
// button is absolute
export default function Filter() {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <>
      {isOpen && <div className="filter-modal"></div>}
      <button
        id={styles["filter-btn"]}
        className="btn btn__overlay text-sm"
        onClick={() => setIsOpen(!isOpen)}
      >
        Filter
      </button>
    </>
  );
}
