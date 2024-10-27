import { useEffect, useState } from "react";

export default function ProgressBar({}) {
  const [currentTime, setCurrentTime] = useState(0);

  const duration = 30;
  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentTime((prevTime) => {
        if (prevTime >= duration) {
          clearInterval(intervalId);
          return duration;
        }
        return prevTime + 1;
      });
    }, 1000);

    return () => clearInterval(intervalId);
  }, [duration]);

  const progressPercent = (currentTime / duration) * 100;
  return (
    <div className="progress-bar-container">
      <span className="text-xs">00:00</span>
      <div className="progress-bar">
        <div
          className="progress-bar-fill"
          style={{ width: `${progressPercent}%` }}
        />
        <div className="progress-bar-background" />
      </div>
      <span className="text-xs">00:00</span>
    </div>
  );
}
