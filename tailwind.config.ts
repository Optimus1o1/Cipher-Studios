import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        bg: {
          DEFAULT: '#05060d',
          dark: '#05060d',
          surface: '#0b0d18',
          subtle: '#121526',
          light: '#f7f7f9',
        },
        ink: {
          DEFAULT: '#eceef4',
          bone: '#f2efe8',
          light: '#07080f',
          muted: '#8e95aa',
        },
        mute: {
          DEFAULT: '#8e95aa',
          dark: '#8e95aa',
          light: '#5e6475',
        },
        accent: {
          DEFAULT: '#d8c3a0', // Warm Gold / Moon light
          copper: '#e0a45c', // Copper brand accent
          hover: '#c4ad88',
        },
        line: {
          DEFAULT: 'rgba(236, 238, 244, 0.11)',
          dark: 'rgba(236, 238, 244, 0.11)',
          light: 'rgba(15, 16, 19, 0.08)',
        },
        veil: {
          DEFAULT: 'rgba(5, 6, 13, 0.82)',
          deep: 'rgba(5, 6, 13, 0.94)',
        },
        glass: {
          DEFAULT: 'rgba(255, 255, 255, 0.06)',
          light: 'rgba(255, 255, 255, 0.65)',
          dark: 'rgba(11, 13, 24, 0.62)',
          border: 'rgba(236, 238, 244, 0.14)',
          borderLight: 'rgba(255, 255, 255, 0.35)',
        },
      },
      fontFamily: {
        serif: ['var(--font-fraunces)', 'Fraunces', 'Georgia', 'serif'],
        sans: ['var(--font-inter)', 'Inter', 'system-ui', '-apple-system', 'Segoe UI', 'sans-serif'],
        manrope: ['var(--font-manrope)', 'Manrope', 'system-ui', '-apple-system', 'Segoe UI', 'sans-serif'],
        mono: ['var(--font-mono)', 'JetBrains Mono', 'ui-monospace', 'monospace'],
      },
      borderRadius: {
        input: '12px',
        card: '24px',
        glass: '24px',
        pill: '9999px',
      },
      boxShadow: {
        glass: '0 24px 60px -24px rgba(0, 0, 0, 0.45)',
        glow: '0 0 40px -10px rgba(216, 195, 160, 0.25)',
      },
      backdropBlur: {
        glass: '18px',
        'glass-sm': '8px',
        'glass-lg': '32px',
      },
      maxWidth: {
        content: '1100px',
        editorial: '1240px',
      },
      screens: {
        sm: '640px',
        md: '860px', // matching prototype blueprint breakpoint
        lg: '1024px',
        xl: '1280px',
      },
    },
  },
  plugins: [],
};

export default config;
