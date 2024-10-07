"use client";
import { useState } from "react";
import styles from "../Bottom.module.scss";

export default function History() {
  const [isOpen, setIsOpen] = useState(false);
  const [isActive, setIsActive] = useState(false);

  function openModal() {
    setIsOpen(!isOpen);
    setIsActive(!isActive);
  }

  return (
    <>
      <button
        id={styles["history-btn"]}
        className={
          !isActive
            ? `btn btn__overlay btn__center text-sm`
            : `btn btn__overlay btn__active btn__center text-sm`
        }
        onClick={() => setIsActive(!isActive)}
      >
        History
      </button>
      {isOpen && <div></div>}
    </>
  );
}
