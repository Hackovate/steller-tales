# Stellar Tales

Digital children’s story that explains space weather using live data and friendly visuals.

## Features
- Real‑time alerts ticker (NOAA SWPC)
- Flare monitor: GOES X‑ray flux with C/M/X bands
- Solar wind gauges: speed, density, Bz (DSCOVR)
- Kp forecast bars and “Storm Watch” badge
- Aurora probability maps (NH/SH)
- Space‑weather events timeline (NASA DONKI)
- Story panels: impacts on pilots, astronauts, farmers, grid operators, public
- Visual learning gallery (NASA SVS, GOES‑R multimedia)

## Primary Endpoints
- SWPC Alerts: `https://services.swpc.noaa.gov/products/alerts.json`
- GOES X‑ray (1‑day): `https://services.swpc.noaa.gov/json/goes/primary/xrays-1-day.json`
- Solar wind (mag): `https://services.swpc.noaa.gov/products/solar-wind/mag-1-day.json`
- Solar wind (plasma): `https://services.swpc.noaa.gov/products/solar-wind/plasma-1-day.json`
- Kp 3‑day forecast: `https://services.swpc.noaa.gov/products/3-day-forecast.json`
- Aurora map (NH): `https://services.swpc.noaa.gov/images/aurora-forecast-northern-hemisphere.png`
- Aurora map (SH): `https://services.swpc.noaa.gov/images/aurora-forecast-southern-hemisphere.png`
- Sun images: `https://services.swpc.noaa.gov/images/suvi/suvi-latest-195.jpg`, `https://services.swpc.noaa.gov/images/sxi/sxi-latest.jpg`

### NASA DONKI (requires api.nasa.gov key)
- Flares (FLR): `https://api.nasa.gov/DONKI/FLR?startDate=YYYY-MM-DD&endDate=YYYY-MM-DD&api_key=YOUR_KEY`
- CME: `https://api.nasa.gov/DONKI/CME?...&api_key=YOUR_KEY`
- CME Analysis: `https://api.nasa.gov/DONKI/CMEAnalysis?...&api_key=YOUR_KEY`
- Geomagnetic storms (GST): `https://api.nasa.gov/DONKI/GST?...&api_key=YOUR_KEY`
- Solar energetic particles (SEP): `https://api.nasa.gov/DONKI/SEP?...&api_key=YOUR_KEY`
- Notifications: `https://api.nasa.gov/DONKI/notifications?...&api_key=YOUR_KEY`

### NASA Images & APOD
- Images API search: `https://images-api.nasa.gov/search?q=aurora&media_type=image`
- APOD: `https://api.nasa.gov/planetary/apod?api_key=YOUR_KEY`

## Dev Notes
- Use helpers in `utils/nasaAPI.js` and `utils/helpers.js`
- Configure `VITE_NASA_API_KEY` (do not hardcode)
- Show “Last updated” on each widget; polite polling (alerts 15–60s; timeseries 60–120s; imagery 60–180s; DONKI 5–15m)
- Attribution: NOAA SWPC, NASA DONKI/GOES; visuals NASA SVS/GOES‑R

## APIs & Usage Map

This project uses two primary API groups, wrapped with small utility modules and consumed by components/pages as listed below.

### NASA APIs (`src/utils/nasaAPI.js`)
- `getSpaceWeatherSummary()`
  - `src/context/AppContext.jsx`
  - `src/components/TodayAtAGlance.jsx`
- `getAPOD({ cacheMinutes })`
  - `src/context/AppContext.jsx`
  - `src/components/VisualGallery.jsx`
- `getSolarFlares({})`
  - `src/components/EventsTimeline.jsx`
  - `src/components/ImpactStoryPanels.jsx`
- `getCoronalMassEjections({})`
  - `src/components/EventsTimeline.jsx`
- `getGeomagneticStorms({})`
  - `src/components/EventsTimeline.jsx`
  - `src/components/ImpactStoryPanels.jsx`
- `getSEPs({})`
  - `src/components/EventsTimeline.jsx`
  - `src/components/ImpactStoryPanels.jsx`
- `searchImages({ q, page, cacheMinutes })`
  - `src/components/VisualGallery.jsx`

### NOAA SWPC APIs (`src/utils/swpcAPI.js`)
- `getAlerts()`
  - `src/components/AlertsTicker.jsx`
  - `src/components/ImpactStoryPanels.jsx`
- `getSolarWindMag1Day()`, `getSolarWindPlasma1Day()`
  - `src/components/SolarWindGauges.jsx`
- `getKp3DayForecast()`
  - `src/components/AuroraMap.jsx`

### Dev Proxy (Vite)
- See `vite.config.js` for proxies: `/nasa`, `/swpc`, `/nasa-images`

## Page → API usage

- Home (`src/pages/HomePage.jsx`)
  - APOD (NASA): shows Astronomy Picture of the Day pulled via context (`AppContext` → `nasaAPI.getAPOD`)
  - Space weather summary (NASA): loaded in `AppContext` with `nasaAPI.getSpaceWeatherSummary`; surfaced in widgets like Today‑at‑a‑Glance

- Dashboard (`src/pages/DashboardPage.jsx`)
  - NASA DONKI timeline, flare/SEP/GST data via components: `EventsTimeline`, `ImpactStoryPanels`
  - SWPC live data via components: `SolarWindGauges`, `AuroraMap`, `AlertsTicker` (alerts only)

- Games (`src/pages/GamesPage.jsx`)
  - Visual Learning Gallery: NASA APOD + NASA Images Library search via `VisualGallery` → `nasaAPI.getAPOD`, `nasaAPI.searchImages`
  - Mini‑games are local only (no API)

- Wiki (`src/pages/WikiPage.jsx`, `src/pages/WikiDetailPage.jsx`)
  - Static/local assets (no external API)

- Stories (`src/pages/StoriesPage.jsx`)
  - Static images and local quiz data (no external API)