import React from 'react';
import { PacmanLoader } from 'react-spinners';

const LoadingSpinner = ({ size = 'md', color = '#FACC15', speed = 2 }) => {
  const sizePx = {
    sm: 10,
    md: 14,
    lg: 18,
    xl: 22
  };

  return (
    <div className="flex items-center justify-center py-6">
      <PacmanLoader color={color} size={sizePx[size] || sizePx.md} speedMultiplier={speed} />
    </div>
  );
};

export default LoadingSpinner;