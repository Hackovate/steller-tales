// Space Weather Quiz (static) - curated from user-provided references
// Sources (for educators):
// - NASA Heliophysics: https://science.nasa.gov/heliophysics/focus-areas/space-weather/
// - NASA: Solar storms and flares: https://science.nasa.gov/sun/solar-storms-and-flares/
// - NOAA SWPC: https://www.swpc.noaa.gov/
// - Canadian Space Weather: https://www.spaceweather.gc.ca/index-en.php
// - GOES-R multimedia: https://www.goes-r.gov/multimedia/space-weather.html
// - NASA SVS items referenced by id

// Helper to shuffle arrays deterministically if a seed is provided
export const shuffleArray = (arr) => {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
};

export const quizCategories = [
  {
    id: 'basics',
    title: 'Space Weather Basics',
    questions: [
      {
        q: 'What is space weather?',
        options: [
          'Weather forecasts for space launches',
          'Conditions on the Sun and in space that affect Earth',
          'The climate on other planets',
          'The temperature of stars far away'
        ],
        a: 1,
        explain: 'Space weather describes solar activity and conditions in space that can affect Earth and our technology.'
      },
      {
        q: 'What causes the Northern Lights (auroras)?',
        options: [
          'Moonlight reflecting on clouds',
          'Charged particles from the Sun interacting with Earths atmosphere',
          'Volcanoes near the North Pole',
          'City lights at night'
        ],
        a: 1,
        explain: 'Auroras happen when solar particles collide with oxygen and nitrogen in Earths upper atmosphere, making them glow green, red, and purple!'
      },
      {
        q: 'Which part of Earth helps protect us from space weather?',
        options: [
          'The oceans',
          'The magnetic field and atmosphere',
          'Mountains',
          'Clouds'
        ],
        a: 1,
        explain: 'Earths magnetic field acts like an invisible shield, deflecting most harmful solar radiation and particles away from our planet.'
      }
    ]
  },
  {
    id: 'flares',
    title: 'Solar Flares & X-rays',
    questions: [
      {
        q: 'A solar flare is best described as...',
        options: [
          'A piece of the Sun breaking off',
          'A sudden burst of electromagnetic energy from the Sun',
          'A comet flying into the Sun',
          'An eclipse'
        ],
        a: 1,
        explain: 'Solar flares are intense bursts of radiation released when magnetic energy stored in the Sun\'s atmosphere is suddenly released!'
      },
      {
        q: 'Which flare class is the strongest?',
        options: ['C-class', 'M-class', 'X-class', 'B-class'],
        a: 2,
        explain: 'X-class flares are the most powerful! Each class is 10x stronger than the one before: B -> C -> M -> X. An X10 flare is 10,000x stronger than a B1!'
      },
      {
        q: 'How fast do X-rays from a solar flare travel to Earth?',
        options: [
          'Speed of light (8 minutes)',
          '1 hour',
          '1-3 days',
          'Instantly'
        ],
        a: 0,
        explain: 'X-rays travel at the speed of light, so they reach Earth in just 8 minutes! This is why we can\'t get advance warning of flare impacts.'
      },
      {
        q: 'What can a strong X-class solar flare disrupt on Earth?',
        options: [
          'Ocean tides',
          'Weather patterns',
          'Radio communications and GPS',
          'Earth\'s rotation'
        ],
        a: 2,
        explain: 'Strong flares ionize Earth\'s upper atmosphere, causing radio blackouts (especially HF radio) and GPS errors. Pilots and sailors are affected!'
      }
    ]
  },
  {
    id: 'cme',
    title: 'CMEs & Solar Storms',
    questions: [
      {
        q: 'A Coronal Mass Ejection (CME) is...',
        options: [
          'A cloud of billion-ton solar plasma launched into space',
          'A new planet forming',
          'A type of asteroid',
          'A telescope error'
        ],
        a: 0,
        explain: 'A CME is a massive explosion of billions of tons of magnetized plasma ejected from the Sun at speeds up to 3,000 km/s (6.7 million mph)!'
      },
      {
        q: 'How long does it take for a CME to reach Earth?',
        options: [
          '8 minutes',
          '1-3 days',
          '1 week',
          '1 month'
        ],
        a: 1,
        explain: 'Fast CMEs can reach Earth in 15-18 hours, while typical CMEs take 1-3 days. This gives us time to prepare!'
      },
      {
        q: 'What happens when a CME hits Earth\'s magnetic field?',
        options: [
          'Nothing at all',
          'A geomagnetic storm can occur',
          'The Moon gets brighter',
          'Earthquakes happen'
        ],
        a: 1,
        explain: 'CMEs compress Earth\'s magnetosphere, triggering geomagnetic storms that can create auroras, disrupt satellites, and affect power grids!'
      },
      {
        q: 'Which famous event caused a 9-hour blackout in Quebec, Canada?',
        options: [
          'A hurricane',
          'March 1989 geomagnetic storm',
          'An earthquake',
          'A flood'
        ],
        a: 1,
        explain: 'The March 13, 1989 geomagnetic storm (Kp 9) caused Quebec\'s power grid to collapse in 90 seconds, leaving 6 million people without power for 9 hours!'
      }
    ]
  },
  {
    id: 'storms',
    title: 'Geomagnetic Storms',
    questions: [
      {
        q: 'Geomagnetic storms are measured by which index?',
        options: ['UV Index', 'Kp Index', 'Richter Scale', 'Air Quality Index'],
        a: 1,
        explain: 'The Kp index measures geomagnetic activity from 0 (quiet) to 9 (extreme storm). Kp 5+ means aurora are likely visible at mid-latitudes!'
      },
      {
        q: 'What is the "auroral oval"?',
        options: [
          'A type of spacecraft',
          'The oval-shaped region around Earth\'s poles where auroras occur',
          'A crater on the Moon',
          'A solar feature'
        ],
        a: 1,
        explain: 'The auroral oval is a ring-shaped zone around the magnetic poles where auroras are most common. During storms, it expands toward the equator!'
      },
      {
        q: 'During a Kp 9 storm, auroras can be seen as far south as...',
        options: [
          'Alaska only',
          'Canada',
          'Southern US states like Texas and Florida',
          'Auroras never happen outside polar regions'
        ],
        a: 2,
        explain: 'During extreme Kp 9 storms, the auroral oval expands so much that people in Mexico, Florida, and even the Caribbean can see auroras!'
      },
      {
        q: 'Which technology is MOST vulnerable to geomagnetic storms?',
        options: [
          'Light bulbs',
          'Satellites and power grids',
          'Bicycles',
          'Books'
        ],
        a: 1,
        explain: 'Satellites can be damaged by radiation, GPS signals get disrupted, and power grids can experience dangerous current surges during storms!'
      }
    ]
  },
  {
    id: 'particles',
    title: 'Solar Energetic Particles',
    questions: [
      {
        q: 'Solar Energetic Particles (SEPs) are...',
        options: [
          'Tiny pieces of the Sun traveling near light speed',
          'High-energy protons and electrons accelerated by solar events',
          'Meteorites from the Sun',
          'Solar dust'
        ],
        a: 1,
        explain: 'SEPs are super-fast charged particles (mostly protons) accelerated to nearly the speed of light by solar flares and CMEs!'
      },
      {
        q: 'Who is MOST at risk from Solar Energetic Particles?',
        options: [
          'Deep-sea divers',
          'Astronauts in space and pilots on polar flights',
          'Mountain climbers',
          'People at the beach'
        ],
        a: 1,
        explain: 'Astronauts and high-altitude polar flight crews receive higher radiation doses during SEP events. NASA monitors this closely!'
      },
      {
        q: 'How fast can SEPs reach Earth after a solar flare?',
        options: [
          '8 minutes',
          '15-30 minutes',
          '1-3 days',
          '1 week'
        ],
        a: 1,
        explain: 'The fastest SEPs can reach Earth in 15-30 minutes! This is faster than CMEs (1-3 days) but slower than X-rays (8 minutes).'
      }
    ]
  },
  {
    id: 'safety',
    title: 'Space Weather Safety & Tech',
    questions: [
      {
        q: 'What does NOAA\'s Space Weather Prediction Center do?',
        options: [
          'Predict rain and snow',
          'Monitor and forecast solar activity and space weather',
          'Study ocean temperatures',
          'Track hurricanes only'
        ],
        a: 1,
        explain: 'NOAA SWPC provides 24/7 monitoring and forecasts of solar flares, CMEs, geomagnetic storms, and solar radiation to protect technology and people!'
      },
      {
        q: 'During a strong geomagnetic storm, GPS accuracy can...',
        options: [
          'Improve',
          'Degrade by several meters',
          'Stop working completely forever',
          'Stay exactly the same'
        ],
        a: 1,
        explain: 'Storms ionize the atmosphere, causing GPS signals to take longer paths. Errors can reach 10+ meters, affecting navigation and surveying!'
      },
      {
        q: 'If a Carrington Event-level storm hit Earth today, it could...',
        options: [
          'Have no effect',
          'Cause widespread power outages and satellite damage',
          'Stop the Earth from rotating',
          'Change the weather permanently'
        ],
        a: 1,
        explain: 'A Carrington-level event today could damage transformers, disable satellites, and cause trillion-dollar economic impacts. We\'re much more vulnerable now!'
      },
      {
        q: 'How do satellites protect themselves during solar storms?',
        options: [
          'They hide behind the Moon',
          'They enter "safe mode" and orient solar panels away from the Sun',
          'They land back on Earth',
          'They don\'t need protection'
        ],
        a: 1,
        explain: 'Satellites can turn sensitive instruments off, reorient to minimize radiation exposure, and wait out the storm in a protective configuration!'
      },
      {
        q: 'Auroras mean Wi-Fi routers and electronics are in danger.',
        options: ['True', 'False'],
        a: 1,
        explain: 'Myth! Auroras are beautiful natural lights caused by particles in Earth\'s UPPER atmosphere (100+ km up). Your home electronics are perfectly safe!'
      },
      {
        q: 'Which color aurora is caused by oxygen at high altitudes (200+ km)?',
        options: [
          'Green',
          'Red',
          'Blue',
          'Yellow'
        ],
        a: 1,
        explain: 'Red auroras come from oxygen at 200-400 km altitude. Green auroras (most common) come from oxygen at 100-200 km. Blue/purple come from nitrogen!'
      }
    ]
  }
];

// Levels structure: basic, intermediate, advanced
export const quizLevels = {
  basic: quizCategories,
  intermediate: quizCategories, // placeholder to expand with more difficult items
  advanced: quizCategories // placeholder to expand with more difficult items
};

// Generate a session: 10-15 randomized questions for a given level
export const generateQuizSession = (level = 'basic', count = 12) => {
  const cats = quizLevels[level] || quizCategories;
  const pool = cats.flatMap((c) => c.questions.map((q) => ({ ...q, category: c.title })));
  return shuffleArray(pool).slice(0, Math.min(Math.max(10, count), 15));
};


