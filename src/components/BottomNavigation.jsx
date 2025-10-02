import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { getAvailableStoriesCount } from '../data/stories';
import { useLanguage } from '../context/LanguageContext';

const BottomNavigation = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useLanguage();

  // Get the current available stories count dynamically
  const storiesCount = getAvailableStoriesCount();

  const navItems = [
    { path: '/', icon: '🏠', label: t('home'), badge: null },
    { path: '/stories', icon: '📚', label: t('stories'), badge: storiesCount > 0 ? String(storiesCount) : null },
    { path: '/wiki', icon: '📖', label: t('wiki'), badge: null },
    { path: '/games', icon: '🎮', label: t('games'), badge: null },
    { path: '/dashboard', icon: '🚀', label: t('dashboard'), badge: null }
  ];

  const handleNavClick = (path) => {
    navigate(path);
  };

  return (
    <nav className="fixed bottom-0 left-1/2 transform -translate-x-1/2 w-full max-w-[430px] bg-gradient-to-r from-[#16213e]/95 to-[#1a1a2e]/95 backdrop-blur-xl border-t-2 border-[#9b59b6]/30 shadow-2xl rounded-t-3xl z-50">
      <div className="flex justify-around items-center py-3 px-2">
        {navItems.map((item) => (
          <div
            key={item.path}
            onClick={() => handleNavClick(item.path)}
            className={`flex flex-col items-center justify-center py-3 px-3 min-w-[65px] cursor-pointer transition-all duration-300 rounded-2xl relative ${
              location.pathname === item.path
                ? 'text-accent-orange scale-110 bg-accent-orange/20 shadow-lg border border-accent-orange/30'
                : 'text-text-gray hover:text-text-light hover:scale-105 hover:bg-white/10 hover:border-accent-purple/30 border border-transparent'
            }`}
          >
            <div className="relative mb-1">
              <div className={`text-2xl transition-transform duration-300 ${
                location.pathname === item.path ? 'scale-110' : 'hover:scale-105'
              }`}>
                {item.icon}
              </div>
              {item.badge && (
                <div className="absolute -top-2 -right-2 bg-gradient-to-r from-accent-orange to-accent-yellow text-white text-xs rounded-full w-6 h-6 flex items-center justify-center font-bold shadow-lg animate-pulse">
                  {item.badge}
                </div>
              )}
            </div>
            <span className={`text-xs font-medium transition-all duration-300 ${
              location.pathname === item.path ? 'font-bold' : ''
            }`}>
              {item.label}
            </span>
            {location.pathname === item.path && (
              <div className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-accent-orange rounded-full"></div>
            )}
          </div>
        ))}
      </div>
    </nav>
  );
};

export default BottomNavigation;