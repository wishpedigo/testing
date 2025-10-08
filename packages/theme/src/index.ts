import type { Config } from 'tailwindcss'

export const themeConfig: Config['theme'] = {
  extend: {
    colors: {
      // Primary colors - navy blue for main actions
      'primary': {
        '600': '#1e3a8a', // Navy blue
        '500': '#1e40af', // Darker navy
        '400': '#2563eb', // Medium navy
      },
      // Secondary colors - orange for secondary actions
      'secondary': {
        '600': '#ea580c', // Orange-600
        '500': '#f97316', // Orange-500
        '400': '#fb923c', // Orange-400
      },
      // Accent colors - keep the vibrant colors for warnings/attention
      'warning': {
        '600': '#ff6b35',
        '500': '#ff8c42',
        '400': '#ffa552',
      },
      'error': {
        '600': '#ea580c', // Orange instead of red
        '500': '#f97316',
        '400': '#fb923c',
      },
      'success': {
        '600': '#06ffa5',
        '500': '#39ff14',
        '400': '#4ade80',
      },
      'info': {
        '600': '#9d4edd',
        '500': '#b565f5',
        '400': '#c084fc',
      },
      // Background colors - Classic grey interface style
      'bg': {
        'primary': '#AAAAAA',    // Medium grey background
        'secondary': '#999999',  // Slightly darker grey
        'tertiary': '#888888',   // Darker grey
      },
      // Text colors for dark text on light background
      'text': {
        'primary': '#1f2937',    // Dark grey
        'secondary': '#4b5563',  // Medium grey
        'muted': '#6b7280',      // Light grey
      },
    },
    fontFamily: {
      'pixel': ['Press Start 2P', 'Courier New', 'monospace'],
      'mono': ['Courier New', 'Monaco', 'Menlo', 'monospace'],
    },
    boxShadow: {
      'pixel': '4px 4px 0px #1f2937',
      'pixel-lg': '6px 6px 0px #1f2937',
      'glow-primary': '0 0 15px #1e3a8a',
      'glow-secondary': '0 0 15px #ea580c',
      'glow-warning': '0 0 15px #ff6b35',
      'glow-error': '0 0 15px #ea580c',
      'glow-success': '0 0 15px #06ffa5',
      'glow-info': '0 0 15px #9d4edd',
      // Legacy glow effects
      'glow-orange': '0 0 15px #ff6b35',
      'glow-red': '0 0 15px #c9184a',
      'glow-purple': '0 0 15px #9d4edd',
      'glow-green': '0 0 15px #06ffa5',
    }
  },
}

export const createTailwindConfig = (content: string[]): Config => ({
  content,
  theme: themeConfig,
  plugins: [],
})
