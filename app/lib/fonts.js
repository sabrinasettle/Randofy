import {
  DM_Mono,
  DM_Sans,
  Sono,
  IBM_Plex_Mono,
  IBM_Plex_Sans,
} from "next/font/google";

export const dm_mono_init = DM_Mono({
  weight: ["300", "400", "500"],
  subsets: ["latin"],
  variable: "--font-dm-mono",
});

export const dm_sans_init = DM_Sans({
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  subsets: ["latin"],
  variable: "--font-dm-sans",
});

export const sono_init = Sono({
  weight: ["200", "300", "400", "500", "600", "700"],
  subsets: ["latin"],
  variable: "--font-sono",
});

export const ibm_plex_mono_init = IBM_Plex_Mono({
  weight: ["300", "400", "500"],
  subsets: ["latin"],
  variable: "--font-ibm-plex-mono",
});

export const ibm_plex_sans_init = IBM_Plex_Sans({
  weight: ["100", "200", "300", "400", "500", "600", "700"],
  subsets: ["latin"],
  variable: "--font-ibm-plex-sans",
});

export const dm_mono = dm_mono_init.variable;
export const dm_sans = dm_sans_init.variable;
export const sono = sono_init.variable;
export const ibm_plex_mono = ibm_plex_mono_init.variable;
export const ibm_plex_sans = ibm_plex_sans_init.variable;
