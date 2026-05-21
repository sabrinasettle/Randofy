import { useStyleContext } from "../../../context/style-context.js";
import { createArtists } from "../../../utils/createArtists.js";
import Tooltip from "../../ui/ToolTip.jsx";
import { Youtube } from "lucide-react";

export default function YouTubeButton({ song }) {
  const { isMobile } = useStyleContext();
  const artists = createArtists(song);
  const searchQuery = encodeURIComponent(`${song.track_name} ${artists}`);
  const youtubeHref = `https://www.youtube.com/results?search_query=${searchQuery}`;

  const buttonStyle = `hover:bg-gray-100 border border-transparent hover:border-gray-200 hover:text-gray-700 text-gray-600 p-2 rounded-sm ${!isMobile ? "h-[42px] w-[42px]" : "h-[48px] w-[48px]"}`;
  const youtubeIconHeight = isMobile ? 30 : 22;

  return (
    <Tooltip text="Open on YouTube">
      <a
        id="open-youtube"
        href={youtubeHref}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`Open ${song.track_name} by ${artists} on YouTube`}
        className={`${buttonStyle} inline-flex items-center justify-center`}
      >
        <Youtube width={youtubeIconHeight} height={youtubeIconHeight} />
      </a>
    </Tooltip>
  );
}
