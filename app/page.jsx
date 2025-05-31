import RandofyContent from "./_components/RandofyContent/RandofyContent";
import { SpotifyClientProvider } from "./context/spotify-context";
import InformationLink from "./_components/InformationLink";

// import Bottom from "./_components/Bottom/Bottom";
// import { CardLayoutProvider } from "./context/card-layout-context";
// import Top from "./_components/Top/Top";

export default function Main() {
  return (
    <main className="flex flex-col items-center justify-center min-h-[calc(100vh-80px)] px-4">
      <SpotifyClientProvider>
        {/* <CardLayoutProvider> */}
        {/* <Top /> */}
        <RandofyContent />
        {/* <Bottom /> */}
        {/* </CardLayoutProvider> */}
      </SpotifyClientProvider>
      <InformationLink />
    </main>
  );
}
