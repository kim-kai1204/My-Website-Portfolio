
import React, { useState } from 'react';
import { ToolType } from './types';
import ChatInterface from './components/ChatInterface';
import VisionInterface from './components/VisionInterface';
import AnalysisInterface from './components/AnalysisInterface';
import Navbar from './components/Navbar';

const App: React.FC = () => {
  const [activeTool, setActiveTool] = useState<ToolType>(ToolType.CHAT);

  const renderContent = () => {
    switch (activeTool) {
      case ToolType.CHAT:
        return <ChatInterface />;
      case ToolType.VISION:
        return <VisionInterface />;
      case ToolType.ANALYZE:
        return <AnalysisInterface />;
      default:
        return <ChatInterface />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar activeTool={activeTool} onNavigate={setActiveTool} />
      
      <main className="flex-1 container mx-auto px-4 py-8 max-w-6xl">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden min-h-[70vh] flex flex-col border border-slate-200">
          {renderContent()}
        </div>
      </main>

      <footer className="py-6 text-center text-slate-500 text-sm">
        <p>&copy; 2024 제미나이 AI 스튜디오. Powered by Google Gemini.</p>
      </footer>
    </div>
  );
};

export default App;
