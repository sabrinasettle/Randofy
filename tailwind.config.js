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
        mono: ["var(--font-ibm_plex_mono)"],
      },
      fontSize: {
        "display-1": [
          "clamp(3rem, 8vw, 4rem)",
          { lineHeight: "1.0", letterSpacing: "-0.03em" },
        ],
        "display-2": [
          "clamp(2.5rem, 6vw, 3.5rem)",
          { lineHeight: "1.05", letterSpacing: "-0.025em" },
        ],
        "heading-1": [
          "clamp(2.25rem, 4vw, 3rem)",
          { lineHeight: "1.1", letterSpacing: "-0.02em" },
        ],
        "heading-2": ["clamp(1.875rem, 3.5vw, 2.25rem)", { lineHeight: "1.2" }],
        "heading-3": ["clamp(1.5rem, 3vw, 1.75rem)", { lineHeight: "1.3" }],
        "heading-4": ["clamp(1.25rem, 2.5vw, 1.5rem)", { lineHeight: "1.4" }],
        "heading-5": ["clamp(1.125rem, 2vw, 1.25rem)", { lineHeight: "1.4" }],
        "heading-6": ["clamp(1.120rem, 1.5vw, 1.20rem)", { lineHeight: "1.4" }],

        // Body text - Responsive scaling
        "body-lg": ["clamp(1.125rem, 1.5vw, 1.2rem)", { lineHeight: "1.6" }],
        "body-md": ["clamp(1rem, 1.2vw, 1.1rem)", { lineHeight: "1.5" }],
        "body-sm": ["clamp(0.875rem, 1vw, 1rem)", { lineHeight: "1.6" }],
        caption: [
          "clamp(0.75rem, 0.8vw, 0.8rem)",
          { lineHeight: "1.4", letterSpacing: "0.02em" },
        ],
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
      perspective: {
        1000: "1000px",
      },
    },
  },

  plugins: [
    function ({ addUtilities }) {
      addUtilities({
        ".perspective-1000": {
          perspective: "1000px",
        },
      });
    },
  ],
};
