// Space Weather Quiz (static) — curated from user-provided references
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
          'Charged particles from the Sun interacting with Earth’s atmosphere',
          'Volcanoes near the North Pole',
          'City lights at night'
        ],
        a: 1,
        explain: 'Auroras happen when solar particles energize gases high in the atmosphere, making them glow.'
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
        explain: 'Earth’s magnetic field and atmosphere shield us from most solar radiation.'
      }
    ]
  },
  {
    id: 'flares',
    title: 'Flares and Radiation',
    questions: [
      {
        q: 'A solar flare is best described as…',
        options: [
          'A piece of the Sun breaking off',
          'A sudden burst of energy and light from the Sun',
          'A comet flying into the Sun',
          'An eclipse'
        ],
        a: 1,
        explain: 'Solar flares are intense bursts of radiation and light from active regions on the Sun.'
      },
      {
        q: 'Which flares are the strongest class?',
        options: ['C‑class', 'M‑class', 'X‑class', 'B‑class'],
        a: 2,
        explain: 'X‑class are the most powerful flares, then M, then C.'
      },
      {
        q: 'A big flare can cause temporary problems with…',
        options: ['Rainfall', 'HF radio and GPS signals', 'Tides', 'Earthquakes'],
        a: 1,
        explain: 'Strong solar flares can cause radio blackouts and affect GPS accuracy.'
      }
    ]
  },
  {
    id: 'cme',
    title: 'CMEs and Storms',
    questions: [
      {
        q: 'A Coronal Mass Ejection (CME) is…',
        options: [
          'A cloud of solar material launched into space',
          'A new planet forming',
          'A type of asteroid',
          'A telescope error'
        ],
        a: 0,
        explain: 'A CME is a huge burst of solar plasma and magnetic field ejected from the Sun.'
      },
      {
        q: 'Geomagnetic storms are measured by which index?',
        options: ['UV', 'Kp', 'Richter', 'pH'],
        a: 1,
        explain: 'The Kp index rates geomagnetic activity from 0 to 9.'
      },
      {
        q: 'Stronger storms can sometimes affect power grids on Earth.',
        options: ['True', 'False'],
        a: 0,
        explain: 'Geomagnetic storms can induce currents in long power lines and transformers.'
      }
    ]
  },
  {
    id: 'safety',
    title: 'People and Safety',
    questions: [
      {
        q: 'Who is most concerned about Solar Energetic Particles (SEPs)?',
        options: ['Deep‑sea divers', 'Astronauts and satellite operators', 'Mountain climbers', 'Gardeners'],
        a: 1,
        explain: 'SEPs can increase radiation exposure in space and at high altitudes.'
      },
      {
        q: 'Pilots flying polar routes may see radio issues during…',
        options: ['Heavy rain', 'Strong flares/geomagnetic storms', 'Snow', 'Fog'],
        a: 1,
        explain: 'HF radio can be disrupted by strong flares and storms, especially near the poles.'
      },
      {
        q: 'Auroras mean Wi‑Fi routers are melting.',
        options: ['True', 'False'],
        a: 1,
        explain: 'Myth! Auroras are natural lights in the sky and don’t melt home electronics.'
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

// Generate a session: 10–15 randomized questions for a given level
export const generateQuizSession = (level = 'basic', count = 12) => {
  const cats = quizLevels[level] || quizCategories;
  const pool = cats.flatMap((c) => c.questions.map((q) => ({ ...q, category: c.title })));
  return shuffleArray(pool).slice(0, Math.min(Math.max(10, count), 15));
};


