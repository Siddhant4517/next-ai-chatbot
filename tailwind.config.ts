import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-dm-sans)", "sans-serif"],
        display: ["var(--font-syne)", "sans-serif"],
      },
      colors: {
        surface: {
          950: "#0c0c0d",
          900: "#111113",
          800: "#1a1a1e",
          700: "#242428",
          600: "#2e2e34",
          500: "#3a3a42",
          400: "#9898a8",
        },
      },
    },
  },
  plugins: [require("@tailwindcss/typography")],
};

export default config;