// Utility functions for the Stellar Tales app

export const formatTimeAgo = (timestamp) => {
  const now = new Date();
  const past = new Date(timestamp);
  const diffInSeconds = Math.floor((now - past) / 1000);

  if (diffInSeconds < 60) return 'just now';
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
  return `${Math.floor(diffInSeconds / 86400)} days ago`;
};

export const calculateUserLevel = (completedStories, achievements) => {
  const totalPoints = (completedStories.length * 10) + (achievements.length * 20);
  
  if (totalPoints < 50) return { level: 'Beginner Explorer', number: 1 };
  if (totalPoints < 150) return { level: 'Space Cadet', number: 2 };
  if (totalPoints < 300) return { level: 'Stellar Navigator', number: 3 };
  if (totalPoints < 500) return { level: 'Cosmic Ranger', number: 4 };
  return { level: 'Space Master', number: 5 };
};

export const generateSpaceWeatherAlert = (data) => {
  if (!data) return null;

  if (data.solarWind > 600) {
    return {
      level: 'high',
      message: '🌟 High solar wind speeds detected! Perfect time to watch for auroras!',
      color: 'accent-orange'
    };
  }

  if (data.magneticField > 15) {
    return {
      level: 'moderate',
      message: '⚡ Increased magnetic activity! Satellite operations may be affected.',
      color: 'accent-yellow'
    };
  }

  return {
    level: 'low',
    message: '🌌 Calm space weather conditions today.',
    color: 'accent-blue'
  };
};

export const getLanguageEmoji = (languageCode) => {
  const languageEmojis = {
    'en': '🇺🇸',
    'es': '🇪🇸',
    'bn': '🇧🇩',
    'hi': '🇮🇳',
    'fr': '🇫🇷'
  };
  return languageEmojis[languageCode] || '🌍';
};

export const getCharacterEmoji = (characterId) => {
  const characterEmojis = {
    'astronaut': '👨‍🚀',
    'alien': '👽',
    'robot': '🤖'
  };
  return characterEmojis[characterId] || '👨‍🚀';
};

export const validateUsername = (username) => {
  if (!username || username.trim().length < 2) {
    return { valid: false, message: 'Username must be at least 2 characters long' };
  }
  
  if (username.length > 20) {
    return { valid: false, message: 'Username must be less than 20 characters' };
  }
  
  if (!/^[a-zA-Z0-9\s]+$/.test(username)) {
    return { valid: false, message: 'Username can only contain letters, numbers, and spaces' };
  }
  
  return { valid: true, message: 'Username is valid' };
};

export const generateRandomStars = (count = 10) => {
  return Array.from({ length: count }, (_, i) => ({
    id: i + 1,
    top: `${Math.random() * 90 + 5}%`,
    left: `${Math.random() * 90 + 5}%`,
    delay: Math.random() * 2,
    size: Math.random() * 2 + 1,
    opacity: Math.random() * 0.5 + 0.5
  }));
};

export const playNotificationSound = () => {
  // Simple notification sound using Web Audio API
  try {
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
    oscillator.frequency.setValueAtTime(600, audioContext.currentTime + 0.1);
    
    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
    
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.3);
  } catch (error) {
    console.log('Audio not available:', error);
  }
};

export const saveToLocalStorage = (key, data) => {
  try {
    localStorage.setItem(key, JSON.stringify(data));
    return true;
  } catch (error) {
    console.error('Error saving to localStorage:', error);
    return false;
  }
};

export const loadFromLocalStorage = (key, defaultValue = null) => {
  try {
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : defaultValue;
  } catch (error) {
    console.error('Error loading from localStorage:', error);
    return defaultValue;
  }
};