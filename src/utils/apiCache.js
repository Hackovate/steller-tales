// Advanced API caching utility
// Provides intelligent caching with TTL, background refresh, and request deduplication

class APICache {
  constructor() {
    this.cache = new Map();
    this.pendingRequests = new Map();
    this.defaultTTL = 5 * 60 * 1000; // 5 minutes default
  }

  // Get cached data or fetch if not available/expired
  async get(url, options = {}) {
    const {
      ttl = this.defaultTTL,
      backgroundRefresh = true,
      forceRefresh = false
    } = options;

    const cacheKey = this.getCacheKey(url, options);
    const cached = this.cache.get(cacheKey);

    // Return cached data if valid and not forcing refresh
    if (cached && !forceRefresh && this.isValid(cached, ttl)) {
      // Background refresh if enabled and data is getting stale
      if (backgroundRefresh && this.isStale(cached, ttl * 0.8)) {
        this.backgroundRefresh(url, options);
      }
      return cached.data;
    }

    // Check if request is already pending (deduplication)
    if (this.pendingRequests.has(cacheKey)) {
      return this.pendingRequests.get(cacheKey);
    }

    // Make new request
    const requestPromise = this.fetchAndCache(url, options, cacheKey);
    this.pendingRequests.set(cacheKey, requestPromise);

    try {
      const result = await requestPromise;
      return result;
    } finally {
      this.pendingRequests.delete(cacheKey);
    }
  }

  // Fetch data and cache it
  async fetchAndCache(url, options, cacheKey) {
    try {
      const response = await fetch(url, {
        ...options,
        headers: {
          'Accept': 'application/json',
          ...options.headers
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      
      // Cache the result
      this.cache.set(cacheKey, {
        data,
        timestamp: Date.now(),
        url,
        options
      });

      return data;
    } catch (error) {
      console.error(`API Cache fetch failed for ${url}:`, error);
      
      // Return stale data if available
      const cached = this.cache.get(cacheKey);
      if (cached) {
        console.warn(`Returning stale data for ${url}`);
        return cached.data;
      }
      
      throw error;
    }
  }

  // Background refresh without blocking
  async backgroundRefresh(url, options) {
    try {
      await this.fetchAndCache(url, options, this.getCacheKey(url, options));
    } catch (error) {
      console.warn(`Background refresh failed for ${url}:`, error);
    }
  }

  // Check if cached data is still valid
  isValid(cached, ttl) {
    return Date.now() - cached.timestamp < ttl;
  }

  // Check if data is getting stale (for background refresh)
  isStale(cached, staleThreshold) {
    return Date.now() - cached.timestamp > staleThreshold;
  }

  // Generate cache key
  getCacheKey(url, options) {
    const params = new URLSearchParams(options.params || {});
    return `${url}?${params.toString()}`;
  }

  // Clear cache
  clear() {
    this.cache.clear();
    this.pendingRequests.clear();
  }

  // Clear expired entries
  cleanup() {
    const now = Date.now();
    for (const [key, cached] of this.cache.entries()) {
      if (now - cached.timestamp > this.defaultTTL * 2) {
        this.cache.delete(key);
      }
    }
  }

  // Get cache stats
  getStats() {
    return {
      size: this.cache.size,
      pending: this.pendingRequests.size,
      keys: Array.from(this.cache.keys())
    };
  }
}

// Create singleton instance
export const apiCache = new APICache();

// Cleanup expired entries every 10 minutes
if (typeof window !== 'undefined') {
  setInterval(() => {
    apiCache.cleanup();
  }, 10 * 60 * 1000);
}
