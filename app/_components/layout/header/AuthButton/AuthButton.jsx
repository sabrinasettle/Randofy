import { useSpotifyContext } from "../../../../context/spotify-context";

export default function AuthButton() {
  const { spotifyClient } = useSpotifyContext();
  const { spotifyUser } = spotifyClient;
  // console.log(spotifyUser);

  // const buttonCn =
  //   "bg-gray-100 text-gray-700 px-2 py-1 rounded-sm border border-transparent hover:border-gray-200 transition-all duration-400 ease-in-out";

  const buttonCn =
    "font-body bg-gray-100 text-body-md text-gray-700 px-2 py-1 rounded-sm border border-transparent hover:border-gray-400 transition-all duration-400 ease-in-out";

  if (spotifyUser) {
    return (
      <button
        onClick={() => spotifyClient.logoutRequest()}
        className={buttonCn}
      >
        Sign Out
      </button>
    );
  }

  return (
    <button onClick={() => spotifyClient.loginRequest()} className={buttonCn}>
      Connect with Spotify
    </button>
  );
}
