
import React from 'react';
import { ToolType } from '../types';

interface NavbarProps {
  activeTool: ToolType;
  onNavigate: (tool: ToolType) => void;
}

const Navbar: React.FC<NavbarProps> = ({ activeTool, onNavigate }) => {
  const navItems = [
    { type: ToolType.CHAT, label: 'AI 채팅', icon: 'fa-comments' },
    { type: ToolType.VISION, label: '비전 연구소', icon: 'fa-eye' },
    { type: ToolType.ANALYZE, label: '데이터 분석', icon: 'fa-chart-pie' },
  ];

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="bg-blue-600 p-2 rounded-lg">
            <i className="fa-solid fa-bolt-lightning text-white text-xl"></i>
          </div>
          <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
            제미나이 스튜디오
          </h1>
        </div>

        <nav className="flex space-x-1">
          {navItems.map((item) => (
            <button
              key={item.type}
              onClick={() => onNavigate(item.type)}
              className={`px-4 py-2 rounded-full text-sm font-semibold transition-all flex items-center space-x-2 ${
                activeTool === item.type
                  ? 'bg-blue-100 text-blue-700 shadow-sm'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <i className={`fa-solid ${item.icon}`}></i>
              <span className="hidden sm:inline">{item.label}</span>
            </button>
          ))}
        </nav>
      </div>
    </header>
  );
};

export default Navbar;
