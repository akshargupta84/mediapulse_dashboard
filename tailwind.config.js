/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        // Warm Light aesthetic — IBM Plex Sans for body, Plex Mono for
        // tabular numbers / technical detail. Typography does the work.
        sans: ['"IBM Plex Sans"', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        mono: ['"IBM Plex Mono"', 'ui-monospace', 'monospace'],
      },
      colors: {
        // Warm paper palette. Restrained — a single terracotta accent.
        bg: '#fbfaf6',   // page background (warm cream)
        bg2: '#f5f3ec',  // inset/secondary background
        card: '#ffffff', // card surface
        line: '#e9e5d9', // default warm hairline
        line2: '#dcd8c9',// stronger warm hairline
        ink: '#1a1a1f',  // primary ink
        ink2: '#51525c', // secondary ink
        ink3: '#8b8b93', // tertiary ink / labels
        ink4: '#b8b5a8', // warm muted ink
        accent: '#b85c3a',   // terracotta — used sparingly
        accent2: '#5a7a5c',  // sage
        up: '#4a7a4c',       // positive deltas (warm green)
        down: '#b85c3a',     // negative deltas (terracotta)
        upBg: '#e8f0e8',     // positive pill background
        downBg: '#f5e7df',   // negative pill background
      },
      borderRadius: {
        none: '0',
        sm: '3px',
        DEFAULT: '6px',
        md: '6px',
        lg: '8px',
        xl: '10px',
        '2xl': '14px',
        '3xl': '18px',
        full: '9999px',
      },
      boxShadow: {
        card: '0 1px 2px rgba(26,26,31,0.03)',
        'card-hover': '0 2px 8px rgba(26,26,31,0.06)',
      },
    },
  },
  plugins: [],
}
