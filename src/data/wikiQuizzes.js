// Wiki-specific quizzes - each wiki card has its own unique quiz questions
// No translations needed - English only

const shuffleArray = (arr) => {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
};

// Quiz questions for each wiki entry by ID
export const wikiQuizzes = {
  "aurora": [
    {
      q: "What are auroras?",
      options: [
        "Colorful lights near Earth's poles caused by solar particles",
        "Reflections of city lights",
        "Volcanic eruptions in the sky",
        "Moonlight on clouds"
      ],
      a: 0,
      explain: "Auroras are beautiful lights that happen when solar particles collide with gases in Earth's atmosphere near the poles."
    },
    {
      q: "What causes auroras to form?",
      options: [
        "Solar wind particles hitting oxygen and nitrogen in the atmosphere",
        "Lightning storms",
        "Meteor showers",
        "Airplane contrails"
      ],
      a: 0,
      explain: "Charged particles from the solar wind collide with oxygen and nitrogen gases high in our atmosphere, making them glow."
    },
    {
      q: "What is the aurora near the North Pole called?",
      options: [
        "Aurora Borealis (Northern Lights)",
        "Aurora Australis",
        "Solar Aurora",
        "Polar Lights"
      ],
      a: 0,
      explain: "The Northern Lights are called Aurora Borealis, while the Southern Lights are Aurora Australis."
    },
    {
      q: "What colors can auroras be?",
      options: [
        "Green, red, blue, and purple",
        "Only green",
        "Only white",
        "Black and white"
      ],
      a: 0,
      explain: "Auroras display many colors! Oxygen makes green and red, while nitrogen creates blue and purple."
    },
    {
      q: "Which gases make auroras glow?",
      options: [
        "Oxygen and nitrogen",
        "Carbon dioxide",
        "Hydrogen and helium",
        "Water vapor"
      ],
      a: 0,
      explain: "When solar particles hit oxygen and nitrogen in Earth's upper atmosphere, these gases light up in different colors."
    },
    {
      q: "Do auroras only happen on Earth?",
      options: [
        "No, planets like Jupiter and Saturn also have auroras",
        "Yes, only on Earth",
        "Only on the Moon",
        "Only on Mars"
      ],
      a: 0,
      explain: "Any planet with a magnetic field and atmosphere can have auroras! Jupiter and Saturn have spectacular auroras."
    },
    {
      q: "When is the best time to see auroras?",
      options: [
        "At night, near the poles, during winter",
        "During the day",
        "At the equator",
        "During summer"
      ],
      a: 0,
      explain: "Auroras are best seen at night in polar regions, especially during winter when nights are longest."
    },
    {
      q: "What shapes can auroras take?",
      options: [
        "Curtains, waves, and rays",
        "Perfect circles only",
        "Always straight lines",
        "They don't move or change"
      ],
      a: 0,
      explain: "Auroras are dynamic and can look like curtains, waves, or rays that dance and change shape!"
    },
    {
      q: "What protects Earth from most solar particles?",
      options: [
        "Earth's magnetic shield",
        "The ozone layer",
        "Clouds",
        "The ocean"
      ],
      a: 0,
      explain: "Earth's magnetic field acts like a shield, but some particles sneak in near the poles, creating auroras."
    },
    {
      q: "Why are auroras important to scientists?",
      options: [
        "They help study space weather and protect technology",
        "They predict earthquakes",
        "They control the weather",
        "They have no scientific value"
      ],
      a: 0,
      explain: "Auroras show us how the Sun and Earth interact, helping scientists understand and predict space weather."
    }
  ],

  "space-weather": [
    {
      q: "What is space weather?",
      options: [
        "Changing environmental conditions in space near Earth",
        "Weather on other planets",
        "Weather forecasts for astronauts",
        "Rain and snow in space"
      ],
      a: 0,
      explain: "Space weather refers to conditions in space caused by the Sun's activity, affecting Earth and our technology."
    },
    {
      q: "What is the main driver of space weather?",
      options: [
        "The Sun",
        "The Moon",
        "Jupiter",
        "Earth's rotation"
      ],
      a: 0,
      explain: "The Sun is the main source of space weather through solar wind, flares, and coronal mass ejections."
    },
    {
      q: "What is the solar wind?",
      options: [
        "A stream of charged particles from the Sun",
        "Wind on the Sun's surface",
        "Hurricanes in space",
        "Dust clouds"
      ],
      a: 0,
      explain: "The solar wind is a continuous stream of charged particles flowing from the Sun throughout the solar system."
    },
    {
      q: "How does space weather affect Earth?",
      options: [
        "Creates auroras, disrupts communications, affects power grids",
        "Changes the seasons",
        "Controls ocean tides",
        "Makes it rain"
      ],
      a: 0,
      explain: "Space weather can create beautiful auroras but also disrupt technology like GPS, radio, and power systems."
    },
    {
      q: "What protects us from harmful space weather?",
      options: [
        "Earth's magnetic field and atmosphere",
        "The ozone layer only",
        "Satellites",
        "Nothing protects us"
      ],
      a: 0,
      explain: "Earth's magnetic field and atmosphere work together to shield us from most harmful solar radiation."
    },
    {
      q: "What are solar storms?",
      options: [
        "Powerful eruptions from the Sun including flares and CMEs",
        "Tornadoes on the Sun",
        "Thunder in space",
        "Rain on the Sun"
      ],
      a: 0,
      explain: "Solar storms are eruptions from the Sun that can affect Earth, including solar flares and coronal mass ejections."
    },
    {
      q: "Why is understanding space weather important?",
      options: [
        "To protect technology, satellites, and astronauts",
        "To predict Earth's weather",
        "To plan vacations",
        "It's not important"
      ],
      a: 0,
      explain: "Space weather can damage satellites, disrupt GPS and communications, and pose risks to astronauts."
    },
    {
      q: "What is a geomagnetic storm?",
      options: [
        "A disturbance in Earth's magnetic field caused by space weather",
        "A thunderstorm",
        "An earthquake",
        "A hurricane"
      ],
      a: 0,
      explain: "Geomagnetic storms occur when solar wind interacts with Earth's magnetic field, causing disruptions."
    },
    {
      q: "Can space weather affect GPS systems?",
      options: [
        "Yes, it can disrupt GPS signals",
        "No, GPS is never affected",
        "Only during the day",
        "Only in winter"
      ],
      a: 0,
      explain: "Space weather can interfere with GPS signals, causing navigation errors and timing issues."
    },
    {
      q: "What types of events are part of space weather?",
      options: [
        "Solar flares, CMEs, solar wind, geomagnetic storms, auroras",
        "Rain, snow, and hail",
        "Earthquakes and tsunamis",
        "Meteor showers only"
      ],
      a: 0,
      explain: "Space weather includes many phenomena driven by the Sun's activity and its effects on Earth's environment."
    }
  ],

  "space-weather-agriculture": [
    {
      q: "How does space weather affect farming?",
      options: [
        "It disrupts GPS systems used for precision agriculture",
        "It makes crops grow faster",
        "It controls rainfall",
        "It doesn't affect farming"
      ],
      a: 0,
      explain: "Space weather can interfere with GPS signals that farmers rely on for precision planting and autonomous tractors."
    },
    {
      q: "What do modern farmers use GPS for?",
      options: [
        "Precision planting and autonomous tractor operations",
        "Weather forecasting",
        "Watering crops",
        "Harvesting only"
      ],
      a: 0,
      explain: "GPS enables precision agriculture, helping farmers plant seeds accurately and operate automated equipment."
    },
    {
      q: "What might a farmer do during a space weather event?",
      options: [
        "Stop planting operations due to poor GPS signal",
        "Plant more crops",
        "Ignore it completely",
        "Water the fields"
      ],
      a: 0,
      explain: "When GPS signals are disrupted by space weather, farmers may need to halt precision planting operations."
    },
    {
      q: "Why is space weather awareness important for farmers?",
      options: [
        "To plan operations and have backup systems ready",
        "To predict rain",
        "To control pests",
        "To fertilize crops"
      ],
      a: 0,
      explain: "Understanding space weather helps farmers prepare for GPS disruptions and have alternative plans ready."
    },
    {
      q: "What technology in farming is affected by space weather?",
      options: [
        "GPS systems and automated farming equipment",
        "Water pumps",
        "Tractors without GPS",
        "Hand tools"
      ],
      a: 0,
      explain: "GPS-dependent technology like autonomous tractors and precision planting systems are vulnerable to space weather."
    },
    {
      q: "Who experienced GPS disruptions mentioned in the wiki?",
      options: [
        "Farmer Dwane Roth of Kansas",
        "A farmer in California",
        "A rancher in Texas",
        "A gardener in Florida"
      ],
      a: 0,
      explain: "Farmer Dwane Roth of Kansas experienced firsthand how space weather can disrupt agricultural GPS systems."
    },
    {
      q: "What is precision agriculture?",
      options: [
        "Using technology like GPS for accurate farming operations",
        "Planting by hand",
        "Traditional farming methods",
        "Organic farming"
      ],
      a: 0,
      explain: "Precision agriculture uses GPS and technology to optimize planting, reduce waste, and improve crop yields."
    },
    {
      q: "Can space weather disrupt autonomous tractors?",
      options: [
        "Yes, through GPS signal interference",
        "No, they are immune",
        "Only at night",
        "Only in winter"
      ],
      a: 0,
      explain: "Autonomous tractors rely on GPS for navigation, so space weather disruptions can affect their operation."
    },
    {
      q: "What type of farming relies heavily on GPS?",
      options: [
        "Modern precision agriculture",
        "Organic farming",
        "Subsistence farming",
        "Urban gardening"
      ],
      a: 0,
      explain: "Modern precision agriculture depends on GPS for automated planting, field mapping, and crop monitoring."
    },
    {
      q: "How can farmers prepare for space weather impacts?",
      options: [
        "Monitor space weather forecasts and have backup plans",
        "Ignore all weather reports",
        "Only farm at night",
        "Avoid using any technology"
      ],
      a: 0,
      explain: "Being aware of space weather forecasts helps farmers plan around potential GPS disruptions."
    }
  ],

  "space-weather-forecasting": [
    {
      q: "What is NASA's Space Weather Program?",
      options: [
        "A program that studies space weather for prediction and applications",
        "A weather app",
        "A TV show about space",
        "A satellite repair service"
      ],
      a: 0,
      explain: "NASA's Space Weather Program studies physical processes to enable successful prediction and protect missions."
    },
    {
      q: "What does NASA's program support?",
      options: [
        "Robotic and human exploration at Earth, Moon, Mars, and beyond",
        "Only Earth weather",
        "Commercial airlines",
        "Cell phone networks"
      ],
      a: 0,
      explain: "The program ensures safety of NASA's missions and equipment across the solar system."
    },
    {
      q: "What enables successful space weather forecasting?",
      options: [
        "Scientific understanding of physical processes",
        "Guessing",
        "Random predictions",
        "Historical almanacs"
      ],
      a: 0,
      explain: "Accurate forecasts are built on scientific understanding of how space weather works."
    },
    {
      q: "How do power grid managers use space weather forecasts?",
      options: [
        "Change network configurations to prevent blackouts",
        "Ignore all warnings",
        "Turn off all power",
        "Increase prices"
      ],
      a: 0,
      explain: "Forecasts allow power companies to reconfigure grids and protect equipment from geomagnetic storms."
    },
    {
      q: "What do pilots do with space weather information?",
      options: [
        "Switch to backup communication equipment",
        "Cancel all flights",
        "Fly higher",
        "Ignore it"
      ],
      a: 0,
      explain: "Pilots use space weather forecasts to prepare backup systems and adjust routes if needed."
    },
    {
      q: "Why do commercial companies adjust spacecraft orbits?",
      options: [
        "To avoid collisions due to increased atmospheric drag",
        "For fun",
        "To go faster",
        "To save fuel only"
      ],
      a: 0,
      explain: "Space weather can increase atmospheric drag, so companies adjust orbits to prevent satellite collisions."
    },
    {
      q: "What type of research does NASA support?",
      options: [
        "User-driven space weather research and applications",
        "Only basic astronomy",
        "Historical research only",
        "Theoretical physics only"
      ],
      a: 0,
      explain: "NASA focuses on research that has practical applications for protecting technology and people."
    },
    {
      q: "Who benefits from space weather forecasting?",
      options: [
        "Power companies, pilots, satellite operators, and astronauts",
        "Only scientists",
        "Only governments",
        "Nobody"
      ],
      a: 0,
      explain: "Space weather forecasting helps many industries and organizations protect their operations and people."
    },
    {
      q: "What can happen without space weather forecasting?",
      options: [
        "Unexpected blackouts, satellite damage, communication failures",
        "Nothing bad",
        "Better technology",
        "Faster internet"
      ],
      a: 0,
      explain: "Without forecasts, we couldn't prepare for solar storms that can damage infrastructure and technology."
    },
    {
      q: "Is space weather forecasting similar to Earth weather forecasting?",
      options: [
        "Yes, both use scientific models to predict future conditions",
        "No, they are completely different",
        "Only on Sundays",
        "Only in winter"
      ],
      a: 0,
      explain: "Both use observations and models to predict future conditions, though the phenomena are different."
    }
  ],

  "how-nasa-studies-solar-storms": [
    {
      q: "What is NASA's heliophysics fleet?",
      options: [
        "Spacecraft that orbit to study the Sun's activity and effects",
        "A navy ship",
        "Commercial airplanes",
        "Submarines"
      ],
      a: 0,
      explain: "NASA has multiple spacecraft studying the Sun from different locations in the solar system."
    },
    {
      q: "What does SOHO stand for?",
      options: [
        "Solar and Heliospheric Observatory",
        "Space Orbit Helicopter",
        "Sun Observation Headquarters",
        "Solar Heat Observation"
      ],
      a: 0,
      explain: "SOHO is a joint NASA/ESA mission that monitors the Sun continuously from space."
    },
    {
      q: "What does NASA's Parker Solar Probe do?",
      options: [
        "Passes through the Sun's outer atmosphere (corona)",
        "Studies Earth's weather",
        "Explores Mars",
        "Observes Jupiter"
      ],
      a: 0,
      explain: "Parker Solar Probe gets close enough to 'touch' the Sun, studying material leaving our star."
    },
    {
      q: "What do STEREO spacecraft provide?",
      options: [
        "Different viewpoints of the Sun from various locations",
        "Music in space",
        "3D movies",
        "Weather reports"
      ],
      a: 0,
      explain: "STEREO spacecraft observe the Sun from different angles to track solar eruptions."
    },
    {
      q: "What does MMS study?",
      options: [
        "How the Sun influences Earth's magnetosphere",
        "Moon rocks",
        "Mars soil",
        "Asteroids"
      ],
      a: 0,
      explain: "The Magnetospheric Multiscale Mission studies solar wind interactions with Earth's magnetic field."
    },
    {
      q: "Where do THEMIS-ARTEMIS spacecraft operate?",
      options: [
        "Near the Moon, studying lunar space environment",
        "Inside the Sun",
        "On Mars",
        "In Earth's orbit only"
      ],
      a: 0,
      explain: "Two ARTEMIS spacecraft study how solar wind and Earth's magnetosphere affect the Moon."
    },
    {
      q: "What does RAD on Curiosity rover study?",
      options: [
        "Radiation on the surface of Mars",
        "Water on Mars",
        "Mars weather",
        "Mars geology only"
      ],
      a: 0,
      explain: "The Radiation Assessment Detector measures how solar radiation affects the Martian surface."
    },
    {
      q: "What will ESCAPADE mission study?",
      options: [
        "Sun's effects on Martian atmosphere and magnetosphere",
        "Earth's oceans",
        "Saturn's rings",
        "Venus clouds"
      ],
      a: 0,
      explain: "ESCAPADE will study how solar activity affects Mars' atmosphere and weak magnetic field."
    },
    {
      q: "What does SDO observe?",
      options: [
        "Sunspots and active regions on the Sun",
        "Earth's clouds",
        "Moon craters",
        "Comets"
      ],
      a: 0,
      explain: "Solar Dynamics Observatory continuously monitors solar activity and sunspots."
    },
    {
      q: "Why study the Sun from multiple locations?",
      options: [
        "To get complete 3D view of solar activity and eruptions",
        "For fun",
        "To waste money",
        "No particular reason"
      ],
      a: 0,
      explain: "Multiple viewpoints help scientists track solar storms heading toward Earth and other planets."
    }
  ],

  "space-weather-missions": [
    {
      q: "What does HERMES stand for?",
      options: [
        "Heliophysics Environmental and Radiation Measurement Experiment Suite",
        "High Energy Radio Measurement System",
        "Helium Research Module",
        "Heat Energy Radiation Monitor"
      ],
      a: 0,
      explain: "HERMES is designed to measure solar particles and radiation from the Gateway lunar station."
    },
    {
      q: "Where will HERMES be located?",
      options: [
        "On Gateway lunar space station",
        "On Earth",
        "On Mars",
        "Inside the Sun"
      ],
      a: 0,
      explain: "HERMES will fly on Gateway, supporting Artemis lunar operations."
    },
    {
      q: "What does HERMES study?",
      options: [
        "Solar and cosmic radiation to understand space weather",
        "Moon rocks",
        "Earth's atmosphere",
        "Ocean temperatures"
      ],
      a: 0,
      explain: "HERMES observes solar particles and solar wind to help protect astronauts on deep space missions."
    },
    {
      q: "Where is Vigil's orbit location?",
      options: [
        "Sun-Earth Lagrange Point 5, about 60 degrees behind Earth",
        "Around the Moon",
        "Around Mars",
        "Near Jupiter"
      ],
      a: 0,
      explain: "Vigil will orbit at L5, giving a unique side view of the Sun and incoming solar storms."
    },
    {
      q: "When is Vigil expected to launch?",
      options: [
        "2031",
        "2025",
        "2040",
        "It already launched"
      ],
      a: 0,
      explain: "The European Space Agency's Vigil mission is planned to launch in 2031."
    },
    {
      q: "What does JEDI stand for?",
      options: [
        "Joint EUV coronal Diagnostic Investigation",
        "Jupiter Exploration Device",
        "Just Earthly Data Instrument",
        "Jet Engine Diagnostic"
      ],
      a: 0,
      explain: "JEDI will fly aboard Vigil and study the Sun's corona."
    },
    {
      q: "What will JEDI observe?",
      options: [
        "The middle layer of the solar corona",
        "Earth's clouds",
        "Mars surface",
        "Saturn's rings"
      ],
      a: 0,
      explain: "JEDI's telescopes focus on the corona region that creates solar wind and eruptions."
    },
    {
      q: "What are Space Weather CubeSats?",
      options: [
        "Small satellites for space weather innovation and research",
        "Toy blocks",
        "Food containers",
        "Ice cubes in space"
      ],
      a: 0,
      explain: "CubeSats are small, cost-effective satellites that test new space weather technologies."
    },
    {
      q: "How many CubeSat missions were selected in 2021?",
      options: [
        "Four missions",
        "One mission",
        "Ten missions",
        "No missions"
      ],
      a: 0,
      explain: "Four CubeSat missions were selected to advance space weather understanding and forecasting."
    },
    {
      q: "Why are these missions important?",
      options: [
        "They protect astronauts and improve space weather forecasting",
        "They are not important",
        "Only for entertainment",
        "To study Earth's weather"
      ],
      a: 0,
      explain: "These missions help us predict solar storms and protect people and technology in space."
    }
  ],

  "cme": [
    {
      q: "What is a Coronal Mass Ejection (CME)?",
      options: [
        "An enormous cloud of electrically charged gas from the Sun",
        "A comet",
        "An asteroid",
        "A solar eclipse"
      ],
      a: 0,
      explain: "CMEs are massive eruptions of billions of tons of plasma that burst from the Sun into space."
    },
    {
      q: "How much material can a single CME blast into space?",
      options: [
        "Billions of tons",
        "A few pounds",
        "Thousands of tons",
        "Just a few particles"
      ],
      a: 0,
      explain: "A single CME can eject billions of tons of solar material into the solar system at once!"
    },
    {
      q: "Where do CMEs occur?",
      options: [
        "In the Sun's outer atmosphere, called the corona",
        "On Earth",
        "In the solar core",
        "On the Moon"
      ],
      a: 0,
      explain: "CMEs erupt from the Sun's corona, often looking like giant bubbles bursting from the surface."
    },
    {
      q: "How fast can the fastest CMEs travel?",
      options: [
        "Millions of miles per hour",
        "10 miles per hour",
        "100 miles per hour",
        "They don't move"
      ],
      a: 0,
      explain: "The fastest CMEs race through space at millions of miles per hour toward Earth and other planets."
    },
    {
      q: "How quickly can a CME reach Earth?",
      options: [
        "As little as 15 hours for the fastest ones",
        "8 minutes",
        "One year",
        "Instantly"
      ],
      a: 0,
      explain: "Fast CMEs can reach Earth in 15 hours, while slower ones may take several days."
    },
    {
      q: "What can CMEs do to power grids?",
      options: [
        "Induce currents that damage transformers and cause outages",
        "Make them more efficient",
        "Nothing at all",
        "Reduce electricity costs"
      ],
      a: 0,
      explain: "CMEs can create electrical currents in power lines, damaging equipment and causing blackouts."
    },
    {
      q: "How do CMEs affect satellites?",
      options: [
        "Heat the atmosphere, increasing drag and slowing satellites",
        "Make them go faster",
        "Have no effect",
        "Improve their signals"
      ],
      a: 0,
      explain: "CMEs heat Earth's upper atmosphere, causing it to expand and create drag on satellites."
    },
    {
      q: "What beautiful phenomenon do CMEs help create?",
      options: [
        "Aurora borealis and australis (northern and southern lights)",
        "Rainbows",
        "Fog",
        "Clouds"
      ],
      a: 0,
      explain: "CME particles interact with Earth's atmosphere to create stunning auroral displays."
    },
    {
      q: "Can CME particles harm people on the ground?",
      options: [
        "No, Earth's magnetic field and atmosphere protect us",
        "Yes, very dangerous",
        "Only at night",
        "Only in winter"
      ],
      a: 0,
      explain: "We're safe on Earth! Our magnetic field deflects most particles before they reach the ground."
    },
    {
      q: "Who is at risk from high-speed CME particles?",
      options: [
        "Astronauts in space and crew on high-altitude polar flights",
        "People at the beach",
        "Subway passengers",
        "Deep sea divers"
      ],
      a: 0,
      explain: "Beyond Earth's protective shield, astronauts and high-altitude flight crews face radiation risks from CMEs."
    }
  ],

  "solar-flare": [
    {
      q: "What is a solar flare?",
      options: [
        "An intense burst of radiation from the Sun",
        "A cool spot on the Sun",
        "A type of eclipse",
        "A comet near the Sun"
      ],
      a: 0,
      explain: "Solar flares are intense bursts of electromagnetic radiation - the most powerful explosions in our solar system!"
    },
    {
      q: "What parts of the electromagnetic spectrum do solar flares emit?",
      options: [
        "X-rays, gamma rays, radio waves, UV, and visible light",
        "Only visible light",
        "Only radio waves",
        "Only infrared"
      ],
      a: 0,
      explain: "Solar flares release energy across the entire electromagnetic spectrum simultaneously."
    },
    {
      q: "How powerful are the biggest solar flares?",
      options: [
        "As much energy as a billion hydrogen bombs",
        "Like a small firecracker",
        "Like a candle",
        "Like a campfire"
      ],
      a: 0,
      explain: "The largest solar flares release incredible amounts of energy - equivalent to billions of hydrogen bombs!"
    },
    {
      q: "What is the weakest solar flare class?",
      options: [
        "A-class",
        "X-class",
        "M-class",
        "Z-class"
      ],
      a: 0,
      explain: "Solar flares are classified A, B, C, M, X - with A being the weakest and X being the strongest."
    },
    {
      q: "What is the strongest solar flare class?",
      options: [
        "X-class",
        "A-class",
        "C-class",
        "B-class"
      ],
      a: 0,
      explain: "X-class flares are the most powerful, with each letter class being 10 times stronger than the previous."
    },
    {
      q: "How much stronger is an X-class flare than a C-class?",
      options: [
        "100 times stronger",
        "2 times stronger",
        "Same strength",
        "Slightly weaker"
      ],
      a: 0,
      explain: "Each class is 10x stronger: C to M is 10x, M to X is another 10x, so X is 100x stronger than C!"
    },
    {
      q: "How long does it take for solar flare energy to reach Earth?",
      options: [
        "About 8 minutes (speed of light)",
        "1 day",
        "1 hour",
        "1 week"
      ],
      a: 0,
      explain: "Solar flare radiation travels at the speed of light, reaching Earth in just 8 minutes!"
    },
    {
      q: "Can solar flare radiation harm people on Earth's surface?",
      options: [
        "No, we're protected by Earth's atmosphere and magnetic field",
        "Yes, very dangerous",
        "Only at night",
        "Only in summer"
      ],
      a: 0,
      explain: "Earth's atmosphere and magnetic field shield us from harmful flare radiation - we're safe on the ground!"
    },
    {
      q: "What can strong solar flares disrupt?",
      options: [
        "Radio communications through the upper atmosphere",
        "Ocean tides",
        "Gravity",
        "Time"
      ],
      a: 0,
      explain: "Strong flares ionize Earth's upper atmosphere, causing radio blackouts and communication problems."
    },
    {
      q: "Can solar flares affect spacecraft and satellites?",
      options: [
        "Yes, they can disrupt or damage satellites beyond Earth's protection",
        "No, never",
        "Only on Mondays",
        "Only in winter"
      ],
      a: 0,
      explain: "Satellites outside Earth's protective shield are vulnerable to intense radiation from solar flares."
    }
  ],

  "sunspots": [
    {
      q: "What are sunspots?",
      options: [
        "Dark, cooler regions on the Sun caused by magnetic fields",
        "Holes in the Sun",
        "Shadows from planets",
        "Sun dirt"
      ],
      a: 0,
      explain: "Sunspots are dark patches on the Sun where twisted magnetic fields block heat flow, making them cooler."
    },
    {
      q: "What causes sunspots?",
      options: [
        "Twisted magnetic field lines that prevent heat from flowing",
        "Clouds on the Sun",
        "Asteroids hitting the Sun",
        "Cold weather in space"
      ],
      a: 0,
      explain: "The Sun's magnetic field gets tangled up, blocking heat and creating cooler, darker regions."
    },
    {
      q: "What is the Sun made of?",
      options: [
        "Plasma (electrically charged gas)",
        "Rock",
        "Water",
        "Ice"
      ],
      a: 0,
      explain: "The Sun is made of plasma - super hot electrically charged gas that creates magnetic fields."
    },
    {
      q: "What temperature are sunspots?",
      options: [
        "Around 6,000 degrees Fahrenheit",
        "Room temperature",
        "Freezing",
        "100 degrees Fahrenheit"
      ],
      a: 0,
      explain: "Sunspots are about 6,000°F - cooler than the surrounding 10,000°F photosphere, so they look dark."
    },
    {
      q: "What are active regions?",
      options: [
        "Areas with strong magnetic fields where solar eruptions occur",
        "Quiet areas on the Sun",
        "Dark areas on Earth",
        "Moon craters"
      ],
      a: 0,
      explain: "Active regions have powerful magnetic fields and are where solar flares and CMEs typically erupt."
    },
    {
      q: "Are sunspots associated with solar eruptions?",
      options: [
        "Yes, solar flares and CMEs often burst from active regions near sunspots",
        "No, never",
        "Only sometimes",
        "Nobody knows"
      ],
      a: 0,
      explain: "Scientists find that sunspot groups are often the source of powerful solar flares and CMEs."
    },
    {
      q: "How do scientists use sunspots?",
      options: [
        "To track and predict solar activity and the solar cycle",
        "For decoration",
        "To tell time",
        "They don't use them"
      ],
      a: 0,
      explain: "Counting sunspots helps scientists monitor the 11-year solar cycle and predict space weather."
    },
    {
      q: "What is solar minimum?",
      options: [
        "Low number of sunspots and low solar activity",
        "Maximum sunspot count",
        "Noon on the Sun",
        "Smallest size of the Sun"
      ],
      a: 0,
      explain: "During solar minimum, the Sun has very few sunspots and is relatively calm."
    },
    {
      q: "What is solar maximum?",
      options: [
        "High number of sunspots and high solar activity",
        "No sunspots",
        "Midnight on the Sun",
        "Largest size of the Sun"
      ],
      a: 0,
      explain: "Solar maximum is when the Sun has many sunspots and frequent solar storms."
    },
    {
      q: "What is the current solar cycle?",
      options: [
        "Solar Cycle 25, which began in 2019",
        "Solar Cycle 1",
        "Solar Cycle 100",
        "There is no solar cycle"
      ],
      a: 0,
      explain: "We're currently in Solar Cycle 25, the 25th cycle since scientists started tracking in the 1700s."
    }
  ],

  "solar-activity-cycle": [
    {
      q: "How long is the Sun's activity cycle?",
      options: [
        "About 11 years",
        "1 year",
        "100 years",
        "1 month"
      ],
      a: 0,
      explain: "The Sun goes through an approximately 11-year cycle of increasing and decreasing activity."
    },
    {
      q: "When are solar storms more common?",
      options: [
        "During solar maximum (peak of the cycle)",
        "During solar minimum",
        "Every Tuesday",
        "Never"
      ],
      a: 0,
      explain: "Solar maximum is when the Sun is most active, producing more flares, CMEs, and sunspots."
    },
    {
      q: "When are solar storms less frequent?",
      options: [
        "During solar minimum (low point of the cycle)",
        "During solar maximum",
        "All the time",
        "Only in summer"
      ],
      a: 0,
      explain: "Solar minimum is the quiet period when sunspots and solar eruptions are rare."
    },
    {
      q: "What increases during solar maximum?",
      options: [
        "Sunspots and active regions on the Sun",
        "Earth's temperature",
        "Moon brightness",
        "Ocean levels"
      ],
      a: 0,
      explain: "Solar maximum brings many sunspots and magnetically active regions that spawn solar storms."
    },
    {
      q: "What are sunspots a marker for?",
      options: [
        "Magnetically active regions that can produce solar eruptions",
        "Cool vacation spots",
        "Safe areas on the Sun",
        "Nothing important"
      ],
      a: 0,
      explain: "Sunspots indicate areas of intense magnetic activity where flares and CMEs are likely to occur."
    },
    {
      q: "During solar minimum, how does the Sun appear?",
      options: [
        "Relatively calm with few sunspots",
        "Very active with many storms",
        "Completely dark",
        "Covered in sunspots"
      ],
      a: 0,
      explain: "At solar minimum, the Sun has very few sunspots and minimal eruptive activity."
    },
    {
      q: "What should you look for to predict solar storms?",
      options: [
        "Large sunspot groups or particularly active regions",
        "Clear sky",
        "Full moon",
        "Clouds"
      ],
      a: 0,
      explain: "When a large sunspot group appears, it's a good time to watch for solar storms heading our way!"
    },
    {
      q: "Do all solar phenomena follow the 11-year cycle?",
      options: [
        "Yes, solar storms and related events wax and wane with it",
        "No, they are random",
        "Only solar flares",
        "Only CMEs"
      ],
      a: 0,
      explain: "Solar flares, CMEs, auroras, and other space weather events all follow the solar cycle pattern."
    },
    {
      q: "What happens to auroras during solar maximum?",
      options: [
        "They become more frequent and can be seen at lower latitudes",
        "They disappear",
        "They only appear at the equator",
        "No change"
      ],
      a: 0,
      explain: "During solar maximum, increased solar activity creates more frequent and widespread auroras."
    },
    {
      q: "Can we predict when solar maximum will occur?",
      options: [
        "Yes, approximately every 11 years based on the cycle",
        "No, it's completely random",
        "Only during leap years",
        "Nobody knows"
      ],
      a: 0,
      explain: "Scientists track the solar cycle to predict when we'll transition from minimum to maximum and back."
    }
  ],

  "nasa-r2o2r-program": [
    {
      q: "What does R2O2R stand for?",
      options: [
        "Research-to-Operations-to-Research",
        "Radio to Orbit to Radio",
        "Rocket to Outer Orbit Return",
        "Research Observation Office"
      ],
      a: 0,
      explain: "R2O2R describes the cycle of moving research into practical operations and back to research."
    },
    {
      q: "Which agencies collaborate on R2O2R?",
      options: [
        "NASA, NOAA, DoD, and NSF",
        "Only NASA",
        "Only NOAA",
        "Private companies only"
      ],
      a: 0,
      explain: "NASA, NOAA, Department of Defense, and National Science Foundation all work together on this program."
    },
    {
      q: "What does the program accelerate?",
      options: [
        "Space weather research toward operational implementation",
        "Rocket launches",
        "Satellite production",
        "Computer speed"
      ],
      a: 0,
      explain: "The program helps move space weather research into real-world forecasting systems faster."
    },
    {
      q: "What is the 'R to O' part of R2O2R?",
      options: [
        "Taking research and making it operational",
        "Reading books",
        "Running outside",
        "Resting often"
      ],
      a: 0,
      explain: "Research findings with forecasting potential are matured into working operational systems."
    },
    {
      q: "What is the 'O to R' part of R2O2R?",
      options: [
        "Feedback from operations back to research for improvements",
        "Opening rockets",
        "Observing rocks",
        "Operating radios"
      ],
      a: 0,
      explain: "Once operational, systems provide feedback to researchers about what needs improvement."
    },
    {
      q: "Why is R2O2R a cycle?",
      options: [
        "Research improves operations, which informs more research",
        "It goes in circles",
        "It repeats every day",
        "It's not a cycle"
      ],
      a: 0,
      explain: "The process continuously cycles: research → operations → refinement → more research."
    },
    {
      q: "Who implements the R2O2R program?",
      options: [
        "NASA, on behalf of and in collaboration with partner agencies",
        "Only universities",
        "Only private companies",
        "Foreign governments"
      ],
      a: 0,
      explain: "NASA leads the program but works closely with NOAA, DoD, and NSF."
    },
    {
      q: "What is the goal of R2O2R?",
      options: [
        "Improve space weather forecasting capabilities",
        "Build more satellites",
        "Study distant galaxies",
        "Train astronauts"
      ],
      a: 0,
      explain: "The program aims to enhance our ability to predict and prepare for space weather events."
    },
    {
      q: "What type of research is targeted?",
      options: [
        "Research identified as having potential for improving forecasts",
        "All research equally",
        "Only basic science",
        "Only theoretical work"
      ],
      a: 0,
      explain: "R2O2R focuses on research that can practically improve operational forecasting systems."
    },
    {
      q: "How does R2O2R benefit society?",
      options: [
        "Better forecasts protect technology, infrastructure, and people",
        "It provides entertainment",
        "It makes space travel cheaper",
        "It has no benefits"
      ],
      a: 0,
      explain: "By improving forecasts, R2O2R helps protect power grids, satellites, communications, and astronauts."
    }
  ]
};

// Generate quiz session for a specific wiki entry
export const generateWikiQuiz = (wikiId, count = 10) => {
  const questions = wikiQuizzes[wikiId];
  
  if (!questions || questions.length === 0) {
    return [];
  }

  // Shuffle and take up to 'count' questions
  const shuffled = shuffleArray(questions);
  const selected = shuffled.slice(0, Math.min(count, questions.length));

  // Shuffle options for each question
  return selected.map((q) => {
    const pairs = q.options.map((opt, idx) => ({ opt, idx }));
    for (let i = pairs.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [pairs[i], pairs[j]] = [pairs[j], pairs[i]];
    }
    const options = pairs.map((p) => p.opt);
    const a = pairs.findIndex((p) => p.idx === q.a);
    return { ...q, options, a };
  });
};
