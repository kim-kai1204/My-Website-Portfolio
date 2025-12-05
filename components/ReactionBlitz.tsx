import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Header } from './Header';
import { GameState, ScoreData } from '../types';

// GameBlock Component
interface GameBlockProps {
  gameState: GameState;
  score: number | null;
  round: number;
  totalRounds: number;
  onAction: () => void;
}

const GameBlock: React.FC<GameBlockProps> = ({ gameState, score, round, totalRounds, onAction }) => {
  const getVisuals = () => {
    switch (gameState) {
      case GameState.IDLE:
        return {
          bg: 'bg-slate-800 hover:bg-slate-700',
          icon: '⚡',
          title: '반응속도 테스트',
          subtitle: '화면이 초록색으로 변하면 최대한 빨리 클릭하세요!',
          subtext: '클릭해서 시작하기'
        };
      case GameState.WAITING:
        return {
          bg: 'bg-rose-600',
          icon: '⏱️',
          title: '기다리세요...',
          subtitle: '아직 초록색이 아닙니다.',
          subtext: ''
        };
      case GameState.READY:
        return {
          bg: 'bg-emerald-500 cursor-pointer',
          icon: '🖱️',
          title: '클릭하세요!',
          subtitle: '지금입니다!',
          subtext: ''
        };
      case GameState.TOO_EARLY:
        return {
          bg: 'bg-amber-500',
          icon: '⚠️',
          title: '너무 빨랐어요!',
          subtitle: '초록색이 된 후에 클릭해야 합니다.',
          subtext: '클릭해서 다시 시도'
        };
      case GameState.ROUND_RESULT:
        return {
          bg: 'bg-sky-600',
          icon: '⏱️',
          title: `${score}ms`,
          subtitle: `Round ${round} / ${totalRounds}`,
          subtext: '클릭해서 계속하기'
        };
      default:
        return {
          bg: 'bg-slate-800',
          icon: null,
          title: '',
          subtitle: '',
          subtext: ''
        };
    }
  };

  const visuals = getVisuals();

  return (
    <div 
      className={`w-full h-full flex flex-col items-center justify-center transition-colors duration-200 ease-in-out cursor-pointer p-8 text-center select-none ${visuals.bg}`}
      onMouseDown={onAction}
      onTouchStart={(e) => {
        e.preventDefault();
        onAction();
      }}
    >
      <div className="transform transition-all duration-300 hover:scale-105 flex flex-col items-center">
        {visuals.icon && <div className="text-6xl mb-4">{visuals.icon}</div>}
        <h1 className="text-4xl md:text-6xl font-black text-white mb-4 drop-shadow-md">
          {visuals.title}
        </h1>
        <p className="text-xl md:text-2xl text-white/90 font-medium mb-8">
          {visuals.subtitle}
        </p>
        {visuals.subtext && (
          <p className="text-white/60 text-sm uppercase tracking-widest font-bold animate-bounce mt-8">
            {visuals.subtext}
          </p>
        )}
      </div>
    </div>
  );
};

// StatsBoard Component
interface StatsBoardProps {
  scores: ScoreData[];
  onReset: () => void;
}

const StatsBoard: React.FC<StatsBoardProps> = ({ scores, onReset }) => {
  const average = Math.round(scores.reduce((acc, curr) => acc + curr.timeMs, 0) / scores.length);
  const best = Math.min(...scores.map(s => s.timeMs));
  const worst = Math.max(...scores.map(s => s.timeMs));

  let rankText = "거북이";
  let rankColor = "text-green-400";
  
  if (average < 200) {
    rankText = "초인적인 반사신경";
    rankColor = "text-purple-400";
  } else if (average < 250) {
    rankText = "프로게이머 수준";
    rankColor = "text-blue-400";
  } else if (average < 300) {
    rankText = "평균 이상";
    rankColor = "text-emerald-400";
  } else if (average < 400) {
    rankText = "평균";
    rankColor = "text-yellow-400";
  } else {
    rankText = "조금 피곤하신가요?";
    rankColor = "text-slate-400";
  }

  return (
    <div className="w-full h-full flex flex-col items-center justify-center bg-slate-900 p-4 md:p-8 overflow-y-auto">
      <div className="max-w-4xl w-full bg-slate-800 rounded-3xl shadow-2xl p-6 md:p-10 border border-slate-700">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center p-3 bg-slate-700 rounded-full mb-4">
            <span className="text-3xl">🏆</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-2">테스트 완료</h2>
          <p className={`text-xl md:text-2xl font-bold ${rankColor}`}>{rankText}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <div className="bg-slate-700/50 p-6 rounded-2xl flex flex-col items-center justify-center border border-slate-600">
            <span className="text-blue-400 mb-2 text-2xl">📊</span>
            <span className="text-slate-400 text-sm uppercase tracking-wider font-semibold">평균 속도</span>
            <span className="text-4xl font-black text-white mt-1">{average}<span className="text-lg text-slate-500 ml-1">ms</span></span>
          </div>
          <div className="bg-slate-700/50 p-6 rounded-2xl flex flex-col items-center justify-center border border-slate-600">
            <span className="text-emerald-400 mb-2 text-2xl">📉</span>
            <span className="text-slate-400 text-sm uppercase tracking-wider font-semibold">최고 기록</span>
            <span className="text-4xl font-black text-white mt-1">{best}<span className="text-lg text-slate-500 ml-1">ms</span></span>
          </div>
          <div className="bg-slate-700/50 p-6 rounded-2xl flex flex-col items-center justify-center border border-slate-600">
            <span className="text-slate-400 text-sm uppercase tracking-wider font-semibold mb-2">최악 기록</span>
            <span className="text-2xl font-bold text-slate-300">{worst}<span className="text-sm text-slate-500 ml-1">ms</span></span>
          </div>
        </div>

        <div className="mb-8 bg-slate-900/50 rounded-xl p-4 border border-slate-700">
          <div className="text-slate-300 text-center mb-4 font-semibold">라운드별 기록</div>
          <div className="space-y-2">
            {scores.map((score, index) => (
              <div key={index} className="flex justify-between items-center p-3 bg-slate-800 rounded-lg">
                <span className="text-slate-400">Round {score.round}</span>
                <span className="text-white font-bold">{score.timeMs}ms</span>
              </div>
            ))}
          </div>
        </div>

        <button 
          onClick={onReset}
          className="w-full py-4 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-bold text-lg transition-all transform active:scale-95 shadow-lg shadow-indigo-500/20 flex items-center justify-center gap-2"
        >
          <span>🔄</span>
          다시 테스트하기
        </button>
      </div>
    </div>
  );
};

