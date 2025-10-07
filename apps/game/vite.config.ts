import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

export default defineConfig({
  plugins: [react()],
  envDir: resolve(__dirname, '../..'), // Look for .env in project root
  resolve: {
    alias: {
      '@venue/shared': resolve(__dirname, '../../packages/shared/src'),
      '@venue/firebase': resolve(__dirname, '../../packages/firebase/src'),
    },
  },
  server: {
    port: 5175,
    host: 'localhost',
  },
});

