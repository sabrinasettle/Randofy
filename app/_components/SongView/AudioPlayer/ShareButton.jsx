import { useState } from "react";
import { useStyleContext } from "../../../context/style-context.js";
import { useToast } from "../../../context/toast-context";
import { createArtists } from "../../../utils/createArtists.js";
import Tooltip from "../../ui/ToolTip.jsx";
import { Share2 } from "lucide-react";

export default function ShareButton({ song, appName = "Randofy" }) {
  const { isMobile } = useStyleContext();
  const { showToast } = useToast();
  const [isCopied, setIsCopied] = useState(false);

  const artists = createArtists(song);

  const buttonStyle = `hover:bg-gray-100 border border-transparent hover:border-gray-200 hover:text-gray-700 text-gray-600 p-2 rounded-sm ${!isMobile ? "h-[42px] w-[42px]" : "h-[48px] w-[48px]"}`;
  const shareIconHeight = isMobile ? 28 : 20;
  const text = `Take a listen: "${song.track_name}" by ${artists} — found via ${appName}`;

  const handleCopy = () => {
    showToast("Copied to clipboard");
    navigator.clipboard.writeText(text);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <Tooltip text="Share song">
      <button id="share-song" onClick={handleCopy} className={`${buttonStyle}`}>
        <Share2 width={shareIconHeight} height={shareIconHeight} />
      </button>
    </Tooltip>
  );
}
