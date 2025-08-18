import { useEffect, useState, useRef } from "react";

export default function ProgressBar({
  isPlaying,
  currentTime,
  setCurrentTime,
  onSongEnd,
  audioRef, // Add audioRef prop
}) {
  const duration = 29;
  const [isDragging, setIsDragging] = useState(false);
  const progressBarRef = useRef(null);

  useEffect(() => {
    // Only run the interval if `isPlaying` is true and not dragging
    if (isPlaying && !isDragging) {
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
  }, [isPlaying, duration, setCurrentTime, onSongEnd, isDragging]);

  const progressPercent = (currentTime / duration) * 100;

  const calculateTimeFromPosition = (clientX) => {
    if (!progressBarRef.current) return 0;
    const rect = progressBarRef.current.getBoundingClientRect();
    const clickX = clientX - rect.left;
    const width = rect.width;
    const newTime = Math.max(
      0,
      Math.min(duration, (clickX / width) * duration),
    );
    return Math.floor(newTime);
  };

  const handleMouseDown = (e) => {
    setIsDragging(true);
    const newTime = calculateTimeFromPosition(e.clientX);
    setCurrentTime(newTime);
    // Seek audio to new position
    if (audioRef?.current) {
      audioRef.current.currentTime = newTime;
    }
  };

  const handleMouseMove = (e) => {
    if (isDragging) {
      const newTime = calculateTimeFromPosition(e.clientX);
      setCurrentTime(newTime);
      // Seek audio to new position while dragging
      if (audioRef?.current) {
        audioRef.current.currentTime = newTime;
      }
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Add global mouse events when dragging
  useEffect(() => {
    if (isDragging) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);

      return () => {
        document.removeEventListener("mousemove", handleMouseMove);
        document.removeEventListener("mouseup", handleMouseUp);
      };
    }
  }, [isDragging]);

  return (
    <div
      id="progress-bar-container"
      className="flex items-center gap-3 text-gray-600 w-full"
    >
      <span className="text-sm md:text-xs font-mono min-w-[32px]">
        0:{String(currentTime).padStart(2, "0")}
      </span>

      {/* Progress Bar */}
      <div
        ref={progressBarRef}
        className="relative flex-1 h-1 bg-gray-200 rounded-full cursor-pointer group"
        onMouseDown={handleMouseDown}
      >
        {/* Background track */}
        <div className="absolute inset-0 bg-gray-200 rounded-full" />

        {/* Progress fill */}
        <div
          className="absolute top-0 left-0 h-full bg-gray-500 rounded-full transition-all duration-75 ease-out"
          style={{ width: `${progressPercent}%` }}
        />

        {/* Thumb */}
        <div
          className={`absolute top-1/2 w-3 h-3 bg-gray-700 rounded-full border-2 border-white shadow-md transform -translate-y-1/2 -translate-x-1/2 transition-opacity duration-75 ${
            isDragging || progressPercent > 0
              ? "opacity-100"
              : "opacity-0 group-hover:opacity-100"
          }`}
          style={{ left: `${progressPercent}%` }}
        />
      </div>

      <span className="text-sm md:text-xs font-mono min-w-[32px]">0:30</span>
    </div>
  );
}
