// import HistoryContent from "../../_components/HistoryContent/HistoryContent";
//
// new
import HistoryContent from "../../_components/history/HistoryContent";
import { SpotifyClientProvider } from "../../context/spotify-context";
import { CardLayoutProvider } from "../../context/card-layout-context";
// import InformationLink from "../../_components/layout/InformationLink";

export default function History() {
  return (
    <>
      <SpotifyClientProvider>
        <CardLayoutProvider>
          <HistoryContent />
        </CardLayoutProvider>
      </SpotifyClientProvider>
      {/* <InformationLink /> */}
    </>
  );
}
