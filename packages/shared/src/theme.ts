// AIM Messenger Pixel Art Theme - Sunset Edition

export const theme = {
  colors: {
    // Sunset-inspired retro palette
    background: {
      default: '#0a1128', // Dark navy blue - primary base
      paper: '#16213e',   // Slightly lighter navy
      accent: '#1e2a47',  // Medium navy
    },
    text: {
      primary: '#ffffff',   // Pure white
      secondary: '#cccccc', // Light gray
      accent: '#ff6b35',    // Orange for highlights
    },
    primary: {
      main: '#ff6b35',    // Vibrant orange - main accent
      dark: '#e55a2b',    // Darker orange
      light: '#ff8c42',   // Lighter orange
    },
    secondary: {
      main: '#c9184a',    // Deep red - secondary accent
      dark: '#a0143d',    // Darker red
      light: '#ff4365',   // Lighter red
    },
    accent: {
      orange: '#ff6b35',  // Main orange
      red: '#c9184a',     // Main red
      purple: '#9d4edd',  // Purple undertone
      green: '#06ffa5',   // Green undertone
    },
    border: {
      default: '#ff6b35', // Orange borders
      light: '#ff8c42',   // Light orange
      dark: '#e55a2b',    // Dark orange
      accent: '#c9184a',  // Red for emphasis
    },
    glow: {
      orange: '#ff6b35',
      red: '#c9184a',
      purple: '#9d4edd',
      green: '#06ffa5',
    },
  },
  spacing: {
    xs: '0.25rem',   // 4px
    sm: '0.5rem',    // 8px
    md: '1rem',      // 16px
    lg: '1.5rem',    // 24px
    xl: '2rem',      // 32px
  },
  typography: {
    fontFamily: '"Courier New", "Monaco", "Menlo", monospace',
    pixelFont: '"Press Start 2P", "Courier New", monospace',
  },
  effects: {
    glow: '0 0 10px',
    pixelBorder: '3px solid',
    retroShadow: '4px 4px 0px',
  },
};

// CSS custom properties for dynamic theming
export const cssVariables = `
  :root {
    --color-background-default: ${theme.colors.background.default};
    --color-background-paper: ${theme.colors.background.paper};
    --color-background-accent: ${theme.colors.background.accent};
    --color-text-primary: ${theme.colors.text.primary};
    --color-text-secondary: ${theme.colors.text.secondary};
    --color-text-accent: ${theme.colors.text.accent};
    --color-primary-main: ${theme.colors.primary.main};
    --color-primary-dark: ${theme.colors.primary.dark};
    --color-primary-light: ${theme.colors.primary.light};
    --color-secondary-main: ${theme.colors.secondary.main};
    --color-secondary-dark: ${theme.colors.secondary.dark};
    --color-secondary-light: ${theme.colors.secondary.light};
    --color-accent-orange: ${theme.colors.accent.orange};
    --color-accent-red: ${theme.colors.accent.red};
    --color-accent-purple: ${theme.colors.accent.purple};
    --color-accent-green: ${theme.colors.accent.green};
    --color-border-default: ${theme.colors.border.default};
    --color-border-light: ${theme.colors.border.light};
    --color-border-dark: ${theme.colors.border.dark};
    --color-border-accent: ${theme.colors.border.accent};
    --color-glow-orange: ${theme.colors.glow.orange};
    --color-glow-red: ${theme.colors.glow.red};
    --color-glow-purple: ${theme.colors.glow.purple};
    --color-glow-green: ${theme.colors.glow.green};
    --font-family: ${theme.typography.fontFamily};
    --font-family-pixel: ${theme.typography.pixelFont};
    --effect-glow: ${theme.effects.glow};
    --effect-pixel-border: ${theme.effects.pixelBorder};
    --effect-retro-shadow: ${theme.effects.retroShadow};
  }
`;