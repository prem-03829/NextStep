import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        ink: "#050816",
        haze: "#8ec5ff",
        night: {
          sky: "#0a1224",
          road: "#1f2937",
          mist: "#7c8aa5",
          gold: "#9ec5ff",
          moon: "#f8fbff",
        },
        neon: {
          cyan: "#67e8f9",
          blue: "#60a5fa",
          purple: "#a855f7",
          pink: "#ec4899",
        },
      },
      backgroundImage: {
        "hero-grid":
          "radial-gradient(circle at center, rgba(255,255,255,0.12) 1px, transparent 1px)",
      },
      boxShadow: {
        glow: "0 0 40px rgba(103, 232, 249, 0.28)",
        card: "0 25px 70px rgba(6, 10, 24, 0.5)",
        soft: "0 20px 60px rgba(8, 13, 30, 0.38)",
      },
      fontFamily: {
        sans: ["var(--font-manrope)", "sans-serif"],
        display: ["var(--font-cormorant)", "serif"],
      },
      animation: {
        float: "float 7s ease-in-out infinite",
        pulseGlow: "pulseGlow 4s ease-in-out infinite",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-16px)" },
        },
        pulseGlow: {
          "0%, 100%": { boxShadow: "0 0 24px rgba(168, 85, 247, 0.2)" },
          "50%": { boxShadow: "0 0 56px rgba(103, 232, 249, 0.5)" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
