import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const Cloverfit: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col">
      <header className="sticky top-0 z-20 border-b border-slate-800 bg-slate-950/80 backdrop-blur">
        <div className="mx-auto max-w-6xl px-4 h-16 flex items-center justify-between">
          <button
            onClick={() => navigate('/')}
            className="inline-flex items-center gap-2 px-3 py-2 rounded-lg text-slate-200 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            <span className="text-sm font-medium">대시보드로 돌아가기</span>
          </button>
          <span className="text-xs text-slate-400">Cloverfit Hack Simulation</span>
        </div>
      </header>

      <main className="flex-1">
        <iframe
          title="Cloverfit Hack Simulation"
          src="/cloverfit/index.html"
          className="w-full h-[calc(100vh-4rem)] border-0"
          sandbox="allow-scripts allow-same-origin allow-pointer-lock allow-popups allow-forms"
        />
      </main>
    </div>
  );
};

