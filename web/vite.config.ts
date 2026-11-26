import path from 'node:path';
import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: { '@': path.resolve(import.meta.dirname, './src') },
  },
  server: {
    proxy: {
      // Forwards API calls to the Symfony API (Caddy)
      '/api': {
        target: 'https://localhost',
        changeOrigin: true,
        secure: false, // accepts Caddy's self-signed development certificate
      },
    },
  },
});
