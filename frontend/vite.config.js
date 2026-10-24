import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    port: 5000, // open http://localhost:5000/login etc.
    proxy: { '/api': 'http://localhost:4000' },
  },
  preview: { port: 5000 },
});
