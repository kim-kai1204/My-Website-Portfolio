import React from 'react';
import { Bookmark } from 'lucide-react';

export const Header: React.FC = () => {
  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-20 shadow-sm">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between max-w-7xl">
        <div className="flex items-center gap-2.5">
          <div className="bg-indigo-100 p-2 rounded-lg">
            <Bookmark className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">My Site Keeper</h1>
          </div>
        </div>
        <div className="hidden md:flex items-center text-sm text-slate-500">
          <span>나만의 웹 컬렉션을 완성해보세요</span>
        </div>
      </div>
    </header>
  );
};