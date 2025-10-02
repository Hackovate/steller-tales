// NASA API integration for authentic space weather data

const runtimeKey = typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_NASA_API_KEY;
const NASA_API_KEY = runtimeKey || 'Lfarxv8KlKxfthMk26VjKhSLCKyVRYaTV7BOCZa8';

// Use Vite dev proxy locally to avoid CORS
const isDev = typeof window !== 'undefined' && window.location && window.location.hostname === 'localhost';
const BASE_URL = isDev ? '/nasa' : 'https://api.nasa.gov';
// NASA Images API already supports CORS. Call it directly to avoid proxy 404s.
const IMAGES_BASE = 'https://images-api.nasa.gov';

// DONKI (Space Weather Database Of Notifications, Knowledge, Information)
const DONKI_BASE = `${BASE_URL}/DONKI`;

export class NASASpaceWeatherAPI {
  constructor(apiKey = NASA_API_KEY) {
    this.apiKey = apiKey;
  }

  // Astronomy Picture of the Day (for header/credit)
  async getAPOD({ cacheMinutes = 0 } = {}) {
    try {
      const url = `${BASE_URL}/planetary/apod?api_key=${this.apiKey}`;
      const cached = this.readCache(url, cacheMinutes);
      if (cached) return cached;
      const res = await fetch(url, { cache: 'no-cache' });
      if (!res.ok) {
        if (res.status === 429) {
          console.log('NASA API rate limited, using fallback');
          return { title: 'Astronomy Picture', explanation: '', url: 'https://apod.nasa.gov/apod/image/1901/OrionAlone_Harshaw_960.jpg' };
        }
        throw new Error('APOD fetch failed');
      }
      const data = await res.json();
      this.writeCache(url, data);
      return data;
    } catch (e) {
      return { title: 'Astronomy Picture', explanation: '', url: 'https://apod.nasa.gov/apod/image/1901/OrionAlone_Harshaw_960.jpg' };
    }
  }

  // NASA Images and Video Library search
  async searchImages({ q, page = 1, cacheMinutes = 0 }) {
    try {
      const params = new URLSearchParams({ q, media_type: 'image,video', page: String(page) });
      const url = `${IMAGES_BASE}/search?${params.toString()}`;
      const cached = this.readCache(url, cacheMinutes);
      if (cached) return cached;
      const res = await fetch(url, { cache: 'no-cache' });
      if (!res.ok) {
        if (res.status === 404) {
          console.log('NASA Images API not found, using fallback');
          return { collection: { items: [] } };
        }
        throw new Error('Images search failed');
      }
      const data = await res.json();
      this.writeCache(url, data);
      return data;
    } catch (e) {
      console.log('NASA Images API error, using fallback');
      return { collection: { items: [] } };
    }
  }

  // Simple localStorage cache to avoid burning rate limits
  readCache(key, maxAgeMinutes) {
    try {
      if (!maxAgeMinutes) return null;
      const raw = localStorage.getItem(`cache:${key}`);
      if (!raw) return null;
      const { t, v } = JSON.parse(raw);
      if (Date.now() - t > maxAgeMinutes * 60 * 1000) return null;
      return v;
    } catch { return null; }
  }

  writeCache(key, value) {
    try {
      localStorage.setItem(`cache:${key}`, JSON.stringify({ t: Date.now(), v: value }));
    } catch {}
  }

  // Helper method to parse and validate dates
  parseValidDate(dateString) {
    if (!dateString) return null;
    
    const date = new Date(dateString);
    // Check if the date is valid
    if (isNaN(date.getTime())) {
      console.warn('Invalid date string:', dateString);
      return null;
    }
    
    return date;
  }

