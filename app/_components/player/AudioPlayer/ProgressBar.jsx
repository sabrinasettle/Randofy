import { useEffect } from "react";

export default function ProgressBar({
  isPlaying,
  currentTime,
  setCurrentTime,
  onSongEnd,
}) {
  const duration = 29;
  useEffect(() => {
    // Only run the interval if `isPlaying` is true
    if (isPlaying) {
      const intervalId = setInterval(() => {
        setCurrentTime((prevTime) => {
          if (prevTime >= duration) {
            clearInterval(intervalId);
            onSongEnd();
            return duration;
          }
          return prevTime + 1;
        });
      }, 1000);

      // Clear the interval when `isPlaying` changes or component unmounts
      return () => clearInterval(intervalId);
    }
  }, [isPlaying, duration]);

  const progressPercent = (currentTime / duration) * 100;
  return (
    <div className="progress-bar-container">
      <span className="text-xs">0:{String(currentTime).padStart(2, "0")}</span>
      <div className="progress-bar">
        <div
          className="progress-bar-fill"
          style={{ width: `${progressPercent}%` }}
        />
        <div className="progress-bar-background" />
      </div>
      <span className="text-xs">0:30</span>
    </div>
  );
}
