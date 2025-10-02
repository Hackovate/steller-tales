import React, { useEffect, useMemo, useState } from 'react';
import { getAlerts } from '../utils/swpcAPI';
import { nasaAPI } from '../utils/nasaAPI';

const POLL_MS = 120000; // 2 min; DONKI cached 5–15m inside utils

const panels = [
  { key: 'farmers', title: 'Farmers', icon: '🚜', text: 'GPS on tractors can wobble during strong storms.' },
  { key: 'pilots', title: 'Pilots', icon: '✈️', text: 'Long‑range HF radio can fade during big flares.' },
  { key: 'astronauts', title: 'Astronauts', icon: '🧑‍🚀', text: 'Extra radiation protection during SEP events.' },
  { key: 'grid', title: 'Grid Operators', icon: '⚡', text: 'Strong storms can stress power lines and transformers.' },
  { key: 'everyone', title: 'Everyone', icon: '🌌', text: 'Auroras may be visible. Wi‑Fi myths: storms don’t melt routers.' }
];

const ImpactStoryPanels = () => {
  const [active, setActive] = useState('everyone');
  const [triggers, setTriggers] = useState({ flare: null, storm: null, sep: null });

  useEffect(() => {
    let mounted = true;
    const fetchData = async () => {
      try {
        const [alerts, flares, storms, seps] = await Promise.all([
          getAlerts(),
          nasaAPI.getSolarFlares({}),
          nasaAPI.getGeomagneticStorms({}),
          nasaAPI.getSEPs({})
        ]);
        const latestFlr = (flares || [])[0];
        const latestGst = (storms || [])[0];
        const latestSep = (seps || [])[0];
        if (!mounted) return;
        setTriggers({ flare: latestFlr?.intensity || null, storm: latestGst?.kpIndex || null, sep: !!latestSep });
        if (latestFlr?.intensity?.startsWith('M') || latestFlr?.intensity?.startsWith('X')) setActive('pilots');
        else if ((latestGst?.kpIndex || 0) >= 5) setActive('grid');
        else if (latestSep) setActive('astronauts');
        else setActive('everyone');
      } catch {}
    };
    fetchData();
    const t = setInterval(fetchData, POLL_MS);
    return () => { mounted = false; clearInterval(t); };
  }, []);

  const content = useMemo(() => panels.find((p) => p.key === active) || panels[4], [active]);

  return (
    <div className="bg-gradient-to-br from-[#16213e]/95 to-[#1a1a2e]/95 rounded-2xl p-4 border border-accent-purple/30 shadow-lg">
      <div className="flex items-center gap-3 mb-2">
        <span className="text-2xl">📖</span>
        <h3 className="text-lg font-bold text-accent-blue tracking-wide">Impact on People</h3>
      </div>
      <div className="flex gap-2 mb-3 overflow-x-auto no-scrollbar">
        {panels.map((p) => (
          <button key={p.key} onClick={() => setActive(p.key)} className={`px-3 py-2 rounded-xl border ${active===p.key?'border-accent-purple text-accent-yellow':'border-accent-purple/30 text-text-light'} bg-space-card/50 whitespace-nowrap`}>{p.icon} {p.title}</button>
        ))}
      </div>
      <div className="p-4 bg-space-card/50 rounded-xl border border-accent-purple/20">
        <div className="text-3xl mb-2">{content.icon}</div>
        <div className="text-text-light font-semibold mb-1">{content.title}</div>
        <div className="text-sm text-text-light/90">{content.text}</div>
        <div className="text-xs text-text-gray mt-2">Triggers — Flare: {triggers.flare || '—'} • Kp: {triggers.storm ?? '—'} • SEP: {triggers.sep ? 'Yes' : 'No'}</div>
      </div>
    </div>
  );
};

export default ImpactStoryPanels;


