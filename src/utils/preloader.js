// Resource preloader for critical assets
// This helps improve perceived performance by loading important resources early

class ResourcePreloader {
  constructor() {
    this.preloadedResources = new Set();
    this.preloadPromises = new Map();
  }

  // Preload critical data files
  async preloadCriticalData() {
    const criticalData = [
      { key: 'spaceWeatherQuiz', loader: () => import('../data/spaceWeatherQuiz.js') },
      { key: 'stories', loader: () => import('../data/stories.js') },
      { key: 'wikiEntries', loader: () => import('../data/wikiEntries.js') }
    ];

    const promises = criticalData.map(async ({ key, loader }) => {
      if (this.preloadedResources.has(key)) return;
      
      try {
        await loader();
        this.preloadedResources.add(key);
        console.log(`✅ Preloaded: ${key}`);
      } catch (error) {
        console.warn(`⚠️ Failed to preload ${key}:`, error);
      }
    });

    await Promise.allSettled(promises);
  }

  // Preload critical images
  async preloadImages(imageUrls) {
    const promises = imageUrls.map(url => {
      if (this.preloadedResources.has(url)) return Promise.resolve();
      
      return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => {
          this.preloadedResources.add(url);
          resolve();
        };
        img.onerror = reject;
        img.src = url;
      });
    });

    await Promise.allSettled(promises);
  }

  // Preload critical API data
  async preloadAPIData() {
    const apiEndpoints = [
      'https://services.swpc.noaa.gov/products/alerts.json',
      'https://services.swpc.noaa.gov/json/goes/primary/xrays-1-day.json',
      'https://api.nasa.gov/planetary/apod'
    ];

    const promises = apiEndpoints.map(async (url) => {
      if (this.preloadedResources.has(url)) return;
      
      try {
        const response = await fetch(url);
        if (response.ok) {
          this.preloadedResources.add(url);
          console.log(`✅ Preloaded API: ${url}`);
        }
      } catch (error) {
        console.warn(`⚠️ Failed to preload API ${url}:`, error);
      }
    });

    await Promise.allSettled(promises);
  }

  // Preload next page resources based on user behavior
  preloadNextPage(pageName) {
    const pageResources = {
      'wiki': () => import('../data/wikiQuizzes.js'),
      'stories': () => import('../data/stories.js'),
      'games': () => import('../components/SolarParticleShooter.jsx')
    };

    const loader = pageResources[pageName];
    if (loader && !this.preloadedResources.has(pageName)) {
      loader().then(() => {
        this.preloadedResources.add(pageName);
        console.log(`✅ Preloaded next page: ${pageName}`);
      }).catch(error => {
        console.warn(`⚠️ Failed to preload ${pageName}:`, error);
      });
    }
  }

  // Get preload status
  getStatus() {
    return {
      preloaded: Array.from(this.preloadedResources),
      count: this.preloadedResources.size
    };
  }
}

// Create singleton instance
export const resourcePreloader = new ResourcePreloader();

// Auto-preload critical resources when the module loads
if (typeof window !== 'undefined') {
  // Preload critical data after a short delay to not block initial render
  setTimeout(() => {
    resourcePreloader.preloadCriticalData();
  }, 1000);

  // Preload API data after 2 seconds
  setTimeout(() => {
    resourcePreloader.preloadAPIData();
  }, 2000);
}
