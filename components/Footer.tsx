import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="border-t border-indigo-100/50 bg-gradient-to-r from-indigo-50/50 via-purple-50/50 to-pink-50/50 backdrop-blur-sm py-8 mt-auto">
      <div className="container mx-auto px-6 text-center text-slate-500 text-xs font-medium">
        <p>© {new Date().getFullYear()} My Site Keeper</p>
      </div>
    </footer>
  );
};
