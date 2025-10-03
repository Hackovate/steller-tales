// Aurora Hotspots Database - Interactive locations on aurora map
// Coordinates are relative to the aurora map image (0-100% from top-left)

export const auroraHotspots = {
  northern: [
    {
      id: 'alaska-fairbanks',
      name: 'Fairbanks, Alaska',
      coordinates: { x: 15, y: 25 }, // Percentage from top-left
      fact: "Fairbanks is located at 64.8°N latitude, directly under the auroral oval, experiencing auroras 200+ nights per year!",
      tip: "The University of Alaska Fairbanks operates the Geophysical Institute, studying auroral physics and space weather",
      region: 'North America',
      emoji: '🔬'
    },
    {
      id: 'alaska-anchorage',
      name: 'Anchorage, Alaska',
      coordinates: { x: 12, y: 30 },
      fact: "Anchorage at 61.2°N latitude experiences auroras during geomagnetic storms, visible even from urban areas!",
      tip: "The Alaska Volcano Observatory monitors space weather effects on Earth's ionosphere and radio communications",
      region: 'North America',
      emoji: '🔬'
    },
    {
      id: 'tromso-norway',
      name: 'Tromsø, Norway',
      coordinates: { x: 45, y: 20 },
      fact: "Tromsø at 69.6°N latitude hosts the University of Tromsø's Arctic University, a leading auroral research center!",
      tip: "The university studies solar wind-magnetosphere interactions and auroral particle acceleration mechanisms",
      region: 'Europe',
      emoji: '🔬'
    },
    {
      id: 'lofoten-norway',
      name: 'Lofoten Islands, Norway',
      coordinates: { x: 42, y: 25 },
      fact: "The Lofoten Islands at 68.2°N latitude experience frequent auroras due to their position under the auroral oval!",
      tip: "The islands are ideal for studying auroral morphology and the effects of geomagnetic storms on Earth's atmosphere",
      region: 'Europe',
      emoji: '🔬'
    },
    {
      id: 'reykjavik-iceland',
      name: 'Reykjavik, Iceland',
      coordinates: { x: 35, y: 30 },
      fact: "Reykjavik at 64.1°N latitude experiences auroras 8 months per year due to its proximity to the auroral oval!",
      tip: "The Icelandic Meteorological Office monitors space weather and its effects on Earth's magnetic field",
      region: 'Europe',
      emoji: '🔬'
    },
    {
      id: 'akureyri-iceland',
      name: 'Akureyri, Iceland',
      coordinates: { x: 32, y: 25 },
      fact: "Akureyri at 65.7°N latitude experiences frequent auroras due to its northern position and clear skies!",
      tip: "The University of Akureyri conducts research on space weather impacts on Arctic ecosystems",
      region: 'Europe',
      emoji: '🔬'
    },
    {
      id: 'yellowknife-canada',
      name: 'Yellowknife, Canada',
      coordinates: { x: 20, y: 35 },
      fact: "Yellowknife at 62.5°N latitude is optimal for aurora viewing due to its position directly under the auroral oval!",
      tip: "The AuroraMAX project studies auroral phenomena and their relationship to solar wind conditions",
      region: 'North America',
      emoji: '🔬'
    },
    {
      id: 'whitehorse-canada',
      name: 'Whitehorse, Canada',
      coordinates: { x: 18, y: 40 },
      fact: "Whitehorse at 60.7°N latitude experiences frequent auroras with minimal light pollution for optimal viewing!",
      tip: "The Yukon Research Centre studies space weather effects on high-latitude communications and power systems",
      region: 'North America',
      emoji: '🔬'
    },
    {
      id: 'kiruna-sweden',
      name: 'Kiruna, Sweden',
      coordinates: { x: 48, y: 25 },
      fact: "Kiruna hosts the Swedish Institute of Space Physics (IRF) and is a major center for auroral research!",
      tip: "The IRF studies solar wind interactions with Earth's magnetosphere and auroral particle acceleration",
      region: 'Europe',
      emoji: '🔬'
    },
    {
      id: 'rovaniemi-finland',
      name: 'Rovaniemi, Finland',
      coordinates: { x: 50, y: 30 },
      fact: "Rovaniemi is located at 66.5°N latitude, within the auroral oval, and experiences auroras 200+ nights per year!",
      tip: "The Arctic Research Center here studies auroral phenomena and space weather effects on Earth's magnetosphere",
      region: 'Europe',
      emoji: '🔬'
    }
  ],
  southern: [
    {
      id: 'mcmurdo-antarctica',
      name: 'McMurdo Station, Antarctica',
      coordinates: { x: 50, y: 20 },
      fact: "McMurdo Station at 77.8°S latitude experiences continuous auroras during the Antarctic winter (polar night)!",
      tip: "The station conducts research on space weather effects on Earth's magnetosphere and ionosphere",
      region: 'Antarctica',
      emoji: '🔬'
    },
    {
      id: 'hobart-australia',
      name: 'Hobart, Tasmania',
      coordinates: { x: 75, y: 60 },
      fact: "Hobart at 42.9°S latitude experiences auroras during strong geomagnetic storms due to its southern position!",
      tip: "The University of Tasmania studies space weather impacts on Earth's upper atmosphere and radio communications",
      region: 'Australia',
      emoji: '🔬'
    },
    {
      id: 'melbourne-australia',
      name: 'Melbourne, Australia',
      coordinates: { x: 70, y: 65 },
      fact: "Melbourne at 37.8°S latitude occasionally experiences auroras during extreme geomagnetic storms!",
      tip: "The Australian Space Weather Services monitors solar activity and its effects on Earth's magnetic field",
      region: 'Australia',
      emoji: '🔬'
    },
    {
      id: 'christchurch-newzealand',
      name: 'Christchurch, New Zealand',
      coordinates: { x: 80, y: 70 },
      fact: "Christchurch at 43.5°S latitude experiences auroras during geomagnetic storms due to its southern location!",
      tip: "The University of Canterbury operates the Mount John Observatory, studying space weather and auroral physics",
      region: 'New Zealand',
      emoji: '🔬'
    },
    {
      id: 'dunedin-newzealand',
      name: 'Dunedin, New Zealand',
      coordinates: { x: 82, y: 75 },
      fact: "Dunedin at 45.9°S latitude experiences frequent auroras due to its southernmost position in New Zealand!",
      tip: "The University of Otago conducts research on space weather effects on Earth's atmosphere and climate",
      region: 'New Zealand',
      emoji: '🔬'
    },
    {
      id: 'ushuaia-argentina',
      name: 'Ushuaia, Argentina',
      coordinates: { x: 25, y: 80 },
      fact: "Ushuaia at 54.8°S latitude is the world's southernmost city and experiences regular auroras!",
      tip: "The Argentine Antarctic Institute studies space weather effects on Earth's polar regions and climate",
      region: 'South America',
      emoji: '🔬'
    },
    {
      id: 'punta-arenas-chile',
      name: 'Punta Arenas, Chile',
      coordinates: { x: 20, y: 85 },
      fact: "Punta Arenas at 53.2°S latitude experiences auroras during geomagnetic storms in Chilean Patagonia!",
      tip: "The Chilean Antarctic Institute studies space weather impacts on Earth's magnetosphere and ionosphere",
      region: 'South America',
      emoji: '🔬'
    }
  ]
};

// Get hotspots for a specific hemisphere
export const getHotspotsForHemisphere = (hemisphere) => {
  return auroraHotspots[hemisphere] || [];
};

// Get a random hotspot for a hemisphere
export const getRandomHotspot = (hemisphere) => {
  const spots = getHotspotsForHemisphere(hemisphere);
  return spots[Math.floor(Math.random() * spots.length)];
};

// Get hotspot by ID
export const getHotspotById = (id) => {
  for (const hemisphere in auroraHotspots) {
    const spot = auroraHotspots[hemisphere].find(h => h.id === id);
    if (spot) return spot;
  }
  return null;
};
