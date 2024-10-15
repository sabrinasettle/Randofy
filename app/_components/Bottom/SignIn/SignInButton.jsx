"use client";
import styles from "../Bottom.module.scss";

export default function SignIn() {
  return (
    <button
      id={styles["sign-in-btn"]}
      className="
        btn btn__cta btn__center text-sm"

      // onClick={() => setIsActive(!isActive)}
    >
      Sign In
    </button>
  );
}
