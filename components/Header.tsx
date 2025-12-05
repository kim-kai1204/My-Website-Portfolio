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
    <header className="bg-white/80 backdrop-blur-md border-b border-slate-100 sticky top-0 z-20">
      <div className="container mx-auto px-6 h-20 flex items-center justify-between max-w-7xl">
        <div 
          className={`flex items-center gap-3 ${!isHomePage ? 'cursor-pointer hover:opacity-70 transition-opacity' : ''}`}
          onClick={handleLogoClick}
        >
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-slate-900 to-slate-700 flex items-center justify-center">
            <Bookmark className="h-4 w-4 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-semibold text-slate-900 tracking-tight">My Site Keeper</h1>
          </div>
        </div>
        <div className="hidden md:flex items-center text-xs text-slate-400 font-light tracking-wide">
          <span>나만의 웹 컬렉션</span>
        </div>
      </div>
    </header>
  );
};