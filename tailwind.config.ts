import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          50: 'var(--color-primary-50)',
          100: 'var(--color-primary-100)',
          200: 'var(--color-primary-200)',
          300: 'var(--color-primary-300)',
          400: 'var(--color-primary-400)',
          500: 'var(--color-primary-500)',
          600: 'var(--color-primary-600)',
          700: 'var(--color-primary-700)',
          800: 'var(--color-primary-800)',
          900: 'var(--color-primary-900)',
        },
        secondary: {
          50: '#fafafa', 100: '#f5f5f5', 200: '#e5e5e5',
          300: '#d4d4d4', 400: '#a3a3a3', 500: '#737373',
          600: '#525252', 700: '#404040', 800: '#262626', 900: '#171717',
        },
        accent: {
          50: '#fffbeb', 100: '#fef3c7', 200: '#fde68a',
          300: '#fcd34d', 400: '#fbbf24', 500: '#f59e0b',
          600: '#d97706', 700: '#b45309', 800: '#92400e', 900: '#78350f',
        },
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        heading: ['Playfair_Display', 'ui-serif', 'Georgia', 'serif'],
      },
      container: {
        center: true,
        padding: { DEFAULT: '1rem', sm: '2rem', lg: '4rem' },
      },
    },
  },
  plugins: [],
};

export default config;