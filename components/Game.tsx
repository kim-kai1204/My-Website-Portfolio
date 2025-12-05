import React, { useEffect, useRef, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Header } from './Header';

// --- Types & Interfaces ---
interface Point {
  x: number;
  y: number;
}

interface Entity {
  id: number;
  x: number;
  y: number;
  radius: number;
  vx: number;
  vy: number;
  color: string;
  type: 'player' | 'enemy' | 'orb' | 'particle';
  life?: number; // For particles
  maxLife?: number;
}

// --- Game Constants ---
const COLORS = {
  background: '#050505',
  player: '#00ffff', // Cyan
  enemy: '#ff0055', // Neon Red/Pink
  orb: '#ffcc00', // Gold/Yellow
  text: '#ffffff',
};

const SPAWN_RATE_INITIAL = 60; // Frames between spawns
const PLAYER_SPEED_FACTOR = 0.15; // Lerp factor for mouse follow (0.1 = loose, 1.0 = instant)

export const Game: React.FC = () => {
  const navigate = useNavigate();
  
  // --- Refs for Game Loop (Mutable state without re-renders) ---
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const requestRef = useRef<number>(0);
  const frameCountRef = useRef<number>(0);
  const scoreRef = useRef<number>(0);
  const spawnRateRef = useRef<number>(SPAWN_RATE_INITIAL);
  const mouseRef = useRef<Point>({ x: 0, y: 0 });
  const isMouseDownRef = useRef<boolean>(false);
  
  // Game Entities
  const playerRef = useRef<Entity>({
    id: 0, x: 0, y: 0, radius: 15, vx: 0, vy: 0, color: COLORS.player, type: 'player'
  });
  const enemiesRef = useRef<Entity[]>([]);
  const orbsRef = useRef<Entity[]>([]);
  const particlesRef = useRef<Entity[]>([]);
  
  // --- React State for UI ---
  const [gameState, setGameState] = useState<'start' | 'playing' | 'gameover'>('start');
  const [finalScore, setFinalScore] = useState(0);
  const [highScore, setHighScore] = useState(0);

  // --- Helpers ---
  const randomRange = (min: number, max: number) => Math.random() * (max - min) + min;

  const createExplosion = (x: number, y: number, color: string, count: number = 10) => {
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = randomRange(1, 5);
      particlesRef.current.push({
        id: Math.random(),
        x,
        y,
        radius: randomRange(1, 3),
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        color: color,
        type: 'particle',
        life: 1.0, // Alpha/Life
        maxLife: 1.0
      });
    }
  };

  const spawnEnemy = (canvasWidth: number, canvasHeight: number) => {
    const side = Math.floor(Math.random() * 4); // 0: top, 1: right, 2: bottom, 3: left
    let x = 0, y = 0;
    const padding = 50;

    switch (side) {
      case 0: x = randomRange(0, canvasWidth); y = -padding; break;
      case 1: x = canvasWidth + padding; y = randomRange(0, canvasHeight); break;
      case 2: x = randomRange(0, canvasWidth); y = canvasHeight + padding; break;
      case 3: x = -padding; y = randomRange(0, canvasHeight); break;
    }

    // Determine enemy behavior
    // 30% chance to be a "Homing" enemy, 70% "Drifter"
    const isHoming = Math.random() < 0.3;
    let vx = 0, vy = 0;

    if (!isHoming) {
      // Aim vaguely at center but drift past
      const angle = Math.atan2(canvasHeight / 2 - y, canvasWidth / 2 - x) + (Math.random() - 0.5);
      const speed = randomRange(2, 5) + (scoreRef.current / 500); // Speed up over time
      vx = Math.cos(angle) * speed;
      vy = Math.sin(angle) * speed;
    }

    enemiesRef.current.push({
      id: Math.random(),
      x, y,
      radius: randomRange(10, 20),
      vx, vy,
      color: COLORS.enemy,
      type: 'enemy',
      // Store homing property if needed, simplified here by updating velocity in loop
      life: isHoming ? 1 : 0 // abuse life property to flag homing
    });
  };

  const spawnOrb = (canvasWidth: number, canvasHeight: number) => {
    const margin = 50;
    orbsRef.current.push({
      id: Math.random(),
      x: randomRange(margin, canvasWidth - margin),
      y: randomRange(margin, canvasHeight - margin),
      radius: 8,
      vx: 0,
      vy: 0,
      color: COLORS.orb,
      type: 'orb'
    });
  };

  const resetGame = () => {
    scoreRef.current = 0;
    spawnRateRef.current = SPAWN_RATE_INITIAL;
    enemiesRef.current = [];
    orbsRef.current = [];
    particlesRef.current = [];
    
    // Reset player to center
    if (canvasRef.current) {
      playerRef.current.x = canvasRef.current.width / 2;
      playerRef.current.y = canvasRef.current.height / 2;
      mouseRef.current = { x: playerRef.current.x, y: playerRef.current.y };
      spawnOrb(canvasRef.current.width, canvasRef.current.height);
    }
  };

  const startGame = () => {
    resetGame();
    setGameState('playing');
  };

  // --- Main Game Loop ---
  const update = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;

    // Clear Screen with trailing effect
    ctx.fillStyle = 'rgba(5, 5, 5, 0.3)'; // Leaves trails
    ctx.fillRect(0, 0, width, height);

    if (gameState === 'playing') {
      frameCountRef.current++;

      // 1. Update Player (Lerp to mouse)
      const dx = mouseRef.current.x - playerRef.current.x;
      const dy = mouseRef.current.y - playerRef.current.y;
      playerRef.current.x += dx * PLAYER_SPEED_FACTOR;
      playerRef.current.y += dy * PLAYER_SPEED_FACTOR;

      // Keep player in bounds
      playerRef.current.x = Math.max(playerRef.current.radius, Math.min(width - playerRef.current.radius, playerRef.current.x));
      playerRef.current.y = Math.max(playerRef.current.radius, Math.min(height - playerRef.current.radius, playerRef.current.y));

      // Draw Player
      ctx.shadowBlur = 20;
      ctx.shadowColor = COLORS.player;
      ctx.fillStyle = COLORS.player;
      ctx.beginPath();
      // Draw a triangle for player
      ctx.moveTo(playerRef.current.x + Math.cos(frameCountRef.current * 0.1) * 20, playerRef.current.y + Math.sin(frameCountRef.current * 0.1) * 20);
      for (let i = 1; i < 3; i++) {
        const angle = (frameCountRef.current * 0.1) + (i * 2 * Math.PI / 3);
        ctx.lineTo(playerRef.current.x + Math.cos(angle) * 15, playerRef.current.y + Math.sin(angle) * 15);
      }
      ctx.closePath();
      ctx.fill();


      // 2. Spawning Logic
      // Difficulty: Increase spawn rate as score increases
      const currentSpawnRate = Math.max(15, SPAWN_RATE_INITIAL - Math.floor(scoreRef.current / 50));
      if (frameCountRef.current % currentSpawnRate === 0) {
        spawnEnemy(width, height);
      }
      if (orbsRef.current.length < 3 && frameCountRef.current % 120 === 0) {
        spawnOrb(width, height);
      }

      // 3. Update & Draw Enemies
      ctx.shadowColor = COLORS.enemy;
      ctx.fillStyle = COLORS.enemy;
      
      for (let i = enemiesRef.current.length - 1; i >= 0; i--) {
        const enemy = enemiesRef.current[i];
        
        // Move
        if (enemy.life === 1) { // Homing behavior
           const angle = Math.atan2(playerRef.current.y - enemy.y, playerRef.current.x - enemy.x);
           const speed = 2 + (scoreRef.current / 1000);
           enemy.x += Math.cos(angle) * speed;
           enemy.y += Math.sin(angle) * speed;
        } else {
           enemy.x += enemy.vx;
           enemy.y += enemy.vy;
        }

        // Draw
        ctx.beginPath();
        ctx.arc(enemy.x, enemy.y, enemy.radius, 0, Math.PI * 2);
        ctx.fill();

        // Collision: Player vs Enemy
        const distP = Math.hypot(playerRef.current.x - enemy.x, playerRef.current.y - enemy.y);
        if (distP < playerRef.current.radius + enemy.radius) {
          // GAME OVER
          createExplosion(playerRef.current.x, playerRef.current.y, COLORS.player, 50);
          setFinalScore(scoreRef.current);
          if (scoreRef.current > highScore) {
            setHighScore(scoreRef.current);
            localStorage.setItem('neonDashHighScore', scoreRef.current.toString());
          }
          setGameState('gameover');
        }

        // Remove off-screen enemies (with margin)
        if (enemy.x < -100 || enemy.x > width + 100 || enemy.y < -100 || enemy.y > height + 100) {
          enemiesRef.current.splice(i, 1);
        }
      }

      // 4. Update & Draw Orbs
      ctx.shadowColor = COLORS.orb;
      ctx.fillStyle = COLORS.orb;
      for (let i = orbsRef.current.length - 1; i >= 0; i--) {
        const orb = orbsRef.current[i];
        
        // Pulse effect
        const pulse = Math.sin(frameCountRef.current * 0.1) * 2;
        
        ctx.beginPath();
        ctx.arc(orb.x, orb.y, orb.radius + pulse, 0, Math.PI * 2);
        ctx.fill();

        // Collision: Player vs Orb
        const distO = Math.hypot(playerRef.current.x - orb.x, playerRef.current.y - orb.y);
        if (distO < playerRef.current.radius + orb.radius + 5) {
          // Collect
          scoreRef.current += 10;
          createExplosion(orb.x, orb.y, COLORS.orb, 8);
          orbsRef.current.splice(i, 1);
          // Spawn a replacement immediately sometimes
          spawnOrb(width, height);
        }
      }

      // 5. Particles
      for (let i = particlesRef.current.length - 1; i >= 0; i--) {
        const p = particlesRef.current[i];
        p.x += p.vx;
        p.y += p.vy;
        p.life! -= 0.02;

        if (p.life! <= 0) {
          particlesRef.current.splice(i, 1);
        } else {
          ctx.shadowBlur = 0; // Performance save
          ctx.globalAlpha = p.life!;
          ctx.fillStyle = p.color;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
          ctx.fill();
          ctx.globalAlpha = 1.0;
        }
      }

      // 6. Draw Score (In-game)
      ctx.shadowBlur = 0;
      ctx.fillStyle = COLORS.text;
      ctx.font = '20px Orbitron';
      ctx.fillText(`SCORE: ${scoreRef.current}`, 20, 40);

    } else {
       // --- Background Animation for Menu ---
       particlesRef.current.forEach((p) => {
          p.x += p.vx;
          p.y += p.vy;
          if (p.x < 0 || p.x > width || p.y < 0 || p.y > height) {
             p.x = width/2; p.y = height/2; // Reset center
          }
          ctx.fillStyle = p.color;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
          ctx.fill();
       });
       // Add some background particles if empty
       if (particlesRef.current.length < 20) {
         createExplosion(width/2, height/2, COLORS.player, 1);
       }
    }

    requestRef.current = requestAnimationFrame(update);
  }, [gameState, highScore]);

  // --- Input Handling ---
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const handleResize = () => {
      if (canvas) {
        // Get the container dimensions
        const container = canvas.parentElement;
        if (container) {
          canvas.width = container.clientWidth;
          canvas.height = container.clientHeight;
        }
      }
    };
    
    const handleMouseMove = (e: MouseEvent) => {
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      mouseRef.current = { x: e.clientX - rect.left, y: e.clientY - rect.top };
    };

    const handleTouchMove = (e: TouchEvent) => {
      e.preventDefault(); // Stop scrolling
      if (!canvas) return;
      if (e.touches.length > 0) {
        const rect = canvas.getBoundingClientRect();
        mouseRef.current = { x: e.touches[0].clientX - rect.left, y: e.touches[0].clientY - rect.top };
      }
    };

    const handleMouseDown = () => { isMouseDownRef.current = true; };
    const handleMouseUp = () => { isMouseDownRef.current = false; };

    window.addEventListener('resize', handleResize);
    canvas.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('mousedown', handleMouseDown);
    canvas.addEventListener('mouseup', handleMouseUp);
    canvas.addEventListener('touchmove', handleTouchMove, { passive: false });

    // Initial Resize
    handleResize();
    
    // Load High Score
    const saved = localStorage.getItem('neonDashHighScore');
    if (saved) setHighScore(parseInt(saved, 10));

    // Start Loop
    requestRef.current = requestAnimationFrame(update);

    return () => {
      window.removeEventListener('resize', handleResize);
      canvas.removeEventListener('mousemove', handleMouseMove);
      canvas.removeEventListener('mousedown', handleMouseDown);
      canvas.removeEventListener('mouseup', handleMouseUp);
      canvas.removeEventListener('touchmove', handleTouchMove);
      cancelAnimationFrame(requestRef.current);
    };
  }, [update]);

  // --- Styles for Overlay UI ---
  const overlayStyle: React.CSSProperties = {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    background: 'rgba(0,0,0,0.6)',
    backdropFilter: 'blur(5px)',
    zIndex: 10,
    pointerEvents: gameState === 'playing' ? 'none' : 'auto',
    opacity: gameState === 'playing' ? 0 : 1,
    transition: 'opacity 0.3s ease',
  };

  const buttonStyle: React.CSSProperties = {
    marginTop: '20px',
    padding: '15px 40px',
    fontSize: '24px',
    fontFamily: 'Orbitron, sans-serif',
    color: '#050505',
    backgroundColor: COLORS.player,
    border: 'none',
    boxShadow: `0 0 20px ${COLORS.player}`,
    cursor: 'pointer',
    textTransform: 'uppercase',
    fontWeight: 'bold',
    clipPath: 'polygon(10% 0, 100% 0, 100% 70%, 90% 100%, 0 100%, 0 30%)'
  };

  const titleStyle: React.CSSProperties = {
    fontSize: '60px',
    fontWeight: 900,
    color: '#fff',
    textShadow: `0 0 20px ${COLORS.player}, 0 0 40px ${COLORS.enemy}`,
    marginBottom: '10px',
    textAlign: 'center'
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 font-sans">
      <Header />
      
      <div className="flex-grow relative" style={{ minHeight: 'calc(100vh - 128px)' }}>
        <canvas 
          ref={canvasRef} 
          style={{ 
            display: 'block',
            width: '100%',
            height: '100%',
            background: COLORS.background
          }} 
        />
        
        {/* Game UI Overlay */}
        <div style={overlayStyle}>
          {gameState === 'start' && (
            <>
              <h1 style={titleStyle}>NEON DASH</h1>
              <p style={{ fontSize: '18px', color: '#ccc', maxWidth: '400px', textAlign: 'center' }}>
                Mouse/Touch to Move. Dodge Red. Collect Gold.
              </p>
              <button style={buttonStyle} onClick={startGame}>Start Mission</button>
            </>
          )}

          {gameState === 'gameover' && (
            <>
              <h1 style={{ ...titleStyle, color: COLORS.enemy, textShadow: `0 0 30px ${COLORS.enemy}` }}>GAME OVER</h1>
              <div style={{ textAlign: 'center', fontSize: '24px', marginBottom: '20px' }}>
                <p>Score: {finalScore}</p>
                <p style={{ color: COLORS.orb }}>High Score: {highScore}</p>
              </div>
              <button style={buttonStyle} onClick={startGame}>Reboot System</button>
            </>
          )}
        </div>
      </div>

      <footer className="border-t border-slate-200 bg-white py-6 mt-auto">
        <div className="container mx-auto px-4 text-center text-slate-500 text-sm">
          <p>© {new Date().getFullYear()} My Site Keeper. Built with React & Gemini.</p>
        </div>
      </footer>
    </div>
  );
};
