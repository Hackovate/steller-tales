import React, { useState } from 'react';
import { BsCoin } from 'react-icons/bs';
import { useLanguage } from '../context/LanguageContext';
import { useUser } from '../context/UserContext';

const OnboardingModal = ({ isOpen, onClose }) => {
  const { switchLanguage, t } = useLanguage();
  const { createUser } = useUser();
  const [currentPage, setCurrentPage] = useState(0);
  const [showCongrats, setShowCongrats] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    language: 'en',
    knowledgeLevel: 'beginner'
  });


  // Onboarding pages configuration
  const pages = [
    {
      id: 'welcome',
      title: t('welcomeToStellarTales'),
      subtitle: t('yourSpaceAdventureBegins')
    },
    {
      id: 'profile',
      title: t('createYourSpaceProfile'),
      subtitle: t('tellUsAboutYourself')
    }
  ];




  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };


  const nextPage = () => {
    if (currentPage < pages.length - 1) {
      setCurrentPage(currentPage + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };

  const completeOnboarding = () => {
    // Switch to selected language
    if (formData.language) {
      switchLanguage(formData.language);
    }
    
    const userData = {
      ...formData,
      coins: 150, // Welcome bonus (UserContext)
      level: formData.knowledgeLevel,
      completedOnboarding: true
    };
    
    createUser(userData);
    
    // Award 100 welcome coins to localStorage (for StoriesPage usage)
    const currentCoins = parseInt(localStorage.getItem('userCoins') || '0');
    const welcomeBonus = 50;
    localStorage.setItem('userCoins', String(currentCoins + welcomeBonus));
    
    // Show congratulations popup
    setShowCongrats(true);
  };

  const handleCloseCongrats = () => {
    setShowCongrats(false);
    onClose();
  };

  const canProceed = () => {
    switch (currentPage) {
      case 1: // Profile
        return formData.username.trim().length >= 3;
      default:
        return true;
    }
  };


  if (!isOpen) return null;

  const currentPageData = pages[currentPage];

  return (
    <div className="modal active">
      <div className="modal-content onboarding-modal flex flex-col max-h-[100dvh]">
        {/* Header */}
  <div className="onboarding-header flex-shrink-0">
          <div className="onboarding-logo">
            <img 
              src="/logo.svg" 
              alt="Stellar Tales Logo" 
              className="onboarding-logo-img"
              onError={(e) => {
                e.target.style.display = 'none';
                e.target.nextSibling.style.display = 'block';
              }}
            />
            <span className="onboarding-logo-fallback text-4xl hidden">🚀</span>
          </div>
          <h2 className="onboarding-title">{currentPageData.title}</h2>
          <p className="onboarding-subtitle">{currentPageData.subtitle}</p>
          
          {/* Progress indicator */}
          <div className="onboarding-progress">
            <div className="progress-bar">
              <div 
                className="progress-fill" 
                style={{ width: `${((currentPage + 1) / pages.length) * 100}%` }}
              ></div>
            </div>
            <span className="progress-text">{currentPage + 1} of {pages.length}</span>
          </div>
        </div>

        {/* Content */}
  <div className="onboarding-body flex-1 min-h-0 overflow-y-auto scrollbar-hide">
          {/* Welcome Page */}
          {currentPage === 0 && (
            <div className="onboarding-page welcome-page-mobile">
              <div className="glass-card p-4 rounded-2xl relative overflow-hidden">
                <div className="floating-stars">
                  <span className="star star-1">⭐</span>
                  <span className="star star-2">🌟</span>
                  <span className="star star-3">✨</span>
                </div>
                <div className="flex items-center justify-center gap-3 py-3">
                  <span className="text-3xl animate-float">🚀</span>
                  <h3 className="gradient-text text-xl font-extrabold tracking-wide">Welcome to Stellar Tales</h3>
                  <span className="text-3xl animate-float">🪐</span>
                </div>
                <p className="text-center text-white/85 text-sm px-2 pb-1">
                  Begin your journey through stories, quizzes, and cosmic fun.
                </p>
              </div>
            </div>
          )}

          {/* Profile Page */}
          {currentPage === 1 && (
            <div className="onboarding-page profile-page mobile-compact-form">
              <div className="glass-card p-4 rounded-2xl">
                <div className="form-group compact">
                  <label htmlFor="username">👤 Space Name</label>
                  <input
                    type="text"
                    id="username"
                    value={formData.username}
                    onChange={(e) => handleInputChange('username', e.target.value)}
                    placeholder="Your name"
                    maxLength={20}
                  />
                  <small>{formData.username.length}/20</small>
                </div>

                <div className="form-group compact">
                  <label htmlFor="language">🌍 {t('language')}</label>
                  <select 
                    id="language"
                    value={formData.language}
                    onChange={(e) => handleInputChange('language', e.target.value)}
                  >
                    <option value="en">English</option>
                    <option value="es">Español</option>
                    <option value="bn">বাংলা</option>
                    <option value="hi">हिंदी</option>
                    <option value="fr">Français</option>
                  </select>
                </div>
              </div>
            </div>
          )}


        </div>

        {/* Footer */}
        <div className="onboarding-footer w-full mt-4 flex-shrink-0 sticky bottom-0 z-10 bg-gradient-to-t from-[#0f0f23ee] to-transparent backdrop-blur-md">
          <div className="flex flex-row justify-center items-center gap-2 w-full px-1 py-1">
            {currentPage > 0 && (
              <button
                className="bg-white/80 text-purple-700 font-bold px-4 py-2 sm:px-5 rounded-full shadow hover:bg-white hover:scale-105 transition-all duration-200 border-2 border-purple-300 flex items-center gap-1 text-sm sm:text-base"
                onClick={prevPage}
              >
                <span className="text-base">←</span> Back
              </button>
            )}
            {currentPage === 0 && (
              <button
                className="bg-gradient-to-r from-yellow-400 via-pink-400 to-purple-500 text-white font-extrabold px-4 py-2 sm:px-6 rounded-full shadow-lg hover:scale-105 hover:from-yellow-500 hover:to-purple-600 transition-all duration-300 border-2 border-white/40 flex items-center gap-1 text-sm sm:text-base"
                style={{ boxShadow: '0 2px 12px 0 rgba(255, 182, 193, 0.2)' }}
                onClick={nextPage}
              >
                <span className="text-base">✨</span>
                Continue
                <span className="ml-1 text-base">→</span>
              </button>
            )}
            {currentPage === 1 && (
              <button
                className="bg-gradient-to-r from-green-400 via-blue-400 to-purple-500 text-white font-extrabold px-4 py-2 sm:px-6 rounded-full shadow-lg hover:scale-105 hover:from-green-500 hover:to-purple-600 transition-all duration-300 border-2 border-white/40 flex items-center gap-1 text-sm sm:text-base"
                style={{ boxShadow: '0 2px 12px 0 rgba(100, 200, 255, 0.2)' }}
                onClick={completeOnboarding}
                disabled={!canProceed()}
              >
                <span className="text-base">🚀</span>
                Let's go!
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Congratulations Popup */}
      {showCongrats && (
        <div className="fixed inset-0 flex items-center justify-center z-[100] p-4 aurora-bg">

          <div className="modal-content onboarding-modal relative p-6 sm:p-8 max-w-md w-full glass-card">
            {/* Celebration header */}
            <div className="text-center mb-4 sm:mb-6">
              <div className="text-6xl mb-3 animate-float">🎊</div>
              <h2 className="gradient-text text-2xl sm:text-3xl font-extrabold tracking-wide mb-2">
                Congratulations, {formData.username || 'Explorer'}!
              </h2>
              <p className="text-white/90 text-sm sm:text-base">
                Welcome to Stellar Tales — your space adventure starts now!
              </p>
            </div>

            {/* Bonus */}
            <div className="bonus-card mb-5">
              <div className="flex items-center justify-center gap-3">
                <span className="text-4xl text-yellow-300 animate-bounce-gentle"><BsCoin /></span>
                <div className="text-center">
                  <div className="gradient-text text-3xl font-black leading-none">50 COINS</div>
                  <div className="text-white/80 text-xs sm:text-sm font-semibold">Welcome Bonus</div>
                </div>
                <span className="text-4xl text-yellow-300 animate-bounce-gentle"><BsCoin /></span>
              </div>
              <p className="mt-3 text-white/85 text-xs sm:text-sm text-center">
                Use coins to unlock stories or save them by completing quizzes.
              </p>
            </div>

            {/* CTA */}
            <div className="flex justify-center">
              <button
                onClick={handleCloseCongrats}
                className="max-w-xs sm:max-w-sm launch-btn px-4 sm:px-6 py-3 sm:py-4 rounded-2xl shadow-2xl hover:scale-105 transition-all duration-300 flex items-center justify-center gap-2 text-sm sm:text-base animate-pulse-glow"
              >
                <span className="text-xl">🚀</span>
                Start Your Adventure
                <span className="text-xl">✨</span>
              </button>
            </div>

            {/* Tiny footer note */}
            <p className="mt-3 text-center text-white/70 text-xs">
              You can view your coins anytime on the dashboard.
            </p>

            {/* decorative corners */}
            <div className="corner-star tl">⭐</div>
            <div className="corner-star br">🌟</div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OnboardingModal;