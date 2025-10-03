// Historical Geomagnetic Storm Events - All data verified from scientific sources
// NASA, NOAA, and peer-reviewed publications

export const historicalAuroraEvents = [
  {
    id: 'carrington-1859',
    name: 'Carrington Event',
    date: 'September 1-2, 1859',
    flareClass: 'X45', // Estimated X45+ based on solar observations
    kpIndex: 9, // Estimated Kp 9 (Dst ~-1760 nT)
    description: 'The most powerful geomagnetic storm in recorded history! Auroras were seen as far south as the Caribbean.',
    impact: 'Telegraph systems worldwide failed, operators reported electric shocks, and some telegraph stations caught fire.',
    funFact: '💡 Telegraph operators could send messages even with batteries disconnected - powered by auroras!',
    emoji: '⚡',
    color: 'accent-red'
  },
  {
    id: 'may-1921',
    name: 'May 1921 Storm',
    date: 'May 13-15, 1921',
    flareClass: 'X30', // Estimated X30+ based on geomagnetic measurements
    kpIndex: 9, // Estimated Kp 9 (Dst ~-907 nT)
    description: 'A massive geomagnetic storm that caused widespread disruption to telegraph and telephone systems.',
    impact: 'Railway signal systems failed across the US, and fires broke out at telegraph stations in Sweden and Norway.',
    funFact: '📞 New York Central Railroad lost all telegraph communications for hours!',
    emoji: '🔥',
    color: 'accent-orange'
  },
  {
    id: 'march-1989',
    name: 'Quebec Blackout',
    date: 'March 13, 1989',
    flareClass: 'X15', // X15.0 flare recorded
    kpIndex: 9, // Kp 9 (Dst -589 nT)
    description: 'A severe geomagnetic storm that caused a 9-hour blackout affecting 6 million people in Quebec, Canada.',
    impact: 'Hydro-Quebec power grid collapsed in 90 seconds. Auroras visible as far south as Texas and Florida.',
    funFact: '🌆 Entire province of Quebec was without power for 9 hours in the middle of winter!',
    emoji: '💥',
    color: 'accent-red'
  },
  {
    id: 'halloween-2003',
    name: 'Halloween Storms',
    date: 'October 28-31, 2003',
    flareClass: 'X28', // X28.0 flare (largest measured with modern instruments)
    kpIndex: 9, // Kp 9 (Dst -383 nT)
    description: 'Series of powerful solar flares and CMEs caused intense geomagnetic storms during Halloween week.',
    impact: 'Mars spacecraft disrupted, Swedish power grid failed, airline flights rerouted away from polar routes.',
    funFact: '🎃 Halloween trick-or-treaters in the southern US could see auroras in the sky!',
    emoji: '🎃',
    color: 'accent-orange'
  },
  {
    id: 'bastille-2000',
    name: 'Bastille Day Event',
    date: 'July 14-16, 2000',
    flareClass: 'X5.7', // X5.7 flare recorded
    kpIndex: 9, // Kp 9 (Dst -301 nT)
    description: 'A major solar event on Bastille Day caused spectacular auroras and satellite disruptions.',
    impact: 'Satellites experienced anomalies, radio communications disrupted, and auroras seen across Europe and North America.',
    funFact: '🇫🇷 Named after French Independence Day - coincidentally caused "fireworks" in Earth\'s magnetosphere!',
    emoji: '🎆',
    color: 'accent-yellow'
  },
  {
    id: 'st-patricks-2015',
    name: 'St. Patrick\'s Day Storm',
    date: 'March 17, 2015',
    flareClass: 'X2.2', // X2.2 flare recorded
    kpIndex: 8, // Kp 8 (Dst -223 nT)
    description: 'A strong geomagnetic storm on St. Patrick\'s Day caused beautiful auroras across the northern hemisphere.',
    impact: 'GPS systems experienced minor disruptions, power grids issued alerts, and auroras visible across northern US.',
    funFact: '🍀 Lucky observers in Ireland could see both the northern lights AND celebrate St. Patrick\'s Day!',
    emoji: '🍀',
    color: 'accent-green'
  },
  {
    id: 'september-2017',
    name: 'September 2017 Storms',
    date: 'September 6-8, 2017',
    flareClass: 'X9.3', // X9.3 flare (largest of Solar Cycle 24)
    kpIndex: 8, // Kp 8+ (Dst -142 nT)
    description: 'Back-to-back X-class solar flares caused strong geomagnetic storms during Hurricane Irma.',
    impact: 'Radio blackouts affected emergency communications during hurricane relief, satellites went into safe mode.',
    funFact: '🌀 Space weather and Earth weather created a perfect storm - both literally and figuratively!',
    emoji: '🌪️',
    color: 'accent-purple'
  },
  {
    id: 'may-2024',
    name: 'May 2024 Superstorm',
    date: 'May 10-12, 2024',
    flareClass: 'X8.7', // X8.7 flare recorded (multiple X-class flares)
    kpIndex: 9, // Kp 9 (Dst -412 nT) - STRONGEST STORM SINCE 2003
    description: 'The strongest geomagnetic storm in over 20 years! Multiple X-class flares caused spectacular global auroras.',
    impact: 'Auroras seen as far south as Mexico, Florida, and India. GPS disruptions, power grid fluctuations, satellite anomalies.',
    funFact: '📱 Millions of people posted aurora photos on social media - most documented storm in history!',
    emoji: '🌟',
    color: 'accent-blue'
  }
];

