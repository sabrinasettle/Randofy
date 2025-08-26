import { SpotifyClientProvider } from "./context/spotify-context";
import { SongViewProvider } from "./context/song-view-context";
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
            <AudioProvider>
              <SongViewProvider>{children}</SongViewProvider>
            </AudioProvider>
          </MusicProvider>
        </SpotifyClientProvider>
      </StyleProvider>
    </ToastProvider>
  );
}
