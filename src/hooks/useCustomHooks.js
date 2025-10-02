import { useState, useEffect } from 'react';

export const useLocalStorage = (key, initialValue) => {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  });

  const setValue = (value) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.error(`Error setting localStorage key "${key}":`, error);
    }
  };

  return [storedValue, setValue];
};

export const useTextToSpeech = () => {
  const [isSupported, setIsSupported] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);

  useEffect(() => {
    setIsSupported('speechSynthesis' in window);
  }, []);

  const speak = (text, options = {}) => {
    if (!isSupported || !text) return;

    // Stop any current speech
    speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = options.rate || 0.9;
    utterance.pitch = options.pitch || 1;
    utterance.volume = options.volume || 0.8;
    utterance.lang = options.lang || 'en-US';

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    speechSynthesis.speak(utterance);
  };

  const stop = () => {
    speechSynthesis.cancel();
    setIsSpeaking(false);
  };

  return { speak, stop, isSupported, isSpeaking };
};

export const useSpaceWeatherAPI = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchSpaceWeather = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Mock API call - replace with actual NASA API
      // const response = await fetch('https://api.nasa.gov/DONKI/FLR?api_key=DEMO_KEY');
      
      // For now, using mock data
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API delay
      
      const mockData = {
        solarWind: Math.floor(Math.random() * 400) + 300,
        magneticField: Math.floor(Math.random() * 20) + 5,
        auroralActivity: ['Low', 'Moderate', 'High'][Math.floor(Math.random() * 3)],
        kpIndex: Math.floor(Math.random() * 9),
        lastUpdated: new Date().toISOString(),
        forecast: {
          tomorrow: 'Moderate activity expected',
          dayAfter: 'Quiet conditions likely'
        }
      };
      
      setData(mockData);
    } catch (err) {
      setError('Failed to fetch space weather data');
      console.error('Space Weather API Error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSpaceWeather();
    
    // Refresh data every 30 minutes
    const interval = setInterval(fetchSpaceWeather, 30 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  return { data, loading, error, refetch: fetchSpaceWeather };
};

export const useNotifications = () => {
  const [permission, setPermission] = useState(Notification.permission);

  useEffect(() => {
    if ('Notification' in window) {
      setPermission(Notification.permission);
    }
  }, []);

  const requestPermission = async () => {
    if (!('Notification' in window)) return false;
    
    const result = await Notification.requestPermission();
    setPermission(result);
    return result === 'granted';
  };

  const sendNotification = (title, options = {}) => {
    if (permission !== 'granted') return;

    const notification = new Notification(title, {
      icon: '/logo.svg',
      badge: '/logo.svg',
      ...options
    });

    return notification;
  };

  return {
    permission,
    requestPermission,
    sendNotification,
    isSupported: 'Notification' in window
  };
};

export const useOnlineStatus = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return isOnline;
};