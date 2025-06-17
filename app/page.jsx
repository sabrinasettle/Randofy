import RandofyContent from "./_components/main_page/RandofyContent";
// import { SpotifyClientProvider } from "./context/spotify-context";
// import { SongViewProvider } from "./context/song-view-context";
import InformationLink from "./_components/layout/InformationLink";

// import Bottom from "./_components/Bottom/Bottom";
// import { CardLayoutProvider } from "./context/card-layout-context";
// import Top from "./_components/Top/Top";

export default function Main() {
  // min-h-[calc(100vh-80px)]
  return (
    <main className="flex flex-col items-center justify-center px-4">
      {/* <CardLayoutProvider> */}
      {/* <Top /> */}
      <RandofyContent />
      {/* <Bottom /> */}
      {/* </CardLayoutProvider> */}
      {/* </SongViewProvider>
      </SpotifyClientProvider> */}
      <InformationLink />
    </main>
  );
}
