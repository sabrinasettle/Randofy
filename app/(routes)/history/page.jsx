import HistoryContent from "../../_components/HistoryContent/HistoryContent";
import { SpotifyClientProvider } from "../../context/spotify-context";
import { CardLayoutProvider } from "../../context/card-layout-context";
import InformationLink from "../../_components/InformationLink";

export default function History() {
  return (
    <>
      <SpotifyClientProvider>
        <CardLayoutProvider>
          <HistoryContent />
        </CardLayoutProvider>
      </SpotifyClientProvider>
      <InformationLink />
    </>
  );
}
