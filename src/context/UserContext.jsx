import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';

const UserContext = createContext();

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};

export const UserProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [userCoins, setUserCoins] = useState(100);
  const [currentLanguage, setCurrentLanguage] = useState('en');
  const [completedStories, setCompletedStories] = useState([]);
  const [achievements, setAchievements] = useState([]);
  const [streakDays, setStreakDays] = useState(0);

  // Load user data from localStorage on mount
  useEffect(() => {
    const savedUser = localStorage.getItem('stellarTalesUser');
    if (savedUser) {
      const userData = JSON.parse(savedUser);
      setCurrentUser(userData);
      setUserCoins(userData.coins || 100);
      setCurrentLanguage(userData.language || 'en');
      setCompletedStories(userData.completedStories || []);
      setAchievements(userData.achievements || []);
      setStreakDays(userData.streakDays || 0);
    }
  }, []);

  // Save user data to localStorage whenever it changes
  useEffect(() => {
    if (currentUser) {
      const userData = {
        ...currentUser,
        coins: userCoins,
        language: currentLanguage,
        completedStories,
        achievements,
        streakDays,
        lastLogin: new Date().toISOString()
      };
      localStorage.setItem('stellarTalesUser', JSON.stringify(userData));
    }
  }, [currentUser, userCoins, currentLanguage, completedStories, achievements, streakDays]);

  const createUser = useCallback((userData) => {
    const newUser = {
      ...userData,
      id: Date.now(),
      createdAt: new Date().toISOString(),
      level: 'beginner',
      coins: 100
    };
    setCurrentUser(newUser);
    setUserCoins(100);
    setCurrentLanguage(userData.language || 'en');
  }, []);

  const updateUserCoins = useCallback((amount) => {
    setUserCoins(prev => Math.max(0, prev + amount));
  }, []);

  const addCompletedStory = useCallback((storyId) => {
    setCompletedStories(prev => {
      if (!prev.includes(storyId)) {
        updateUserCoins(20); // Reward for completing story
        return [...prev, storyId];
      }
      return prev;
    });
  }, [updateUserCoins]);

  const addAchievement = useCallback((achievement) => {
    setAchievements(prev => {
      if (!prev.some(a => a.id === achievement.id)) {
        updateUserCoins(achievement.reward || 50);
        return [...prev, { ...achievement, unlockedAt: new Date().toISOString() }];
      }
      return prev;
    });
  }, [updateUserCoins]);

  const logout = useCallback(() => {
    setCurrentUser(null);
    setUserCoins(100);
    setCurrentLanguage('en');
    setCompletedStories([]);
    setAchievements([]);
    setStreakDays(0);
    localStorage.removeItem('stellarTalesUser');
  }, []);

  const value = useMemo(() => ({
    currentUser,
    userCoins,
    currentLanguage,
    completedStories,
    achievements,
    streakDays,
    createUser,
    updateUserCoins,
    addCompletedStory,
    addAchievement,
    setCurrentLanguage,
    logout
  }), [
    currentUser,
    userCoins,
    currentLanguage,
    completedStories,
    achievements,
    streakDays,
    createUser,
    updateUserCoins,
    addCompletedStory,
    addAchievement,
    logout
  ]);

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
};