import { useSongViewContext } from "../../../context/song-view-context.js";
import { useSpotifyContext } from "../../../context/spotify-context";
import { useToast } from "../../../context/toast-context";
import Tooltip from "../../ui/ToolTip.jsx";
import { Share2, Plus, Eye } from "lucide-react";

export default function AddSongButton({ song }) {
  const { songViewContext } = useSongViewContext();
  const { spotifyClient } = useSpotifyContext();

  const { showToast } = useToast();
  const { spotifyUser } = spotifyClient;

  const isMobile = songViewContext.isMobile;

  const buttonStyle = `hover:bg-gray-100 border border-transparent hover:border-gray-200 hover:text-gray-700 text-gray-600 p-2 rounded-sm ${!isMobile ? "h-[42px] w-[42px]" : "h-[48px] w-[48px]"}`;
  const addIconHeight = isMobile ? 32 : 24;
  const addTooltipString = spotifyUser ? "Add to Playlist" : "Login to Add";

  return (
    <Tooltip text={addTooltipString}>
      <button
        id="add-song"
        className={`${buttonStyle}`}
        disabled={spotifyUser ? false : true}
        onClick={() => {
          if (spotifyUser) {
            spotifyClient.addToPlaylist(song.track_id);
          } else {
            toast("Please log in to add songs to your playlist");
          }
        }}
      >
        {/* 44px at mobile */}
        <Plus width={addIconHeight} height={addIconHeight} />
      </button>
    </Tooltip>
  );
}
