/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        ink: {
          950: "#080A0F",
          900: "#0B0E14",
          800: "#121722",
          700: "#1A2130",
          600: "#232C3D",
          500: "#3A4457",
        },
        paper: "#E8ECF1",
        muted: "#7C8798",
        amber: {
          400: "#FFC97A",
          500: "#FFB454",
          600: "#E89A38",
        },
        teal: {
          300: "#7FE3D8",
          400: "#4FD1C5",
          500: "#2FB6AA",
        },
      },
      fontFamily: {
        display: ["Space Grotesk", "sans-serif"],
        body: ["Inter", "sans-serif"],
        mono: ["JetBrains Mono", "monospace"],
      },
      backgroundImage: {
        "grid-pattern":
          "linear-gradient(to right, rgba(255,255,255,0.04) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.04) 1px, transparent 1px)",
      },
      backgroundSize: {
        grid: "36px 36px",
      },
      boxShadow: {
        glow: "0 0 40px -10px rgba(79, 209, 197, 0.35)",
        "glow-amber": "0 0 40px -10px rgba(255, 180, 84, 0.35)",
      },
    },
  },
  plugins: [],
};
