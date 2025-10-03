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
      
      // Fetch HPI data
      const hpiResponse = await fetch('https://services.swpc.noaa.gov/json/ovation_aurora_latest.json');
      const hpiData = await hpiResponse.json();
      
      setNorthernData({
        imageUrl: northUrl,
        hpi: hpiData.north?.hpi || 'N/A',
        forecastTime: hpiData.north?.forecast_time || 'N/A'
      });
      
      setSouthernData({
        imageUrl: southUrl,
        hpi: hpiData.south?.hpi || 'N/A', 
        forecastTime: hpiData.south?.forecast_time || 'N/A'
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

  const getAuroraIntensity = (hpi) => {
    const value = parseFloat(hpi);
    if (value >= 100) return { level: 'Very High', color: 'text-red-400', description: 'Spectacular aurora likely!' };
    if (value >= 50) return { level: 'High', color: 'text-orange-400', description: 'Strong aurora possible' };
    if (value >= 20) return { level: 'Moderate', color: 'text-yellow-400', description: 'Aurora may be visible' };
    if (value >= 10) return { level: 'Low', color: 'text-blue-400', description: 'Weak aurora possible' };
    return { level: 'Very Low', color: 'text-gray-400', description: 'Aurora unlikely' };
  };

  const currentData = selectedHemisphere === 'northern' ? northernData : southernData;
  const intensity = currentData ? getAuroraIntensity(currentData.hpi) : null;

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

              {/* HPI and Intensity Info */}
              <div className="grid grid-cols-1 gap-3 mt-4">
                <div className="bg-space-card/50 rounded-lg p-4 border border-accent-blue/20">
                  <h5 className="text-accent-blue font-bold mb-2 text-lg">{t('hemisphericPowerIndex')}</h5>
                  <div className="text-3xl font-bold text-accent-yellow mb-2">
                    {currentData.hpi} GW
                  </div>
                  <div className="text-sm text-text-gray">
                    Range: 5-200 GW (higher = more intense aurora)
                  </div>
                </div>

                <div className="bg-space-card/50 rounded-lg p-4 border border-accent-purple/20">
                  <h5 className="text-accent-blue font-bold mb-2 text-lg">{t('auroraIntensity')}</h5>
                  <div className={`text-2xl font-bold ${intensity?.color} mb-2`}>
                    {intensity?.level}
                  </div>
                  <div className="text-sm text-text-light">
                    {intensity?.description}
                  </div>
                </div>
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
            <div className="text-center text-sm text-text-gray border-t border-accent-purple/20 pt-6 bg-space-card/20 rounded-lg p-4">
              <div className="space-y-1">
                <p className="font-medium">{t('dataSource')}</p>
                <p>{t('modelInfo')}</p>
                {lastUpdate && <p className="text-accent-blue">{t('lastUpdated')} {lastUpdate}</p>}
              </div>
            </div>

            {/* Refresh Button */}
            <div className="flex justify-center mt-4">
              <button
                onClick={fetchAuroraData}
                disabled={loading}
                className="w-full bg-gradient-to-r from-accent-blue to-accent-purple hover:from-accent-blue/90 hover:to-accent-purple/90 disabled:opacity-50 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300 hover:scale-[1.02] shadow-lg"
              >
                {loading ? t('updating') : `🔄 ${t('refreshForecast')}`}
              </button>
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