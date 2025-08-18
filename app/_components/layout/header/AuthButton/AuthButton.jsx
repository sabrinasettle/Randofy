import { useSpotifyContext } from "../../../../context/spotify-context";

export default function AuthButton() {
  const { spotifyClient } = useSpotifyContext();
  const { spotifyUser, isLoading } = spotifyClient;
  // console.log(spotifyUser);

  // const buttonCn =
  //   "bg-gray-100 text-gray-700 px-2 py-1 rounded-sm border border-transparent hover:border-gray-200 transition-all duration-400 ease-in-out";

  const buttonCn =
    "font-body bg-gray-100 text-body-md text-gray-700 px-2 py-1 rounded-sm border border-transparent hover:border-gray-400 transition-all duration-400 ease-in-out";

  const handleClickAction = () => {
    if (spotifyUser) {
      spotifyClient.logoutRequest();
    } else {
      spotifyClient.loginRequest();
    }
  };

  // if (spotifyUser) {
  //   return (
  //     <button onClick={() => handleClickAction()} className={buttonCn}>
  //       Sign Out
  //     </button>
  //   );
  // }

  const btnText = spotifyUser ? "Sign Out" : "Connect with Spotify";

  return (
    <button
      onClick={() => handleClickAction()}
      className={buttonCn}
      disabled={isLoading}
    >
      {isLoading ? "Loading..." : btnText}
    </button>
  );
}
