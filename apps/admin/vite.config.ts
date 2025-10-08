import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

export default defineConfig({
  plugins: [react()],
  envDir: resolve(__dirname, '../..'), // Look for .env in project root
  server: {
    port: 5176,
    host: 'localhost',
  },
  resolve: {
    alias: {
      '@wishlabs/shared': resolve(__dirname, '../../packages/shared/src'),
      '@wishlabs/firebase': resolve(__dirname, '../../packages/firebase/src'),
      '@admin/components': resolve(__dirname, 'src/components'),
      '@admin/pages': resolve(__dirname, 'src/pages'),
      '@admin/services': resolve(__dirname, 'src/services'),
    },
  },
});
