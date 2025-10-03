import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          // Core React libraries
          if (id.includes('node_modules/react') || id.includes('node_modules/react-dom')) {
            return 'vendor-react';
          }
          // Router
          if (id.includes('node_modules/react-router')) {
            return 'vendor-router';
          }
          // i18n libraries
          if (id.includes('node_modules/i18next') || id.includes('node_modules/react-i18next')) {
            return 'vendor-i18n';
          }
          // Icons library
          if (id.includes('node_modules/react-icons')) {
            return 'vendor-icons';
          }
          // Games (lazy load separately)
          if (id.includes('src/components/SolarParticleShooter') || 
              id.includes('src/components/ShieldTheGrid') ||
              id.includes('src/components/AuroraForecastGame')) {
            return 'games';
          }
          // Quiz components
          if (id.includes('src/components/Quiz') || id.includes('src/data/spaceWeatherQuiz')) {
            return 'quizzes';
          }
          // Other node_modules
          if (id.includes('node_modules')) {
            return 'vendor-misc';
          }
        },
      },
    },
    chunkSizeWarningLimit: 1000,
    // Enable minification
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true, // Remove console.logs in production
        drop_debugger: true,
      },
    },
    // Enable source maps for production debugging (optional)
    sourcemap: false,
    // Optimize CSS
    cssCodeSplit: true,
  },
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
        configure: (proxy) => {
          proxy.on('proxyReq', (proxyReq) => {
            // Add proper headers for NASA Images API
            proxyReq.setHeader('Accept', 'application/json');
          });
        },
      },
    },
  },
})
