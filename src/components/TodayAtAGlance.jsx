import React, { useEffect, useState } from 'react';
import { useApp } from '../context/AppContext';
import { useLanguage } from '../context/LanguageContext';
import { nasaAPI } from '../utils/nasaAPI';
import { getSolarWindPlasma1Day } from '../utils/swpcAPI';

const POLL_MS = 90000;

const TodayAtAGlance = () => {
  const { spaceWeatherData } = useApp();
  const { t } = useLanguage();
  const [state, setState] = useState({ flare: '—', kp: null, wind: { temperature: null }, aurora: null, updated: null });

  useEffect(() => {
    let mounted = true;
    const fetchData = async () => {
      try {
        const [summary, plasma] = await Promise.all([
          spaceWeatherData || nasaAPI.getSpaceWeatherSummary(),
          getSolarWindPlasma1Day().catch(() => null)
        ]);
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
      } catch {}
    };
    fetchData();
    const t = setInterval(fetchData, POLL_MS);
    return () => { mounted = false; clearInterval(t); };
  }, []);

  // Aurora chance shown here; detailed aurora map is in Games tab

  return (
    <div className="bg-gradient-to-br from-[#16213e]/95 to-[#1a1a2e]/95 rounded-2xl p-4 border border-accent-purple/30 shadow-lg">
      <div className="flex items-center gap-3 mb-2">
        <span className="text-2xl">🌞</span>
        <h3 className="text-lg font-bold text-accent-blue tracking-wide">{t('todayAtAGlance')}</h3>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div className="p-3 bg-space-card/50 rounded-xl border border-accent-purple/20 text-center">
          <div className="text-sm text-text-gray mb-1">{t('biggestFlare')}</div>
          <div className="text-2xl font-bold">{state.flare}</div>
          <div className="text-xs text-text-light">{t('whatThisMeans')} {state.flare==='X'?t('sunsXraysVeryStrong'):state.flare==='M'?t('sunsXraysStrong'):state.flare==='C'?t('sunsXraysBitActive'):t('sunsXraysCalm')}</div>
        </div>
        <div className="p-3 bg-space-card/50 rounded-xl border border-accent-purple/20 text-center">
          <div className="text-sm text-text-gray mb-1">{t('currentKp')}</div>
          <div className="text-2xl font-bold">{state.kp ?? '—'}</div>
          <div className="text-xs text-text-light">{t('whatThisMeans')} {state.aurora === 'High' ? t('auroraChanceHigh') : state.aurora === 'Medium' ? t('auroraChanceMedium') : state.aurora === 'Low' ? t('auroraChanceLow') : '—'}.</div>
        </div>
        <div className="p-3 bg-space-card/50 rounded-xl border border-accent-purple/20 text-center">
          <div className="text-sm text-text-gray mb-1">{t('solarWindTemp')}</div>
          <div className="text-2xl font-bold">{state.wind.temperature?.toFixed?state.wind.temperature.toFixed(0):state.wind.temperature} K</div>
          <div className="text-xs text-text-light">{t('highTempsFollowCMEs')}</div>
        </div>
        <div className="p-3 bg-space-card/50 rounded-xl border border-accent-purple/20 text-center">
          <div className="text-sm text-text-gray mb-1">{t('auroraChance')}</div>
          <div className="text-2xl font-bold">{state.aurora || '—'}</div>
          <div className="text-xs text-text-light">{t('lookNorthAtNight')}</div>
        </div>
      </div>
      {state.updated && <div className="text-xs text-text-gray mt-2">{t('lastUpdated')} {new Date(state.updated).toLocaleTimeString()}</div>}
    </div>
  );
};

export default TodayAtAGlance;


