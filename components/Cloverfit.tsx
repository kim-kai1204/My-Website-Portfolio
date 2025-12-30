import React from 'react';
import { Header } from './Header';

export const Cloverfit: React.FC = () => {
  const baseUrl = import.meta.env.BASE_URL;

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-50 via-indigo-50/30 to-purple-50/30 font-sans">
      <Header />

      <main className="flex-1">
        <iframe
          title="Cloverfit Hack Simulation"
          src={`${baseUrl}cloverfit/index.html`}
          className="w-full h-[calc(100vh-9rem)] border-0"
          sandbox="allow-scripts allow-same-origin allow-pointer-lock allow-popups allow-forms"
        />
      </main>

      <footer className="border-t border-indigo-100/50 bg-gradient-to-r from-indigo-50/50 via-purple-50/50 to-pink-50/50 backdrop-blur-sm py-8 mt-auto">
        <div className="container mx-auto px-6 text-center text-slate-500 text-xs font-medium">
          <p>© {new Date().getFullYear()} My Site Keeper</p>
        </div>
      </footer>
    </div>
  );
};
