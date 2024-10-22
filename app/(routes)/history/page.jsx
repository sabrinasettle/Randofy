import HistoryContent from "../../_components/HistoryContent/HistoryContent";
import { SpotifyClientProvider } from "../../context/spotify-context";

export default function History() {
  return (
    <SpotifyClientProvider>
      <HistoryContent />
    </SpotifyClientProvider>
  );
}
