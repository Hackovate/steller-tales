import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import { spaceWeatherTrivia, getRandomTrivia } from '../data/spaceWeatherTrivia';
import { nasaAPI } from '../utils/nasaAPI';

export const AppContext = createContext();

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

export const AppProvider = ({ children }) => {
  const [currentScreen, setCurrentScreen] = useState('home');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [spaceWeatherData, setSpaceWeatherData] = useState(null);
  const [currentTrivia, setCurrentTrivia] = useState(() => getRandomTrivia());
  const [apod, setApod] = useState(null);
  const [mood, setMood] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuspenseLoading, setIsSuspenseLoading] = useState(false);

  // Load random trivia
  const loadRandomTrivia = useCallback(() => {
    const newTrivia = getRandomTrivia();
    setCurrentTrivia(newTrivia);
  }, []);

  const navigateToScreen = useCallback((screenName) => {
    setCurrentScreen(screenName);
  }, []);

  const openModal = useCallback(() => {
    setIsModalOpen(true);
  }, []);

  const closeModal = useCallback(() => {
    setIsModalOpen(false);
  }, []);

  const withLoading = useCallback(async (fn) => {
    try {
      setIsLoading(true);
      return await fn();
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Fetch space weather data and mood summary
  const fetchSpaceWeatherData = useCallback(async () => {
    return withLoading(async () => {
      try {
        const [summary, apodResp] = await Promise.all([
          nasaAPI.getSpaceWeatherSummary(),
          nasaAPI.getAPOD({ cacheMinutes: 60 })
        ]);
        setSpaceWeatherData(summary);
        setMood(summary?.alertLevel || null);
        setApod(apodResp);
      } catch (error) {
        // Silently handle errors
      }
    });
  }, [withLoading]);

  // Remove automatic API calls on app startup
  // APIs will be called only when user visits dashboard
  // useEffect(() => {
  //   fetchSpaceWeatherData();
  //   // Refresh data every 30 minutes
  //   const interval = setInterval(fetchSpaceWeatherData, 30 * 60 * 1000);
  //   return () => clearInterval(interval);
  // }, [fetchSpaceWeatherData]);

  const value = useMemo(() => ({
    currentScreen,
    isModalOpen,
    isLoading,
    isSuspenseLoading,
    spaceWeatherData,
    mood,
    apod,
    currentTrivia,
    spaceWeatherTrivia,
    navigateToScreen,
    openModal,
    closeModal,
    loadRandomTrivia,
    fetchSpaceWeatherData,
    withLoading,
    setIsSuspenseLoading
  }), [
    currentScreen,
    isModalOpen,
    isLoading,
    isSuspenseLoading,
    spaceWeatherData,
    mood,
    apod,
    currentTrivia,
    spaceWeatherTrivia,
    navigateToScreen,
    openModal,
    closeModal,
    loadRandomTrivia,
    fetchSpaceWeatherData,
    withLoading
  ]);

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};