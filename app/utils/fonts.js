import {
  Inclusive_Sans,
  Hanken_Grotesk,
  IBM_Plex_Mono,
} from "next/font/google";

export const inclusive_sans_init = Inclusive_Sans({
  weight: ["400"],
  subsets: ["latin"],
  variable: "--font-inclusive_sans",
});

export const hanken_grotesk_init = Hanken_Grotesk({
  weight: ["300", "400", "500", "600", "700"],
  subsets: ["latin"],
  variable: "--font-hanken_grotesk",
});

export const ibm_plex_mono_init = IBM_Plex_Mono({
  weight: ["100", "200", "300", "400", "500", "600", "700"],
  subsets: ["latin"],
  variable: "--font-ibm_plex_mono",
});

export const inclusive_sans = inclusive_sans_init.variable;
export const hanken_grotesk = hanken_grotesk_init.variable;
export const ibm_plex_mono = ibm_plex_mono_init.variable;
