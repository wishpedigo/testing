import { defineConfig } from 'vite';
import { resolve } from 'path';
import react from '@vitejs/plugin-react';
import dts from 'vite-plugin-dts';

export default defineConfig({
  plugins: [react(), dts()],
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name: 'WishlabsFirebase',
      fileName: 'index',
      formats: ['es', 'cjs']
    },
    rollupOptions: {
      external: ['firebase/app', 'firebase/auth', 'firebase/firestore', 'firebase/analytics'],
      output: {
        globals: {
          'firebase/app': 'firebase',
          'firebase/auth': 'firebase.auth',
          'firebase/firestore': 'firebase.firestore',
          'firebase/analytics': 'firebase.analytics'
        }
      }
    }
  }
});
