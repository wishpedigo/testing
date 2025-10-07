import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

export default defineConfig({
  plugins: [react()],
  envDir: resolve(__dirname, '../..'), // Look for .env in project root
  server: {
    port: 5173,
    host: 'localhost',
  },
  // No local package aliases for production builds
});
