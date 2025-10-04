import React, { useEffect } from 'react';
import { useApp } from '../context/AppContext';
import LoadingSpinner from './LoadingSpinner';

// Fallback shown during lazy route loading
const SuspenseFallback = () => {
  const { setIsSuspenseLoading } = useApp();

  useEffect(() => {
    setIsSuspenseLoading(true);
    return () => setIsSuspenseLoading(false);
  }, [setIsSuspenseLoading]);

  // Show inline loader for immediate feedback
  return (
    <div className="min-h-screen bg-space-bg flex flex-col items-center justify-center">
      <LoadingSpinner size="lg" color="#FACC15" speed={2} />
      <div className="text-accent-yellow font-medium text-lg animate-pulse mt-4">
        Loading page...
      </div>
    </div>
  );
};

export default SuspenseFallback;


