import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    allowedHosts: ['a0bf-122-161-241-12.ngrok-free.app'],
    proxy:{
      '/api': 'https://f38a-122-161-241-12.ngrok-free.app'
    }
  },
})
