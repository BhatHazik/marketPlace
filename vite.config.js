import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    allowedHosts: ['192.168.100.22:5173', '127.0.0.1:5173', 'localhost:5173'],
    proxy:{
      '/api': 'https://f38a-122-161-241-12.ngrok-free.app'
    }
  },
});