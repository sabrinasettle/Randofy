import "./global.css";
import {
  hanken_grotesk,
  inclusive_sans,
  ibm_plex_mono,
} from "./utils/fonts.js";
import Nav from "./_components/layout/header/Header";
import { SpotifyClientProvider } from "./context/spotify-context";
import { SongViewProvider } from "./context/song-view-context";

export const metadata = {
  title: "Randofy",
  description: "A musical expeeiment to randomize the Spotify database",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${hanken_grotesk} ${inclusive_sans} ${ibm_plex_mono}`}
    >
      <SpotifyClientProvider>
        <SongViewProvider>
          <body className="overscroll-none">
            <div className="h-screen">
              {/* AuthProvider */}
              <Nav />
              {children}
            </div>
            {/* Auth Provider */}
          </body>
        </SongViewProvider>
      </SpotifyClientProvider>
    </html>
  );
}
