import "./global.css";
import Nav from "./_components/Nav.jsx";
import { hanken_grotesk } from "./utils/fonts.js";

export const metadata = {
  title: "",
  description: "",
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
