const APP_CACHE = 'stellar-tales-app-v4';
const RUNTIME_CACHE = 'stellar-tales-runtime-v4';
const DASHBOARD_CACHE = 'stellar-tales-dashboard-v4';
const VISUAL_CACHE = 'stellar-tales-visual-v4';

// Cache durations in milliseconds
const CACHE_DURATIONS = {
  DASHBOARD: 5 * 60 * 1000, // 5 minutes
  PAGES: 60 * 60 * 1000, // 60 minutes
  VISUAL: 60 * 60 * 1000, // 60 minutes
  STATIC: 24 * 60 * 60 * 1000, // 24 hours
  API: 10 * 60 * 1000 // 10 minutes
};

const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/logo.svg'
];

// Precache core shell
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(APP_CACHE).then((cache) => 
      cache.addAll(STATIC_ASSETS).catch((error) => {
        // Continue even if some assets fail
      })
    )
  );
  self.skipWaiting();
});

// Clean old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys.map((key) => {
          if (![APP_CACHE, RUNTIME_CACHE, DASHBOARD_CACHE, VISUAL_CACHE].includes(key)) {
            return caches.delete(key);
          }
        })
      )
    ).then(() => self.clients.claim())
  );
});

// Helper function to check if cache is still valid
const isCacheValid = (cachedResponse, maxAge) => {
  if (!cachedResponse) return false;
  const cachedTime = cachedResponse.headers.get('sw-cached-time');
  if (!cachedTime) return false;
  return Date.now() - parseInt(cachedTime) < maxAge;
};

// Helper function to add cache timestamp
const addCacheTimestamp = (response) => {
  const newHeaders = new Headers(response.headers);
  newHeaders.set('sw-cached-time', Date.now().toString());
  
  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers: newHeaders
  });
};

// Navigation fallback for SPA
const isNavigationRequest = (request) => request.mode === 'navigate';

