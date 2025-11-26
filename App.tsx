import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Dashboard from './components/Dashboard';
import LiveAssistant from './components/LiveAssistant';
import LearningHub from './components/LearningHub';
import ServiceFinder from './components/ServiceFinder';
import AgriHub from './components/AgriHub';
import ChatBot from './components/ChatBot';
import HealthHub from './components/HealthHub';
import LandingPage from './components/LandingPage';
import { Language } from './types';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState('home');
  const [language, setLanguage] = useState<Language>('en');

  // Persist language preference
  useEffect(() => {
    const savedLang = localStorage.getItem('gramsetu_language') as Language;
    if (savedLang) setLanguage(savedLang);
  }, []);

  useEffect(() => {
    localStorage.setItem('gramsetu_language', language);
  }, [language]);

  const renderContent = () => {
    switch (activeTab) {
      case 'home': return <LandingPage language={language} onNavigate={setActiveTab} />;
      case 'dashboard': return <Dashboard />;
      case 'agri': return <AgriHub language={language} />;
      case 'live': return <LiveAssistant language={language} />;
      case 'chat': return <ChatBot language={language} />;
      case 'health': return <HealthHub language={language} />;
      case 'learn': return <LearningHub language={language} />;
      case 'services': return <ServiceFinder language={language} />;
      default: return <Dashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
      <Navbar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        language={language}
        setLanguage={setLanguage}
      />

      {/* Main Content Area - Full Width, Padded Top for Navbar */}
      <main className="pt-24 pb-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        {renderContent()}
      </main>
      
      {/* Simple Footer for Website Feel */}
      <footer className="bg-white border-t border-slate-200 mt-auto py-8">
        <div className="max-w-7xl mx-auto px-4 text-center text-slate-400 text-sm">
          <p>&copy; 2024 GramSetu. Empowering Rural India.</p>
        </div>
      </footer>
    </div>
  );
};

export default App;