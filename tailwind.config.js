/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './apps/*/index.html',
    './apps/*/src/**/*.{js,ts,jsx,tsx}',
    './packages/shared/src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        // Keep nested structure for reference if needed
        'sunset': {
          'navy': {
            '900': '#0a1128',
            '800': '#16213e',
            '700': '#1e2a47',
          },
          'orange': {
            '600': '#ff6b35',
            '500': '#ff8c42',
            '400': '#ffa552',
          },
          'red': {
            '600': '#c9184a',
            '500': '#ff4365',
            '400': '#ff6978',
          },
          'purple': {
            '600': '#9d4edd',
            '500': '#b565f5',
          },
          'green': {
            '600': '#06ffa5',
            '500': '#39ff14',
          },
        }
      },
      fontFamily: {
        'pixel': ['Press Start 2P', 'Courier New', 'monospace'],
        'mono': ['Courier New', 'Monaco', 'Menlo', 'monospace'],
      },
      boxShadow: {
        'pixel': '4px 4px 0px #1f2937',
        'pixel-lg': '6px 6px 0px #1f2937',
        'glow-orange': '0 0 15px #ff6b35',
        'glow-red': '0 0 15px #c9184a',
        'glow-purple': '0 0 15px #9d4edd',
        'glow-green': '0 0 15px #06ffa5',
      }
    },
  },
  plugins: [],
}

