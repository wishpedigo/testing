/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './apps/*/index.html',
    './apps/*/src/**/*.{js,ts,jsx,tsx}',
    './packages/shared/src/**/*.{js,ts,jsx,tsx}',
  ],
  darkMode: 'class', // Enable dark mode with class strategy
  theme: {
    extend: {},
  },
  plugins: [],
  // Important for MUI compatibility
  corePlugins: {
    preflight: false,
  },
}

