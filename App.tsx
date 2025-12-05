import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { Dashboard } from './components/Dashboard';
import { Game } from './components/Game';
import { ReactionBlitz } from './components/ReactionBlitz';

const App: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<Dashboard />} />
      <Route path="/game" element={<Game />} />
      <Route path="/reaction-blitz" element={<ReactionBlitz />} />
    </Routes>
  );
};

export default App;