import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ['var(--font-display)', 'sans-serif'],
        body: ['var(--font-body)', 'sans-serif'],
      },
      colors: {
        accent: {
          DEFAULT: '#c8a15c',
          light: '#d9b878',
          dark: '#a67f3d',
        },
      },
    },
  },
  plugins: [],
}

export default config
