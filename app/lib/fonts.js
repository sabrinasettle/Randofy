import { DM_Mono, Sono } from "next/font/google";

export const dm_mono_init = DM_Mono({
  weight: ["300", "400", "500"],
  subsets: ["latin"],
  variable: "--font-dm-mono",
});

export const sono_init = Sono({
  weight: ["200", "300", "400", "500", "600", "700"],
  subsets: ["latin"],
  variable: "--font-sono",
});

export const dm_mono = dm_mono_init.variable;
export const sono = sono_init.variable;
