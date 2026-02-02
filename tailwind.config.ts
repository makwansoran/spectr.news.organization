import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        bloomberg: {
          blue: '#0000ff',
          blueDark: '#0000cc',
          blueLight: '#3333ff',
        },
        globalist: {
          black: '#000000',
          white: '#ffffff',
          gray: {
            100: '#f5f5f5',
            200: '#e5e5e5',
            300: '#d4d4d4',
            400: '#a3a3a3',
            500: '#737373',
            600: '#525252',
            700: '#404040',
            800: '#262626',
            900: '#171717',
          },
        },
      },
      fontFamily: {
        sans: ['var(--font-public-sans)', 'Public Sans', 'Roboto', 'system-ui', 'sans-serif'],
        logo: ['var(--font-logo)', 'Georgia', 'Cambria', 'Times New Roman', 'serif'],
      },
      typography: {
        globalist: {
          css: {
            '--tw-prose-body': '#171717',
            '--tw-prose-headings': '#000000',
            '--tw-prose-links': '#0000ff',
            '--tw-prose-bold': '#000000',
          },
        },
      },
      gridTemplateColumns: {
        bento: 'repeat(12, minmax(0, 1fr))',
      },
      animation: {
        'ticker': 'ticker 30s linear infinite',
      },
      keyframes: {
        ticker: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
      },
    },
  },
  plugins: [],
};

export default config;
