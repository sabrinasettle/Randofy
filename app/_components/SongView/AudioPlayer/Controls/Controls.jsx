import { Pause, Play } from "lucide-react";
import Tooltip from "../../../ui/ToolTip";
import { useSongViewContext } from "../../../../context/song-view-context.js";

export default function Controls({ isPlaying, playAudio }) {
  const { songViewContext } = useSongViewContext();
  const isMobile = songViewContext.isMobile;

  const activeStyle = isPlaying ? "bg-gray-700" : "bg-gray-600";
  const heightStyle = isMobile ? "h-[56px] w-[56px]" : "h-[40px] w-[40px]";
  const iconHeight = isMobile ? 24 : 20;

  return (
    <Tooltip text={isPlaying ? "Pause" : "Play"}>
      <button
        id="control-btn"
        className={`flex justify-center items-center rounded-[200px] ${heightStyle} ${activeStyle} hover:bg-gray-700`}
        onClick={playAudio}
      >
        {isPlaying ? (
          <Pause fill="#1c1c1c" width={iconHeight} height={iconHeight} />
        ) : (
          <Play fill="#1c1c1c" width={iconHeight} height={iconHeight} />
        )}
      </button>
    </Tooltip>
  );
}
