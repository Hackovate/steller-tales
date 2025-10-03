import React from 'react';
import { useLanguage } from '../context/LanguageContext';

const AuroraHotspotModal = ({ hotspot, isOpen, onClose }) => {
  const { t } = useLanguage();

  if (!isOpen || !hotspot) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-60 p-4">
      <div className="bg-gradient-to-br from-[#16213e]/95 to-[#1a1a2e]/95 backdrop-blur-md rounded-2xl p-6 max-w-md w-full border border-accent-yellow/30 shadow-2xl">
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-3">
            <span className="text-3xl">{hotspot.emoji}</span>
            <div>
              <h3 className="text-xl font-bold text-accent-yellow">
                {hotspot.name}
              </h3>
              <p className="text-text-gray text-sm">
                {hotspot.region}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-text-gray hover:text-text-light text-2xl transition-all duration-300 hover:scale-105"
          >
            ×
          </button>
        </div>

        {/* Fun Fact */}
        <div className="bg-gradient-to-br from-accent-yellow/10 to-accent-orange/10 rounded-lg p-4 border border-accent-yellow/30 mb-4">
          <div className="flex items-start gap-3">
            <span className="text-2xl">💡</span>
            <div>
              <h4 className="text-accent-yellow font-bold mb-2 text-sm">
                Fun Fact!
              </h4>
              <p className="text-text-light text-sm leading-relaxed">
                {hotspot.fact}
              </p>
            </div>
          </div>
        </div>

        {/* Viewing Tip */}
        <div className="bg-gradient-to-br from-accent-blue/10 to-accent-purple/10 rounded-lg p-4 border border-accent-blue/30 mb-6">
          <div className="flex items-start gap-3">
            <span className="text-2xl">👀</span>
            <div>
              <h4 className="text-accent-blue font-bold mb-2 text-sm">
                Viewing Tip
              </h4>
              <p className="text-text-light text-sm leading-relaxed">
                {hotspot.tip}
              </p>
            </div>
          </div>
        </div>

        {/* Action Button */}
        <div className="flex justify-center">
          <button
            onClick={onClose}
            className="w-full bg-gradient-to-r from-accent-blue to-accent-purple hover:from-accent-blue/90 hover:to-accent-purple/90 text-white px-4 py-3 rounded-lg font-medium transition-all duration-300 hover:scale-[1.02]"
          >
            Awesome! 🌟
          </button>
        </div>
      </div>
    </div>
  );
};

export default AuroraHotspotModal;
