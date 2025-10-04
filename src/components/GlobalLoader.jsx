import React, { useContext } from 'react';
import LoadingSpinner from './LoadingSpinner';
import { AppContext } from '../context/AppContext';

const GlobalLoader = () => {
  const context = useContext(AppContext);
  
  // If context is not available (e.g., during HMR), don't render anything
  if (!context) {
    return null;
  }

  const { isLoading, isSuspenseLoading } = context;

  if (!isLoading && !isSuspenseLoading) return null;

  return (
    <div className="fixed inset-0 z-[100] bg-black/40 backdrop-blur-sm flex flex-col items-center justify-center gap-4">
      <LoadingSpinner size="lg" color="#FACC15" speed={2} />
      <div className="text-accent-yellow font-medium text-lg animate-pulse">
        Caching data...
      </div>
    </div>
  );
};

export default GlobalLoader;


