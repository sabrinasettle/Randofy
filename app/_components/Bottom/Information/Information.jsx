"use client";
import { useState } from "react";
import styles from "../Bottom.module.scss";

export default function Information() {
  const [isOpen, setIsOpen] = useState(false);
  const [isActive, setIsActive] = useState(false);
  return (
    <button
      id={styles["information-btn"]}
      className={
        !isActive
          ? `btn btn__overlay text-sm`
          : `btn btn__overlay btn__active text-sm`
      }
      onClick={() => setIsActive(!isActive)}
    >
      Icon
    </button>
  );
}
