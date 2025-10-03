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
    <div className="fixed inset-0 z-[100] bg-black/40 backdrop-blur-sm flex items-center justify-center">
      <LoadingSpinner size="lg" color="#FACC15" speed={2} />
    </div>
  );
};

export default GlobalLoader;


