import RandofyContent from "./_components/RandofyContent/RandofyContent";
import Bottom from "./_components/Bottom/Bottom";
import { SpotifyClientProvider } from "./context/spotify-context";
import { CardLayoutProvider } from "./context/card-layout-context";

import Top from "./_components/Top/Top";

export default function Main() {
  return (
    <div>
      <SpotifyClientProvider>
        <CardLayoutProvider>
          <Top />
          <RandofyContent />
          {/* <Bottom /> */}
        </CardLayoutProvider>
      </SpotifyClientProvider>
    </div>
  );
}
