// Lazy data loading utility to improve initial page load performance
import { wikiEntries } from '../data/wikiEntries';
import { spaceWeatherTrivia } from '../data/spaceWeatherTrivia';
import { translations } from '../utils/translations';

// Cache for loaded data
const dataCache = new Map();

// Lazy load functions
export const lazyLoadWikiEntries = async () => {
  if (dataCache.has('wikiEntries')) {
    return dataCache.get('wikiEntries');
  }
  
  // Simulate async loading (in real app, this could be an API call)
  const data = await new Promise(resolve => {
    setTimeout(() => resolve(wikiEntries), 0);
  });
  
  dataCache.set('wikiEntries', data);
  return data;
};

export const lazyLoadSpaceWeatherTrivia = async () => {
  if (dataCache.has('spaceWeatherTrivia')) {
    return dataCache.get('spaceWeatherTrivia');
  }
  
  const data = await new Promise(resolve => {
    setTimeout(() => resolve(spaceWeatherTrivia), 0);
  });
  
  dataCache.set('spaceWeatherTrivia', data);
  return data;
};

export const lazyLoadTranslations = async () => {
  if (dataCache.has('translations')) {
    return dataCache.get('translations');
  }
  
  const data = await new Promise(resolve => {
    setTimeout(() => resolve(translations), 0);
  });
  
  dataCache.set('translations', data);
  return data;
};

// Preload critical data
export const preloadCriticalData = async () => {
  const promises = [
    lazyLoadWikiEntries(),
    lazyLoadSpaceWeatherTrivia(),
    lazyLoadTranslations()
  ];
  
  await Promise.all(promises);
};

// Clear cache if needed
export const clearDataCache = () => {
  dataCache.clear();
};
