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
          // Wiki data - split large files
          if (id.includes('src/data/wikiEntries') || id.includes('src/pages/WikiPage') || id.includes('src/pages/WikiDetailPage')) {
            return 'wiki';
          }
          if (id.includes('src/data/wikiQuizzes')) {
            return 'wiki-quizzes';
          }
          // Stories data
          if (id.includes('src/pages/StoriesPage') || id.includes('src/data/stories')) {
            return 'stories';
          }
          // Dashboard components
          if (id.includes('src/pages/DashboardPage') || id.includes('src/components/TodayAtAGlance') || 
              id.includes('src/components/SolarWindGauges') || id.includes('src/components/EventsTimeline')) {
            return 'dashboard';
          }
          // Utils and helpers
          if (id.includes('src/utils/') && !id.includes('node_modules')) {
            return 'utils';
          }
          // Other node_modules
          if (id.includes('node_modules')) {
            return 'vendor-misc';
          }
        },
      },
    },
    chunkSizeWarningLimit: 500, // Reduced warning threshold
    // Enable minification
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true, // Remove console.logs in production
        drop_debugger: true,
        pure_funcs: ['console.log', 'console.info', 'console.debug'], // Remove specific console functions
        passes: 2, // Multiple passes for better compression
        unsafe: true, // Enable unsafe optimizations
        unsafe_comps: true,
        unsafe_math: true,
        unsafe_proto: true,
      },
      mangle: {
        toplevel: true, // Mangle top-level names
      },
    },
    // Enable source maps for production debugging (optional)
    sourcemap: false,
    // Optimize CSS
    cssCodeSplit: true,
    // Target modern browsers for better performance
    target: 'esnext',
    // Enable tree shaking
    treeshake: true,
    // Additional optimizations
    reportCompressedSize: false, // Disable size reporting for faster builds
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
