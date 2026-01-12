import { useStyleContext } from "../../../context/style-context.js";
import { useMusicContext } from "../../../context/music-context.js";
import { Eye } from "lucide-react";
import Tooltip from "../../ui/ToolTip.jsx";

export default function OpenDetailsButton() {
  const { isMobile } = useStyleContext();
  const { musicContext } = useMusicContext();
  const buttonStyle = `hover:bg-gray-100 border border-transparent hover:border-gray-200 hover:text-gray-700 text-gray-600 p-2 rounded-sm ${!isMobile ? "h-[42px] w-[42px]" : "h-[48px] w-[48px]"}`;
  const eyeIconHeight = isMobile ? 32 : 24;

  return (
    <div className="text-gray-600">
      <Tooltip text="See Details">
        <button
          id="share-song"
          onClick={musicContext.openDetails}
          className={`${buttonStyle}`}
        >
          <Eye width={eyeIconHeight} height={eyeIconHeight} />
        </button>
      </Tooltip>
    </div>
  );
}
