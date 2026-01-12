import { SpotifyClientProvider } from "./context/spotify-context";
import { ToastProvider } from "./context/toast-context";
import { MusicProvider } from "./context/music-context";
import { StyleProvider } from "./context/style-context";
import { AudioProvider } from "./context/audio-context";

export default function Providers({ children }) {
  return (
    <ToastProvider>
      <StyleProvider>
        <SpotifyClientProvider>
          <MusicProvider>
            <AudioProvider>{children}</AudioProvider>
          </MusicProvider>
        </SpotifyClientProvider>
      </StyleProvider>
    </ToastProvider>
  );
}
