import React from 'react';
import LoadingSpinner from './LoadingSpinner';
import { useApp } from '../context/AppContext';

const GlobalLoader = () => {
  const { isLoading, isSuspenseLoading } = useApp();

  if (!isLoading && !isSuspenseLoading) return null;

  return (
    <div className="fixed inset-0 z-[100] bg-black/40 backdrop-blur-sm flex items-center justify-center">
      <div className="rounded-2xl p-4 bg-black/50 border border-white/10 shadow-xl">
        <LoadingSpinner size="lg" color="#FACC15" speed={2} />
      </div>
    </div>
  );
};

export default GlobalLoader;


