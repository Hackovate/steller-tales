// Clear cache script for Stellar Tales
// This helps resolve Service Worker caching issues

if ('serviceWorker' in navigator) {
  // Unregister all service workers
  navigator.serviceWorker.getRegistrations().then(function(registrations) {
    for(let registration of registrations) {
      registration.unregister();
    }
  });
}

// Clear all caches
if ('caches' in window) {
  caches.keys().then(function(cacheNames) {
    return Promise.all(
      cacheNames.map(function(cacheName) {
        return caches.delete(cacheName);
      })
    );
  }).then(function() {
    console.log('All caches cleared successfully');
    // Reload the page
    window.location.reload(true);
  });
} else {
  // Fallback: force reload
  window.location.reload(true);
}
