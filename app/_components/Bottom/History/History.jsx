"use client";
import { useState } from "react";
import styles from "../Bottom.module.scss";

export default function History() {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <button
      id={styles["history-btn"]}
      className="btn btn__overlay"
      onClick={() => setIsOpen(!isOpen)}
    >
      History
    </button>
  );
}