// Main ReactionBlitz Component
const MAX_ROUNDS = 5;

export const ReactionBlitz: React.FC = () => {
  const [gameState, setGameState] = useState<GameState>(GameState.IDLE);
  const [scores, setScores] = useState<ScoreData[]>([]);
  const [startTime, setStartTime] = useState<number>(0);
  const [currentScore, setCurrentScore] = useState<number | null>(null);
  
  const timeoutRef = useRef<number | null>(null);

  const clearPendingTimeout = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  };

  const startWaiting = useCallback(() => {
    setGameState(GameState.WAITING);
    setCurrentScore(null);
    
    const delay = Math.floor(Math.random() * 3000) + 2000;
    
    clearPendingTimeout();
    timeoutRef.current = window.setTimeout(() => {
      setGameState(GameState.READY);
      setStartTime(performance.now());
    }, delay);
  }, []);

  const handleAction = () => {
    if (gameState === GameState.IDLE) {
      setScores([]);
      startWaiting();
      return;
    }

    if (gameState === GameState.WAITING) {
      clearPendingTimeout();
      setGameState(GameState.TOO_EARLY);
      return;
    }

    if (gameState === GameState.TOO_EARLY) {
      startWaiting();
      return;
    }

    if (gameState === GameState.READY) {
      const endTime = performance.now();
      const reactionTime = Math.round(endTime - startTime);
      const newScores = [...scores, { round: scores.length + 1, timeMs: reactionTime }];
      setScores(newScores);
      setCurrentScore(reactionTime);
      setGameState(GameState.ROUND_RESULT);
      return;
    }

    if (gameState === GameState.ROUND_RESULT) {
      if (scores.length >= MAX_ROUNDS) {
        setGameState(GameState.GAME_OVER);
      } else {
        startWaiting();
      }
      return;
    }
  };

  const resetGame = () => {
    setScores([]);
    setCurrentScore(null);
    setGameState(GameState.IDLE);
    clearPendingTimeout();
  };

  useEffect(() => {
    return () => clearPendingTimeout();
  }, []);

  if (gameState === GameState.GAME_OVER) {
    return (
      <div className="min-h-screen flex flex-col bg-slate-50 font-sans">
        <Header />
        <div className="flex-grow relative" style={{ minHeight: 'calc(100vh - 128px)' }}>
          <StatsBoard scores={scores} onReset={resetGame} />
        </div>
        <footer className="border-t border-slate-200 bg-white py-6 mt-auto">
          <div className="container mx-auto px-4 text-center text-slate-500 text-sm">
            <p>© {new Date().getFullYear()} My Site Keeper. Built with React & Gemini.</p>
          </div>
        </footer>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 font-sans">
      <Header />
      <div className="flex-grow relative" style={{ minHeight: 'calc(100vh - 128px)' }}>
        <GameBlock 
          gameState={gameState} 
          score={currentScore}
          round={scores.length}
          totalRounds={MAX_ROUNDS}
          onAction={handleAction} 
        />
      </div>
      <footer className="border-t border-slate-200 bg-white py-6 mt-auto">
        <div className="container mx-auto px-4 text-center text-slate-500 text-sm">
          <p>© {new Date().getFullYear()} My Site Keeper. Built with React & Gemini.</p>
        </div>
      </footer>
    </div>
  );
};

