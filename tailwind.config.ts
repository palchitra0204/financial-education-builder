import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        navy: {
          50: "#f0f4f9",
          100: "#e1e9f2",
          200: "#c3d3e6",
          300: "#95b3d4",
          400: "#608dc0",
          500: "#3d6fa8",
          600: "#2d5689",
          700: "#24456f",
          800: "#1e3a5c",
          900: "#0b1528",
          950: "#060c18",
        },
        fintech: {
          green: "#10b981",
          emerald: "#059669",
          cyan: "#06b6d4",
          blue: "#3b82f6",
          indigo: "#6366f1",
          violet: "#8b5cf6",
          amber: "#f59e0b",
          rose: "#f43f5e",
        },
      },
      keyframes: {
        "pulse-subtle": {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.85" },
        },
        "slide-up": {
          "0%": { transform: "translateY(10px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        "scale-in": {
          "0%": { transform: "scale(0.95)", opacity: "0" },
          "100%": { transform: "scale(1)", opacity: "1" },
        },
      },
      animation: {
        "pulse-subtle": "pulse-subtle 3s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "slide-up": "slide-up 0.3s ease-out forwards",
        "scale-in": "scale-in 0.2s ease-out forwards",
      },
    },
  },
  plugins: [],
};
export default config;