// Runtime caching strategies
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Only handle http(s) requests
  if (!request.url.startsWith(self.location.origin) && !request.url.startsWith('http')) return;

  // Skip Vite development files and HMR
  if (request.url.includes('?t=') || request.url.includes('@vite') || request.url.includes('@react')) return;

  // Navigation requests - serve from cache with 60min duration
  if (isNavigationRequest(request)) {
    event.respondWith(
      caches.open(RUNTIME_CACHE).then(async (cache) => {
        const cached = await cache.match(request);
        
        if (cached && isCacheValid(cached, CACHE_DURATIONS.PAGES)) {
          return cached;
        }

        try {
          const networkResponse = await fetch(request);
          if (networkResponse.ok) {
            const responseWithTimestamp = addCacheTimestamp(networkResponse);
            cache.put(request, responseWithTimestamp.clone());
            return responseWithTimestamp;
          }
          return cached || new Response('Network error', { status: 503 });
        } catch (error) {
          return cached || caches.match('/index.html');
        }
      })
    );
    return;
  }

  // Dashboard API requests - 5 minute cache
  if (url.pathname.includes('/dashboard') || 
      request.url.includes('api.nasa.gov') || 
      request.url.includes('services.swpc.noaa.gov') ||
      request.url.includes('swpc.noaa.gov') ||
      request.url.includes('mag-1-day.json') ||
      request.url.includes('plasma-1-day.json') ||
      request.url.includes('xrays-1-day.json') ||
      request.url.includes('alerts.json') ||
      request.url.includes('notifications.json')) {
    
    
    event.respondWith(
      caches.open(DASHBOARD_CACHE).then(async (cache) => {
        const cached = await cache.match(request);
        
        if (cached && isCacheValid(cached, CACHE_DURATIONS.DASHBOARD)) {
          return cached;
        }

        try {
          const networkResponse = await fetch(request);
          if (networkResponse.ok) {
            const responseWithTimestamp = addCacheTimestamp(networkResponse);
            cache.put(request, responseWithTimestamp.clone());
            return responseWithTimestamp;
          }
          return cached || new Response('Network error', { status: 503 });
        } catch (error) {
          // Return cached data if available, otherwise return a fallback response
          if (cached) {
            return cached;
          }
          
          // Return fallback data for SWPC API calls
          if (request.url.includes('services.swpc.noaa.gov') || 
              request.url.includes('mag-1-day.json') ||
              request.url.includes('plasma-1-day.json') ||
              request.url.includes('xrays-1-day.json')) {
            
            
            // Return appropriate fallback data based on the endpoint
            let fallbackData = [];
            
            if (request.url.includes('mag-1-day.json')) {
              // Fallback for magnetic field data
              fallbackData = [
                ['time_tag', 'bx_gsm', 'by_gsm', 'bz_gsm'],
                [new Date().toISOString(), 0, 0, -2]
              ];
            } else if (request.url.includes('plasma-1-day.json')) {
              // Fallback for plasma data
              fallbackData = [
                ['time_tag', 'density', 'speed', 'temperature'],
                [new Date().toISOString(), 5, 400, 50000]
              ];
            } else if (request.url.includes('xrays-1-day.json')) {
              // Fallback for X-ray data
              fallbackData = [
                ['time_tag', 'xrsa', 'xrsb'],
                [new Date().toISOString(), 1e-7, 1e-7]
              ];
            }
            
            return new Response(JSON.stringify(fallbackData), {
              headers: { 
                'Content-Type': 'application/json',
                'sw-cached-time': Date.now().toString()
              }
            });
          }
          
          throw error;
        }
      })
    );
    return;
  }

  // Visual learning library - 60 minute cache
  if (url.pathname.includes('/wiki') || 
      url.pathname.includes('/stories') || 
      url.pathname.includes('/games') ||
      request.url.includes('images.nasa.gov')) {
    event.respondWith(
      caches.open(VISUAL_CACHE).then(async (cache) => {
        const cached = await cache.match(request);
        
        if (cached && isCacheValid(cached, CACHE_DURATIONS.VISUAL)) {
          return cached;
        }

        try {
          const networkResponse = await fetch(request);
          if (networkResponse.ok) {
            const responseWithTimestamp = addCacheTimestamp(networkResponse);
            cache.put(request, responseWithTimestamp.clone());
            return responseWithTimestamp;
          }
          return cached || new Response('Network error', { status: 503 });
        } catch (error) {
          return cached || new Response('Network error', { status: 503 });
        }
      })
    );
    return;
  }

  // Images and static assets - 24 hour cache
  if (request.destination === 'image' || 
      request.destination === 'style' || 
      request.destination === 'font' ||
      request.url.includes('.png') ||
      request.url.includes('.jpg') ||
      request.url.includes('.jpeg') ||
      request.url.includes('.webp') ||
      request.url.includes('.svg')) {
    event.respondWith(
      caches.open(RUNTIME_CACHE).then(async (cache) => {
        const cached = await cache.match(request);
        
        if (cached && isCacheValid(cached, CACHE_DURATIONS.STATIC)) {
          return cached;
        }

        try {
          const networkResponse = await fetch(request);
          if (networkResponse.ok) {
            const responseWithTimestamp = addCacheTimestamp(networkResponse);
            cache.put(request, responseWithTimestamp.clone());
            return responseWithTimestamp;
          }
          return cached || new Response('Network error', { status: 503 });
        } catch (error) {
          return cached || new Response('Network error', { status: 503 });
        }
      })
    );
    return;
  }

  // JavaScript modules and components - 60 minute cache
  if (request.url.includes('/src/') || 
      request.url.includes('.jsx') || 
      request.url.includes('.js')) {
    event.respondWith(
      caches.open(RUNTIME_CACHE).then(async (cache) => {
        const cached = await cache.match(request);
        
        if (cached && isCacheValid(cached, CACHE_DURATIONS.PAGES)) {
          return cached;
        }

        try {
          const networkResponse = await fetch(request);
          if (networkResponse.ok) {
            const responseWithTimestamp = addCacheTimestamp(networkResponse);
            cache.put(request, responseWithTimestamp.clone());
            return responseWithTimestamp;
          }
          return cached || new Response('Network error', { status: 503 });
        } catch (error) {
          return cached || new Response('Network error', { status: 503 });
        }
      })
    );
    return;
  }

  // Default: network-first with cache fallback
  event.respondWith(
    fetch(request)
      .then((response) => {
        if (response.ok) {
        const copy = response.clone();
          caches.open(RUNTIME_CACHE).then((cache) => {
            const responseWithTimestamp = addCacheTimestamp(copy);
            cache.put(request, responseWithTimestamp);
          });
        }
        return response;
      })
      .catch(() => caches.match(request))
  );
});
