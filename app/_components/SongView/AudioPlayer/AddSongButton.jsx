import { useState, useEffect } from "react";
import { useStyleContext } from "../../../context/style-context";
import { useSpotifyContext } from "../../../context/spotify-context";
import { useToast } from "../../../context/toast-context";
import Tooltip from "../../ui/ToolTip.jsx";
import { Plus, CheckCircleIcon } from "lucide-react";

export default function AddSongButton({ song }) {
  const { styleContext } = useStyleContext();
  const { spotifyClient } = useSpotifyContext();

  const { showToast } = useToast();
  const { spotifyUser } = spotifyClient;
  const isMobile = styleContext.isMobile;
  const [isAdded, setIsAdded] = useState(false);

  useEffect(() => {
    if (spotifyUser) {
      setIsAdded(spotifyClient.isInPlaylist(song.track_id));
    }
  }, [spotifyClient, spotifyUser, song.track_id]);

  const buttonStyle = `hover:bg-gray-100 border border-transparent hover:border-gray-200 hover:text-gray-700 text-gray-600 p-2 rounded-sm ${!isMobile ? "h-[42px] w-[42px]" : "h-[48px] w-[48px]"}`;
  const addIconHeight = isMobile ? 32 : 24;
  const addTooltipString = !isAdded
    ? spotifyUser
      ? "Add to Playlist"
      : "Login to Add"
    : "Remove from Playlist";

  return (
    <Tooltip text={addTooltipString}>
      {isAdded ? (
        <button
          id="added-song"
          className={`${buttonStyle}`}
          disabled={spotifyUser ? false : true}
          onClick={() => {
            if (spotifyUser) {
              console.log("Removing song from playlist");
              spotifyClient.removeFromPlaylist(song.track_id);
            } else {
              showToast("Please log in to remove songs to your playlist");
            }
          }}
        >
          {/* 44px at mobile */}

          <CheckCircleIcon width={addIconHeight} height={addIconHeight} />
        </button>
      ) : (
        <button
          id="add-song"
          className={`${buttonStyle}`}
          disabled={spotifyUser ? false : true}
          onClick={() => {
            if (spotifyUser) {
              spotifyClient.addToPlaylist(song.track_id);
            } else {
              showToast("Please log in to add songs to your playlist");
            }
          }}
        >
          {/* 44px at mobile */}

          <Plus width={addIconHeight} height={addIconHeight} />
        </button>
      )}
    </Tooltip>
  );
}
