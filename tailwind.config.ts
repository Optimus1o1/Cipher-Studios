import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        ink: {
          DEFAULT: "#0F1013",
          light: "#16171B",
          dark: "#08080A",
          surface: "rgba(22, 23, 27, 0.65)",
        },
        bone: {
          DEFAULT: "#F2EFE8",
          muted: "rgba(242, 239, 232, 0.72)",
          subtle: "rgba(242, 239, 232, 0.12)",
        },
        copper: {
          DEFAULT: "#E0A45C",
          hover: "#E8B06D",
          active: "#D4954A",
          muted: "rgba(224, 164, 92, 0.16)",
          glow: "rgba(224, 164, 92, 0.35)",
        },
        slate: {
          dark: "#8B9099",
          light: "#5E636B",
        },
        glass: {
          border: "rgba(255, 255, 255, 0.12)",
          "border-light": "rgba(255, 255, 255, 0.35)",
          bg: "rgba(22, 22, 24, 0.46)",
          "bg-light": "rgba(255, 255, 255, 0.62)",
        },
      },
      fontFamily: {
        heading: ["var(--font-space-grotesk)", "sans-serif"],
        body: ["var(--font-manrope)", "sans-serif"],
        mono: ["var(--font-space-grotesk)", "monospace"],
      },
      borderRadius: {
        "glass-sm": "16px",
        glass: "24px",
        "glass-lg": "32px",
      },
      backdropBlur: {
        "glass-sm": "8px",
        glass: "18px",
        "glass-lg": "32px",
      },
      boxShadow: {
        glass: "0 24px 60px -24px rgba(0,0,0,0.45)",
        "glass-sm": "0 12px 30px -12px rgba(0,0,0,0.35)",
        "glass-hover": "0 28px 70px -20px rgba(0,0,0,0.55)",
        "copper-glow": "0 0 40px -10px rgba(224, 164, 92, 0.45)",
      },
      animation: {
        "drift-slow": "drift 30s ease-in-out infinite alternate",
        "pulse-subtle": "subtlePulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite",
      },
      keyframes: {
        drift: {
          "0%": { transform: "translate(0px, 0px) scale(1)" },
          "100%": { transform: "translate(20px, 15px) scale(1.03)" },
        },
        subtlePulse: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.82" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
