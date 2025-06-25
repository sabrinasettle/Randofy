import { useSpotifyContext } from "../../../../context/spotify-context";

export default function AuthButton() {
  const { spotifyClient } = useSpotifyContext();
  const { spotifyUser } = spotifyClient;
  console.log(spotifyUser);

  if (spotifyUser) {
    return (
      <button
        onClick={() => spotifyClient.logoutRequest()}
        className="bg-gray-100 text-gray-700 px-2 py-1 rounded-sm"
      >
        Sign out of Spotify
      </button>
    );
  }

  return (
    <button
      onClick={() => spotifyClient.loginRequest()}
      className="bg-gray-100 text-gray-700 px-2 py-1 rounded-sm"
    >
      Sign in to Spotify
    </button>
  );
}
