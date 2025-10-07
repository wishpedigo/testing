// CSS-based theme system

export const theme = {
  colors: {
    // Dark theme colors
    background: {
      default: '#121212',
      paper: '#1e1e1e',
    },
    text: {
      primary: '#ffffff',
      secondary: '#b3b3b3',
    },
    primary: {
      main: '#90caf9', // Light blue
      dark: '#5a9fd4',
    },
    secondary: {
      main: '#f48fb1', // Light pink
      dark: '#c2185b',
    },
    border: {
      default: '#374151', // gray-700
      light: '#4b5563',   // gray-600
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
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
  },
};

// CSS custom properties for dynamic theming
export const cssVariables = `
  :root {
    --color-background-default: ${theme.colors.background.default};
    --color-background-paper: ${theme.colors.background.paper};
    --color-text-primary: ${theme.colors.text.primary};
    --color-text-secondary: ${theme.colors.text.secondary};
    --color-primary-main: ${theme.colors.primary.main};
    --color-primary-dark: ${theme.colors.primary.dark};
    --color-secondary-main: ${theme.colors.secondary.main};
    --color-secondary-dark: ${theme.colors.secondary.dark};
    --color-border-default: ${theme.colors.border.default};
    --color-border-light: ${theme.colors.border.light};
    --font-family: ${theme.typography.fontFamily};
  }
`;