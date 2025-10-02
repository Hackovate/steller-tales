import React, { useEffect } from 'react';
import { useApp } from '../context/AppContext';

// Lightweight fallback that only toggles the suspense loading flag.
const SuspenseFallback = () => {
  const { setIsSuspenseLoading } = useApp();

  useEffect(() => {
    setIsSuspenseLoading(true);
    return () => setIsSuspenseLoading(false);
  }, [setIsSuspenseLoading]);

  // Render nothing; GlobalLoader will show the single centered Pacman
  return null;
};

export default SuspenseFallback;


