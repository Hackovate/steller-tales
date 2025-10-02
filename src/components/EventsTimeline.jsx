import React, { useEffect, useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { nasaAPI } from '../utils/nasaAPI';

const POLL_MS = 300000; // 5 min

const iconFor = (type) => ({
  FLR: '⚡',
  CME: '☀️',
  GST: '🧭',
  SEP: '🌟'
}[type] || '🛰️');

const EventsTimeline = () => {
  const { t } = useLanguage();
  const [events, setEvents] = useState([]);

  // Helper function to validate and format dates
  const isValidDate = (dateString) => {
    if (!dateString) return false;
    const date = new Date(dateString);
    return !isNaN(date.getTime());
  };

  const formatDate = (dateString) => {
    if (!isValidDate(dateString)) return 'Date unavailable';
    return new Date(dateString).toLocaleString();
  };

  useEffect(() => {
    let mounted = true;
    const fetchData = async () => {
      try {
        const [flares, cmes, storms, seps] = await Promise.all([
          nasaAPI.getSolarFlares({}),
          nasaAPI.getCoronalMassEjections({}),
          nasaAPI.getGeomagneticStorms({}),
          nasaAPI.getSEPs({})
        ]);
        
        const all = [
          ...flares.map((f) => ({ 
            type: 'FLR', 
            time: f.peakTime || f.date, 
            text: `${f.intensity} flare`, 
            explain: f.childFriendlyExplanation,
            isValidDate: isValidDate(f.peakTime || f.date)
          })),
          ...cmes.map((c) => ({ 
            type: 'CME', 
            time: c.date, 
            text: `CME ~${c.speed} km/s`, 
            explain: c.childFriendlyExplanation,
            isValidDate: isValidDate(c.date)
          })),
          ...storms.map((s) => ({ 
            type: 'GST', 
            time: s.date, 
            text: `Kp ${s.kpIndex}`, 
            explain: s.childFriendlyExplanation,
            isValidDate: isValidDate(s.date)
          })),
          ...(seps || []).map((s) => ({ 
            type: 'SEP', 
            time: s.date, 
            text: 'SEP event', 
            explain: s.childFriendlyExplanation,
            isValidDate: isValidDate(s.date)
          }))
        ]
        // Filter out events with invalid dates and sort by time
        .filter(event => event.isValidDate)
        .sort((a, b) => new Date(b.time) - new Date(a.time));
        
        if (!mounted) return;
        setEvents(all);
      } catch {}
    };
    fetchData();
    const t = setInterval(fetchData, POLL_MS);
    return () => { mounted = false; clearInterval(t); };
  }, []);

  return (
    <div className="bg-gradient-to-br from-[#16213e]/95 to-[#1a1a2e]/95 rounded-2xl p-3 sm:p-4 border border-accent-purple/30 shadow-lg">
      <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
        <span className="text-xl sm:text-2xl">🗓️</span>
        <h3 className="text-base sm:text-lg font-bold text-accent-blue tracking-wide">{t('spaceWeatherEvents')}</h3>
      </div>
      
      {/* Mobile-friendly scrollable container */}
      <div className="max-h-80 sm:max-h-96 overflow-y-auto overscroll-contain scrollbar-thin scrollbar-thumb-accent-purple/30 scrollbar-track-transparent">
        <div className="space-y-2 pr-1 sm:pr-2">
          {events.length === 0 ? (
            <div className="text-text-light text-sm py-8 text-center">{t('loading')}</div>
          ) : (
            events.map((e, idx) => (
              <div key={idx} className="flex items-start gap-2 sm:gap-3 p-2 sm:p-3 bg-space-card/50 rounded-xl border border-accent-purple/20 hover:bg-space-card/70 transition-colors">
                <div className="text-xl sm:text-2xl flex-shrink-0" aria-hidden>{iconFor(e.type)}</div>
                <div className="flex-1 min-w-0">
                  <div className="text-text-light font-semibold text-xs sm:text-sm leading-tight">{e.text}</div>
                  <div className="text-text-gray text-xs mb-1 mt-1">{formatDate(e.time)}</div>
                  <div className="text-xs text-text-light/90 leading-relaxed">{e.explain}</div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default EventsTimeline;


