import { useState, useRef, useEffect } from "react";
import { useAudio } from "../../../context/audio-context.js";

export default function ProgressBar() {
  const { currentTime, duration, seek, setCurrentTime } = useAudio();
  const [isDragging, setIsDragging] = useState(false);
  const progressBarRef = useRef(null);

  const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0;

  const calculateTimeFromPosition = (clientX) => {
    if (!progressBarRef.current || duration === 0) return 0;
    const rect = progressBarRef.current.getBoundingClientRect();
    const clickX = clientX - rect.left;
    const width = rect.width;
    const newTime = Math.max(
      0,
      Math.min(duration, (clickX / width) * duration),
    );
    return newTime;
  };

  const handleMouseDown = (e) => {
    setIsDragging(true);
    const newTime = calculateTimeFromPosition(e.clientX);
    seek(newTime);
  };

  const handleMouseMove = (e) => {
    if (isDragging) {
      const newTime = calculateTimeFromPosition(e.clientX);
      seek(newTime);
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

  // format time helper
  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${String(seconds).padStart(2, "0")}`;
  };

  return (
    <div
      id="progress-bar-container"
      className="flex items-center gap-3 text-gray-600 w-full"
    >
      <span className="text-sm md:text-xs font-mono min-w-[32px]">
        {formatTime(currentTime)}
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

      <span className="text-sm md:text-xs font-mono min-w-[32px]">
        {formatTime(duration)}
      </span>
    </div>
  );
}
