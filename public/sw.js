const APP_CACHE = 'stellar-tales-app-v10';
const STATIC_CACHE = 'stellar-tales-static-v10';
const MEDIA_CACHE = 'stellar-tales-media-v10';
const DATA_CACHE = 'stellar-tales-data-v10';
const API_CACHE = 'stellar-tales-api-v10';

// Core shell assets to cache immediately
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/logo.svg',
  '/offline.html'
];

// Wiki images and videos to precache
const WIKI_ASSETS = [
  '/wiki/aurora/aurora.webp',
  '/wiki/aurora/Northern Lights Seen From the International Space Station.mp4',
  '/wiki/space_weather/space_weather_thumbnail.webp',
  '/wiki/space_weather/space_weather_farmers.jpg',
  '/wiki/space_weather/space-weather-forcast.webp',
  '/wiki/space_weather/space-weather-effects-esa.webp',
  '/wiki/nasa_studies/nasa-studies.webp',
  '/wiki/nasa_studies/nasa-studies1.jpg',
  '/wiki/nasa_studies/nasastudies2.webp',
  '/wiki/nasa_studies/nasa-studies3.jpg',
  '/wiki/spaceweather_mission/hermes.webp',
  '/wiki/spaceweather_mission/vigil.webp',
  '/wiki/spaceweather_mission/high_precision_pointing_cubesat.webp',
  '/wiki/cme/749832main_cme-graphic_full.webp',
  '/wiki/cme/cme.gif',
  '/wiki/cme/solarsotrmeffect-satelite.webp',
  '/wiki/solar_flare/solar-flare.webp',
  '/wiki/solar_flare/flare.gif',
  '/sunspot.webp',
  '/wiki/solar_activity/solar-activity.webp',
  '/wiki/solar_activity/solar-active-cycle.gif'
];

// Story images to precache
const STORY_ASSETS = [
  // Farmer
  '/stories/farmer/1.jpg', '/stories/farmer/2.jpg', '/stories/farmer/3.jpg',
  '/stories/farmer/4.jpg', '/stories/farmer/5.jpg', '/stories/farmer/6.jpg',
  '/stories/farmer/7.jpg', '/stories/farmer/9.jpg', '/stories/farmer/10.jpg',
  '/stories/farmer/11.jpg',
  // Fisherman
  '/stories/fisherman/1.png', '/stories/fisherman/2.png', '/stories/fisherman/3.png',
  '/stories/fisherman/4.png', '/stories/fisherman/5.png', '/stories/fisherman/6.png',
  '/stories/fisherman/7.png',
  // Astronaut
  '/stories/astronaut/1.png', '/stories/astronaut/2.png', '/stories/astronaut/3.png',
  '/stories/astronaut/4.png', '/stories/astronaut/5.png', '/stories/astronaut/6.png',
  '/stories/astronaut/7.png',
  // Scientist
  '/stories/scientist/page-1.png', '/stories/scientist/page-2.png',
  '/stories/scientist/page-3.png', '/stories/scientist/page-4.png',
  '/stories/scientist/page-5.png', '/stories/scientist/page-6.png',
  // Pilot
  '/stories/pilot/1.png', '/stories/pilot/2.png', '/stories/pilot/3.png',
  '/stories/pilot/4.png', '/stories/pilot/5.png', '/stories/pilot/6.png',
  '/stories/pilot/7.png',
  // Electrician
  '/stories/electrician/Page-1.png', '/stories/electrician/page-2.png',
  '/stories/electrician/page-3.png', '/stories/electrician/page-4.png',
  '/stories/electrician/page-5.png'
];

// Game assets to precache
const GAME_ASSETS = [
  '/particle-shooter-bgm.mp3'
  // Note: ship.svg is bundled in src/assets and will be cached as part of the JS bundle
];

// Cache durations in milliseconds
const CACHE_DURATIONS = {
  STATIC: 7 * 24 * 60 * 60 * 1000, // 7 days for static assets
  MEDIA: 30 * 24 * 60 * 60 * 1000, // 30 days for images/videos
  PAGES: 24 * 60 * 60 * 1000, // 24 hours for pages
  DATA: 3 * 60 * 60 * 1000, // 3 hours for API data
  API: 15 * 60 * 1000, // 15 minutes for API calls
};

// API endpoints to cache
const API_ENDPOINTS = [
  'https://services.swpc.noaa.gov/products/alerts.json',
  'https://services.swpc.noaa.gov/json/goes/primary/xrays-1-day.json',
  'https://services.swpc.noaa.gov/products/solar-wind/mag-1-day.json',
  'https://services.swpc.noaa.gov/products/solar-wind/plasma-1-day.json',
  'https://api.nasa.gov/planetary/apod',
  'https://services.swpc.noaa.gov/json/ovation_aurora_latest.json'
];

// Precache core shell and content for offline support
self.addEventListener('install', (event) => {
  event.waitUntil(
    Promise.all([
      // Cache core app shell
      caches.open(APP_CACHE).then((cache) => 
        cache.addAll(STATIC_ASSETS).catch(() => {})
      ),
      // Cache media content (wikis and stories)
      caches.open(MEDIA_CACHE).then((cache) => {
        // Cache in batches to avoid overwhelming the browser
        const batchSize = 10;
        const allMedia = [...WIKI_ASSETS, ...STORY_ASSETS, ...GAME_ASSETS];
        
        const cacheBatch = async (startIndex) => {
          const batch = allMedia.slice(startIndex, startIndex + batchSize);
          if (batch.length === 0) return;
          
          try {
            await cache.addAll(batch);
          } catch {
            // Skip failed batches
          }
          
          // Continue with next batch
          if (startIndex + batchSize < allMedia.length) {
            await cacheBatch(startIndex + batchSize);
          }
        };
        
        return cacheBatch(0);
      })
    ])
  );
  self.skipWaiting();
});

