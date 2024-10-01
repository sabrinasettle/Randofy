"use client";
import { useState } from "react";
import styles from "../Bottom.module.scss";

export default function Information() {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <button
      id={styles["information-btn"]}
      className="btn btn__overlay"
      onClick={() => setIsOpen(!isOpen)}
    >
      Icon
    </button>
  );
}
