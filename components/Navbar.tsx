import React, { useState } from 'react';
import { Language } from '../types';
import { labels, languageNames } from '../utils/localization';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  language: Language;
  setLanguage: (lang: Language) => void;
}

const Navbar: React.FC<NavbarProps> = ({ activeTab, setActiveTab, language, setLanguage }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const t = labels[language];

  const menuItems = [
    { id: 'home', label: t.nav.home },
    { id: 'services', label: t.nav.services },
    { id: 'agri', label: t.nav.agri },
    { id: 'health', label: t.nav.health },
    { id: 'chat', label: t.nav.chat },
    { id: 'learn', label: t.nav.learn },
    { id: 'live', label: t.nav.live },
    { id: 'dashboard', label: t.nav.dashboard },
  ];

  const handleNavClick = (id: string) => {
    setActiveTab(id);
    setIsMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <nav className="bg-white border-b border-slate-200 fixed top-0 w-full z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20">
          
          {/* Logo Section */}
          <div className="flex items-center cursor-pointer" onClick={() => handleNavClick('home')}>
            <div className="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold text-2xl mr-3 shadow-md shadow-indigo-200">
              G
            </div>
            <div>
                <h1 className="text-2xl font-bold text-slate-800 tracking-tight leading-none">{t.appTitle}</h1>
                <span className="text-xs text-slate-500 font-medium tracking-wide uppercase">Rural Digital Bridge</span>
            </div>
          </div>

          {/* Desktop Menu */}
          <div className="hidden lg:flex items-center space-x-1">
            {menuItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`px-3 py-2 rounded-lg text-xs font-bold transition-all duration-200 uppercase tracking-wide ${
                  activeTab === item.id
                    ? 'text-indigo-600 bg-indigo-50'
                    : 'text-slate-600 hover:text-indigo-600 hover:bg-slate-50'
                }`}
              >
                {item.label}
              </button>
            ))}
            
            <div className="h-6 w-px bg-slate-200 mx-4"></div>

            {/* Language Selector */}
            <select
                value={language}
                onChange={(e) => setLanguage(e.target.value as Language)}
                className="bg-slate-50 border border-slate-200 text-slate-700 text-xs rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block p-2 font-medium"
            >
                {(Object.keys(languageNames) as Language[]).map((lang) => (
                    <option key={lang} value={lang}>
                        {lang === 'en' ? '🇺🇸' : lang === 'hi' ? '🇮🇳' : '🇮🇳'} {lang.toUpperCase()}
                    </option>
                ))}
            </select>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center lg:hidden gap-4">
             <select
                value={language}
                onChange={(e) => setLanguage(e.target.value as Language)}
                className="bg-slate-50 border border-slate-200 text-slate-700 text-sm rounded-lg p-2 w-20"
            >
                {(Object.keys(languageNames) as Language[]).map((lang) => (
                    <option key={lang} value={lang}>{lang.toUpperCase()}</option>
                ))}
            </select>
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-slate-600 hover:text-indigo-600 focus:outline-none p-2"
            >
              <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {isMobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {isMobileMenuOpen && (
        <div className="lg:hidden bg-white border-t border-slate-100 shadow-xl animate-in slide-in-from-top-5">
          <div className="px-4 pt-2 pb-6 space-y-2">
            {menuItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`block w-full text-left px-4 py-4 rounded-xl text-base font-bold ${
                  activeTab === item.id
                    ? 'bg-indigo-50 text-indigo-700'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-indigo-600'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;