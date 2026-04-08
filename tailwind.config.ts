import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        bone: "#e8e4de",
        abyss: "#0a0a0a",
        "surface": "#141414",
        "surface-light": "#1a1a1a",
      },
      fontFamily: {
        serif: ["Instrument Serif", "Georgia", "serif"],
        mono: ["JetBrains Mono", "monospace"],
        sans: ["Inter", "system-ui", "sans-serif"],
      },
      keyframes: {
        heartbeat: {
          "0%, 100%": { transform: "scale(1)" },
          "14%": { transform: "scale(1.02)" },
          "28%": { transform: "scale(1)" },
          "42%": { transform: "scale(1.02)" },
          "70%": { transform: "scale(1)" },
        },
        "heartbeat-fast": {
          "0%, 100%": { transform: "scale(1)" },
          "10%": { transform: "scale(1.03)" },
          "20%": { transform: "scale(1)" },
          "30%": { transform: "scale(1.03)" },
          "50%": { transform: "scale(1)" },
        },
        "pulse-glow": {
          "0%, 100%": { opacity: "0.4" },
          "50%": { opacity: "1" },
        },
        "ticker-scroll": {
          "0%": { transform: "translateY(0)" },
          "100%": { transform: "translateY(-50%)" },
        },
        "ken-burns": {
          "0%": { transform: "scale(1)" },
          "100%": { transform: "scale(1.02)" },
        },
        "fade-in-up": {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        heartbeat: "heartbeat 1.2s ease-in-out infinite",
        "heartbeat-fast": "heartbeat-fast 0.6s ease-in-out infinite",
        "pulse-glow": "pulse-glow 2s ease-in-out infinite",
        "ticker-scroll": "ticker-scroll 30s linear infinite",
        "ken-burns": "ken-burns 20s ease-in-out infinite alternate",
        "fade-in-up": "fade-in-up 0.6s ease-out forwards",
      },
    },
  },
  plugins: [],
};
export default config;
