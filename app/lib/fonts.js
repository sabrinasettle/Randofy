import { Inclusive_Sans, Hanken_Grotesk } from "next/font/google";

export const inclusive_sans_init = Inclusive_Sans({
  weight: ["300", "400", "500", "600", "700"],
  subsets: ["latin"],
  preload: "false",
  variable: "--font-inclusive_sans",
});

export const hanken_grotesk_init = Hanken_Grotesk({
  weight: ["300", "400", "500", "600", "700"],
  subsets: ["latin"],
  preload: "true",
  variable: "--font-hanken_grotesk",
});

export const inclusive_sans = inclusive_sans_init.variable;
export const hanken_grotesk = hanken_grotesk_init.variable;
