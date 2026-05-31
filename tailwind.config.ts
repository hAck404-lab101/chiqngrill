import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{js,ts,jsx,tsx,mdx}", "./components/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        charcoal: "#111111",
        smoke: "#3A2418",
        flame: "#D96B27",
        gold: "#F5B041",
        cream: "#FFF4E6",
        bone: "#E8E2D8"
      },
      boxShadow: {
        warm: "0 24px 80px rgba(217, 107, 39, 0.18)"
      }
    }
  },
  plugins: []
};

export default config;
