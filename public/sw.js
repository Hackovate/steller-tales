const APP_CACHE = 'stellar-tales-app-v5';
const STATIC_CACHE = 'stellar-tales-static-v5';

// Static assets to cache
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/logo.svg'
];

// Cache durations in milliseconds
const CACHE_DURATIONS = {
  STATIC: 24 * 60 * 60 * 1000, // 24 hours for static assets
  PAGES: 60 * 60 * 1000, // 60 minutes for pages
};

// Precache core shell
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(APP_CACHE).then((cache) => 
      cache.addAll(STATIC_ASSETS).catch((error) => {
        console.log('Some assets failed to cache:', error);
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
          if (![APP_CACHE, STATIC_CACHE].includes(key)) {
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

// Simple caching strategy - only cache static assets and pages
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Only handle same-origin requests
  if (!request.url.startsWith(self.location.origin)) {
    // For external requests (APIs), just pass through without caching
    return;
  }

  // Skip Vite development files and HMR
  if (request.url.includes('?t=') || request.url.includes('@vite') || request.url.includes('@react')) {
    return;
  }

  // Skip API calls - let them go through normally
  if (url.pathname.includes('/nasa/') || 
      url.pathname.includes('/swpc/') ||
      request.url.includes('api.nasa.gov') || 
      request.url.includes('services.swpc.noaa.gov') ||
      request.url.includes('swpc.noaa.gov')) {
    return;
  }

  // Navigation requests - serve from cache with 60min duration
  if (isNavigationRequest(request)) {
    event.respondWith(
      caches.open(APP_CACHE).then(async (cache) => {
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

  // Images and static assets - 24 hour cache
  if (request.destination === 'image' || 
      request.destination === 'style' || 
      request.destination === 'font' ||
      request.url.includes('.png') ||
      request.url.includes('.jpg') ||
      request.url.includes('.jpeg') ||
      request.url.includes('.webp') ||
      request.url.includes('.svg') ||
      request.url.includes('.css') ||
      request.url.includes('.js')) {
    event.respondWith(
      caches.open(STATIC_CACHE).then(async (cache) => {
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

  // For all other requests, just pass through without caching
  return;
});
