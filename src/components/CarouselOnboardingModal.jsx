import React, { useState } from 'react';

const CarouselOnboardingModal = ({ isOpen, onClose }) => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      id: 'intro',
      heading: 'Stellar Tales',
      subheading: 'Welcome Future Space Explorer',
      buttonText: 'Next',
      emoji: '🚀',
      background: 'bg-gradient-to-br from-purple-900/90 to-blue-900/90'
    },
    {
      id: 'stories',
      heading: 'Explore Amazing Space Stories',
      subheading: 'Explore the space with your favourite character, unlock new characters by playing quiz!',
      buttonText: 'Next',
      emoji: '📖',
      background: 'bg-gradient-to-br from-blue-900/90 to-cyan-900/90'
    },
    {
      id: 'games',
      heading: 'Play Fun Cosmic Games',
      subheading: 'Become a space expert by playing games',
      buttonText: 'Next',
      emoji: '🎮',
      background: 'bg-gradient-to-br from-cyan-900/90 to-teal-900/90'
    },
    {
      id: 'progress',
      heading: 'Track Your Space Progress',
      subheading: "See how much you've learned and unlock awesome rewards",
      buttonText: "Let's Go",
      emoji: '🏆',
      background: 'bg-gradient-to-br from-teal-900/90 to-green-900/90'
    }
  ];

  const nextSlide = () => {
    if (currentSlide < slides.length - 1) {
      setCurrentSlide(currentSlide + 1);
    } else {
      // Complete onboarding
      onClose();
    }
  };

  const prevSlide = () => {
    if (currentSlide > 0) {
      setCurrentSlide(currentSlide - 1);
    }
  };

  if (!isOpen) return null;

  const currentSlideData = slides[currentSlide];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
      <div className="w-full max-w-md mx-4">
        <div className={`carousel-slide ${currentSlideData.background} rounded-3xl p-8 text-center relative overflow-hidden min-h-[500px] flex flex-col justify-between`}>
          {/* Background decorative elements */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute -top-4 -right-4 w-24 h-24 bg-white/10 rounded-full blur-xl"></div>
            <div className="absolute -bottom-8 -left-8 w-32 h-32 bg-white/5 rounded-full blur-2xl"></div>
            <div className="floating-stars">
              <span className="absolute top-6 left-6 text-yellow-300 animate-spin-slow">⭐</span>
              <span className="absolute top-12 right-8 text-yellow-200">🌟</span>
              <span className="absolute bottom-20 left-4 text-yellow-400 animate-pulse delay-700">✨</span>
            </div>
          </div>

          {/* Content */}
          <div className="relative z-10 flex-1 flex flex-col justify-center">
            {/* Emoji Icon */}
            <div className="text-8xl mb-6">
              {currentSlideData.emoji}
            </div>

            {/* Heading */}
            <h1 className="text-3xl font-bold text-white mb-4 leading-tight">
              {currentSlideData.heading}
            </h1>

            {/* Subheading */}
            <p className="text-white/90 text-lg leading-relaxed mb-8 px-2">
              {currentSlideData.subheading}
            </p>
          </div>

          {/* Bottom Section */}
          <div className="relative z-10 space-y-6">
            {/* Dots Indicator */}
            <div className="flex justify-center space-x-2">
              {slides.map((_, index) => (
                <div
                  key={index}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    index === currentSlide 
                      ? 'bg-white scale-125' 
                      : 'bg-white/40 hover:bg-white/60'
                  }`}
                  onClick={() => setCurrentSlide(index)}
                />
              ))}
            </div>

            {/* Navigation Buttons */}
            <div className="flex justify-between items-center">
              {currentSlide > 0 ? (
                <button
                  onClick={prevSlide}
                  className="px-6 py-3 bg-white/20 hover:bg-white/30 text-white rounded-full transition-all duration-200 hover:scale-105 backdrop-blur-sm"
                >
                  ← Back
                </button>
              ) : (
                <div></div>
              )}

              <button
                onClick={nextSlide}
                className={`px-8 py-4 font-semibold rounded-full transition-all duration-200 hover:scale-105 ${
                  currentSlide === slides.length - 1
                    ? 'bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white shadow-lg'
                    : 'bg-white hover:bg-gray-100 text-gray-900'
                }`}
              >
                {currentSlideData.buttonText}
                {currentSlide < slides.length - 1 ? ' →' : ' 🚀'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CarouselOnboardingModal;