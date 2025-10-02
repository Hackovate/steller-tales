import React, { useEffect } from 'react';
import { useUser } from '../context/UserContext';
import { useApp } from '../context/AppContext';
import { useLanguage } from '../context/LanguageContext';
import StarsBackground from '../components/StarsBackground';
import TriviaCard from '../components/TriviaCard';
import LanguageSwitcher from '../components/LanguageSwitcher';
import FeatureShowcase from '../components/FeatureShowcase';

const HomePage = () => {
  // Updated: Removed LoginModal dependency - no longer needed
  const { currentUser } = useUser();
  const { currentTrivia, loadRandomTrivia, apod } = useApp();
  const { t } = useLanguage();

  useEffect(() => {
    if (!currentUser) {
      // Check if user is completely new (no previous sessions)
      const hasVisited = localStorage.getItem('hasVisited');
      if (!hasVisited) {
        // First-time user - just mark as visited, no modal
        localStorage.setItem('hasVisited', 'true');
      }
    }
  }, [currentUser]);


  return (
    <div className="mobile-container">
      <StarsBackground />
      <LanguageSwitcher />
      {/* <FeatureShowcase isVisible={!currentUser} /> */}
      
      {/* Main Content */}
      <div className="screen active" id="home-screen">
        <div className="home-content relative z-10 pt-2 pb-4">
          {/* Logo Section */}
          <div className="logo flex justify-center mb-4">
            <img 
              src="/logo.svg" 
              alt="Stellar Tales Logo" 
              className="logo-image w-16 h-16 drop-shadow-lg animate-spin-slow hover:scale-105 transition-all duration-300"
              onError={(e) => {
                e.target.style.display = 'none';
                e.target.nextSibling.style.display = 'block';
              }}
            />
            <span className="text-4xl">🚀</span>
          </div>

          {/* Title Section */}
          <div className="title-section text-center mb-4">
            <h1 className="text-2xl font-bold text-accent-orange mb-1 tracking-wide">
              {t('appTitle')}
            </h1>
            <div className="greeting-texts">
              <p className="text-text-light text-xs leading-relaxed">
                {currentUser
                  ? t('welcomeUser', { name: currentUser.username })
                  : t('learnSomethingNew')}
              </p>
            </div>
          </div>

          {/* Space Weather Trivia Section */}
          <div className="mb-3">
            <TriviaCard 
              trivia={currentTrivia} 
              onRefresh={loadRandomTrivia}
            />
          </div>

          {/* APOD Section */}
          {apod && (
            <div className="mb-3">
              <div className="bg-gradient-to-br from-[#16213e]/95 to-[#1a1a2e]/95 rounded-2xl p-3 border border-accent-purple/30 shadow-lg">
                <h3 className="text-lg font-bold text-accent-blue mb-2 tracking-wide">
                  {t('spaceWeatherTrivia').replace('Trivia', 'Picture of the Day 🔭')}
                </h3>
                <img src={apod.url} alt={apod.title} className="w-full h-32 object-cover rounded-xl mb-2" />
                <div className="text-text-light font-semibold text-sm mb-1 line-clamp-2">{apod.title}</div>
                <div className="text-xs text-text-gray line-clamp-2 mb-2">{apod.explanation}</div>
                {apod.hdurl && (
                  <a href={apod.hdurl} target="_blank" rel="noreferrer" className="inline-block text-xs text-accent-blue">Learn more →</a>
                )}
              </div>
            </div>
          )}

          {/* Welcome Message for Non-Logged Users */}
          {!currentUser && (
            <div className="mb-2">
              <div className="bg-gradient-to-br from-accent-purple/20 via-accent-blue/15 to-accent-cyan/20 backdrop-blur-md rounded-2xl p-3 border border-accent-purple/30 text-center shadow-2xl">
                <div className="mb-2">
                  <span className="text-3xl inline-block">🌟</span>
                </div>
                <h3 className="text-base font-bold text-accent-yellow mb-2 leading-tight">
                  {t('readyForAdventure')}
                </h3>
                <p className="text-text-light text-xs mb-3 leading-relaxed opacity-90">
                  {t('joinExplorers')}
                </p>
                <div className="flex flex-col gap-1">
                  <button
                    onClick={() => window.location.href = '/dashboard'}
                    className="bg-gradient-to-r from-accent-orange to-accent-yellow hover:from-accent-orange/90 hover:to-accent-yellow/90 text-white px-4 py-2 rounded-xl font-bold text-sm transition-all duration-300 hover:scale-105 hover:shadow-lg"
                  >
                    <span className="inline-block mr-2">🚀</span> {t('startExploring')}
                  </button>
                </div>
              </div>
            </div>
          )}


        </div>
      </div>

    </div>
  );
};

export default HomePage;