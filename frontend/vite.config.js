import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  define: {
    global: 'window',
  },
  preview: {
    host: true, // bind ra 0.0.0.0
    port: 4173, // có thể để bất kỳ port nào Render cấp
    allowedHosts: ['bookstore-7ryn.onrender.com'] // thêm domain Render
  }
});
