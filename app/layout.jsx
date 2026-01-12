import "./global.css";
import {
  dm_mono,
  dm_sans,
  sono,
  ibm_plex_sans,
  ibm_plex_mono,
} from "./lib/fonts.js";
import Nav from "./_components/layout/header/Header";
import Providers from "./providers";

// export const metadata = {
//   title: "Randofy",
//   description: "Randomize the Spotify database",
// };

export function generateMetadata() {
  const isDarkMode =
    typeof window !== "undefined" &&
    window.matchMedia &&
    window.matchMedia("(prefers-color-scheme: dark)").matches;

  return {
    title: "Randofy",
    description: "Randomize the Spotify database",
    icons: {
      icon: isDarkMode ? "/darkThemeFavicon.png" : "/lightThemeFavicon.png",
    },
  };
}

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${dm_mono} ${dm_sans} ${sono} ${ibm_plex_sans} ${ibm_plex_mono}`}
    >
      <body className="overscroll-none">
        <Providers>
          <div className="h-screen">
            <Nav />
            {children}
          </div>
        </Providers>
      </body>
    </html>
  );
}
