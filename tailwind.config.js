/** @type {import('tailwindcss').Config} */

export default {
  content: [
    "./app/**/*.{html,js,ts,jsx,tsx}",
    "./app/*.{html,js,ts,jsx,tsx}",
    "./app/_components/**/*.{html,js,ts,jsx,tsx}",
    "./app/(route)/**/*.{html,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        body: ["var(--font-inclusive_sans)"],
        display: ["var(--font-hanken_grotesk)"],
      },
      fontSize: {
        "heading-1": ["3rem", { lineHeight: "1.1", letterSpacing: "-0.02em" }],
        "heading-2": ["2.25rem", { lineHeight: "1.2" }],
        "heading-3": ["1.75rem", { lineHeight: "1.3" }],
        "heading-4": ["1.5rem", { lineHeight: "1.4" }],
        "heading-5": ["1.25rem", { lineHeight: "1.4" }],
        "heading-6": ["1rem", { lineHeight: "1.4" }],
        "body-lg": ["1.2rem", { lineHeight: "1.6" }],
        "body-md": ["1.1rem", { lineHeight: "1.5" }],
        "body-sm": ["1rem", { lineHeight: "1.6" }],
        caption: ["0.8rem", { lineHeight: "1.4", letterSpacing: "0.02em" }],
      },
      colors: {
        "gray-700": "#E5E5E5",
        "gray-600": "#B2B2B2",
        "gray-500": "#757575",
        "gray-400": "#5D5D5D",
        "gray-300": "#4B4B4B",
        "gray-200": "#333333",
        "gray-100": "#191919",
        "gray-000": "#0A0A0A",
      },
    },
  },
};
