import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
base: '/firebase-pulse-chat/'
export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist',
    emptyOutDir: true,
  },
  server: {
    // Allows accessing the dev server from mobile devices on the same network
    host: true, 
  }
});
