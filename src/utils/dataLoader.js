// Lazy data loading utility for large data files
// This prevents large data files from being loaded until they're actually needed

// Cache for loaded data
const dataCache = new Map();

// Lazy load function that caches results
export const lazyLoadData = async (importFunc, cacheKey) => {
  // Return cached data if available
  if (dataCache.has(cacheKey)) {
    return dataCache.get(cacheKey);
  }

  try {
    // Import the data module
    const module = await importFunc();
    const data = module.default || module;
    
    // Cache the data
    dataCache.set(cacheKey, data);
    
    return data;
  } catch (error) {
    console.error(`Failed to load data for ${cacheKey}:`, error);
    throw error;
  }
};

// Preload critical data in the background
export const preloadCriticalData = async () => {
  const criticalData = [
    () => import('../data/spaceWeatherQuiz.js'),
    () => import('../data/stories.js'),
    () => import('../data/wikiEntries.js')
  ];

  // Load critical data in parallel but don't block the UI
  Promise.allSettled(criticalData.map(loader => loader())).then(results => {
    console.log('Critical data preloaded:', results.length);
  });
};

// Clear cache if needed (for memory management)
export const clearDataCache = () => {
  dataCache.clear();
};

// Get cache stats
export const getCacheStats = () => ({
  size: dataCache.size,
  keys: Array.from(dataCache.keys())
});
