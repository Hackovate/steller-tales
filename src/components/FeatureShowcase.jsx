import React, { useState, useEffect } from 'react';

const FeatureShowcase = ({ isVisible = true }) => {
  const [currentFeature, setCurrentFeature] = useState(0);
  
  const features = [
    {
      icon: '🚀',
      title: 'Animated Elements',
      description: 'All logos and icons are now dynamic with beautiful animations!'
    },
    {
      icon: '🎭',
      title: 'Onboarding Flow',
      description: 'New users see carousel onboarding, returning users get login prompts'
    },
    {
      icon: '🔒',
      title: 'Protected Routes',
      description: 'Dashboard requires authentication for better security'
    },
    {
      icon: '✨',
      title: 'Design Fixes',
      description: 'Improved alignment, spacing, and visual consistency throughout'
    }
  ];

  useEffect(() => {
    if (!isVisible) return;
    
    const interval = setInterval(() => {
      setCurrentFeature((prev) => (prev + 1) % features.length);
    }, 3000);

    return () => clearInterval(interval);
  }, [isVisible, features.length]);

  if (!isVisible) return null;

  return (
    <div className="fixed top-4 right-4 z-50 max-w-sm">
      <div className="bg-gradient-to-br from-space-card/95 to-accent-purple/20 backdrop-blur-md rounded-2xl p-6 border border-accent-purple/30 shadow-xl animate-in slide-in-from-right duration-500">
        <div className="text-center">
          <div className="text-4xl mb-3">
            {features[currentFeature].icon}
          </div>
          <h3 className="text-lg font-bold text-accent-yellow mb-2">
            {features[currentFeature].title}
          </h3>
          <p className="text-text-light text-sm leading-relaxed">
            {features[currentFeature].description}
          </p>
          
          {/* Progress dots */}
          <div className="flex justify-center gap-2 mt-4">
            {features.map((_, index) => (
              <div
                key={index}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  index === currentFeature 
                    ? 'bg-accent-yellow animate-pulse' 
                    : 'bg-text-gray/30'
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeatureShowcase;