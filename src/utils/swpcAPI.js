// Lightweight SWPC fetch helpers (no auth). Polite polling recommended.

// Use Vite dev proxy to bypass CORS locally; fall back to real host in production
const isDev = typeof window !== 'undefined' && window.location && window.location.hostname === 'localhost';
const SWPC_BASE = isDev ? '/swpc' : 'https://services.swpc.noaa.gov';

const json = async (url) => {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`SWPC request failed: ${res.status}`);
  return res.json();
};

export const getAlerts = () => json(`${SWPC_BASE}/products/alerts.json`);
export const getNotifications = () => json(`${SWPC_BASE}/products/notifications.json`);

// GOES X-ray flux (primary)
export const getXray1Day = () => json(`${SWPC_BASE}/json/goes/primary/xrays-1-day.json`);
export const getXray7Day = () => json(`${SWPC_BASE}/json/goes/primary/xrays-7-day.json`);

// DSCOVR solar wind (1-day, 1-min cadence)
export const getSolarWindMag1Day = () => json(`${SWPC_BASE}/products/solar-wind/mag-1-day.json`);
export const getSolarWindPlasma1Day = () => json(`${SWPC_BASE}/products/solar-wind/plasma-1-day.json`);

// Kp forecast
export const getKp3DayForecast = () => json(`${SWPC_BASE}/products/3-day-forecast.json`);

// Estimated planetary K index, 1-minute cadence (fallback for current conditions)
export const getEstimatedKp1m = () => json(`${SWPC_BASE}/json/estimated-planetary-k-index-1m.json`).catch(() => json(`${SWPC_BASE}/json/planetary_k_index_1m.json`));

// Aurora images
export const getAuroraUrls = () => ({
  north: `${SWPC_BASE}/images/aurora-forecast-northern-hemisphere.png`,
  south: `${SWPC_BASE}/images/aurora-forecast-southern-hemisphere.png`
});

// Latest Sun images
export const getSunImageUrls = () => ({
  suvi195: `${SWPC_BASE}/images/suvi/suvi-latest-195.jpg`,
  sxi: `${SWPC_BASE}/images/sxi/sxi-latest.jpg`
});

// Helpers to classify flare class bands for kid-friendly visuals
export const classifyFlareLevel = (flux) => {
  // flux in W/m^2 (e.g., 1e-6 = C1.0). Return band and label.
  if (flux >= 1e-4) return { band: 'X', color: 'text-accent-orange' };
  if (flux >= 1e-5) return { band: 'M', color: 'text-accent-yellow' };
  if (flux >= 1e-6) return { band: 'C', color: 'text-accent-blue' };
  return { band: 'B/A', color: 'text-text-gray' };
};