  // Get solar flare events
  async getSolarFlares(startDate = null, endDate = null) {
    try {
      const start = startDate || new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
      const end = endDate || new Date().toISOString().split('T')[0];
      const url = `${DONKI_BASE}/FLR?startDate=${start}&endDate=${end}&api_key=${this.apiKey}`;
      const cached = this.readCache(url, 15);
      if (cached) return cached;
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error('Failed to fetch solar flare data');
      }
      
      const data = await response.json();
      const processed = this.processFlareData(data);
      this.writeCache(url, processed);
      return processed;
    } catch (error) {
      console.error('Error fetching solar flares:', error);
      return this.getMockFlareData();
    }
  }

  // Get coronal mass ejection events
  async getCoronalMassEjections(startDate = null, endDate = null) {
    try {
      const start = startDate || new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
      const end = endDate || new Date().toISOString().split('T')[0];
      const url = `${DONKI_BASE}/CME?startDate=${start}&endDate=${end}&api_key=${this.apiKey}`;
      const cached = this.readCache(url, 15);
      if (cached) return cached;
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error('Failed to fetch CME data');
      }
      
      const data = await response.json();
      const processed = this.processCMEData(data);
      this.writeCache(url, processed);
      return processed;
    } catch (error) {
      console.error('Error fetching CMEs:', error);
      return this.getMockCMEData();
    }
  }

  // Get geomagnetic storm predictions
  async getGeomagneticStorms(startDate = null, endDate = null) {
    try {
      const start = startDate || new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
      const end = endDate || new Date().toISOString().split('T')[0];
      const url = `${DONKI_BASE}/GST?startDate=${start}&endDate=${end}&api_key=${this.apiKey}`;
      const cached = this.readCache(url, 15);
      if (cached) return cached;
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error('Failed to fetch geomagnetic storm data');
      }
      
      const data = await response.json();
      const processed = this.processStormData(data);
      this.writeCache(url, processed);
      return processed;
    } catch (error) {
      console.error('Error fetching storms:', error);
      return this.getMockStormData();
    }
  }

  // Solar Energetic Particles (SEP) events
  async getSEPs(startDate = null, endDate = null) {
    try {
      const start = startDate || new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
      const end = endDate || new Date().toISOString().split('T')[0];
      const url = `${DONKI_BASE}/SEP?startDate=${start}&endDate=${end}&api_key=${this.apiKey}`;
      const cached = this.readCache(url, 15);
      if (cached) return cached;
      const response = await fetch(url);
      if (!response.ok) throw new Error('Failed to fetch SEP data');
      const data = await response.json();
      if (!Array.isArray(data)) return [];
      const processed = data.slice(0, 5).map((e) => {
        const eventTime = this.parseValidDate(e.eventTime);
        return {
          id: e.sepID,
          date: eventTime ? eventTime.toISOString() : new Date().toISOString(),
          childFriendlyExplanation: 'A burst of speedy particles from the Sun zoomed through space!'
        };
      });
      this.writeCache(url, processed);
      return processed;
    } catch (e) {
      return [];
    }
  }

  // Get comprehensive space weather summary
  async getSpaceWeatherSummary() {
    try {
      const [flares, cmes, storms] = await Promise.all([
        this.getSolarFlares(),
        this.getCoronalMassEjections(),
        this.getGeomagneticStorms()
      ]);

      return {
        summary: this.generateSummary(flares, cmes, storms),
        solarActivity: flares,
        coronalMassEjections: cmes,
        geomagneticStorms: storms,
        lastUpdated: new Date().toISOString(),
        alertLevel: this.calculateAlertLevel(flares, cmes, storms)
      };
    } catch (error) {
      console.error('Error fetching space weather summary:', error);
      return this.getMockSpaceWeatherData();
    }
  }

  // Process and simplify flare data for children
  processFlareData(rawData) {
    if (!Array.isArray(rawData)) return [];
    
    return rawData.slice(0, 5).map(flare => {
      const beginTime = this.parseValidDate(flare.beginTime);
      const peakTime = this.parseValidDate(flare.peakTime);
      
      return {
        id: flare.flrID,
        date: beginTime ? beginTime.toISOString() : new Date().toISOString(),
        intensity: flare.classType,
        description: this.getFlareDescription(flare.classType),
        peakTime: peakTime ? peakTime.toISOString() : beginTime ? beginTime.toISOString() : new Date().toISOString(),
        childFriendlyExplanation: this.getChildFriendlyFlareExplanation(flare.classType)
      };
    });
  }

  processCMEData(rawData) {
    if (!Array.isArray(rawData)) return [];
    
    return rawData.slice(0, 3).map(cme => {
      const startTime = this.parseValidDate(cme.startTime);
      
      return {
        id: cme.activityID,
        date: startTime ? startTime.toISOString() : new Date().toISOString(),
        speed: cme.cmeAnalyses?.[0]?.speed || 'Unknown',
        direction: cme.cmeAnalyses?.[0]?.latitude || 'Unknown',
        description: this.getCMEDescription(cme.cmeAnalyses?.[0]?.speed),
        childFriendlyExplanation: this.getChildFriendlyCMEExplanation()
      };
    });
  }

  processStormData(rawData) {
    if (!Array.isArray(rawData)) return [];
    
    return rawData.slice(0, 3).map(storm => {
      const startTime = this.parseValidDate(storm.startTime);
      
      return {
        id: storm.gstID,
        date: startTime ? startTime.toISOString() : new Date().toISOString(),
        kpIndex: storm.allKpIndex?.[0]?.kpIndex || 'Unknown',
        description: this.getStormDescription(storm.allKpIndex?.[0]?.kpIndex),
        childFriendlyExplanation: this.getChildFriendlyStormExplanation(storm.allKpIndex?.[0]?.kpIndex)
      };
    });
  }

  // Generate child-friendly descriptions
  getFlareDescription(classType) {
    const flareDescriptions = {
      'A': 'Very small solar hiccup 😴',
      'B': 'Small solar burp 😊',
      'C': 'Medium solar sneeze 🤧',
      'M': 'Big solar shout 📢',
      'X': 'Huge solar roar! 🦁'
    };
    
    const firstLetter = classType?.charAt(0) || 'A';
    return flareDescriptions[firstLetter] || 'Solar activity detected';
  }

  getChildFriendlyFlareExplanation(classType) {
    return `The Sun just had a ${this.getFlareDescription(classType)}! Solar flares are like the Sun sneezing energy into space. Don't worry - Earth's atmosphere protects us!`;
  }

  getChildFriendlyCMEExplanation() {
    return 'A Coronal Mass Ejection is like the Sun blowing a big bubble of particles into space! If it comes toward Earth, it might create beautiful auroras!';
  }

  getChildFriendlyStormExplanation(kpIndex) {
    if (kpIndex >= 5) {
      return 'There\'s a magnetic storm happening! This might make the Northern Lights extra bright and colorful tonight! 🌈';
    }
    return 'Earth\'s magnetic field is staying calm and protecting us from space weather! 🛡️';
  }

  // New: descriptions used by EventsTimeline processors
  getCMEDescription(speed) {
    const v = parseInt(speed || 0, 10);
    if (v >= 1500) return 'Very fast CME — could cause strong geomagnetic effects.';
    if (v >= 800) return 'Moderate-speed CME — auroras possible at higher latitudes.';
    if (v > 0) return 'Slow CME — limited Earth impact expected.';
    return 'CME detected.';
  }

  getStormDescription(kpIndex) {
    const kp = parseInt(kpIndex || 0, 10);
    if (kp >= 7) return 'Strong geomagnetic storm — widespread auroras possible.';
    if (kp >= 5) return 'Moderate geomagnetic storm — auroras likely in northern areas.';
    if (kp >= 3) return 'Quiet to unsettled conditions.';
    return 'Very quiet geomagnetic field.';
  }

  calculateAlertLevel(flares, cmes, storms) {
    let score = 0;
    
    // Check for X-class flares
    if (flares.some(f => f.intensity?.startsWith('X'))) score += 3;
    // Check for M-class flares
    else if (flares.some(f => f.intensity?.startsWith('M'))) score += 2;
    
    // Check for fast CMEs
    if (cmes.some(c => parseInt(c.speed) > 1000)) score += 2;
    
    // Check for strong storms
    if (storms.some(s => parseInt(s.kpIndex) >= 6)) score += 3;
    
    if (score >= 5) return { level: 'high', color: 'accent-orange', emoji: '🔥' };
    if (score >= 3) return { level: 'moderate', color: 'accent-yellow', emoji: '⚡' };
    return { level: 'low', color: 'accent-blue', emoji: '🌌' };
  }

  generateSummary(flares, cmes, storms) {
    const totalEvents = flares.length + cmes.length + storms.length;
    
    if (totalEvents === 0) {
      return 'Space weather is very quiet today! Perfect time to learn about what makes space weather exciting! ✨';
    }
    
    if (totalEvents >= 5) {
      return 'Wow! Space is very active today with lots of solar events! Great time to see how the Sun affects Earth! 🌟';
    }
    
    return `There are ${totalEvents} space weather events happening. The Sun is moderately active! 🌞`;
  }

  // Fallback mock data when API is unavailable
  getMockSpaceWeatherData() {
    return {
      summary: 'Using sample space weather data for demonstration! 🚀',
      solarActivity: [
        {
          id: 'mock-1',
          date: new Date().toLocaleDateString(),
          intensity: 'C1.2',
          description: 'Medium solar sneeze 🤧',
          childFriendlyExplanation: 'The Sun just had a medium solar sneeze! Solar flares are like the Sun sneezing energy into space.'
        }
      ],
      coronalMassEjections: [],
      geomagneticStorms: [],
      lastUpdated: new Date().toISOString(),
      alertLevel: { level: 'low', color: 'accent-blue', emoji: '🌌' }
    };
  }

  getMockFlareData() {
    return [
      {
        id: 'mock-flare-1',
        date: new Date().toLocaleDateString(),
        intensity: 'C5.4',
        description: 'Medium solar sneeze 🤧',
        childFriendlyExplanation: 'The Sun just sneezed some energy into space! Don\'t worry, Earth\'s atmosphere keeps us safe!'
      }
    ];
  }

  getMockCMEData() {
    return [];
  }

  getMockStormData() {
    return [];
  }
}

// Create singleton instance
export const nasaAPI = new NASASpaceWeatherAPI();

// Export utility functions
export const formatSpaceWeatherForKids = (data) => {
  if (!data) return null;
  
  return {
    todaysHighlight: data.summary,
    funFacts: [
      'Did you know the Sun is so big that 1 million Earths could fit inside it? ☀️',
      'Solar wind travels at about 1 million miles per hour! That\'s super fast! 💨',
      'The Northern Lights happen when solar particles dance with Earth\'s magnetic field! 💃'
    ],
    safetyMessage: 'Don\'t worry! Earth\'s atmosphere and magnetic field protect us from space weather! 🛡️',
    alertLevel: data.alertLevel
  };
};