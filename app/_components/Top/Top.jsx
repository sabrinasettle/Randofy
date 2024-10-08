// import GenerateButton from "./Generate/GenerateButton";
import SignIn from "./SignIn/SignInButton";
import Title from "./Title/Title";
import { useSpotifyContext } from "../../context/spotify-context";

const Button = () => {
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
};

export default function Top() {
  return (
    <>
      <Title />
      {/* <GenerateButton /> */}
      {/* <Button /> */}
      <SignIn />
    </>
  );
}
