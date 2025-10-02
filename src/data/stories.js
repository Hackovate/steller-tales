// Character data
export const CHARACTERS = [
  {
    id: "farmer",
    name: "Farmer",
    description: "Grows crops and faces space weather!",
    emoji: "👨‍🌾",
    images: [
      "/stories/farmer/1.jpg",
      "/stories/farmer/2.jpg",
      "/stories/farmer/3.jpg",
      "/stories/farmer/4.jpg",
      "/stories/farmer/5.jpg",
      "/stories/farmer/6.jpg",
      "/stories/farmer/7.jpg",
      "/stories/farmer/9.jpg",
      "/stories/farmer/10.jpg",
      "/stories/farmer/11.jpg",
    ],
    depth: 1,
    quizQuestions: [
      {
        id: 1,
        question: "Who is Sam and what does he grow?",
        options: [
          "A pilot who grows grapes and apples",
          "A farmer who grows corn, wheat, and soybeans",
          "An astronaut who tends space gardens",
          "A fisherman who grows seaweed",
        ],
        answer: 1,
        explanation:
          "Farmer Sam in the story grows corn, wheat, and soybeans to help feed people.",
      },
      {
        id: 2,
        question: "What is a solar flare?",
        options: [
          "A type of cloud that blocks sunlight",
          "A sudden explosion of energy on the Sun releasing radiation and charged particles",
          "A comet passing close to Earth",
          "A man-made satellite malfunction",
        ],
        answer: 1,
        explanation:
          "Solar flares are sudden explosions of energy on the Sun that send radiation and charged particles into space.",
      },
      {
        id: 3,
        question:
          "How can space weather (solar storms) directly affect Farmer Sam's farm equipment?",
        options: [
          "By causing crops to grow faster",
          "By disrupting GPS and satellites used for precision farming",
          "By changing soil pH instantly",
          "By making tractors run on solar power automatically",
        ],
        answer: 1,
        explanation:
          "Space weather can disrupt satellites and GPS signals, which farmers use for guiding tractors and other precision equipment.",
      },
      {
        id: 4,
        question:
          "What visible sky phenomenon can occur when charged solar particles interact with Earth's magnetic field?",
        options: [
          "Meteor showers",
          "Auroras (northern/southern lights)",
          "Solar eclipses",
          "Rainbows during the night",
        ],
        answer: 1,
        explanation:
          "When charged particles strike Earth's magnetic field and atmosphere they can create auroras, visible most strongly near the poles.",
      },
      {
        id: 5,
        question:
          "What is one way farmers like Sam respond when GPS and satellites fail due to space weather?",
        options: [
          "They stop farming until satellites are fixed",
          "They use skill and traditional methods (maps, manual guidance) to keep working",
          "They switch to growing only indoor plants",
          "They move their whole farm closer to the equator",
        ],
        answer: 1,
        explanation:
          "Farmers adapt by using experience and older techniques (paper maps, manual steering) to continue operations during disruptions.",
      },
    ],
  },
  {
    id: "fisherman",
    name: "Fisherman",
    description: "Catches fish, affected by solar storms.",
    emoji: "🧑‍🎣",
    images: [
      "/stories/fisherman/1.png",
      "/stories/fisherman/2.png",
      "/stories/fisherman/3.png",
      "/stories/fisherman/4.png",
      "/stories/fisherman/5.png",
      "/stories/fisherman/6.png",
      "/stories/fisherman/7.png",
    ],
    depth: 2,
    quizQuestions: [
      {
        id: 1,
        question:
          "Why is HF radio particularly vulnerable during solar flares?",
        options: [
          "Because flares produce strong winds that damage antennas",
          "Because ionospheric ionization increases, absorbing HF signals",
          "Because satellites stop relaying HF radio signals",
          "Because seawater interferes with radio waves",
        ],
        answer: 1,
        explanation:
          "Solar flares increase ionization in the ionosphere, which absorbs HF waves and causes radio blackouts on the sunlit side of Earth.",
      },
      {
        id: 2,
        question:
          "Tasi experienced drifting GPS tracks during the storm. What is the main reason GPS errors occur in space weather?",
        options: [
          "Solar storms bend signals in the ionosphere, delaying travel time",
          "GPS satellites temporarily turn off during flares",
          "Fishing boats emit interference that confuses GPS",
          "Auroras directly block GPS signals in the sky",
        ],
        answer: 0,
        explanation:
          "Disturbances in the ionosphere during solar storms cause GPS signals to refract or delay, making position estimates inaccurate.",
      },
      {
        id: 3,
        question:
          "Which scale describes the strength of radiation storms like the 'S3' alert Tasi saw?",
        options: [
          "R-scale (Radio blackout scale)",
          "S-scale (Solar radiation storm scale)",
          "G-scale (Geomagnetic storm scale)",
          "UV-scale (Ultraviolet exposure index)",
        ],
        answer: 1,
        explanation:
          "The NOAA S-scale measures solar radiation storms, ranging from S1 (minor) to S5 (extreme); Tasi saw an S3 storm warning.",
      },
      {
        id: 4,
        question:
          "Why are fishers near polar waters more exposed to radiation during solar storms?",
        options: [
          "Earth’s magnetic field is weaker at the poles, letting in more charged particles",
          "Auroras emit harmful rays themselves",
          "Ozone layer is missing at polar regions",
          "Satellites beam extra signals toward the poles",
        ],
        answer: 0,
        explanation:
          "At the poles, Earth's magnetic field lines are more open, allowing solar energetic particles to penetrate deeper into the atmosphere.",
      },
      {
        id: 5,
        question:
          "What is the best safety step when NOAA/CSA issues a severe space weather alert to fishers?",
        options: [
          "Continue as normal because storms are harmless at sea",
          "Turn off all navigation devices",
          "Reroute closer to shore and rely on compass/maps",
          "Anchor in deep ocean waters until the storm passes",
        ],
        answer: 2,
        explanation:
          "Mitigation includes staying closer to shore, using traditional tools like compass and maps when GPS/radio are unreliable, and following official alerts.",
      },
    ],
  },
  {
    id: "astronaut",
    name: "Astronaut",
    description: "Explores space, faces cosmic dangers.",
    emoji: "👩‍🚀",
    images: [
      "/stories/astronaut/1.png",
      "/stories/astronaut/2.png",
      "/stories/astronaut/3.png",
      "/stories/astronaut/4.png",
      "/stories/astronaut/5.png",
      "/stories/astronaut/6.png",
      "/stories/astronaut/7.png",
    ],
    depth: 3,
    quizQuestions: [
      {
        id: 1,
        question: "Who is Alex and where does he work?",
        options: [
          "A scientist who studies volcanoes on Earth",
          "An astronaut aboard the International Space Station (ISS), orbiting Earth 400 km above",
          "A pilot flying experimental jets",
          "A farmer tending crops in space greenhouses",
        ],
        answer: 1,
        explanation:
          "Astronaut Alex works aboard the ISS, which orbits Earth about 400 km above the surface.",
      },
      {
        id: 2,
        question:
          "What happens during a solar flare or coronal mass ejection (CME)?",
        options: [
          "The Sun briefly turns off its light",
          "The Moon reflects extra sunlight",
          "The Sun releases bursts of radiation and energetic particles into space",
          "Earth’s atmosphere heats up instantly",
        ],
        answer: 2,
        explanation:
          "Solar flares and CMEs are massive eruptions of energy and particles from the Sun that can affect space and Earth.",
      },
      {
        id: 3,
        question: "Why do astronauts use a storm shelter inside the ISS?",
        options: [
          "To hide from meteors",
          "To reduce radiation exposure during solar storms",
          "To practice emergency drills",
          "To sleep more comfortably",
        ],
        answer: 1,
        explanation:
          "The ISS storm shelter, often lined with water containers, helps absorb radiation and cuts astronaut exposure by half or more during solar events.",
      },
      {
        id: 4,
        question:
          "How much radiation does an astronaut on the ISS typically receive in a year?",
        options: [
          "Around 5–10 mSv",
          "Around 80–160 mSv",
          "Over 1,000 mSv",
          "Zero, because Earth blocks all radiation",
        ],
        answer: 1,
        explanation:
          "On the ISS, astronauts receive about 80–160 millisieverts of radiation per year, according to NASA data.",
      },
      {
        id: 5,
        question:
          "What beautiful phenomenon is caused by solar particles interacting with Earth’s atmosphere?",
        options: [
          "Solar eclipses",
          "Auroras (northern and southern lights)",
          "Meteor showers",
          "Shooting stars",
        ],
        answer: 1,
        explanation:
          "Solar particles colliding with Earth’s atmosphere create glowing auroras, often visible near the poles.",
      },
    ],
  },
  {
    id: "scientist",
    name: "Scientist",
    description: "Studies space weather.",
    emoji: "👨‍🔬",
    images: [
      "/stories/scientist/page-1.png",
      "/stories/scientist/page-2.png",
      "/stories/scientist/page-3.png",
      "/stories/scientist/page-4.png",
      "/stories/scientist/page-5.png",
      "/stories/scientist/page-6.png",
    ],
    depth: 4,
    quizQuestions: [
      {
        id: 1,
        question:
          "What does Dr. Skywatch study, and what does 'space weather' mean?",
        options: [
          "He studies clouds and storms in Earth's atmosphere",
          "He studies energy and particles released by the Sun that can affect Earth",
          "He studies black holes and galaxies far away",
          "He studies volcanoes and earthquakes on Earth",
        ],
        answer: 1,
        explanation:
          "Space weather refers to solar activity — radiation, particles, and magnetic fields from the Sun — that can travel through space and impact Earth.",
      },
      {
        id: 2,
        question:
          "Which satellites were mentioned as detecting the massive CME in the story?",
        options: [
          "Hubble and James Webb",
          "SOHO and Kepler",
          "DSCOVR and GOES",
          "Chandra and Fermi",
        ],
        answer: 2,
        explanation:
          "DSCOVR and GOES are real satellites used to monitor the Sun and detect coronal mass ejections (CMEs).",
      },
      {
        id: 3,
        question:
          "What are two possible effects of a strong solar storm on Earth?",
        options: [
          "Auroras and earthquakes",
          "GPS disruptions and power grid failures",
          "Volcano eruptions and tsunamis",
          "Floods and hurricanes",
        ],
        answer: 1,
        explanation:
          "Solar storms create auroras, but they can also disrupt technology such as GPS, radio signals, satellites, and even power grids.",
      },
      {
        id: 4,
        question:
          "Why do scientists from NASA, CSA, and NOAA share data about solar storms?",
        options: [
          "Because only the U.S. is affected by solar storms",
          "Because space weather can impact the entire planet and requires global teamwork",
          "Because they want to compete with each other",
          "Because solar storms only affect pilots in North America",
        ],
        answer: 1,
        explanation:
          "Space weather affects all of Earth, so scientists around the world collaborate to monitor the Sun and warn industries and astronauts.",
      },
      {
        id: 5,
        question:
          "How does Earth’s magnetic field help protect us during a solar storm?",
        options: [
          "By blocking sunlight so the storm cannot reach Earth",
          "By reflecting the storm particles back into space like a mirror",
          "By deflecting charged particles away from most of Earth’s surface",
          "By absorbing all solar radiation instantly",
        ],
        answer: 2,
        explanation:
          "Earth’s magnetosphere deflects many of the charged particles from the Sun, protecting the surface. Without it, radiation levels would be far higher.",
      },
    ],
  },
  {
    id: "pilot",
    name: "Pilot",
    description: "Flies planes, navigates solar events.",
    emoji: "👩‍✈️",
    images: [
      "/stories/pilot/1.png",
      "/stories/pilot/2.png",
      "/stories/pilot/3.png",
      "/stories/pilot/4.png",
      "/stories/pilot/5.png",
      "/stories/pilot/6.png",
      "/stories/pilot/7.png",
    ],
    depth: 5,
    quizQuestions: [
      {
        id: 1,
        question:
          "Why do airlines sometimes reroute polar flights during strong solar flares?",
        options: [
          "Because GPS signals are always unavailable near the poles",
          "Because HF radio, needed for polar communication, can black out",
          "Because aircraft fuel efficiency is lower near polar routes",
          "Because auroras make pilots lose visibility",
        ],
        answer: 1,
        explanation:
          "Large solar flares can cause HF radio blackouts on the sunlit side of Earth; polar flights often rely on HF for long-range communication, so airlines may reroute.",
      },
      {
        id: 2,
        question:
          "During a solar particle event, radiation at cruising altitude spiked to 100 µSv/hr. What operational step might airlines take?",
        options: [
          "Increase altitude to escape radiation",
          "Fly at lower altitudes to reduce exposure",
          "Turn off navigation systems",
          "Switch only to GPS-based navigation",
        ],
        answer: 1,
        explanation:
          "Flying at lower altitudes reduces exposure to high-energy particles (which are less abundant deeper in the atmosphere); increasing altitude would usually ↑ exposure.",
      },
      {
        id: 3,
        question:
          "Space weather affects navigation because it disturbs which atmospheric layer?",
        options: ["Troposphere", "Stratosphere", "Ionosphere", "Exosphere"],
        answer: 2,
        explanation:
          "The ionosphere contains charged particles that influence radio wave propagation and GPS signals; solar activity can disturb it and degrade navigation accuracy.",
      },
      {
        id: 4,
        question:
          "If GPS signals are degraded during a storm, what backup system is LEAST likely to help pilots?",
        options: [
          "Inertial navigation units",
          "VOR/DME radio fixes",
          "Astrolabe celestial navigation",
          "ADS-B via satellite",
        ],
        answer: 2,
        explanation:
          "An astrolabe is an obsolete, manual celestial tool not used in modern aviation; inertial units, VOR/DME, or satellite ADS-B are practical modern backups.",
      },
      {
        id: 5,
        question:
          "Which organization issues the 'R-scale' alerts that Captain Mira checks with dispatch?",
        options: ["NASA", "NOAA SWPC", "FAA", "ICAO"],
        answer: 1,
        explanation:
          "The NOAA Space Weather Prediction Center (SWPC) issues operational space-weather alerts and scales (like R-scale) used by aviation and other sectors.",
      },
    ],
  },

  {
    id: "electrician",
    name: "Electrician",
    description: "Keeps the grid safe from solar flares.",
    emoji: "🧑‍🔧",
    images: [
      "/stories/electrician/Page-1.png",
      "/stories/electrician/page-2.png",
      "/stories/electrician/page-3.png",
      "/stories/electrician/page-4.png",
      "/stories/electrician/page-5.png",
    ],
    depth: 6,
    quizQuestions: [
      {
        id: 1,
        question: "How can a solar storm directly affect a city’s power grid?",
        options: [
          "By causing clouds to block sunlight from solar panels",
          "By inducing geomagnetically induced currents (GICs) in transformers and power lines",
          "By making wind turbines spin too fast",
          "By lowering electricity demand unexpectedly",
        ],
        answer: 1,
        explanation:
          "Charged particles from solar storms interact with Earth’s magnetic field, inducing currents in long conductors like power lines and transformers, potentially causing overloads or damage.",
      },
      {
        id: 2,
        question:
          "Which type of space weather event is most likely responsible for sudden currents in power lines?",
        options: [
          "Solar flare and associated coronal mass ejection (CME)",
          "Aurora borealis",
          "Meteor shower",
          "High-altitude lightning",
        ],
        answer: 0,
        explanation:
          "Solar flares followed by CMEs release charged particles that can reach Earth and induce currents in long conductors, affecting power grids.",
      },
      {
        id: 3,
        question:
          "Why is teamwork between electricians like Rafiq and space scientists important during a solar storm?",
        options: [
          "Because scientists repair transformers remotely",
          "Because electricians can interpret space weather alerts and implement protective measures quickly",
          "Because electricians need scientists to fly to the power station",
          "Because teamwork makes the auroras brighter",
        ],
        answer: 1,
        explanation:
          "Scientists provide timely warnings and forecasts, while electricians apply practical measures—like rerouting power, reducing grid load, or switching to backups—to prevent damage.",
      },
      {
        id: 4,
        question:
          "Besides power grids, which systems can space weather affect, as shown in Rafiq’s story?",
        options: [
          "Only traffic lights in cities",
          "GPS, radio communications, and auroras near poles",
          "Indoor lighting in homes",
          "Television screens in classrooms",
        ],
        answer: 1,
        explanation:
          "Solar storms can disrupt GPS signals, cause HF radio blackouts, and produce auroras; these are real, scientifically documented effects.",
      },
      {
        id: 5,
        question:
          "What is the best immediate action when a space weather warning indicates a potential geomagnetic storm?",
        options: [
          "Do nothing until something fails",
          "Increase grid load to test transformers",
          "Implement protective procedures: reduce load, switch to backup circuits, monitor systems",
          "Turn off all electricity in the city permanently",
        ],
        answer: 2,
        explanation:
          "Electricians and engineers follow mitigation protocols during geomagnetic storms: reducing load, using backup systems, and monitoring equipment to prevent transformer damage and maintain power supply.",
      },
    ],
  },
];

// Helper function to get available stories count
export const getAvailableStoriesCount = () => {
  return CHARACTERS.filter((character) => character.images.length > 0).length;
};
