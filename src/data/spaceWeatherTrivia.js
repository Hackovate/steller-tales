// Space Weather Trivia Data from /idea
export const spaceWeatherTrivia = [
  {
    title: "Solar Flares & Communication",
    fact: "Solar flares are intense bursts of radiation from the Sun that can interfere with radio communications and GPS signals on Earth."
  },
  {
    title: "Northern Lights",
    fact: "The beautiful auroras are caused by charged particles from the Sun interacting with Earth's magnetic field and atmosphere."
  },
  {
    title: "Power Grid Impact",
    fact: "Severe space weather events can induce currents in power lines, potentially leading to electrical outages."
  },
  {
    title: "Satellite Vulnerability",
    fact: "Satellites in orbit are susceptible to damage from space weather phenomena, affecting their operation and longevity."
  },
  {
    title: "Astronaut Radiation Risks",
    fact: "Astronauts outside Earth's protective atmosphere are exposed to higher radiation levels during space weather events."
  },
  {
    title: "Solar Wind",
    fact: "The continuous flow of charged particles from the Sun, known as solar wind, influences space weather conditions around Earth."
  },
  {
    title: "Space Weather Prediction",
    fact: "Scientists monitor the Sun's activity to predict space weather events and mitigate their impact on technology."
  },
  {
    title: "Cosmic Rays",
    fact: "High-energy particles from space, called cosmic rays, can be influenced by solar activity and affect space weather."
  },
  {
    title: "Geomagnetic Storms",
    fact: "Disturbances in Earth's magnetic field, known as geomagnetic storms, can impact navigation systems and power grids."
  },
  {
    title: "Space Weather Monitoring",
    fact: "NASA continuously monitors space weather to protect satellites, astronauts, and ground-based technologies."
  },
  {
    title: "Solar Maximum Cycle",
    fact: "The Sun follows an 11-year cycle of activity, with periods of high activity called solar maximum causing more space weather events."
  },
  {
    title: "Magnetic Reconnection",
    fact: "When Earth's magnetic field lines break and reconnect, it can create spectacular auroras and potentially dangerous space weather conditions."
  }
];

export const getRandomTrivia = () => {
  return spaceWeatherTrivia[Math.floor(Math.random() * spaceWeatherTrivia.length)];
};