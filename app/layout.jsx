import "./global.css";
import { hanken_grotesk } from "./utils/fonts.js";

export const metadata = {
  title: "Randofy",
  description: "A musical expeeiment to randomize the Spotify database",
};

export default function RootLayout({ children }) {
  return (
    <html>
      <body className={`${hanken_grotesk}`}>
        <main>{children}</main>
      </body>
    </html>
  );
}
