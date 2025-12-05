import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Bookmark } from 'lucide-react';

export const Header: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  // 홈 페이지인지 확인 (basename 포함 고려)
  const isHomePage = location.pathname === '/' || 
                     location.pathname === '/My-Website-Portfolio/' ||
                     location.pathname.endsWith('/My-Website-Portfolio/');

  const handleLogoClick = () => {
    if (!isHomePage) {
      navigate('/');
    }
  };

  return (
    <header className="bg-gradient-to-r from-indigo-50 via-purple-50 to-pink-50 backdrop-blur-md border-b border-indigo-100/50 sticky top-0 z-20 shadow-sm">
      <div className="container mx-auto px-6 h-20 flex items-center justify-between max-w-7xl">
        <div 
          className={`flex items-center gap-3 ${!isHomePage ? 'cursor-pointer hover:scale-105 transition-transform' : ''}`}
          onClick={handleLogoClick}
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center shadow-lg shadow-indigo-500/30">
            <Bookmark className="h-5 w-5 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent tracking-tight">
              My Site Keeper
            </h1>
          </div>
        </div>
        <div className="hidden md:flex items-center text-xs text-slate-500 font-medium tracking-wide">
          <span className="bg-white/60 px-3 py-1.5 rounded-full backdrop-blur-sm">나만의 웹 컬렉션</span>
        </div>
      </div>
    </header>
  );
};