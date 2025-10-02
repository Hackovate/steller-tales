import React, { useEffect, useRef, useState } from 'react';

// Upgraded arcade mini-game: tap nodes to re-route power while waves of spikes appear.
// Features: difficulty ramp, combo multiplier, progress bars, restart, and high score.

const NODE_COUNT = 6;
const ROUND_MS = 30000; // 30s per round
const BASE_SPAWN_MS = 1200;
const MIN_SPAWN_MS = 500;

const randInt = (n) => Math.floor(Math.random() * n);

const ShieldTheGrid = ({ onClose }) => {
  const [timeLeft, setTimeLeft] = useState(ROUND_MS / 1000);
  const [score, setScore] = useState(0);
  const [best, setBest] = useState(() => Number(localStorage.getItem('shieldGridBest') || 0));
  const [lives, setLives] = useState(3);
  const [combo, setCombo] = useState(1);
  const [spikes, setSpikes] = useState([]); // {id, node, lifeMs, maxMs}
  const [running, setRunning] = useState(false);
  const [countdown, setCountdown] = useState(3);
  const nextId = useRef(1);
  const lastSpawn = useRef(0);
  const lastTick = useRef(0);
  const pendingMissesRef = useRef(0);
  const [hitNode, setHitNode] = useState(null);
  const [missFlash, setMissFlash] = useState(false);

  const start = () => {
    setTimeLeft(ROUND_MS / 1000);
    setScore(0);
    setCombo(1);
    setLives(3);
    setSpikes([]);
    setCountdown(3);
    setRunning(false);
  };

  useEffect(() => { start(); }, []);

  // countdown then run
  useEffect(() => {
    if (countdown <= 0 || running) return;
    const t = setTimeout(() => setCountdown((c) => c - 1), 1000);
    if (countdown === 1) setTimeout(() => setRunning(true), 1000);
    return () => clearTimeout(t);
  }, [countdown, running]);

  // game loop
  useEffect(() => {
    if (!running) return;
    let raf;
    const loop = (ts) => {
      if (!lastTick.current) lastTick.current = ts;
      const dt = ts - lastTick.current;
      lastTick.current = ts;

      // update timers and reduce lives for expired spikes
      setTimeLeft((t) => Math.max(0, t - dt / 1000));
      let expiredLocal = 0;
      setSpikes((prev) => {
        const next = [];
        for (const s of prev) {
          const life = s.lifeMs - dt;
          if (life <= 0) expiredLocal += 1; else next.push({ ...s, lifeMs: life });
        }
        return next;
      });
      if (expiredLocal > 0) {
        pendingMissesRef.current += expiredLocal;
        // Immediate feedback for missed spikes
        setMissFlash(true);
        setTimeout(() => setMissFlash(false), 150);
        if (navigator.vibrate) { try { navigator.vibrate([30, 40, 30]); } catch {} }
      }

      // difficulty ramp: faster spawns over time
      const elapsed = ROUND_MS - (timeLeft * 1000);
      const spawnMs = Math.max(MIN_SPAWN_MS, BASE_SPAWN_MS - Math.floor(elapsed / 4000) * 100);
      if (ts - lastSpawn.current > spawnMs) {
        lastSpawn.current = ts;
        setSpikes((prev) => {
          // limit concurrent spikes
          if (prev.length >= 3) return prev;
          let node = randInt(NODE_COUNT);
          // avoid duplicate node when possible
          const used = new Set(prev.map((p) => p.node));
          for (let tries = 0; tries < NODE_COUNT && used.has(node); tries++) node = randInt(NODE_COUNT);
          const maxMs = 2000 + randInt(1500); // 2-3.5s life
          return [...prev, { id: nextId.current++, node, lifeMs: maxMs, maxMs }];
        });
      }

      // apply pending misses after state updates
      if (pendingMissesRef.current > 0) {
        const n = pendingMissesRef.current;
        pendingMissesRef.current = 0;
        setCombo(1);
        setLives((l) => Math.max(0, l - n));
      }

      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [running, timeLeft]);

  // miss detection (when spikes removed by expiry)
  useEffect(() => {
    // if a spike expired between frames, lives drop based on how many disappeared since last render
    // we approximate by comparing total life remaining sum trending; simpler: check if a spike life is very low
    // handled implicitly by setSpikes filter; we drop life when tapNode fails below
    if (timeLeft === 0 || lives === 0) return;
    if (spikes.length === 0) return;
  }, [spikes, timeLeft, lives]);

  const tapNode = (node) => {
    if (!running) return;
    // Read current spikes synchronously to avoid race with life decrement
    const target = spikes.find((s) => s.node === node);
    if (target) {
      setSpikes((prev) => prev.filter((s) => s.id !== target.id));
      setCombo((c) => Math.min(5, c + 0.25));
      setScore((s) => s + Math.round(10 * combo));
      setHitNode(node);
      setTimeout(() => setHitNode(null), 120);
      if (navigator.vibrate) try { navigator.vibrate(10); } catch {}
    } else {
      setCombo(1);
      setLives((l) => Math.max(0, l - 1));
      setMissFlash(true);
      setTimeout(() => setMissFlash(false), 150);
      if (navigator.vibrate) try { navigator.vibrate([20, 30, 20]); } catch {}
    }
  };

  // end conditions
  const over = timeLeft === 0 || lives === 0;
  useEffect(() => {
    if (over) {
      setRunning(false);
      const final = score;
      if (final > best) {
        setBest(final);
        localStorage.setItem('shieldGridBest', String(final));
      }
    }
  }, [over, score, best]);

  const restart = () => start();

  return (
    <div className={`fixed inset-0 ${missFlash?'bg-black/90':'bg-black/80'} backdrop-blur-sm flex items-center justify-center z-50 p-4 transition-colors`}>
      <div className="bg-gradient-to-br from-[#16213e]/95 to-[#1a1a2e]/95 backdrop-blur-md rounded-2xl p-6 max-w-md w-full border border-accent-purple/30 shadow-2xl">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold text-accent-blue">Shield the Grid</h3>
          <button onClick={onClose} className="text-text-gray hover:text-text-light text-2xl">×</button>
        </div>

        {/* HUD */}
        <div className="flex justify-between text-sm mb-3">
          <div className="text-accent-yellow">Score: {score}</div>
          <div className="text-accent-blue">Time: {Math.ceil(timeLeft)}s</div>
          <div className="text-accent-purple">Lives: {lives}</div>
        </div>
        <div className="text-xs text-text-gray mb-2">Best: {best} • Combo x{combo.toFixed(1)}</div>

        {/* Board */}
        <div className="grid grid-cols-3 gap-3 mb-4">
          {Array.from({ length: NODE_COUNT }).map((_, i) => {
            const s = spikes.find((sp) => sp.node === i);
            const pct = s ? Math.max(0, s.lifeMs / s.maxMs) : 0;
            return (
              <button key={i} onClick={() => tapNode(i)} className={`h-24 rounded-2xl border relative overflow-hidden ${s ? 'border-accent-orange bg-accent-orange/20' : 'border-accent-purple/30 bg-space-card/50'} text-3xl ${hitNode===i?'ring-2 ring-accent-blue':''}`}>
                <span className="select-none">{s ? '⚡' : '🔌'}</span>
                {s && (
                  <div className="absolute bottom-0 left-0 h-1 bg-accent-orange" style={{ width: `${Math.floor(pct * 100)}%` }} />
                )}
              </button>
            );
          })}
        </div>

        {/* Footer */}
        {!running && countdown > 0 && (
          <div className="text-center text-3xl text-accent-yellow font-bold mb-2">{countdown}</div>
        )}
        {over ? (
          <div className="text-center">
            <div className="text-accent-yellow font-bold mb-2">Round Over</div>
            <div className="text-text-light mb-3">Final Score: {score} • Best: {best}</div>
            <div className="flex gap-2 justify-center">
              <button onClick={restart} className="px-4 py-2 rounded-xl bg-gradient-to-r from-accent-orange to-accent-yellow text-white">Restart</button>
              <button onClick={onClose} className="px-4 py-2 rounded-xl bg-gradient-to-r from-accent-blue to-accent-purple text-white">Close</button>
            </div>
          </div>
        ) : (
          <div className="text-xs text-text-gray text-center">Tap nodes showing ⚡ before the bar empties. Misses cost a life; chains raise your combo.</div>
        )}
        {!over && (
          <div className="mt-3 flex items-center justify-center gap-3 select-none">
            <button onPointerDown={() => tapNode(0)} className="hidden" />
          </div>
        )}
      </div>
    </div>
  );
};

export default ShieldTheGrid;


