import { useSpotifyContext } from "../../context/spotify-context";

export default function GetSongsButton({ isSmall }) {
  const { spotifyClient } = useSpotifyContext();

  // bg-gray-600 border border-transparent hover:border-gray-600 hover:bg-gray-700 text-gray-000 rounded transition-colors duration-400 ease-in-out
  const classString = isSmall ? "px-3 py-2" : "px-4 py-3";
  return (
    <button
      id="__get_songs"
      className={`font-body w-full md:w-auto transition-all bg-gray-600 border border-transparent hover:border-gray-600 hover:bg-gray-700 rounded-sm duration-400 ease-in-out ${
        isSmall ? "text-heading-6" : "text-heading-5"
      } ${classString}`}
      onClick={spotifyClient.getSongs}
    >
      Get Songs
    </button>
  );
}
