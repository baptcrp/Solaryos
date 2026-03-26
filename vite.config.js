import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api-solaire': {
        target: 'https://api.le-systeme-solaire.net/rest',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api-solaire/, '')
      }
    }
  }
})