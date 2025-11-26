import React, { useState } from 'react';
import { getHealthAdvice } from '../services/geminiService';
import { Language } from '../types';
import { labels } from '../utils/localization';

interface HealthHubProps {
  language: Language;
}

const HealthHub: React.FC<HealthHubProps> = ({ language }) => {
  const t = labels[language].health;
  const [symptom, setSymptom] = useState('');
  const [advice, setAdvice] = useState('');
  const [loading, setLoading] = useState(false);

  const handleConsult = async (query: string = symptom) => {
    if (!query.trim()) return;
    setLoading(true);
    setAdvice('');
    const result = await getHealthAdvice(query, language);
    setAdvice(result || "Unable to fetch advice. Please visit a doctor.");
    setLoading(false);
  };

  const quickTopics = [
    { id: 'fever', icon: '🤒', label: t.topics.fever },
    { id: 'stomach', icon: '🤢', label: t.topics.stomach },
    { id: 'cuts', icon: '🤕', label: t.topics.cuts },
    { id: 'burns', icon: '🔥', label: t.topics.burns },
    { id: 'snake', icon: '🐍', label: t.topics.snake },
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in">
      
      {/* Header */}
      <div className="bg-gradient-to-r from-red-600 to-rose-600 rounded-2xl p-8 text-white shadow-xl relative overflow-hidden">
          <div className="absolute right-0 top-0 opacity-10 text-9xl transform translate-x-10 -translate-y-4">🏥</div>
          <div className="relative z-10">
              <h2 className="text-3xl font-bold mb-2 flex items-center gap-3">
                  <span className="bg-white/20 p-2 rounded-lg text-2xl">🩺</span> {t.title}
              </h2>
              <p className="text-red-100 text-lg opacity-90 max-w-xl">{t.subtitle}</p>
          </div>
          
          <div className="mt-6 bg-white/10 border border-white/20 p-4 rounded-xl flex items-start gap-3">
              <span className="text-2xl">⚠️</span>
              <p className="text-sm font-medium leading-relaxed opacity-90">
                  {t.disclaimer}
              </p>
          </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Left Column: Input */}
          <div className="md:col-span-1 space-y-6">
              {/* Search Box */}
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                  <label className="block text-slate-700 font-bold mb-3">{t.symptomLabel}</label>
                  <textarea 
                      value={symptom}
                      onChange={(e) => setSymptom(e.target.value)}
                      placeholder={t.placeholder}
                      className="w-full h-32 px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-red-500 focus:border-red-500 resize-none text-slate-800"
                  />
                  <button 
                      onClick={() => handleConsult()}
                      disabled={loading || !symptom.trim()}
                      className="w-full mt-4 bg-red-600 text-white py-3 rounded-xl font-bold hover:bg-red-700 transition-colors shadow-lg shadow-red-100 disabled:opacity-50"
                  >
                      {loading ? t.loading : t.button}
                  </button>
              </div>

              {/* Quick Topics */}
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                  <h3 className="text-slate-500 font-bold uppercase text-xs tracking-wider mb-4">Quick First Aid</h3>
                  <div className="grid grid-cols-2 gap-3">
                      {quickTopics.map(topic => (
                          <button
                              key={topic.id}
                              onClick={() => {
                                  setSymptom(topic.label);
                                  handleConsult(topic.label + " treatment");
                              }}
                              className="p-3 bg-slate-50 border border-slate-100 hover:bg-red-50 hover:border-red-200 rounded-xl text-left transition-all flex flex-col items-center justify-center gap-2 group"
                          >
                              <span className="text-2xl group-hover:scale-110 transition-transform">{topic.icon}</span>
                              <span className="text-xs font-bold text-slate-600 group-hover:text-red-700 text-center">{topic.label}</span>
                          </button>
                      ))}
                  </div>
              </div>
          </div>

          {/* Right Column: Result */}
          <div className="md:col-span-2">
               <div className="h-full bg-white rounded-2xl border border-slate-200 shadow-sm p-8 min-h-[400px] flex flex-col">
                   {loading ? (
                       <div className="flex-1 flex flex-col items-center justify-center text-red-600">
                           <div className="w-16 h-16 border-4 border-red-200 border-t-red-600 rounded-full animate-spin mb-4"></div>
                           <p className="font-bold text-lg animate-pulse">{t.loading}</p>
                       </div>
                   ) : advice ? (
                       <div className="animate-in fade-in slide-in-from-bottom-4">
                           <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-100">
                               <div className="bg-red-100 p-2 rounded-lg text-red-600">
                                   <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                   </svg>
                               </div>
                               <h3 className="text-xl font-bold text-slate-800">{t.resultTitle}</h3>
                           </div>
                           <div className="prose prose-red max-w-none text-slate-700 leading-relaxed whitespace-pre-wrap">
                               {advice}
                           </div>
                           <div className="mt-8 bg-amber-50 border border-amber-200 p-4 rounded-xl flex items-center gap-3 text-amber-800 text-sm">
                               <span>🚑</span>
                               <span>Need an ambulance? Dial <strong>108</strong> (India) for emergencies.</span>
                           </div>
                       </div>
                   ) : (
                       <div className="flex-1 flex flex-col items-center justify-center text-slate-400 opacity-60">
                           <div className="text-6xl mb-4">🩺</div>
                           <p className="text-lg font-medium">Describe symptoms to get advice.</p>
                       </div>
                   )}
               </div>
          </div>

      </div>
    </div>
  );
};

export default HealthHub;