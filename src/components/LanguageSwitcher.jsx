import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { langFlags, langNames } from '../utils/translations';

const LanguageSwitcher = () => {
  const { currentLanguage, switchLanguage } = useLanguage();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleLanguageChange = (language) => {
    switchLanguage(language);
    setIsMenuOpen(false);
  };

  return (
    <div className="language-switcher">
      <button className="lang-btn" onClick={toggleMenu}>
        <span id="current-lang-flag">{langFlags[currentLanguage]}</span>
        <span id="current-lang-code">{currentLanguage.toUpperCase()}</span>
      </button>
      
      <div className={`lang-menu ${isMenuOpen ? 'active' : ''}`}>
        {Object.keys(langFlags).map(lang => (
          <div 
            key={lang}
            className="lang-option" 
            onClick={() => handleLanguageChange(lang)}
          >
            {langFlags[lang]} {langNames[lang]}
          </div>
        ))}
      </div>
    </div>
  );
};

export default LanguageSwitcher;