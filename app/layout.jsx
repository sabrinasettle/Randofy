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

const siteUrl = "https://randofy.vercel.app";

export const metadata = {
  metadataBase: new URL(siteUrl),
  applicationName: "Randofy",
  title: {
    default: "Randofy | Random Song Finder for Spotify",
    template: "%s | Randofy",
  },
  description:
    "Find random songs from Spotify's catalog with Randofy. Generate unexpected tracks, discover deep cuts, tune filters by genre and audio features, and save songs to a playlist.",
  keywords: [
    "random song finder",
    "random song finder spotify",
    "Spotify random song generator",
    "random Spotify songs",
    "music discovery tool",
    "discover new music",
    "Randofy",
  ],
  alternates: {
    canonical: "/",
  },
  icons: {
    icon: [
      {
        url: "/lightThemeFavicon.png",
        media: "(prefers-color-scheme: light)",
      },
      {
        url: "/darkThemeFavicon.png",
        media: "(prefers-color-scheme: dark)",
      },
    ],
  },
  openGraph: {
    title: "Randofy | Random Song Finder for Spotify",
    description:
      "Use Randofy to find random songs from Spotify's catalog, explore deep cuts, and save discoveries to a playlist.",
    url: siteUrl,
    siteName: "Randofy",
    type: "website",
    images: [
      {
        url: "/RandofyIcon - White 1.svg",
        width: 512,
        height: 512,
        alt: "Randofy logo",
      },
    ],
  },
  twitter: {
    card: "summary",
    title: "Randofy | Random Song Finder for Spotify",
    description:
      "Find random Spotify songs, tune discovery filters, and save the tracks you like.",
    images: ["/RandofyIcon - White 1.svg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
};

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
