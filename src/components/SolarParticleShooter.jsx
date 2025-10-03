import React, { useEffect, useRef, useState } from 'react';
import shipSvg from '../assets/ship.svg';

// Canvas-based shooter: move with left/right, tap/click to fire. Mobile friendly.
// No external services required; all local simulation.

const WIDTH = 340;
const HEIGHT = 480;

const clamp = (v, a, b) => Math.max(a, Math.min(b, v));

const SolarParticleShooter = ({ onClose }) => {
  const canvasRef = useRef(null);
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [running, setRunning] = useState(false);
  const [level, setLevel] = useState(1);
  const [combo, setCombo] = useState(0);
  const [maxCombo, setMaxCombo] = useState(0);
  const [powerUps, setPowerUps] = useState([]);
  const [gameStarted, setGameStarted] = useState(false);
  const [shootingMode, setShootingMode] = useState('single'); // 'single', 'triple', 'spread'
  const [powerUpTimer, setPowerUpTimer] = useState(0);
  const [gameOverTimer, setGameOverTimer] = useState(0);
  const [showMenu, setShowMenu] = useState(true);
  const [highScores, setHighScores] = useState([]);
  const [showHelp, setShowHelp] = useState(false);
  const [shieldActive, setShieldActive] = useState(false);
  const [shieldTimer, setShieldTimer] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  // Mirror state to refs to avoid re-creating the RAF loop and handlers
  const runningRef = useRef(false);
  const showMenuRef = useRef(true);
  const showHelpRef = useRef(false);
  const isPausedRef = useRef(false);
  const gameStartedRef = useRef(false);
  const shootingModeRef = useRef('single');
  const powerUpTimerRef = useRef(0);
  const shieldActiveRef = useRef(false);
  const shieldTimerRef = useRef(0);
  const scoreRef = useRef(0);
  const livesRef = useRef(3);
  const levelRef = useRef(1);
  const comboRef = useRef(0);
  const highScoresRef = useRef([]);
  const powerUpsRef = useRef([]);

  useEffect(() => { runningRef.current = running; }, [running]);
  useEffect(() => { showMenuRef.current = showMenu; }, [showMenu]);
  useEffect(() => { showHelpRef.current = showHelp; }, [showHelp]);
  useEffect(() => { isPausedRef.current = isPaused; }, [isPaused]);
  useEffect(() => { gameStartedRef.current = gameStarted; }, [gameStarted]);
  useEffect(() => { shootingModeRef.current = shootingMode; }, [shootingMode]);
  useEffect(() => { powerUpTimerRef.current = powerUpTimer; }, [powerUpTimer]);
  useEffect(() => { shieldActiveRef.current = shieldActive; }, [shieldActive]);
  useEffect(() => { shieldTimerRef.current = shieldTimer; }, [shieldTimer]);
  useEffect(() => { scoreRef.current = score; }, [score]);
  useEffect(() => { livesRef.current = lives; }, [lives]);
  useEffect(() => { levelRef.current = level; }, [level]);
  useEffect(() => { comboRef.current = combo; }, [combo]);
  useEffect(() => { highScoresRef.current = highScores; }, [highScores]);
  useEffect(() => { powerUpsRef.current = powerUps; }, [powerUps]);

  const handleModalTap = (e) => {
    // Only close if clicking on the backdrop, not the game content
    if (e.target === e.currentTarget && !running && gameStarted) {
      onClose();
    }
  };

  const shipRef = useRef({ x: WIDTH / 2, y: HEIGHT - 40, vx: 0 });
  const shipImgRef = useRef(null);
  const bulletsRef = useRef([]); // {x,y,vy}
  const enemiesRef = useRef([]); // {x,y,vy}
  const keysRef = useRef({});
  const lastSpawnRef = useRef(0);
  const lastTsRef = useRef(0);
  const lastShotRef = useRef(0);
  const fireHeldRef = useRef(false);
  const starsRef = useRef([]); // {x,y,s,layer}
  const sparkRef = useRef([]); // explosion particles {x,y,vx,vy,life}
  const powerUpSpawnRef = useRef(0);
  const comboTimeoutRef = useRef(null);
  const lastComboHitRef = useRef(0);
  const screenShakeRef = useRef(0);
  const powerUpEndTimeRef = useRef(0);
  const gameOverStartTimeRef = useRef(0);
  const shieldEndTimeRef = useRef(0);

  // Load high scores from localStorage
  useEffect(() => {
    const savedScores = localStorage.getItem('particleShooterHighScores');
    if (savedScores) {
      setHighScores(JSON.parse(savedScores));
    }
  }, []);

  // Save high score when game ends
  const saveHighScore = (score) => {
    const newScores = [...highScores, { score, date: new Date().toLocaleDateString() }]
      .sort((a, b) => b.score - a.score)
      .slice(0, 5); // Keep top 5
    setHighScores(newScores);
    localStorage.setItem('particleShooterHighScores', JSON.stringify(newScores));
  };

  useEffect(() => {
    // load ship sprite
    const img = new Image();
    img.src = shipSvg; // Use imported asset
    shipImgRef.current = img;
    // create layered starfield
    const makeStars = [];
    for (let i = 0; i < 80; i++) {
      makeStars.push({ x: Math.random()*WIDTH, y: Math.random()*HEIGHT, s: 1+Math.random()*1.5, layer: 1 });
    }
    for (let i = 0; i < 50; i++) {
      makeStars.push({ x: Math.random()*WIDTH, y: Math.random()*HEIGHT, s: 0.8, layer: 0.5 });
    }
    starsRef.current = makeStars;
    const onKey = (e) => { keysRef.current[e.key] = e.type === 'keydown'; };
    window.addEventListener('keydown', onKey);
    window.addEventListener('keyup', onKey);
    const moveFromEvent = (e) => {
      // Normalize to canvas coordinates even when CSS scales the canvas
      const rect = canvasRef.current.getBoundingClientRect();
      const clientX = (e.clientX ?? (e.touches && e.touches[0]?.clientX) ?? (e.pointerType ? e.clientX : undefined));
      if (clientX == null) return;
      const relativeX = clientX - rect.left;
      const canvasX = (relativeX / rect.width) * WIDTH;
      shipRef.current.x = clamp(canvasX, 20, WIDTH - 20);
    };
    const onDown = (e) => { e.preventDefault(); moveFromEvent(e); };
    const onMove = (e) => { e.preventDefault(); moveFromEvent(e); };
        const onUp = () => { };
    canvasRef.current.addEventListener('pointerdown', onDown, { passive: false });
    canvasRef.current.addEventListener('pointermove', onMove, { passive: false });
    window.addEventListener('pointerup', onUp);
    return () => {
      window.removeEventListener('keydown', onKey);
      window.removeEventListener('keyup', onKey);
      canvasRef.current && canvasRef.current.removeEventListener('pointerdown', onDown);
      canvasRef.current && canvasRef.current.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerup', onUp);
    };
  }, []);

  useEffect(() => {
    const ctx = canvasRef.current.getContext('2d');
    let raf;
    const loop = (ts) => {
      if (!lastTsRef.current) lastTsRef.current = ts;
      const dt = (ts - lastTsRef.current) / 1000;
      lastTsRef.current = ts;

      // update
      if (runningRef.current && !showMenuRef.current && !showHelpRef.current && !isPausedRef.current) {
        const ship = shipRef.current;
        const speed = 240;
        ship.vx = (keysRef.current['ArrowRight'] ? 1 : 0) - (keysRef.current['ArrowLeft'] ? 1 : 0);
        ship.x = clamp(ship.x + ship.vx * speed * dt, 20, WIDTH - 20);
        // Always firing for mobile-friendly gameplay
        const firing = true;
        
        // Handle menu navigation
        if (showMenuRef.current && (keysRef.current[' '] || keysRef.current['Spacebar'])) {
          if (showHelpRef.current) {
            setShowHelp(false);
          } else {
            setShowMenu(false);
            setGameStarted(true);
            setRunning(true);
            gameOverStartTimeRef.current = 0;
          }
        }
        
        // Handle pause (P key)
        if (gameStartedRef.current && !showMenuRef.current && !showHelpRef.current && keysRef.current['p']) {
          setIsPaused(!isPaused);
          keysRef.current['p'] = false; // Prevent continuous toggling
        }
        const fireRate = shootingModeRef.current === 'rapid' ? 100 : 180;
        if (firing && ts - lastShotRef.current > fireRate && !shieldActiveRef.current) {
          lastShotRef.current = ts;
          
          if (shootingModeRef.current === 'single' || shootingModeRef.current === 'rapid') {
            bulletsRef.current.push({ x: ship.x, y: ship.y - 12, vy: -380 });
          } else if (shootingModeRef.current === 'triple') {
            // Triple shot - 3 bullets in a line
            bulletsRef.current.push({ x: ship.x - 8, y: ship.y - 12, vy: -380 });
            bulletsRef.current.push({ x: ship.x, y: ship.y - 12, vy: -380 });
            bulletsRef.current.push({ x: ship.x + 8, y: ship.y - 12, vy: -380 });
          } else if (shootingModeRef.current === 'spread') {
            // Spread shot - 5 bullets in a fan
          bulletsRef.current.push({ x: ship.x, y: ship.y - 12, vy: -380 });
            bulletsRef.current.push({ x: ship.x - 12, y: ship.y - 8, vy: -350, vx: -50 });
            bulletsRef.current.push({ x: ship.x + 12, y: ship.y - 8, vy: -350, vx: 50 });
            bulletsRef.current.push({ x: ship.x - 16, y: ship.y - 4, vy: -320, vx: -100 });
            bulletsRef.current.push({ x: ship.x + 16, y: ship.y - 4, vy: -320, vx: 100 });
          }
        }
        // spawn enemies (faster as level increases)
        const spawnRate = Math.max(200, 700 - (levelRef.current * 50));
        if (ts - lastSpawnRef.current > spawnRate) {
          lastSpawnRef.current = ts;
          const enemySpeed = 60 + Math.random() * 90 + (level * 20);
          enemiesRef.current.push({ 
            x: 20 + Math.random() * (WIDTH - 40), 
            y: -10, 
            vy: enemySpeed,
            type: Math.random() < 0.1 ? 'special' : 'normal' // 10% chance for special enemy
          });
        }

        // spawn power-ups
        if (ts - powerUpSpawnRef.current > 6000 + Math.random() * 3000) {
          powerUpSpawnRef.current = ts;
          const powerUpTypes = ['health', 'rapid', 'triple', 'spread', 'stopfire'];
          const randomType = powerUpTypes[Math.floor(Math.random() * powerUpTypes.length)];
          setPowerUps(prev => [...prev, { x: 20 + Math.random() * (WIDTH - 40), y: -10, vy: 40, type: randomType }]);
        }
        // move bullets
        bulletsRef.current = bulletsRef.current.map((b) => ({ 
          ...b, 
          x: b.x + (b.vx || 0) * dt,
          y: b.y + b.vy * dt 
        })).filter((b) => b.y > -20 && b.x > -10 && b.x < WIDTH + 10);
        // move enemies
        enemiesRef.current = enemiesRef.current.map((en) => ({ ...en, y: en.y + en.vy * dt }));
        // move power-ups
        setPowerUps(prev => prev.map(p => ({ ...p, y: p.y + p.vy * dt })).filter(p => p.y < HEIGHT + 20));
        // collisions
        const hit = [];
        for (let i = 0; i < enemiesRef.current.length; i++) {
          const en = enemiesRef.current[i];
          if (en.y > HEIGHT + 20) {
            // miss costs life
            enemiesRef.current.splice(i, 1); i--; 
            setLives((l) => Math.max(0, l - 1));
            setCombo(0);
            screenShakeRef.current = 10;
            continue;
          }
          for (let j = 0; j < bulletsRef.current.length; j++) {
            const b = bulletsRef.current[j];
            if ((b.x - en.x) ** 2 + (b.y - en.y) ** 2 < 20 * 20) {
              bulletsRef.current.splice(j, 1); j--;
              hit.push(i);
              
              // Combo system
              const now = Date.now();
              if (now - lastComboHitRef.current < 1000) {
                setCombo(prev => {
                  const newCombo = prev + 1;
                  setMaxCombo(prevMax => Math.max(prevMax, newCombo));
                  return newCombo;
                });
              } else {
                setCombo(1);
              }
              lastComboHitRef.current = now;
              
              // Score with combo multiplier
              const baseScore = en.type === 'special' ? 50 : 10;
              const comboMultiplier = Math.floor(comboRef.current / 5) + 1;
              setScore((s) => s + (baseScore * comboMultiplier));
              
              // Level up every 500 points
              setLevel(Math.floor((scoreRef.current) / 500) + 1);
              
              // spawn sparks
              const sparkCount = en.type === 'special' ? 20 : 10;
              for (let k = 0; k < sparkCount; k++) {
                const a = Math.random()*Math.PI*2; const sp = 60+Math.random()*80;
                sparkRef.current.push({ x: en.x, y: en.y, vx: Math.cos(a)*sp, vy: Math.sin(a)*sp, life: 500 });
              }
              break;
            }
          }
        }
        // remove hit enemies
        if (hit.length) {
          enemiesRef.current = enemiesRef.current.filter((_, idx) => !hit.includes(idx));
        }

            // Power-up collisions
            setPowerUps(prev => {
              const ship = shipRef.current;
              return prev.filter(p => {
                const dist = Math.sqrt((p.x - ship.x) ** 2 + (p.y - ship.y) ** 2);
                if (dist < 25) {
                  if (p.type === 'health') {
                    setLives(l => Math.min(5, l + 1));
                  } else if (p.type === 'rapid') {
                    setShootingMode('rapid');
                    setPowerUpTimer(5000);
                    powerUpEndTimeRef.current = ts + 5000;
                  } else if (p.type === 'triple') {
                    setShootingMode('triple');
                    setPowerUpTimer(8000);
                    powerUpEndTimeRef.current = ts + 8000;
                  } else if (p.type === 'spread') {
                    setShootingMode('spread');
                    setPowerUpTimer(6000);
                    powerUpEndTimeRef.current = ts + 6000;
                  } else if (p.type === 'stopfire') {
                    setShieldActive(true);
                    setShieldTimer(3000);
                    shieldEndTimeRef.current = ts + 3000;
                  }
                  return false; // Remove power-up
                }
                return true;
              });
            });

        // Check if power-up should expire
        if (powerUpEndTimeRef.current > 0 && ts > powerUpEndTimeRef.current) {
          setShootingMode('single');
          setPowerUpTimer(0);
          powerUpEndTimeRef.current = 0;
        } else if (powerUpEndTimeRef.current > 0) {
          setPowerUpTimer(powerUpEndTimeRef.current - ts);
        }

        // Check if shield should expire
        if (shieldEndTimeRef.current > 0 && ts > shieldEndTimeRef.current) {
          setShieldActive(false);
          setShieldTimer(0);
          shieldEndTimeRef.current = 0;
        } else if (shieldEndTimeRef.current > 0) {
          setShieldTimer(shieldEndTimeRef.current - ts);
        }

        // update sparks
        sparkRef.current = sparkRef.current.map((p) => ({ ...p, x: p.x + p.vx*dt, y: p.y + p.vy*dt, vy: p.vy + 50*dt, life: p.life - dt*1000 })).filter((p) => p.life > 0);
        // move stars (parallax)
        starsRef.current = starsRef.current.map((st) => {
          let y = st.y + (20*st.layer)*dt;
          if (y > HEIGHT) y = 0;
          return { ...st, y };
        });
      }

      // draw
      ctx.clearRect(0, 0, WIDTH, HEIGHT);
      
      // Screen shake effect
      const shakeX = screenShakeRef.current > 0 ? (Math.random() - 0.5) * 4 : 0;
      const shakeY = screenShakeRef.current > 0 ? (Math.random() - 0.5) * 4 : 0;
      if (screenShakeRef.current > 0) screenShakeRef.current--;
      
      ctx.save();
      ctx.translate(shakeX, shakeY);
      
      // bg
      const grad = ctx.createLinearGradient(0,0,0,HEIGHT);
      grad.addColorStop(0,'#0b132b'); grad.addColorStop(1,'#1c2541');
      ctx.fillStyle = grad; ctx.fillRect(0,0,WIDTH,HEIGHT);
      // stars
      starsRef.current.forEach((st) => { ctx.fillStyle = 'rgba(255,255,255,0.8)'; ctx.fillRect(st.x, st.y, st.s, st.s); });
      // ship
      const ship = shipRef.current;
      const img = shipImgRef.current;
      if (img && img.complete) {
        ctx.drawImage(img, ship.x - 16, ship.y - 16, 32, 32);
      } else {
        ctx.fillStyle = '#4ecdc4';
        ctx.beginPath(); ctx.arc(ship.x, ship.y, 10, 0, Math.PI * 2); ctx.fill();
      }
      // bullets
      bulletsRef.current.forEach((b) => {
        const g = ctx.createLinearGradient(b.x, b.y-10, b.x, b.y+2);
        g.addColorStop(0,'#ffe57a'); g.addColorStop(1,'#ff9f1a');
        ctx.fillStyle = g; ctx.fillRect(b.x - 2, b.y - 10, 4, 12);
      });
      // enemies (solar particles)
      // enemies (solar particles) with glow
      enemiesRef.current.forEach((en) => {
        if (en.type === 'special') {
          // Special enemy - larger and different color
          const grd = ctx.createRadialGradient(en.x, en.y, 3, en.x, en.y, 20);
          grd.addColorStop(0, 'rgba(255,50,150,1)');
          grd.addColorStop(0.5, 'rgba(255,100,200,0.8)');
          grd.addColorStop(1, 'rgba(255,100,200,0)');
          ctx.fillStyle = grd;
          ctx.beginPath(); ctx.arc(en.x, en.y, 20, 0, Math.PI * 2); ctx.fill();
        } else {
        const grd = ctx.createRadialGradient(en.x, en.y, 2, en.x, en.y, 14);
        grd.addColorStop(0, 'rgba(255,107,53,1)');
        grd.addColorStop(1, 'rgba(255,107,53,0)');
        ctx.fillStyle = grd;
        ctx.beginPath(); ctx.arc(en.x, en.y, 14, 0, Math.PI * 2); ctx.fill();
        }
      });

      // power-ups
      powerUps.forEach((p) => {
        if (p.type === 'health') {
          ctx.fillStyle = '#4ade80';
          ctx.beginPath(); ctx.arc(p.x, p.y, 8, 0, Math.PI * 2); ctx.fill();
          ctx.fillStyle = '#22c55e';
          ctx.font = '12px sans-serif';
          ctx.fillText('+', p.x - 3, p.y + 3);
        } else if (p.type === 'rapid') {
          ctx.fillStyle = '#f59e0b';
          ctx.beginPath(); ctx.arc(p.x, p.y, 8, 0, Math.PI * 2); ctx.fill();
          ctx.fillStyle = '#d97706';
          ctx.font = '10px sans-serif';
          ctx.fillText('R', p.x - 3, p.y + 3);
        } else if (p.type === 'triple') {
          ctx.fillStyle = '#8b5cf6';
          ctx.beginPath(); ctx.arc(p.x, p.y, 8, 0, Math.PI * 2); ctx.fill();
          ctx.fillStyle = '#7c3aed';
          ctx.font = '10px sans-serif';
          ctx.fillText('3', p.x - 3, p.y + 3);
        } else if (p.type === 'spread') {
          ctx.fillStyle = '#ef4444';
          ctx.beginPath(); ctx.arc(p.x, p.y, 8, 0, Math.PI * 2); ctx.fill();
          ctx.fillStyle = '#dc2626';
          ctx.font = '10px sans-serif';
          ctx.fillText('S', p.x - 3, p.y + 3);
        } else if (p.type === 'stopfire') {
          ctx.fillStyle = '#06b6d4';
          ctx.beginPath(); ctx.arc(p.x, p.y, 8, 0, Math.PI * 2); ctx.fill();
          ctx.fillStyle = '#0891b2';
          ctx.font = '10px sans-serif';
          ctx.fillText('⏸', p.x - 4, p.y + 3);
        }
      });
      // HUD
      ctx.fillStyle = '#ffffff'; ctx.font = '12px sans-serif';
      ctx.fillText(`Score: ${score}`, 8, 16);
      ctx.fillText(`Lives: ${lives}`, WIDTH - 80, 16);
      ctx.fillText(`Level: ${level}`, 8, 32);
      ctx.fillText(`Combo: ${combo}`, WIDTH - 80, 32);
      
      // Multiplier display below pause button
      if (combo > 1) {
        ctx.fillStyle = '#fbbf24';
        ctx.font = 'bold 14px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(`x${combo}`, WIDTH / 2, 48);
        ctx.textAlign = 'left'; // Reset text alignment
      }
      
      // Pause button on canvas (top center) - transparent
      const pauseButtonX = WIDTH / 2 - 20;
      const pauseButtonY = 2;
      const pauseButtonSize = 40;
      
      // Pause button background - more transparent
      ctx.fillStyle = isPaused ? 'rgba(34, 197, 94, 0.3)' : 'rgba(249, 115, 22, 0.3)';
      ctx.fillRect(pauseButtonX, pauseButtonY, pauseButtonSize, pauseButtonSize);
      
      // Pause button border - subtle
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)';
      ctx.lineWidth = 1;
      ctx.strokeRect(pauseButtonX, pauseButtonY, pauseButtonSize, pauseButtonSize);
      
      // Pause/Play icon - smaller and more subtle
      ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
      ctx.font = 'bold 16px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(isPaused ? '▶' : '⏸', pauseButtonX + pauseButtonSize/2, pauseButtonY + pauseButtonSize/2 + 5);
      ctx.textAlign = 'left'; // Reset text alignment
      
          // Power-up status
          if (shootingMode !== 'single') {
            const modeColors = {
              'rapid': '#f59e0b',
              'triple': '#8b5cf6', 
              'spread': '#ef4444'
            };
            const modeNames = {
              'rapid': 'RAPID FIRE',
              'triple': 'TRIPLE SHOT',
              'spread': 'SPREAD SHOT'
            };
            
            ctx.fillStyle = modeColors[shootingMode];
            ctx.font = 'bold 10px sans-serif';
            ctx.fillText(modeNames[shootingMode], 8, 48);
            
            if (powerUpTimer > 0) {
              const seconds = Math.ceil(powerUpTimer / 1000);
              ctx.fillText(`${seconds}s`, WIDTH - 30, 48);
            }
          }
          
          // Stop Fire status
          if (shieldActive) {
            ctx.fillStyle = '#06b6d4';
            ctx.font = 'bold 10px sans-serif';
            ctx.fillText('STOP FIRE ACTIVE', 8, 64);
            
            if (shieldTimer > 0) {
              const seconds = Math.ceil(shieldTimer / 1000);
              ctx.fillText(`${seconds}s`, WIDTH - 30, 64);
            }
          }
      
      // Combo indicator removed - now shown below pause button
      
      // sparks
      sparkRef.current.forEach((p) => { ctx.fillStyle = 'rgba(255,210,63,0.8)'; ctx.fillRect(p.x, p.y, 2, 2); });

      ctx.restore(); // End screen shake

      if (livesRef.current <= 0) {
        setRunning(false);
        if (gameOverStartTimeRef.current === 0) {
          gameOverStartTimeRef.current = ts;
          saveHighScore(scoreRef.current); // Save score when game ends
        }
      }
      
      if (showMenuRef.current) {
        if (showHelpRef.current) {
          // Help screen
          ctx.fillStyle = 'rgba(0,0,0,0.9)'; ctx.fillRect(0, 0, WIDTH, HEIGHT);
          
          // Title
          ctx.fillStyle = '#4ade80'; ctx.font = 'bold 18px sans-serif'; 
          ctx.fillText('HOW TO PLAY', WIDTH / 2 - 60, 40);
          
          // Instructions
          ctx.fillStyle = '#ffffff'; ctx.font = '12px sans-serif';
          ctx.fillText('CONTROLS:', 20, 70);
          ctx.fillStyle = '#f59e0b'; ctx.font = '10px sans-serif';
          ctx.fillText('• Move: Arrow keys or drag', 30, 90);
          ctx.fillText('• Pause: Press P or tap ⏸', 30, 105);
          ctx.fillText('• Auto-fire: Always shooting!', 30, 120);
          ctx.fillText('• Collect power-ups!', 30, 135);
          
          ctx.fillStyle = '#ffffff'; ctx.font = '12px sans-serif';
          ctx.fillText('POWER-UPS:', 20, 150);
          ctx.fillStyle = '#4ade80'; ctx.font = '10px sans-serif';
          ctx.fillText('+ Health - Restore 1 life', 30, 170);
          ctx.fillStyle = '#f59e0b'; ctx.font = '10px sans-serif';
          ctx.fillText('R Rapid - 2x faster shooting', 30, 185);
          ctx.fillStyle = '#8b5cf6'; ctx.font = '10px sans-serif';
          ctx.fillText('3 Triple - 3 bullets at once', 30, 200);
          ctx.fillStyle = '#ef4444'; ctx.font = '10px sans-serif';
          ctx.fillText('S Spread - 5 bullets in fan', 30, 215);
          ctx.fillStyle = '#06b6d4'; ctx.font = '10px sans-serif';
          ctx.fillText('⏸ Stop Fire - Stop shooting 3s', 30, 230);
          
          ctx.fillStyle = '#ffffff'; ctx.font = '12px sans-serif';
          ctx.fillText('TIPS:', 20, 260);
          ctx.fillStyle = '#f59e0b'; ctx.font = '10px sans-serif';
          ctx.fillText('• Hit enemies for combos!', 30, 280);
          ctx.fillText('• Don\'t let them escape!', 30, 295);
          ctx.fillText('• Collect power-ups quickly', 30, 310);
          
          // Back button
          ctx.fillStyle = '#4ade80'; ctx.font = 'bold 12px sans-serif';
          ctx.fillText('TAP TO GO BACK', WIDTH / 2 - 50, HEIGHT - 20);
          
        } else {
          // Menu screen with high scores
          ctx.fillStyle = 'rgba(0,0,0,0.9)'; ctx.fillRect(0, 0, WIDTH, HEIGHT);
          
          // Title
          ctx.fillStyle = '#4ade80'; ctx.font = 'bold 20px sans-serif'; 
          ctx.fillText('PARTICLE SHOOTER', WIDTH / 2 - 80, 60);
          ctx.fillStyle = '#ffffff'; ctx.font = '14px sans-serif';
          ctx.fillText('Defend Earth from solar storms!', WIDTH / 2 - 90, 85);
          
          // High Scores
          ctx.fillStyle = '#f59e0b'; ctx.font = 'bold 16px sans-serif';
          ctx.fillText('HIGH SCORES', WIDTH / 2 - 50, 120);
          
          if (highScoresRef.current.length === 0) {
            ctx.fillStyle = '#888'; ctx.font = '12px sans-serif';
            ctx.fillText('No scores yet!', WIDTH / 2 - 40, 150);
          } else {
            highScoresRef.current.forEach((score, index) => {
              const y = 140 + (index * 20);
              ctx.fillStyle = index === 0 ? '#ffd700' : '#ffffff';
              ctx.font = index === 0 ? 'bold 12px sans-serif' : '12px sans-serif';
              ctx.fillText(`${index + 1}. ${score.score}`, 50, y);
              ctx.fillStyle = '#888';
              ctx.fillText(score.date, WIDTH - 80, y);
            });
          }
          
          // Menu buttons with better visual design and larger click areas
          // Play button background (larger area)
          ctx.fillStyle = 'rgba(74, 222, 128, 0.2)';
          ctx.fillRect(WIDTH / 2 - 80, HEIGHT - 110, 160, 40);
          ctx.strokeStyle = '#4ade80';
          ctx.lineWidth = 2;
          ctx.strokeRect(WIDTH / 2 - 80, HEIGHT - 110, 160, 40);
          
          // Play button text
          ctx.fillStyle = '#4ade80'; ctx.font = 'bold 16px sans-serif';
          ctx.fillText('PLAY GAME', WIDTH / 2 - 40, HEIGHT - 85);
          
          // Help button background (larger area)
          ctx.fillStyle = 'rgba(6, 182, 212, 0.2)';
          ctx.fillRect(WIDTH / 2 - 60, HEIGHT - 60, 120, 35);
          ctx.strokeStyle = '#06b6d4';
          ctx.lineWidth = 2;
          ctx.strokeRect(WIDTH / 2 - 60, HEIGHT - 60, 120, 35);
          
          // Help button text
          ctx.fillStyle = '#06b6d4'; ctx.font = 'bold 14px sans-serif';
          ctx.fillText('HELP', WIDTH / 2 - 20, HEIGHT - 40);
          
        }
        
      } else if (isPausedRef.current) {
        // Pause screen
        ctx.fillStyle = 'rgba(0,0,0,0.8)'; ctx.fillRect(0, 0, WIDTH, HEIGHT);
        ctx.fillStyle = '#f59e0b'; ctx.font = 'bold 20px sans-serif'; 
        ctx.fillText('PAUSED', WIDTH / 2 - 40, HEIGHT / 2 - 40);
        ctx.fillStyle = '#ffffff'; ctx.font = '14px sans-serif';
        ctx.fillText('Press P to resume', WIDTH / 2 - 60, HEIGHT / 2 - 10);
        ctx.fillStyle = '#4ade80'; ctx.font = '12px sans-serif';
        ctx.fillText('or tap anywhere', WIDTH / 2 - 50, HEIGHT / 2 + 20);
      } else if (!gameStartedRef.current) {
        ctx.fillStyle = 'rgba(0,0,0,0.8)'; ctx.fillRect(0, 0, WIDTH, HEIGHT);
        ctx.fillStyle = '#4ade80'; ctx.font = 'bold 20px sans-serif'; 
        ctx.fillText('PARTICLE SHOOTER', WIDTH / 2 - 80, HEIGHT / 2 - 40);
        ctx.fillStyle = '#ffffff'; ctx.font = '14px sans-serif';
        ctx.fillText('Defend Earth from solar storms!', WIDTH / 2 - 90, HEIGHT / 2 - 10);
        ctx.fillStyle = '#f59e0b'; ctx.font = '12px sans-serif';
        ctx.fillText('Tap anywhere to start', WIDTH / 2 - 60, HEIGHT / 2 + 20);
      } else if (!runningRef.current && gameStartedRef.current) {
        // Auto-close after 3 seconds
        if (gameOverStartTimeRef.current > 0 && ts - gameOverStartTimeRef.current > 3000) {
          onClose();
          return;
        }
        
        const remainingTime = gameOverStartTimeRef.current > 0 ? Math.ceil((3000 - (ts - gameOverStartTimeRef.current)) / 1000) : 3;
        
        // Game over background with gradient
        const gradient = ctx.createLinearGradient(0, 0, 0, HEIGHT);
        gradient.addColorStop(0, 'rgba(0, 0, 0, 0.9)');
        gradient.addColorStop(1, 'rgba(20, 20, 40, 0.9)');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, WIDTH, HEIGHT);
        
        // Game over title with glow effect
        ctx.fillStyle = '#ff6b6b'; 
        ctx.font = 'bold 20px sans-serif';
        ctx.shadowColor = '#ff6b6b';
        ctx.shadowBlur = 10;
        ctx.fillText('GAME OVER', WIDTH / 2 - 60, HEIGHT / 2 - 50);
        ctx.shadowBlur = 0;
        
        // Stats with better styling
        ctx.fillStyle = '#ffffff'; ctx.font = 'bold 14px sans-serif';
        ctx.fillText(`Final Score: ${score}`, WIDTH / 2 - 60, HEIGHT / 2 - 15);
        ctx.fillStyle = '#f59e0b'; ctx.font = '12px sans-serif';
        ctx.fillText(`Max Combo: ${maxCombo}`, WIDTH / 2 - 50, HEIGHT / 2 + 10);
        ctx.fillText(`Level Reached: ${level}`, WIDTH / 2 - 60, HEIGHT / 2 + 30);
        
        // Countdown with better styling
        ctx.fillStyle = '#06b6d4'; ctx.font = 'bold 12px sans-serif';
        ctx.fillText(`Closing in ${remainingTime}s...`, WIDTH / 2 - 50, HEIGHT / 2 + 55);
      }

      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    const handleCanvasTap = (e) => {
      // Prevent touch from triggering page scroll or double-tap zoom
      if (e.cancelable) e.preventDefault();
      e.stopPropagation();
      
      // Get click coordinates
      const rect = canvasRef.current.getBoundingClientRect();
      const clickY = (e.clientY || (e.touches && e.touches[0]?.clientY)) - rect.top;
      const clickX = (e.clientX || (e.touches && e.touches[0]?.clientX)) - rect.left;
      
      // Convert to canvas coordinates
      const canvasY = (clickY / rect.height) * HEIGHT;
      const canvasX = (clickX / rect.width) * WIDTH;
      
      // Check if pause button was clicked (during gameplay)
      if (gameStartedRef.current && !showMenuRef.current && !showHelpRef.current) {
        const pauseButtonX = WIDTH / 2 - 20;
        const pauseButtonY = 2;
        const pauseButtonSize = 40;
        
        if (canvasX >= pauseButtonX && canvasX <= pauseButtonX + pauseButtonSize &&
            canvasY >= pauseButtonY && canvasY <= pauseButtonY + pauseButtonSize) {
          setIsPaused(!isPaused);
          return;
        }
      }
      
      if (isPausedRef.current) {
        // Unpause the game
        setIsPaused(false);
      } else if (showMenuRef.current) {
        if (showHelpRef.current) {
          setShowHelp(false);
        } else {
          // Check which button was clicked - simplified detection
          
          // Play button area (Y: HEIGHT-110 to HEIGHT-70)
          if (canvasY >= HEIGHT - 110 && canvasY <= HEIGHT - 70 && 
              canvasX >= WIDTH / 2 - 80 && canvasX <= WIDTH / 2 + 80) {
            setShowMenu(false);
            setGameStarted(true);
            setRunning(true);
            gameOverStartTimeRef.current = 0;
          }
          // Help button area (Y: HEIGHT-60 to HEIGHT-25)
          else if (canvasY >= HEIGHT - 60 && canvasY <= HEIGHT - 25 && 
                   canvasX >= WIDTH / 2 - 60 && canvasX <= WIDTH / 2 + 60) {
            setShowHelp(true);
          }
          // Fallback: if clicking in the lower half, try to determine which button
          else if (canvasY > HEIGHT / 2) {
            // If clicking in upper part of lower half, assume play button
            if (canvasY < HEIGHT - 50) {
              setShowMenu(false);
              setGameStarted(true);
              setRunning(true);
              gameOverStartTimeRef.current = 0;
            }
            // If clicking in lower part, assume help button
            else {
              setShowHelp(true);
            }
          }
        }
      } else if (!gameStartedRef.current) {
        setGameStarted(true);
        setRunning(true);
        // Reset game over timer when starting new game
        gameOverStartTimeRef.current = 0;
      } else if (!runningRef.current && gameStartedRef.current) {
        onClose();
      }
    };
    
    canvasRef.current.addEventListener('pointerdown', handleCanvasTap, { passive: false });
    return () => { 
      cancelAnimationFrame(raf); 
      canvasRef.current && canvasRef.current.removeEventListener('pointerdown', handleCanvasTap);
    };
  }, [running, score, lives, level, combo, powerUps, gameStarted, shootingMode, powerUpTimer, gameOverTimer, showMenu, highScores, showHelp, shieldActive, shieldTimer, isPaused, onClose]);

  return (
    <div 
      className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={handleModalTap}
    >
      <div 
        className="bg-gradient-to-br from-[#16213e]/95 to-[#1a1a2e]/95 backdrop-blur-md rounded-2xl p-4 max-w-md w-full border border-accent-purple/30 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-xl font-bold text-accent-blue">Particle Shooter</h3>
          <button onClick={onClose} className="text-text-gray hover:text-text-light text-2xl">×</button>
        </div>
        <canvas ref={canvasRef} width={WIDTH} height={HEIGHT} className="w-full rounded-xl border border-accent-purple/20 bg-[#0f0f23] touch-none select-none" />
        <div className="text-xs text-text-gray mt-2">Move: ← → or drag • Pause: P key or ⏸ button • Auto-fire enabled • Collect power-ups: + (health), R (rapid), 3 (triple), S (spread), ⏸ (stop fire)</div>
        
      </div>
    </div>
  );
};

export default SolarParticleShooter;


