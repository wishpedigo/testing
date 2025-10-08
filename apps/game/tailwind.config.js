import { createTailwindConfig } from '@wishlabs/theme'

/** @type {import('tailwindcss').Config} */
export default createTailwindConfig([
  './index.html',
  './src/**/*.{js,ts,jsx,tsx}',
  '../../packages/shared/src/**/*.{js,ts,jsx,tsx}',
])