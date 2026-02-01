import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        "p2p-blue": "#418FC5",
        "p2p-red": "#C33934",
        "p2p-light-blue": "#B4D4E9",
        "p2p-light-red": "#ECBCBA",
      },
      keyframes: {
        "slide-up": {
          "0%": { transform: "translateY(100%)" },
          "100%": { transform: "translateY(0)" },
        },
      },
      animation: {
        "slide-up": "slide-up 0.3s ease-out",
      },
      padding: {
        "safe-pt": "env(safe-area-inset-top)",
        "safe-pb": "env(safe-area-inset-bottom)",
      },
    },
  },
  plugins: [],
};
export default config;