// Clean old caches
self.addEventListener('activate', (event) => {
  const currentCaches = [APP_CACHE, STATIC_CACHE, MEDIA_CACHE, DATA_CACHE];
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys.map((key) => {
          if (!currentCaches.includes(key)) {
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

  // Skip Vite development files and HMR
  if (request.url.includes('?t=') || request.url.includes('@vite') || request.url.includes('@react')) {
    return;
  }

  // Handle external API calls with smart caching (NASA & NOAA)
  if (request.url.includes('api.nasa.gov') || 
      request.url.includes('services.swpc.noaa.gov') ||
      request.url.includes('swpc.noaa.gov') ||
      request.url.includes('images-api.nasa.gov')) {
    event.respondWith(
      caches.open(API_CACHE).then(async (cache) => {
        const cached = await cache.match(request);
        
        // Use shorter cache for critical real-time data
        const cacheDuration = request.url.includes('alerts') || 
                             request.url.includes('xrays') || 
                             request.url.includes('solar-wind') ? 
                             CACHE_DURATIONS.API : CACHE_DURATIONS.DATA;
        
        // Return cached if valid
        if (cached && isCacheValid(cached, cacheDuration)) {
          return cached;
        }
        
        try {
          const networkResponse = await fetch(request);
          if (networkResponse.ok && networkResponse.status === 200) {
            const responseWithTimestamp = addCacheTimestamp(networkResponse);
            cache.put(request, responseWithTimestamp.clone());
            return responseWithTimestamp;
          }
          return cached || networkResponse;
        } catch {
          return cached || new Response('API unavailable offline', { status: 503 });
        }
      })
    );
    return;
  }

  // Skip other external requests
  if (!request.url.startsWith(self.location.origin)) {
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
          // If server returns 404/500 for SPA deep links, fall back to index.html
          const fallback = await caches.match('/index.html');
          return fallback || cached || new Response('Network error', { status: 503 });
        } catch {
          return cached || caches.match('/index.html');
        }
      })
    );
    return;
  }

  // Images, videos, and media assets - cache first with long duration
  if (request.destination === 'image' || 
      request.destination === 'video' ||
      request.url.includes('.png') ||
      request.url.includes('.jpg') ||
      request.url.includes('.jpeg') ||
      request.url.includes('.webp') ||
      request.url.includes('.svg') ||
      request.url.includes('.gif') ||
      request.url.includes('.mp4') ||
      request.url.includes('/stories/') ||
      request.url.includes('/wiki/')) {
    event.respondWith(
      caches.open(MEDIA_CACHE).then(async (cache) => {
        const cached = await cache.match(request);
        
        // For media, cache-first strategy for better offline support
        if (cached) {
          // Return cached immediately, but update in background if needed
          if (!isCacheValid(cached, CACHE_DURATIONS.MEDIA)) {
            fetch(request).then((networkResponse) => {
              if (networkResponse && networkResponse.ok && networkResponse.status === 200) {
                cache.put(request, addCacheTimestamp(networkResponse));
              }
            }).catch(() => {});
          }
          return cached;
        }

        try {
          const networkResponse = await fetch(request);
          // Cache both full (200) and partial (206) responses for better media playback
          if (networkResponse.ok && (networkResponse.status === 200 || networkResponse.status === 206)) {
            const responseWithTimestamp = addCacheTimestamp(networkResponse);
            cache.put(request, responseWithTimestamp.clone());
            return responseWithTimestamp;
          }
          return cached || new Response('Media not available', { status: 503 });
        } catch {
          return cached || new Response('Offline - media not cached', { status: 503 });
        }
      })
    );
    return;
  }

  // JavaScript and CSS files - cache with updates
  if (request.destination === 'script' || 
      request.destination === 'style' ||
      request.url.includes('.css') ||
      request.url.includes('.js')) {
    event.respondWith(
      caches.open(STATIC_CACHE).then(async (cache) => {
        const cached = await cache.match(request);
        
        try {
          const networkResponse = await fetch(request);
          if (networkResponse.ok) {
            const responseWithTimestamp = addCacheTimestamp(networkResponse);
            cache.put(request, responseWithTimestamp.clone());
            return responseWithTimestamp;
          }
          return cached || networkResponse;
        } catch {
          // Offline - return cached version
          if (cached) return cached;
          throw new Error('Offline and not cached');
        }
      })
    );
    return;
  }

  // For all other requests, network first with cache fallback
  event.respondWith(
    fetch(request).then((response) => {
      // Cache successful responses for offline use (except partial responses)
      if (response.ok && response.status === 200 && request.method === 'GET') {
        const responseClone = response.clone();
        caches.open(DATA_CACHE).then((cache) => {
          cache.put(request, addCacheTimestamp(responseClone));
        });
      }
      return response;
    }).catch(() => {
      // Offline - try to return cached version
      return caches.match(request).then((cached) => {
        if (cached) return cached;
        // Return offline page for navigation requests
        if (request.mode === 'navigate') {
          return caches.match('/index.html');
        }
        throw new Error('Offline and not cached');
      });
    })
  );
});
