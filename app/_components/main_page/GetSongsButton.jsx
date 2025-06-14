import { useSpotifyContext } from "../../context/spotify-context";

export default function GetSongsButton({ isSmall }) {
  const { spotifyClient } = useSpotifyContext();

  const classString = isSmall
    ? "bg-gray-700 text-gray-000 rounded-sm px-3 py-2 text-heading-6"
    : "bg-gray-700 text-gray-000 text-heading-5 px-4 py-3 rounded-sm";
  return (
    <button
      id="__get_songs"
      className={`w-full md:w-auto transition-all duration-700 ease-in-out ${
        isSmall ? "text-sm" : "text-heading-5"
      } ${classString}`}
      onClick={spotifyClient.getSongs}
    >
      Get Songs
    </button>
  );
}
