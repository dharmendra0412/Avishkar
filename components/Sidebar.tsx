
import React from 'react';
import { Language } from '../types';
import { labels, languageNames } from '../utils/localization';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  isMobileOpen: boolean;
  setIsMobileOpen: (open: boolean) => void;
  language: Language;
  setLanguage: (lang: Language) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab, isMobileOpen, setIsMobileOpen, language, setLanguage }) => {
  const t = labels[language];

  const menuItems = [
    { id: 'home', label: t.nav.home, icon: '🏠' },
    { id: 'dashboard', label: t.nav.dashboard, icon: '📊' },
    { id: 'agri', label: t.nav.agri, icon: '🌾' },
    { id: 'live', label: t.nav.live, icon: '🎙️' },
    { id: 'learn', label: t.nav.learn, icon: '🎓' },
    { id: 'services', label: t.nav.services, icon: '🏛️' },
  ];

  return (
    <>
      {/* Mobile Overlay */}
      {isMobileOpen && (
        <div 
            className="fixed inset-0 bg-black/50 z-20 md:hidden"
            onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed top-0 left-0 bottom-0 w-64 bg-slate-900 text-white z-30 transition-transform duration-300 flex flex-col
        ${isMobileOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}>
        <div className="p-6 border-b border-slate-800 flex items-center gap-3">
          <div className="w-8 h-8 bg-indigo-500 rounded-lg flex items-center justify-center font-bold text-xl">G</div>
          <span className="text-xl font-bold tracking-tight">{t.appTitle}</span>
        </div>

        <nav className="p-4 space-y-2 flex-1">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                setActiveTab(item.id);
                setIsMobileOpen(false);
              }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                activeTab === item.id 
                  ? 'bg-indigo-600 text-white' 
                  : 'text-slate-400 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <span className="text-xl">{item.icon}</span>
              <span className="font-medium">{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-slate-800">
             <div className="mb-4">
                <label className="text-xs text-slate-500 uppercase font-bold mb-2 block">Language / भाषा</label>
                <select 
                    value={language}
                    onChange={(e) => setLanguage(e.target.value as Language)}
                    className="w-full bg-slate-800 text-slate-200 text-sm rounded-lg p-2.5 border border-slate-700 focus:ring-indigo-500 focus:border-indigo-500"
                >
                    {(Object.keys(languageNames) as Language[]).map((lang) => (
                        <option key={lang} value={lang}>{languageNames[lang]}</option>
                    ))}
                </select>
            </div>

            <div className="bg-slate-800 p-4 rounded-lg">
                <p className="text-xs text-slate-400 uppercase font-bold mb-1">Status</p>
                <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                    <span className="text-sm text-slate-300">System Online</span>
                </div>
            </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
