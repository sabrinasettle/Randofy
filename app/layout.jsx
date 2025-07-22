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

export const metadata = {
  title: "Randofy",
  description: "A musical expeeiment to randomize the Spotify database",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${dm_mono} ${dm_sans} ${sono} ${ibm_plex_sans} ${ibm_plex_mono}`}
    >
      <body className="overscroll-none">
        <ToastProvider>
          <SpotifyClientProvider>
            <SongViewProvider>
              <div className="h-screen">
                {/* AuthProvider */}
                <Nav />
                {children}
              </div>
              {/* Auth Provider */}
            </SongViewProvider>
          </SpotifyClientProvider>
        </ToastProvider>
      </body>
    </html>
  );
}
