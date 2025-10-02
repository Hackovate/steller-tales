import React, { useState } from 'react';
import StarsBackground from '../components/StarsBackground';
import GameCard from '../components/GameCard';
import QuizModal from '../components/QuizModal';
import VisualGallery from '../components/VisualGallery';
import ShieldTheGrid from '../components/ShieldTheGrid';
import SolarParticleShooter from '../components/SolarParticleShooter';
import { useLanguage } from '../context/LanguageContext';

const GamesPage = () => {
  const [selectedGame, setSelectedGame] = useState(null);
  const [gameScore, setGameScore] = useState(0);
  const [gameActive, setGameActive] = useState(false);
  const [quizLevel, setQuizLevel] = useState('basic');
  const [unlocked, setUnlocked] = useState({ basic: true, intermediate: false, advanced: false });
  const { t } = useLanguage();

  React.useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem('quizProgress'));
      if (saved && typeof saved === 'object') setUnlocked({ basic: true, intermediate: !!saved.intermediate, advanced: !!saved.advanced });
    } catch {}
  }, []);

  const saveProgress = (next) => {
    const merged = { ...unlocked, ...next };
    setUnlocked(merged);
    try { localStorage.setItem('quizProgress', JSON.stringify(merged)); } catch {}
  };

  const games = [
    {
      id: 'solar-particle-shooter',
      title: 'Particle Shooter',
      description: 'Defend Earth from solar storms!',
      emoji: '🛰️',
      type: 'mini',
      tag: 'action'
    },
    {
      id: 'shield-the-grid',
      title: 'Shield the Grid',
      description: 'Re-route power during Kp spikes!',
      emoji: '⚡',
      type: 'mini'
    },
    {
      id: 'visual-learning',
      title: 'Visual Learning Gallery',
      description: 'Watch space clips and images to learn fast!',
      emoji: '🎬',
      type: 'learning',
      tag: 'learning'
    },
    {
      id: 'space-weather-quiz',
      title: 'Space Weather Quiz',
      description: 'Test your space knowledge!',
      emoji: '🧠',
      type: 'quiz'
    }
  ];

  const handleGameClick = (game) => {
    if (game.locked) return;
    setSelectedGame(game);
    if (game.id === 'shield-the-grid') {
      setGameActive('shield-grid');
      return;
    }
    if (game.id === 'solar-particle-shooter') {
      setGameActive('shooter');
      return;
    }
    if (game.type === 'action') {
      setGameActive(true);
      setGameScore(0);
    }
    if (game.id === 'visual-learning') {
      setGameActive('visual-gallery');
    }
  };

  const closeGameModal = () => {
    setSelectedGame(null);
    setGameActive(false);
    setGameScore(0);
  };

  const simulateGameplay = React.useCallback(() => {
    if (!gameActive) return;
    
    // Simple game simulation
    const interval = setInterval(() => {
      setGameScore(prev => prev + Math.floor(Math.random() * 10) + 1);
    }, 1000);

    // Stop after 10 seconds
    setTimeout(() => {
      clearInterval(interval);
      setGameActive(false);
    }, 10000);
  }, [gameActive]);

  React.useEffect(() => {
    if (gameActive && selectedGame?.type === 'action') {
      simulateGameplay();
    }
  }, [gameActive, selectedGame, simulateGameplay]);

  return (
    <div className="mobile-container">
      <StarsBackground />
      
      <div className="screen active">
        <div className="relative z-10">
          {/* Header */}
          <div className="text-center mb-6 animate-in fade-in slide-in-from-top duration-500">
            <div className="mb-3">
              <span className="text-5xl inline-block hover:scale-105 transition-all cursor-pointer">🎮</span>
            </div>
            <h1 className="text-3xl font-bold text-accent-blue mb-3 tracking-wide">
              {t('gamesHeaderTitle')}
            </h1>
            <p className="text-text-light text-base leading-relaxed">
              {t('gamesHeaderSubtitle')}
            </p>
          </div>

          {/* Player Stats removed */}

          {/* Games Grid */}
          <div className="grid grid-cols-1 gap-6 mb-8">
            {games.map((game) => (
              <GameCard
                key={game.id}
                game={game}
                onClick={handleGameClick}
                isLocked={game.locked}
              />
            ))}
          </div>

          {/* Achievements removed */}
        </div>
      </div>

      {/* Game Modal */}
      {selectedGame && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-gradient-to-br from-[#16213e]/95 to-[#1a1a2e]/95 backdrop-blur-md rounded-2xl p-6 max-w-md w-full border border-accent-purple/30 shadow-2xl">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-accent-blue">
                {selectedGame.title}
              </h3>
              <button
                onClick={closeGameModal}
                className="text-text-gray hover:text-text-light text-2xl transition-all duration-300 hover:scale-105"
              >
                ×
              </button>
            </div>
            
          <div className="text-center mb-6">
              <div className="text-6xl mb-4">{selectedGame.emoji}</div>
              
              {selectedGame.type === 'action' && gameActive && (
                <div className="space-y-4">
                  <div className="text-2xl font-bold text-accent-yellow">
                    {t('score')} {gameScore}
                  </div>
                  <div className="bg-space-blue rounded-full h-4 overflow-hidden">
                    <div 
                      className="bg-gradient-to-r from-accent-orange to-accent-yellow h-full transition-all duration-1000"
                      style={{ width: '50%' }}
                    />
                  </div>
                  <div className="text-accent-orange font-medium">
                    {t('greatJobKeepCatching')}
                  </div>
                </div>
              )}
              
              {selectedGame.type === 'action' && !gameActive && gameScore === 0 && (
                <div className="space-y-4">
                  <p className="text-text-light">
                    {t('protectEarthIntro')}
                  </p>
                  <button
                    onClick={() => setGameActive(true)}
                    className="bg-accent-orange hover:bg-accent-orange/90 text-white px-6 py-3 rounded-lg font-bold transition-all hover:scale-[1.02]"
                  >
                    {t('startGame')}
                  </button>
                </div>
              )}
              
              {selectedGame.type === 'action' && !gameActive && gameScore > 0 && (
                <div className="space-y-4">
                  <div className="text-2xl font-bold text-accent-yellow">
                    {t('finalScore')} {gameScore}
                  </div>
                  <div className="text-accent-blue">
                    {t('excellentWork')}
                  </div>
                  <div className="flex gap-3">
                    <button
                      onClick={() => {
                        setGameActive(true);
                        setGameScore(0);
                      }}
                      className="flex-1 bg-gradient-to-r from-accent-blue to-accent-purple hover:from-accent-blue/90 hover:to-accent-purple/90 text-white px-4 py-3 rounded-lg font-medium transition-all duration-300 hover:scale-[1.02] shadow-lg"
                    >
                      {t('playAgain')}
                    </button>
                    <button
                      onClick={closeGameModal}
                      className="flex-1 bg-gradient-to-r from-accent-orange to-accent-yellow hover:from-accent-orange/90 hover:to-accent-yellow/90 text-white px-4 py-3 rounded-lg font-medium transition-all duration-300 hover:scale-[1.02] shadow-lg"
                    >
                      {t('continue')}
                    </button>
                  </div>
                </div>
              )}
              
              {selectedGame.type === 'quiz' && (
                <div className="space-y-4">
                  <p className="text-text-light">
                    {t('quizBlurb')}
                  </p>
                  <div className="flex items-center justify-center gap-2">
                    {['basic','intermediate','advanced'].map((lvl) => {
                      const isUnlocked = lvl==='basic' ? true : unlocked[lvl];
                      const active = quizLevel === lvl;
                      return (
                        <button key={lvl} onClick={() => isUnlocked && setQuizLevel(lvl)} className={`px-3 py-2 rounded-xl border ${active?'border-accent-purple text-accent-yellow':'border-accent-purple/30 text-text-light'} ${!isUnlocked?'opacity-50 cursor-not-allowed':''} bg-space-card/50 capitalize`}> {lvl} {isUnlocked?'':'🔒'} </button>
                      );
                    })}
                  </div>
                  <div className="text-xs text-text-gray">{t('answerEightyToUnlock')}</div>
                  <button disabled={quizLevel!=='basic' && !unlocked[quizLevel]} onClick={() => setGameActive('quiz')} className={`bg-gradient-to-r from-accent-purple to-accent-blue text-white px-6 py-3 rounded-lg font-bold transition-all duration-300 shadow-lg ${quizLevel!=='basic' && !unlocked[quizLevel] ? 'opacity-60 cursor-not-allowed' : 'hover:from-accent-purple/90 hover:to-accent-blue/90 hover:scale-[1.02]'}`}>
                    {t('startLevelQuiz', { level: quizLevel.charAt(0).toUpperCase()+quizLevel.slice(1) })}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
      {gameActive === 'quiz' && (
        <QuizModal level={quizLevel} count={12} onComplete={({ level, score, total }) => {
          const ratio = total ? (score/total) : 0;
          if (ratio >= 0.8) {
            if (level === 'basic' && !unlocked.intermediate) saveProgress({ intermediate: true });
            if (level === 'intermediate' && !unlocked.advanced) saveProgress({ advanced: true });
          }
        }} onClose={() => { setGameActive(false); setSelectedGame(null); }} />
      )}
      {gameActive === 'visual-gallery' && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-gradient-to-br from-[#16213e]/95 to-[#1a1a2e]/95 backdrop-blur-md rounded-2xl p-6 max-w-md w-full border border-accent-purple/30 shadow-2xl overflow-y-auto max-h-[85vh]">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-accent-blue">{t('visualLearningGalleryTitle')}</h3>
              <button onClick={() => { setGameActive(false); setSelectedGame(null); }} className="text-text-gray hover:text-text-light text-2xl">×</button>
            </div>
            <div className="space-y-4">
              <VisualGallery />
            </div>
          </div>
        </div>
      )}
      {gameActive === 'shield-grid' && (
        <ShieldTheGrid onClose={() => { setGameActive(false); setSelectedGame(null); }} />
      )}
      {gameActive === 'shooter' && (
        <SolarParticleShooter onClose={() => { setGameActive(false); setSelectedGame(null); }} />
      )}
    </div>
  );
};

export default GamesPage;