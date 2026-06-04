import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig(({ mode }) => ({
  plugins: [react()],
  base: './',
  server: mode === 'development' ? {
    proxy: {
      // Proxy API requests to the backend during development so cookies are same-origin
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
        secure: false,
      },
    },
  } : undefined,
}))