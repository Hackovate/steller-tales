import React, { useState } from 'react';
import { getHotspotsForHemisphere } from '../data/auroraHotspots';

const AuroraHotspotOverlay = ({ hemisphere, onHotspotClick, imageRef }) => {
  const [hoveredHotspot, setHoveredHotspot] = useState(null);
  const hotspots = getHotspotsForHemisphere(hemisphere);

  const handleHotspotClick = (hotspot) => {
    onHotspotClick(hotspot);
  };

  const handleHotspotHover = (hotspot) => {
    setHoveredHotspot(hotspot);
  };

  const handleHotspotLeave = () => {
    setHoveredHotspot(null);
  };

  if (!imageRef?.current) return null;

  return (
    <div className="absolute inset-0 pointer-events-none">
      {hotspots.map((hotspot) => (
        <div
          key={hotspot.id}
          className="absolute pointer-events-auto cursor-pointer group"
          style={{
            left: `${hotspot.coordinates.x}%`,
            top: `${hotspot.coordinates.y}%`,
            transform: 'translate(-50%, -50%)'
          }}
          onClick={() => handleHotspotClick(hotspot)}
          onMouseEnter={() => handleHotspotHover(hotspot)}
          onMouseLeave={handleHotspotLeave}
        >
          {/* Hotspot Indicator */}
          <div className="relative">
            {/* Pulsing Ring */}
            <div className={`absolute inset-0 rounded-full border-2 border-accent-yellow/60 animate-ping ${
              hoveredHotspot?.id === hotspot.id ? 'opacity-100' : 'opacity-0'
            }`} 
            style={{ width: '24px', height: '24px', margin: '-12px' }}
            />
            
            {/* Main Hotspot Circle */}
            <div className={`w-6 h-6 rounded-full border-2 transition-all duration-300 ${
              hoveredHotspot?.id === hotspot.id 
                ? 'bg-accent-yellow border-accent-yellow shadow-lg shadow-accent-yellow/50 scale-125' 
                : 'bg-accent-blue/80 border-accent-blue hover:bg-accent-yellow hover:border-accent-yellow hover:scale-110'
            }`}>
              <div className="w-full h-full flex items-center justify-center text-white text-xs font-bold">
                {hotspot.emoji}
              </div>
            </div>

            {/* Tooltip */}
            {hoveredHotspot?.id === hotspot.id && (
              <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 z-50">
                <div className="bg-space-card/95 backdrop-blur-md rounded-lg p-3 border border-accent-yellow/30 shadow-xl max-w-xs">
                  <div className="text-accent-yellow font-bold text-sm mb-1">
                    {hotspot.name}
                  </div>
                  <div className="text-text-light text-xs">
                    {hotspot.region}
                  </div>
                  <div className="text-accent-blue text-xs mt-1">
                    Click to learn more! 🎯
                  </div>
                </div>
                {/* Tooltip Arrow */}
                <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-accent-yellow/30"></div>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default AuroraHotspotOverlay;
