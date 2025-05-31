import "./global.css";
import { hanken_grotesk, inclusive_sans } from "./utils/fonts.js";

export const metadata = {
  title: "Randofy",
  description: "A musical expeeiment to randomize the Spotify database",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${hanken_grotesk} ${inclusive_sans}`}>
      <body>
        <main>{children}</main>
      </body>
    </html>
  );
}
