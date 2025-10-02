import React, { useEffect, useState } from 'react';
import { getKp3DayForecast } from '../utils/swpcAPI';

const POLL_MS = 120000; // 2 min

// Very simple Kp -> visibility heuristic (illustrative)
const kpToChance = (kp) => {
  if (kp >= 7) return { label: 'High', percent: 80, color: 'text-accent-orange', note: 'Likely visible at mid‑latitudes' };
  if (kp >= 5) return { label: 'Moderate', percent: 50, color: 'text-accent-yellow', note: 'Possible at higher latitudes' };
  if (kp >= 4) return { label: 'Low', percent: 25, color: 'text-accent-blue', note: 'Mostly polar regions' };
  return { label: 'Very low', percent: 10, color: 'text-text-gray', note: 'Unlikely tonight' };
};

const AuroraMap = () => {
  const [maxKp, setMaxKp] = useState(null);

  useEffect(() => {
    let mounted = true;
    const fetchData = async () => {
      try {
        const raw = await getKp3DayForecast();
        const rows = Array.isArray(raw) ? raw : [];
        let values = [];
        if (rows.length && Array.isArray(rows[0])) {
          const header = rows[0];
          const kpCol = header.findIndex((h) => String(h).toLowerCase().includes('kp'));
          values = rows.slice(1).filter((r) => Array.isArray(r)).map((r) => Number(r[kpCol])).filter((n) => !isNaN(n));
        } else {
          values = rows.filter((o) => typeof o === 'object').map((o) => Number(o.kp || o.kpIndex || o.value)).filter((n) => !isNaN(n));
        }
        const max = values.length ? Math.max(...values) : null;
        if (!mounted) return;
        setMaxKp(max);
      } catch {
        if (!mounted) return;
        setMaxKp(null);
      }
    };
    fetchData();
    const t = setInterval(fetchData, POLL_MS);
    return () => { mounted = false; clearInterval(t); };
  }, []);

  const chance = kpToChance(maxKp ?? 0);

  return (
    <div className="bg-gradient-to-br from-[#16213e]/95 to-[#1a1a2e]/95 rounded-2xl p-4 border border-accent-purple/30 shadow-lg">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          <span className="text-2xl">🌎</span>
          <h3 className="text-lg font-bold text-accent-blue tracking-wide">Aurora Chance (from Kp)</h3>
        </div>
      </div>
      <div className="p-4 bg-space-card/50 rounded-xl border border-accent-purple/20">
        <div className="text-sm text-text-gray mb-1">Max forecast Kp (next 3 days)</div>
        <div className="text-3xl font-bold text-accent-yellow">{maxKp ?? '—'}</div>
        <div className={`mt-2 text-lg font-semibold ${chance.color}`}>{chance.label} chance — ~{chance.percent}%</div>
        <div className="text-sm text-text-light/90 mt-1">{chance.note}</div>
        <div className="mt-3 h-2 w-full bg-space-card rounded-md overflow-hidden">
          <div className="h-full bg-accent-blue" style={{ width: `${Math.min(100, (maxKp || 0) * 14)}%` }} />
        </div>
      </div>
      <div className="mt-2 text-xs text-text-gray">Visibility also depends on darkness and local weather.</div>
    </div>
  );
};

export default AuroraMap;


