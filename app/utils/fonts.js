import { Hanken_Grotesk } from "next/font/google";

export const hanken_init = Hanken_Grotesk({
  weight: ["100", "200", "300", "400", "500", "600", "700"],
  subsets: ["latin"],
  variable: "--font_hanken_grotesk",
});

export const hanken_groteak = hanken_init.variable;
