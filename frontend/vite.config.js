import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

// https://vite.dev/config/
export default defineConfig({
  base: './', // Relative base for universal compatibility (Localhost, Cloudflare, GitHub Pages)
  plugins: [
    react(),
    tailwindcss()
  ],
  server: {
    port: 3000,
    proxy: {
      '/api': {
        target: 'http://localhost:5050',
        changeOrigin: true
      },
      '/uploads': {
        target: 'http://localhost:5050',
        changeOrigin: true
      }
    }
  }
});
