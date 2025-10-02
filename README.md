# 🌌 Stellar Tales - Interactive Space Weather Education Platform

> **An engaging digital children's story app that explains space weather using real-time NASA and NOAA data with friendly visuals and interactive learning experiences.**

![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)
![React](https://img.shields.io/badge/React-19.1.1-61DAFB?logo=react)
![Vite](https://img.shields.io/badge/Vite-7.1.7-646CFF?logo=vite)
![Tailwind](https://img.shields.io/badge/Tailwind-3.4.0-38B2AC?logo=tailwind-css)

**🌐 [Live Demo](https://stellar-tales-demo.vercel.app)** | **📚 [Documentation](docs/)** | **🚀 [Deployment Guide](DEPLOYMENT_GUIDE.md)**

---

## 🎯 Overview

**Stellar Tales** is an interactive space weather education platform designed for children that combines real-time NASA and NOAA data with engaging storytelling to teach about:

- 🌟 **Real-Time Space Weather** - Live solar activity monitoring with child-friendly explanations
- 📚 **Interactive Stories** - 5 character-based stories showing space weather impacts
- 🎮 **Educational Games** - Mini-games and quizzes to reinforce learning
- 🗺️ **Aurora Maps** - Live aurora probability maps for both hemispheres
- 📊 **Solar Activity Dashboard** - Real-time solar wind, flares, and geomagnetic data
- 🌍 **Impact Stories** - How space weather affects different professions

### 🏆 Key Features

🌟 **Real-Time Space Weather Monitoring** - Live data from NASA DONKI and NOAA SWPC  
📚 **6 Interactive Character Stories** - Astronaut, Pilot, Farmer, Electrician, Fisherman, Scientist  
🎮 **Educational Mini-Games** - Solar particle shooter, shield the grid, trivia quizzes  
🗺️ **Live Aurora Maps** - Northern and Southern Hemisphere aurora forecasts  
📊 **Solar Activity Dashboard** - Solar wind gauges, flare monitor, Kp forecast  
🌍 **Impact Story Panels** - Real-world space weather effects on different professions  
🎨 **Visual Learning Gallery** - NASA APOD and space weather imagery  
🌐 **Multi-Language Support** - Internationalization with i18next  
📱 **Responsive Design** - Works on desktop, tablet, and mobile devices  

---

## 🚀 Quick Start

### Prerequisites

- **Node.js** 18+ and npm/yarn
- **API Keys** (free):
  - [NASA API](https://api.nasa.gov/) - Space weather and imagery data
  - [NOAA SWPC](https://services.swpc.noaa.gov/) - Solar wind and aurora data (no key required)

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/stellar-tales.git
cd stellar-tales

# Install dependencies
npm install

# Setup environment variables
cp .env.example .env
# Edit .env and add your NASA API key

# Start development server
npm run dev

# Open browser to http://localhost:5173

---

## 🔧 Environment Setup

Create a `.env` file in the project root:

```env
# Required
VITE_NASA_API_KEY=your_nasa_api_key_here


**🔐 Important:** Never commit your `.env` file with real API keys to GitHub!

## 📖 Usage Guide

### 1. Home Dashboard
- View the **Astronomy Picture of the Day** (NASA APOD)
- Check **Today at a Glance** space weather summary
- See real-time **solar activity alerts**

### 2. Space Weather Dashboard
- **Solar Wind Gauges** - Speed, density, and magnetic field data
- **Aurora Maps** - Live aurora probability for both hemispheres
- **Events Timeline** - Recent solar flares, CMEs, and geomagnetic storms
- **Impact Story Panels** - How space weather affects different professions

### 3. Interactive Stories
Navigate through 6 character-based stories:
- 🚀 **Astronaut** - Space weather effects on space missions
- ✈️ **Pilot** - Aviation impacts and communication disruptions
- 🌾 **Farmer** - Agricultural effects and crop monitoring
- ⚡ **Electrician** - Power grid impacts and geomagnetic storms
- 🎣 **Fisherman** - Marine weather and navigation effects
 - 🔬 **Scientist** - Research missions, data analysis, instrument protection

### 4. Educational Games
- **Solar Particle Shooter** - Learn about solar wind particles
- **Shield the Grid** - Protect power infrastructure from space weather
- **Space Weather Quizzes** - Test your knowledge with interactive quizzes
- **Visual Learning Gallery** - Explore NASA imagery and videos

### 5. Wiki Section
- **Space Weather Encyclopedia** - Detailed explanations of space weather phenomena
- **Aurora Guide** - How to spot and photograph auroras
- **Solar Activity** - Understanding solar cycles and sunspots
- **Space Weather Effects** - Real-world impacts and safety information
 - **NASA Studies** - How NASA studies the Sun and space weather (missions, instruments)
 - **NASA Space Weather Missions** - Overview of key missions monitoring the Sun and heliosphere

---

## 🛠️ Technology Stack

### Frontend
- **React 19.1.1** - UI framework with hooks and context
- **Vite 7.1.7** - Build tool with HMR
- **React Router 6.26.2** - Client-side routing
- **Tailwind CSS 3.4.0** - Utility-first styling
- **React Icons 5.3.0** - Icon library

### APIs & Data Sources
- **NASA DONKI** - Space weather database (flares, CMEs, storms)
- **NASA APOD** - Astronomy Picture of the Day
- **NASA Images API** - Space imagery and videos
- **NOAA SWPC** - Solar wind, aurora, and geomagnetic data
- **GOES X-ray** - Solar flare monitoring
- **DSCOVR** - Solar wind measurements

### Architecture
- Component-based React architecture
- Context API for state management
- Error boundaries for graceful failure handling
- Debounced API calls to prevent rate limiting
- Responsive design for all devices
- Internationalization support

---

---

## 📊 Space Weather Data Sources

The app integrates **7 real-time data sources** for comprehensive space weather monitoring:

| Source | Data Type | Update Frequency | Description |
|--------|-----------|------------------|-------------|
| 🌟 NASA DONKI | Solar Flares | 15 minutes | X-ray flare events and classifications |
| 🌟 NASA DONKI | CMEs | 15 minutes | Coronal Mass Ejection events |
| 🌟 NASA DONKI | Geomagnetic Storms | 15 minutes | Kp index and storm predictions |
| 🌟 NASA DONKI | Solar Energetic Particles | 15 minutes | SEP event monitoring |
| 🌟 NOAA SWPC | Solar Wind | 1 minute | Real-time solar wind measurements |
| 🌟 NOAA SWPC | Aurora Forecast | 30 minutes | Aurora probability maps |
| 🌟 NASA APOD | Daily Image | 24 hours | Astronomy Picture of the Day |

---


## 🌐 Internationalization

The app supports multiple languages with i18next:

- 🇺🇸 **English** (default)
- 🇪🇸 **Español**
- 🇧🇩 **বাংলা**
- 🇮🇳 **हिंदी**
- 🇫🇷 **Français**

---

## 📚 Documentation

Detailed documentation available in `/docs`:

- **[Quick Start Guide](docs/QUICK_START_GUIDE.md)** - Getting started tutorial
- **[API Reference](docs/API_REFERENCE.md)** - NASA and NOAA API integration
- **[Story Development](docs/STORY_DEVELOPMENT.md)** - Creating new character stories
- **[Game Development](docs/GAME_DEVELOPMENT.md)** - Adding educational games
- **[Deployment Guide](docs/DEPLOYMENT_GUIDE.md)** - Production deployment
- **[Contributing Guide](docs/CONTRIBUTING.md)** - How to contribute

---

## 📝 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- **NASA** - For providing free APIs and space weather data
- **NOAA SWPC** - For real-time solar wind and aurora data

---

## 🌟 Star History

If this project helps you teach space weather to children, please consider giving it a ⭐️ on GitHub!

---

**Built with ❤️ for Space Weather Education**

*Making space weather accessible and fun for the next generation of space explorers!* 🚀✨