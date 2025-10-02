const APP_CACHE = 'stellar-tales-app-v2';
const RUNTIME_CACHE = 'stellar-tales-runtime-v2';
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/logo.svg',
];

// Precache core shell
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(APP_CACHE).then((cache) => cache.addAll(STATIC_ASSETS))
  );
  self.skipWaiting();
});

// Clean old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys.map((key) => {
          if (![APP_CACHE, RUNTIME_CACHE].includes(key)) {
            return caches.delete(key);
          }
        })
      )
    ).then(() => self.clients.claim())
  );
});

// Navigation fallback for SPA
const isNavigationRequest = (request) => request.mode === 'navigate';

// Runtime caching strategies
self.addEventListener('fetch', (event) => {
  const { request } = event;

  // Only handle http(s)
  if (!request.url.startsWith(self.location.origin) && !request.url.startsWith('http')) return;

  if (isNavigationRequest(request)) {
    // App Shell: try network first, fall back to cached index.html
    event.respondWith(
      fetch(request).catch(() => caches.match('/index.html'))
    );
    return;
  }

  // Images and static assets: cache-first
  if (request.destination === 'image' || request.destination === 'style' || request.destination === 'font') {
    event.respondWith(
      caches.match(request).then((cached) => {
        if (cached) return cached;
        return fetch(request).then((response) => {
          const copy = response.clone();
          caches.open(RUNTIME_CACHE).then((cache) => cache.put(request, copy));
          return response;
        });
      })
    );
    return;
  }

  // API requests (NASA/SWPC): stale-while-revalidate
  if (request.url.includes('api.nasa.gov') || request.url.includes('services.swpc.noaa.gov')) {
    event.respondWith(
      caches.open(RUNTIME_CACHE).then(async (cache) => {
        const cached = await cache.match(request);
        const networkPromise = fetch(request)
          .then((response) => {
            if (response && response.status === 200) {
              cache.put(request, response.clone());
            }
            return response;
          })
          .catch(() => cached);
        return cached || networkPromise;
      })
    );
    return;
  }

  // Default: network-first with cache fallback
  event.respondWith(
    fetch(request)
      .then((response) => {
        const copy = response.clone();
        caches.open(RUNTIME_CACHE).then((cache) => cache.put(request, copy));
        return response;
      })
      .catch(() => caches.match(request))
  );
});