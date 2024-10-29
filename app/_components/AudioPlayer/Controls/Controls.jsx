import styles from "./Controls.module.scss";
import { Pause, Play } from "lucide-react";

export default function Controls({ isPlaying, playAudio }) {
  return (
    <div className={styles["controls-container"]}>
      <button
        id={styles["control-btn"]}
        className="icon-btn"
        onClick={playAudio}
      >
        {isPlaying ? (
          <Pause fill="#1c1c1c" width={28} height={28} />
        ) : (
          <Play fill="#1c1c1c" width={28} height={28} />
        )}
      </button>
    </div>
  );
}