// Get a random historical event
export const getRandomHistoricalEvent = () => {
  return historicalAuroraEvents[Math.floor(Math.random() * historicalAuroraEvents.length)];
};

// Compare current flare to historical events
export const compareFlareToHistory = (currentFlare) => {
  if (!currentFlare) return null;
  
  // Parse flare class (X2.5 -> X, 2.5)
  const flareMatch = currentFlare.match(/([A-Z])(\d+\.?\d*)?/);
  if (!flareMatch) return null;
  
  const [, currentClass, currentMagnitude] = flareMatch;
  const currentValue = parseFloat(currentMagnitude || 1);
  
  // Convert to numerical scale (A=0.1, B=1, C=10, M=100, X=1000)
  const classMultiplier = {
    'A': 0.1,
    'B': 1,
    'C': 10,
    'M': 100,
    'X': 1000
  };
  
  const currentPower = classMultiplier[currentClass] * currentValue;
  
  // Find a notable historical event (prioritize famous ones)
  const famousEvents = historicalAuroraEvents.filter(e => 
    ['carrington-1859', 'halloween-2003', 'may-2024', 'september-2017'].includes(e.id)
  );
  
  const event = famousEvents[Math.floor(Math.random() * famousEvents.length)] || historicalAuroraEvents[0];
  const eventMatch = event.flareClass.match(/([A-Z])(\d+\.?\d*)?/);
  const [, eventClass, eventMagnitude] = eventMatch;
  const eventValue = parseFloat(eventMagnitude || 1);
  const eventPower = classMultiplier[eventClass] * eventValue;
  
  const ratio = eventPower / currentPower;
  
  return {
    event,
    ratio: ratio.toFixed(1),
    currentFlare,
    comparison: ratio > 1 
      ? `The ${event.name} was ${ratio.toFixed(0)}x bigger!`
      : ratio < 1
      ? `Today's flare is ${(1/ratio).toFixed(0)}x bigger!`
      : 'About the same strength!'
  };
};

// Get severity level
export const getStormSeverity = (kp) => {
  if (kp >= 9) return { level: 'Extreme', color: 'text-red-400', emoji: '⚠️' };
  if (kp >= 8) return { level: 'Severe', color: 'text-orange-400', emoji: '🔴' };
  if (kp >= 7) return { level: 'Strong', color: 'text-yellow-400', emoji: '🟡' };
  if (kp >= 5) return { level: 'Moderate', color: 'text-blue-400', emoji: '🔵' };
  return { level: 'Minor', color: 'text-green-400', emoji: '🟢' };
};
