import RandofyContent from "./_components/RandofyContent/RandofyContent";
import Bottom from "./_components/Bottom/Bottom";
import { SpotifyClientProvider } from "./context/spotify-context";
import Top from "./_components/Top/Top";

export default function Main() {
  return (
    <div>
      <SpotifyClientProvider>
        <Top />
        <RandofyContent />
        <Bottom />
      </SpotifyClientProvider>
    </div>
  );
}
