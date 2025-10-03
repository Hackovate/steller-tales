/* eslint-disable no-unused-vars */
import React, { memo, useCallback, useMemo } from 'react';
import { BsCoin } from 'react-icons/bs';
import { useUser } from '../context/UserContext';
import { useApp } from '../context/AppContext';
import StarsBackground from '../components/StarsBackground';
import SolarWindGauges from '../components/SolarWindGauges';
import EventsTimeline from '../components/EventsTimeline';
import TodayAtAGlance from '../components/TodayAtAGlance';
import { useLanguage } from '../context/LanguageContext';

const DashboardPage = memo(() => {
  const { currentUser, achievements, streakDays } = useUser();
  const { spaceWeatherData, mood, apod, fetchSpaceWeatherData, isLoading } = useApp();
  const [showCredits, setShowCredits] = React.useState(false);
  const [hasLoadedData, setHasLoadedData] = React.useState(false);
  const { t } = useLanguage();
  
  // Get actual coins from localStorage (synced with StoriesPage)
  const [actualCoins, setActualCoins] = React.useState(0);
  const [completedStoriesCount, setCompletedStoriesCount] = React.useState(0);

  // Function to refresh data from localStorage
  const refreshData = useCallback(() => {
    const coins = parseInt(localStorage.getItem('userCoins') || '0');
    setActualCoins(coins);

    const quizScores = localStorage.getItem('quizScores');
    if (quizScores) {
      const scores = JSON.parse(quizScores);
      setCompletedStoriesCount(Object.keys(scores).length);
    }
  }, []);

  // Load API data only when dashboard is visited
  React.useEffect(() => {
    if (!hasLoadedData) {
      fetchSpaceWeatherData().then(() => {
        setHasLoadedData(true);
      });
    }
  }, [hasLoadedData, fetchSpaceWeatherData]);

  // Initial load and refresh when component mounts
  React.useEffect(() => {
    refreshData();
  }, [refreshData]);

  // Refresh data when tab becomes visible
  React.useEffect(() => {
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        refreshData();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [refreshData]);

  // Refresh data when window gains focus (navigating back to page)
  React.useEffect(() => {
    const handleFocus = () => {
      refreshData();
    };

    window.addEventListener('focus', handleFocus);
    return () => window.removeEventListener('focus', handleFocus);
  }, [refreshData]);

  // Memoize expensive calculations
  const progressStats = useMemo(() => ({
    completedStoriesCount,
    actualCoins
  }), [completedStoriesCount, actualCoins]);

  const handleCreditsToggle = useCallback(() => {
    setShowCredits(prev => !prev);
  }, []);


  // Recent Activity section removed per request

  return (
    <div className="mobile-container relative pb-32 md:pb-24">
      <StarsBackground />
      
      <div className="relative z-10 pt-6">
        {/* Header */}
        <div className="text-center mb-8 animate-in fade-in slide-in-from-top duration-500">
          <div className="mb-4">
            <span className="text-6xl inline-block hover:scale-110 transition-all cursor-pointer">🚀</span>
          </div>
          <h1 className="text-3xl font-bold text-accent-orange mb-3 tracking-wide">
            {t('dashboardHeaderTitle')}
          </h1>
          <p className="text-text-light text-base leading-relaxed">
            {t('dashboardWelcome', { name: currentUser?.username || 'Explorer' })}
          </p>
        </div>

        {/* Progress Stats */}
        <div className="grid grid-cols-2 gap-3 mb-6 max-w-[400px] mx-auto">
          <div className="bg-gradient-to-br from-[#16213e]/95 to-[#1a1a2e]/95 backdrop-blur-md rounded-xl p-4 text-center border border-accent-purple/30 shadow-lg hover:shadow-xl transition-all hover:scale-102 animate-in fade-in slide-in-from-left duration-500">
            <div className="text-2xl mb-1 animate-float">📖</div>
            <div className="text-xl font-bold text-accent-yellow">{progressStats.completedStoriesCount}</div>
            <div className="text-text-light text-xs">{t('storiesComplete')}</div>
          </div>
          <div className="bg-gradient-to-br from-[#16213e]/95 to-[#1a1a2e]/95 backdrop-blur-md rounded-xl p-4 text-center border border-accent-purple/30 shadow-lg hover:shadow-xl transition-all hover:scale-102 animate-in fade-in slide-in-from-right duration-500 delay-75">
            <div className="text-2xl mb-1 animate-float text-accent-yellow flex justify-center"><BsCoin /></div>
            <div className="text-xl font-bold text-accent-yellow">{progressStats.actualCoins}</div>
            <div className="text-text-light text-xs">{t('spaceCoinsLabel')}</div>
          </div>
        </div>

        {/* Alerts removed */}


        {/* Space Weather Mood Summary */}
        {mood && (
          <div className={`bg-gradient-to-br from-[#16213e]/95 to-[#1a1a2e]/95 rounded-xl p-3 mb-4 border border-accent-purple/30 shadow-lg text-center max-w-[400px] mx-auto`}>
            <div className="flex items-center justify-center gap-2 mb-2">
              <span className={`text-2xl ${mood.color}`}>{mood.emoji}</span>
              <h3 className="text-lg font-bold text-accent-blue tracking-wide">{t('spaceWeatherMood')} <span className={`capitalize ${mood.color}`}>{mood.level}</span></h3>
            </div>
            <p className="text-text-light text-xs leading-relaxed">{spaceWeatherData?.summary}</p>
          </div>
        )}

        {/* Live Space Weather Cards */}
        <div className="grid grid-cols-1 gap-3 mb-6 max-w-lg mx-auto">
          {isLoading && !hasLoadedData ? (
            <div className="bg-gradient-to-br from-[#16213e]/95 to-[#1a1a2e]/95 rounded-xl p-6 border border-accent-purple/30 shadow-lg text-center">
              <div className="animate-spin text-4xl mb-3">🌌</div>
              <div className="text-accent-blue font-bold">{t('loadingSpaceData')}</div>
              <div className="text-text-light text-sm mt-2">{t('fetchingLatestData')}</div>
            </div>
          ) : (
            <>
              <TodayAtAGlance />
              <SolarWindGauges />
              <EventsTimeline />
            </>
          )}
        </div>

        {/* Recent Activity removed */}


        {/* Credits trigger at bottom */}
        <div className="mt-6 mb-20 flex justify-center">
          <button
            onClick={handleCreditsToggle}
            className="px-4 py-2 rounded-full bg-gradient-to-r from-accent-purple to-accent-blue text-white text-sm font-bold shadow-lg border border-white/10 active:scale-95 transition-all"
          >
            {t('viewCredits')}
          </button>
        </div>

        {/* Credits Modal */}
        {showCredits && (
          <div className="fixed inset-0 z-[80] flex items-start justify-center p-3 pt-8">
            <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={handleCreditsToggle} />
            <div className="relative w-full max-w-sm rounded-3xl border-2 border-accent-orange/40 shadow-2xl overflow-hidden bg-gradient-to-br from-space-card/95 via-space-blue/90 to-accent-purple/30">
              {/* header */}
              <div className="px-4 py-3 bg-gradient-to-r from-accent-purple/95 to-accent-blue/95 text-white flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">🌟</span>
                  <h3 className="text-base font-extrabold tracking-wide">{t('creditsAndAcknowledgments')}</h3>
                </div>
                <button
                  onClick={handleCreditsToggle}
                  className="w-9 h-9 rounded-full bg-red-500 active:bg-red-600 text-white text-xl font-bold flex items-center justify-center shadow"
                  aria-label="Close credits"
                >
                  ×
                </button>
              </div>
              {/* body (scrollable) */}
              <div className="px-4 py-3 max-h-[70vh] overflow-y-auto">
                <div className="space-y-4 text-xs text-text-light">
                  {/* Team Nomads Header */}
                  <div className="text-center mb-6">
                    <h2 className="text-2xl font-extrabold text-accent-orange mb-2">Team Nomads</h2>
                    <div className="w-16 h-1 bg-gradient-to-r from-accent-orange to-accent-yellow mx-auto rounded-full"></div>
                  </div>
                  
                  {/* Team */}
                  <div className="bg-white/5 border border-white/10 rounded-2xl p-3">
                    <div className="font-bold text-accent-yellow mb-1">{t('team')}</div>
                    <ul className="space-y-1">
                      <li><span className="font-semibold text-white">Al Amin</span> – Team Lead & Vision Strategist</li>
                      <li><span className="font-semibold text-white">Sayed Ajlan</span> – System Designer & Experience Architect</li>
                      <li><span className="font-semibold text-white">Mehrab Hossain</span> – Developer & Creative Technologist</li>
                      <li><span className="font-semibold text-white">Ebrahim Hossain</span> – Researcher, Data Integration</li>
                      <li><span className="font-semibold text-white">Fardin Hossain</span> – Researcher, Story Content & Outreach</li>
                      <li><span className="font-semibold text-white">Shakera Ema</span> – Researcher, Space Weather Impacts</li>
                    </ul>
                  </div>
                  {/* Data & APIs */}
                  <div className="bg-white/5 border border-white/10 rounded-2xl p-3">
                    <div className="font-bold text-accent-yellow mb-1">{t('dataAndAPIs')}</div>
                    <ul className="list-disc list-inside space-y-1">
                      <li>NASA APOD (Astronomy Picture of the Day) for daily space images.</li>
                      <li>NASA Images and Video Library for the visual gallery and wiki media.</li>
                      <li>NASA DONKI (Space Weather database) for flares, CMEs, and geomagnetic storms.</li>
                      <li>NOAA SWPC space‑weather feeds for alerts, notifications, and measurements.</li>
                    </ul>
                  </div>
                  {/* Technology */}
                  <div className="bg-white/5 border border-white/10 rounded-2xl p-3">
                    <div className="font-bold text-accent-yellow mb-1">{t('technology')}</div>
                    <ul className="list-disc list-inside space-y-1">
                      <li>React + Vite + Tailwind CSS.</li>
                      <li>Progressive Web App (PWA) support for installable experience.</li>
                      <li>Emoji and icons for illustrative UI accents.</li>
                    </ul>
                  </div>
                </div>
                {/* Bottom close removed; top-right close remains */}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
});

export default DashboardPage;