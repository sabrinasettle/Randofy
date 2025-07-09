import { useSongViewContext } from "../../../context/song-view-context.js";
import { useToast } from "../../../context/toast-context";
import Tooltip from "../../ui/ToolTip.jsx";
import { Share2, Plus, Eye } from "lucide-react";

export default function ShareButton({ song }) {
  const { songViewContext } = useSongViewContext();
  const { showToast } = useToast();
  // const [isCopied, setIsCopied] = useState(false);

  const isMobile = songViewContext.isMobile;

  const buttonStyle = `hover:bg-gray-100 border border-transparent hover:border-gray-200 hover:text-gray-700 text-gray-600 p-2 rounded-sm ${!isMobile ? "h-[42px] w-[42px]" : "h-[48px] w-[48px]"}`;
  const shareIconHeight = isMobile ? 28 : 20;

  const handleCopy = () => {
    navigator.clipboard.writeText(`https://randofy.com/songs/${song.id}`);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <Tooltip text="Share song">
      <button id="share-song" className={`${buttonStyle}`}>
        <Share2 width={shareIconHeight} height={shareIconHeight} />
      </button>
    </Tooltip>
  );
}
