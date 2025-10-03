import React, { useEffect, useState, memo, useCallback, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { useLanguage } from '../context/LanguageContext';
import { nasaAPI } from '../utils/nasaAPI';
import { getSolarWindPlasma1Day } from '../utils/swpcAPI';
import { compareFlareToHistory } from '../data/historicalAuroraEvents';

const POLL_MS = 90000;

const TodayAtAGlance = memo(() => {
  const { spaceWeatherData } = useApp();
  const { t } = useLanguage();
  const [state, setState] = useState({ flare: '—', kp: null, wind: { temperature: null }, aurora: null, updated: null });
  const [historicalComparison, setHistoricalComparison] = useState(null);
  const [hasLoaded, setHasLoaded] = useState(false);

  useEffect(() => {
    let mounted = true;
    const fetchData = async () => {
      try {
        // Use spaceWeatherData if available, otherwise fetch it
        let summary = spaceWeatherData;
        if (!summary) {
          summary = await nasaAPI.getSpaceWeatherSummary();
        }
        
        const plasma = await getSolarWindPlasma1Day().catch(() => null);
        
        // Biggest flare class from summary.solarActivity
        const flares = Array.isArray(summary?.solarActivity) ? summary.solarActivity : [];
        const flareClass = flares.find(f => f.intensity)?.intensity?.[0] || 'B/A';
        // Approx kp from storms
        const storms = Array.isArray(summary?.geomagneticStorms) ? summary.geomagneticStorms : [];
        const kp = storms[0]?.kpIndex ? Number(storms[0].kpIndex) : null;
        const auroraChance = kp >= 5 ? 'High' : kp >= 4 ? 'Medium' : 'Low';
        // Latest solar wind temperature (K) from SWPC plasma 1-day
        const p = Array.isArray(plasma) ? plasma.filter((r) => Array.isArray(r) && r[0] !== 'time_tag') : [];
        const lastP = p[p.length - 1];
        const temperature = lastP ? Number(lastP[3]) : null; // Kelvin
        
        if (!mounted) return;
        setState({ flare: flareClass || 'B/A', kp, wind: { temperature }, aurora: kp ? auroraChance : null, updated: new Date().toISOString() });
        setHasLoaded(true);
        
        // Compare to historical events
        if (flareClass && flareClass !== 'B/A') {
          const comparison = compareFlareToHistory(flareClass);
          setHistoricalComparison(comparison);
        }
      } catch (error) {
        console.warn('TodayAtAGlance fetch error:', error);
        // Use fallback data if no cached data available
        if (mounted && state.flare === '—') {
          setState({ 
            flare: 'C', 
            kp: 3, 
            wind: { temperature: 50000 }, 
            aurora: 'Low', 
            updated: new Date().toISOString() 
          });
          setHasLoaded(true);
        }
      }
    };
    
    // Always fetch data when component mounts or spaceWeatherData changes
    fetchData();
    const t = setInterval(fetchData, POLL_MS);
    return () => { mounted = false; clearInterval(t); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [spaceWeatherData]);

  // Aurora chance shown here; detailed aurora map is in Games tab

  return (
    <div className="bg-gradient-to-br from-[#16213e]/95 to-[#1a1a2e]/95 rounded-xl p-3 border border-accent-purple/30 shadow-lg hover:shadow-xl transition-all hover:scale-101">
      <div className="flex items-center gap-2 mb-2">
        <span className="text-xl">🌞</span>
        <h3 className="text-base font-bold text-accent-blue tracking-wide">{t('todayAtAGlance')}</h3>
      </div>
      <div className="grid grid-cols-2 gap-2">
        <div className="p-2 bg-space-card/50 rounded-lg border border-accent-purple/20 text-center">
          <div className="text-xs text-text-gray mb-1">{t('biggestFlare')}</div>
          <div className="text-lg font-bold">{state.flare}</div>
          <div className="text-xs text-text-light">{t('whatThisMeans')} {state.flare==='X'?t('sunsXraysVeryStrong'):state.flare==='M'?t('sunsXraysStrong'):state.flare==='C'?t('sunsXraysBitActive'):t('sunsXraysCalm')}</div>
        </div>
        <div className="p-2 bg-space-card/50 rounded-lg border border-accent-purple/20 text-center">
          <div className="text-xs text-text-gray mb-1">{t('currentKp')}</div>
          <div className="text-lg font-bold">{state.kp ?? '—'}</div>
          <div className="text-xs text-text-light">{t('whatThisMeans')} {state.aurora === 'High' ? t('auroraChanceHigh') : state.aurora === 'Medium' ? t('auroraChanceMedium') : state.aurora === 'Low' ? t('auroraChanceLow') : '—'}.</div>
        </div>
        <div className="p-2 bg-space-card/50 rounded-lg border border-accent-purple/20 text-center">
          <div className="text-xs text-text-gray mb-1">{t('solarWindTemp')}</div>
          <div className="text-lg font-bold">{state.wind.temperature?.toFixed?state.wind.temperature.toFixed(0):state.wind.temperature} K</div>
          <div className="text-xs text-text-light">{t('highTempsFollowCMEs')}</div>
        </div>
        <div className="p-2 bg-space-card/50 rounded-lg border border-accent-purple/20 text-center">
          <div className="text-xs text-text-gray mb-1">{t('auroraChance')}</div>
          <div className="text-lg font-bold">{state.aurora || '—'}</div>
          <div className="text-xs text-text-light">{t('lookNorthAtNight')}</div>
        </div>
      </div>
      
      {/* Historical Comparison Section */}
      {historicalComparison && (
        <div className="mt-3 p-3 bg-gradient-to-br from-accent-yellow/10 to-accent-orange/10 rounded-lg border border-accent-yellow/30">
          <div className="flex items-start gap-2 mb-2">
            <span className="text-xl">{historicalComparison.event.emoji}</span>
            <div className="flex-1">
              <div className="text-xs font-bold text-accent-yellow mb-1">
                🏆 Compare to History
              </div>
              <div className="text-sm text-text-light leading-relaxed">
                <span className="font-bold text-accent-blue">Today: {historicalComparison.currentFlare}</span>
                {' vs '}
                <span className="font-bold text-accent-orange">{historicalComparison.event.name}: {historicalComparison.event.flareClass}</span>
              </div>
              <div className="text-xs text-accent-yellow mt-1 font-medium">
                {historicalComparison.comparison}
              </div>
              <div className="text-xs text-text-gray mt-1 italic">
                {historicalComparison.event.funFact}
              </div>
            </div>
          </div>
        </div>
      )}
      
      {state.updated && <div className="text-xs text-text-gray mt-2">{t('lastUpdated')} {new Date(state.updated).toLocaleTimeString()}</div>}
    </div>
  );
});

export default TodayAtAGlance;


