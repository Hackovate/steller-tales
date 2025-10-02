import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  define: {
    // NASA API key should be set in .env file as VITE_NASA_API_KEY
  },
  server: {
    proxy: {
      // NOAA SWPC JSON and image endpoints (avoid CORS during dev)
      '/swpc': {
        target: 'https://services.swpc.noaa.gov',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/swpc/, ''),
      },
      // NASA API (DONKI, APOD)
      '/nasa': {
        target: 'https://api.nasa.gov',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/nasa/, ''),
      },
      // NASA Images Library API
      '/nasa-images': {
        target: 'https://images-api.nasa.gov',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/nasa-images/, ''),
        configure: (proxy, options) => {
          proxy.on('proxyReq', (proxyReq, req, res) => {
            // Add proper headers for NASA Images API
            proxyReq.setHeader('Accept', 'application/json');
          });
        },
      },
    },
  },
})
