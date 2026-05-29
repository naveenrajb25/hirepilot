import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{js,ts,jsx,tsx}", "./components/**/*.{js,ts,jsx,tsx}", "./lib/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        navy: "#071B3A",
        ink: "#0C1222",
        trust: "#1769FF",
        skysoft: "#EAF3FF",
        saffron: "#F59E0B",
        mint: "#10B981"
      },
      boxShadow: {
        soft: "0 16px 45px rgba(7, 27, 58, 0.10)"
      }
    }
  },
  plugins: []
};

export default config;
