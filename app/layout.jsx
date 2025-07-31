import "./global.css";
import {
  dm_mono,
  dm_sans,
  sono,
  ibm_plex_sans,
  ibm_plex_mono,
} from "./lib/fonts.js";
import Nav from "./_components/layout/header/Header";
import { SpotifyClientProvider } from "./context/spotify-context";
import { SongViewProvider } from "./context/song-view-context";
import { ToastProvider } from "./context/toast-context";
import { MusicProvider } from "./context/music-context";
import { StyleProvider } from "./context/style-context";

export const metadata = {
  title: "Randofy",
  description: "Randomize the Spotify database",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${dm_mono} ${dm_sans} ${sono} ${ibm_plex_sans} ${ibm_plex_mono}`}
    >
      <body className="overscroll-none">
        <ToastProvider>
          <StyleProvider>
            <SpotifyClientProvider>
              <MusicProvider>
                <SongViewProvider>
                  <div className="h-screen">
                    {/* AuthProvider */}
                    <Nav />
                    {children}
                  </div>
                  {/* Auth Provider */}
                </SongViewProvider>
              </MusicProvider>
            </SpotifyClientProvider>
          </StyleProvider>
        </ToastProvider>
      </body>
    </html>
  );
}
