import i18next from 'i18next';
import { initReactI18next } from 'react-i18next';
import { translations } from './utils/translations';

// Convert existing translations.js shape to i18next resources
const resources = Object.keys(translations).reduce((acc, lng) => {
  acc[lng] = { translation: translations[lng] };
  return acc;
}, {});

// Persist language in localStorage key consistent with existing app
const STORAGE_KEY = 'stellarTales_language';
const savedLanguage = typeof window !== 'undefined' ? localStorage.getItem(STORAGE_KEY) : null;

i18next
  .use(initReactI18next)
  .init({
    resources,
    lng: savedLanguage && translations[savedLanguage] ? savedLanguage : 'en',
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false
    },
    returnNull: false
  });

export default i18next;


