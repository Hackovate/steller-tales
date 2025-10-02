import React from 'react';
import { useLanguage } from '../context/LanguageContext';

const TriviaCard = ({ trivia, onRefresh }) => {
  const { t } = useLanguage();
  
  if (!trivia) return null;

  return (
    <div className="trivia-section animate-in fade-in slide-in-from-bottom duration-500">
      <div className="bg-gradient-to-br from-[#16213e]/95 to-[#1a1a2e]/95 backdrop-blur-md rounded-2xl p-4 border border-[#9b59b6]/30 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-[1.02]">
        <div className="text-center mb-3">
          <div className="text-3xl mb-2 animate-float">🌌</div>
        </div>
        <div className="trivia-content">
          <h3 className="text-lg font-bold text-accent-orange mb-3 text-center leading-tight">
            {trivia.title}
          </h3>
          <p className="text-text-light text-sm leading-relaxed mb-4 text-center">
            {trivia.fact}
          </p>
          <div className="trivia-footer text-center">
            <button 
              className="bg-gradient-to-r from-accent-purple to-accent-blue hover:from-accent-purple/90 hover:to-accent-blue/90 text-white px-4 py-2 rounded-lg font-semibold transition-all duration-300 hover:scale-105 hover:shadow-lg inline-flex items-center gap-2 text-sm"
              onClick={onRefresh}
            >
              <span className="text-base hover:animate-spin transition-transform duration-300">🔄</span>
              {t('newFact')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TriviaCard;