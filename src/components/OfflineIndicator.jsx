import React, { useState, useEffect } from 'react';

const OfflineIndicator = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [showNotification, setShowNotification] = useState(false);

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      setShowNotification(true);
      setTimeout(() => setShowNotification(false), 3000);
    };

    const handleOffline = () => {
      setIsOnline(false);
      setShowNotification(true);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  if (!showNotification) return null;

  return (
    <div className={`fixed top-20 left-1/2 transform -translate-x-1/2 z-50 px-4 py-2 rounded-lg shadow-lg transition-all duration-300 ${
      isOnline 
        ? 'bg-green-500/90 text-white' 
        : 'bg-orange-500/90 text-white'
    }`}>
      <div className="flex items-center gap-2">
        <span className="text-xl">{isOnline ? '🌐' : '📡'}</span>
        <span className="text-sm font-semibold">
          {isOnline ? 'Back online!' : 'You\'re offline - viewing cached content'}
        </span>
      </div>
    </div>
  );
};

export default OfflineIndicator;
