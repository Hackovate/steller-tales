import React from 'react';

const AnimatedButton = ({ 
  children, 
  onClick, 
  variant = 'primary', 
  size = 'md', 
  className = '',
  disabled = false,
  loading = false,
  icon = null
}) => {
  const baseClasses = 'inline-flex items-center justify-center gap-2 font-semibold rounded-xl transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-transparent';
  
  const variantClasses = {
    primary: 'bg-gradient-to-r from-accent-orange to-accent-yellow hover:from-accent-orange/90 hover:to-accent-yellow/90 text-white shadow-lg hover:shadow-xl focus:ring-accent-orange/50',
    secondary: 'bg-gradient-to-r from-accent-purple to-accent-blue hover:from-accent-purple/90 hover:to-accent-blue/90 text-white shadow-lg hover:shadow-xl focus:ring-accent-purple/50',
    outline: 'border-2 border-accent-orange text-accent-orange hover:bg-accent-orange hover:text-white focus:ring-accent-orange/50',
    ghost: 'text-accent-orange hover:bg-accent-orange/10 focus:ring-accent-orange/50'
  };

  const sizeClasses = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg'
  };

  const hoverClasses = disabled || loading 
    ? 'cursor-not-allowed opacity-50' 
    : 'hover:scale-105 active:scale-95 cursor-pointer';

  return (
    <button
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${hoverClasses} ${className}`}
      onClick={onClick}
      disabled={disabled || loading}
    >
      {loading && (
        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
      )}
      {icon && !loading && (
        <span>{icon}</span>
      )}
      {children}
    </button>
  );
};

export default AnimatedButton;