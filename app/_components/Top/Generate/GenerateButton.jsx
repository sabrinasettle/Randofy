import { useSpotifyContext } from "../../../context/spotify-context";

export default async function GenerateButton() {
  // isLoading disbaled?
  const { spotifyClient } = useSpotifyContext();
  async function handleClick() {
    spotifyClient.getSongs();
  }
  return (
    <button
      id="generate"
      className="btn btn__overlay btn__cta text-md"
      onClick={handleClick}
    >
      Generate Songs
    </button>
  );
}
