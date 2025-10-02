import React, { createContext, useContext, useState, useEffect } from 'react';
import i18n from '../i18n';
import { translations } from '../utils/translations';

const LanguageContext = createContext();

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

export const LanguageProvider = ({ children }) => {
  const [currentLanguage, setCurrentLanguage] = useState(i18n.language || 'en');

  // Sync when i18next language changes externally
  useEffect(() => {
    const handleLanguageChanged = (lng) => {
      setCurrentLanguage(lng);
      localStorage.setItem('stellarTales_language', lng);
    };
    i18n.on('languageChanged', handleLanguageChanged);
    return () => {
      i18n.off('languageChanged', handleLanguageChanged);
    };
  }, []);

  const switchLanguage = (newLanguage) => {
    if (translations[newLanguage]) {
      i18n.changeLanguage(newLanguage);
    }
  };

  const t = (key, options) => i18n.t(key, options);

  const value = {
    currentLanguage,
    switchLanguage,
    t,
    translations: translations[currentLanguage] || translations.en
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};