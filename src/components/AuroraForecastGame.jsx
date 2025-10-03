import React, { useState, useEffect, useRef } from 'react';
import { useLanguage } from '../context/LanguageContext';
import AuroraHotspotOverlay from './AuroraHotspotOverlay';
import AuroraHotspotModal from './AuroraHotspotModal';

const AuroraForecastGame = ({ onClose }) => {
  const { t } = useLanguage();
  const [northernData, setNorthernData] = useState(null);
  const [southernData, setSouthernData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdate, setLastUpdate] = useState(null);
  const [selectedHemisphere, setSelectedHemisphere] = useState('northern');
  const [selectedHotspot, setSelectedHotspot] = useState(null);
  const [showHotspotModal, setShowHotspotModal] = useState(false);
  const imageRef = useRef(null);

  // Fetch aurora forecast data
  const fetchAuroraData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Fetch Northern Hemisphere data
      const northResponse = await fetch('https://services.swpc.noaa.gov/images/animations/ovation/north/latest.jpg');
      const northBlob = await northResponse.blob();
      const northUrl = URL.createObjectURL(northBlob);
      
      // Fetch Southern Hemisphere data  
      const southResponse = await fetch('https://services.swpc.noaa.gov/images/animations/ovation/south/latest.jpg');
      const southBlob = await southResponse.blob();
      const southUrl = URL.createObjectURL(southBlob);
      
      // Fetch aurora coordinate data and calculate HPI
      // The API returns an array of [longitude, latitude, intensity] points
      const coordResponse = await fetch('https://services.swpc.noaa.gov/json/ovation_aurora_latest.json');
      const coordData = await coordResponse.json();
      
      // Calculate approximate HPI from the coordinate data
      const calculateHPI = (coords) => {
        if (!Array.isArray(coords) || coords.length === 0) return 0;
        
        // Filter by hemisphere and sum intensities
        let totalIntensity = 0;
        let count = 0;
        
        coords.forEach(point => {
          if (Array.isArray(point) && point.length >= 3) {
            const intensity = point[2]; // Third value is intensity
            if (typeof intensity === 'number' && intensity > 0) {
              totalIntensity += intensity;
              count++;
            }
          }
        });
        
        // Convert to GW (HPI is typically 0-200 GW range)
        // Scale the sum appropriately
        const hpiValue = count > 0 ? Math.round(totalIntensity / 100) : 0;
        return hpiValue;
      };
      
      // The API returns a flat array, split by hemisphere
      // Latitude positive = north, negative = south
      let northPoints = [];
      let southPoints = [];
      
      if (Array.isArray(coordData)) {
        northPoints = coordData.filter(p => Array.isArray(p) && p.length >= 3 && p[1] >= 0);
        southPoints = coordData.filter(p => Array.isArray(p) && p.length >= 3 && p[1] < 0);
      } else if (coordData.coordinates && Array.isArray(coordData.coordinates)) {
        northPoints = coordData.coordinates.filter(p => Array.isArray(p) && p.length >= 3 && p[1] >= 0);
        southPoints = coordData.coordinates.filter(p => Array.isArray(p) && p.length >= 3 && p[1] < 0);
      }
      
      const northHPI = calculateHPI(northPoints);
      const southHPI = calculateHPI(southPoints);
      
      setNorthernData({
        imageUrl: northUrl,
        hpi: northHPI,
        forecastTime: new Date().toISOString()
      });
      
      setSouthernData({
        imageUrl: southUrl,
        hpi: southHPI, 
        forecastTime: new Date().toISOString()
      });
      
      setLastUpdate(new Date().toLocaleTimeString());
      setLoading(false);
    } catch (err) {
      console.error('Error fetching aurora data:', err);
      // Check if user is offline
      if (!navigator.onLine) {
        setError('You are offline. Aurora forecast requires an internet connection.');
      } else {
        setError('Failed to load aurora forecast data');
      }
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAuroraData();
    // Update every 30 minutes
    const interval = setInterval(fetchAuroraData, 30 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  const currentData = selectedHemisphere === 'northern' ? northernData : southernData;

  const handleHotspotClick = (hotspot) => {
    setSelectedHotspot(hotspot);
    setShowHotspotModal(true);
  };

  const handleCloseHotspotModal = () => {
    setShowHotspotModal(false);
    setSelectedHotspot(null);
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-gradient-to-br from-[#16213e]/95 to-[#1a1a2e]/95 backdrop-blur-md rounded-2xl max-w-[430px] w-full border border-accent-purple/30 shadow-2xl max-h-[90vh] flex flex-col overflow-hidden">
        {/* Header - Fixed */}
        <div className="flex justify-between items-center p-4 border-b border-accent-purple/20 bg-gradient-to-br from-[#16213e] to-[#1a1a2e]">
          <div>
            <h3 className="text-2xl font-bold text-accent-blue flex items-center gap-2 mb-1">
              🌌 {t('auroraForecastTitle')}
            </h3>
            <p className="text-text-gray text-sm">
              {t('auroraForecastSubtitle')}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-text-gray hover:text-text-light text-3xl transition-all duration-300 hover:scale-105 flex-shrink-0"
          >
            ×
          </button>
        </div>

        {/* Hemisphere Selector - Fixed */}
        <div className="flex gap-2 p-3 border-b border-accent-purple/20 bg-[#1a1a2e]/80 backdrop-blur">
          <button
            onClick={() => setSelectedHemisphere('northern')}
            className={`flex-1 px-3 py-2 rounded-lg font-medium text-sm transition-all ${
              selectedHemisphere === 'northern'
                ? 'bg-accent-blue text-white'
                : 'bg-space-card/50 text-text-light hover:bg-space-card'
            }`}
          >
            🌍 {t('northernHemisphere')}
          </button>
          <button
            onClick={() => setSelectedHemisphere('southern')}
            className={`flex-1 px-3 py-2 rounded-lg font-medium text-sm transition-all ${
              selectedHemisphere === 'southern'
                ? 'bg-accent-blue text-white'
                : 'bg-space-card/50 text-text-light hover:bg-space-card'
            }`}
          >
            🌏 {t('southernHemisphere')}
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-4">

        {loading && (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent-blue mx-auto mb-4"></div>
              <p className="text-text-light">{t('loadingAuroraForecast')}</p>
            </div>
          </div>
        )}

        {error && (
          <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-4 mb-6">
            <p className="text-red-400">{error}</p>
            <button 
              onClick={fetchAuroraData}
              className="mt-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 px-4 py-2 rounded-lg transition-all"
            >
              {t('retry')}
            </button>
          </div>
        )}

        {currentData && !loading && (
          <div className="space-y-4">
            {/* Aurora Map */}
            <div className="bg-space-card/30 rounded-xl p-4 border border-accent-purple/20">
              <div className="text-center mb-4">
                <h4 className="text-xl font-bold text-accent-yellow mb-2">
                  {selectedHemisphere === 'northern' ? t('northernHemisphere') : t('southernHemisphere')} Aurora Forecast
                </h4>
                <p className="text-accent-blue text-sm mb-3 flex items-center justify-center gap-2">
                  🎯 Click on the glowing dots to learn fun facts about aurora locations!
                </p>
                {currentData.imageUrl && (
                  <div className="relative">
                    <img
                      ref={imageRef}
                      src={currentData.imageUrl}
                      alt={`${selectedHemisphere} hemisphere aurora forecast`}
                      className="max-w-full h-auto rounded-xl border border-accent-purple/30 max-h-[70vh] w-full object-contain mx-auto shadow-lg"
                      onError={() => setError('Failed to load aurora map image')}
                    />
                    {/* Interactive Hotspots Overlay */}
                    <AuroraHotspotOverlay
                      hemisphere={selectedHemisphere}
                      onHotspotClick={handleHotspotClick}
                      imageRef={imageRef}
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Educational Information */}
            <div className="grid grid-cols-1 gap-3">
              <div className="bg-gradient-to-br from-accent-blue/10 to-accent-purple/10 rounded-lg p-4 border border-accent-blue/30">
                <h5 className="text-accent-blue font-bold mb-3 flex items-center gap-2 text-lg">
                  🎨 {t('colorGuide')}
                </h5>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-green-500 rounded shadow-sm"></div>
                    <span className="text-text-light font-medium">Green: 10-50% probability</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-yellow-500 rounded shadow-sm"></div>
                    <span className="text-text-light font-medium">Yellow: 50-90% probability</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-red-500 rounded shadow-sm"></div>
                    <span className="text-text-light font-medium">Red: 90%+ probability</span>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-accent-orange/10 to-accent-yellow/10 rounded-lg p-4 border border-accent-orange/30">
                <h5 className="text-accent-orange font-bold mb-3 flex items-center gap-2 text-lg">
                  👀 {t('viewingTips')}
                </h5>
                <div className="space-y-2 text-sm text-text-light">
                  <div className="flex items-start gap-2">
                    <span className="text-accent-orange mt-1">•</span>
                    <span>Best viewed away from city lights</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-accent-orange mt-1">•</span>
                    <span>Look north (Northern Hemisphere)</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-accent-orange mt-1">•</span>
                    <span>Check local weather conditions</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-accent-orange mt-1">•</span>
                    <span>Peak viewing: 10 PM - 2 AM local time</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Data Source Info */}
            <div className="text-center text-sm text-text-gray border-t border-accent-purple/20 pt-4 pb-2 bg-space-card/20 rounded-lg p-4 mb-16">
              <div className="space-y-1">
                <p className="font-medium">{t('dataSource')}</p>
                <p>{t('modelInfo')}</p>
                {lastUpdate && <p className="text-accent-blue">{t('lastUpdated')} {lastUpdate}</p>}
              </div>
            </div>
          </div>
        )}
        </div>
      </div>

      {/* Hotspot Modal */}
      <AuroraHotspotModal
        hotspot={selectedHotspot}
        isOpen={showHotspotModal}
        onClose={handleCloseHotspotModal}
      />
    </div>
  );
};

export default AuroraForecastGame;