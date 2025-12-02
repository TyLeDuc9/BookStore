import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
   define: {
    global: 'window', 
  },
  preview: {
    host: 'localhost',
    port: 5000,

    allowedHosts: ['bookstore-ixlc.onrender.com'], 
  },
})
