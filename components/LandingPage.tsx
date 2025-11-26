import React from 'react';
import { Language } from '../types';
import { labels } from '../utils/localization';

interface LandingPageProps {
  language: Language;
  onNavigate: (tab: string) => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ language, onNavigate }) => {
  const t = labels[language].landing;

  const features = [
    {
      id: 'services',
      icon: '🏛️',
      title: labels[language].nav.services,
      desc: t.features.servicesDesc,
      color: 'bg-blue-50 border-blue-200 text-blue-700',
      btnColor: 'bg-blue-600 hover:bg-blue-700'
    },
    {
      id: 'agri',
      icon: '🌾',
      title: labels[language].nav.agri,
      desc: t.features.agriDesc,
      color: 'bg-green-50 border-green-200 text-green-700',
      btnColor: 'bg-green-600 hover:bg-green-700'
    },
    {
      id: 'health',
      icon: '🩺',
      title: labels[language].nav.health,
      desc: t.features.healthDesc,
      color: 'bg-red-50 border-red-200 text-red-700',
      btnColor: 'bg-red-600 hover:bg-red-700'
    },
    {
      id: 'chat',
      icon: '💬',
      title: labels[language].nav.chat,
      desc: t.features.chatDesc,
      color: 'bg-pink-50 border-pink-200 text-pink-700',
      btnColor: 'bg-pink-600 hover:bg-pink-700'
    },
    {
      id: 'learn',
      icon: '🎓',
      title: labels[language].nav.learn,
      desc: t.features.learnDesc,
      color: 'bg-indigo-50 border-indigo-200 text-indigo-700',
      btnColor: 'bg-indigo-600 hover:bg-indigo-700'
    },
    {
      id: 'live',
      icon: '🎙️',
      title: labels[language].nav.live,
      desc: t.features.liveDesc,
      color: 'bg-teal-50 border-teal-200 text-teal-700',
      btnColor: 'bg-teal-600 hover:bg-teal-700'
    }
  ];

  return (
    <div className="space-y-20 animate-in fade-in duration-700">
      {/* Hero Section */}
      <div className="relative overflow-hidden rounded-3xl bg-slate-900 text-white shadow-2xl mx-auto">
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-900 via-purple-900 to-indigo-900 opacity-90"></div>
        
        {/* Abstract Shapes */}
        <div className="absolute top-0 left-0 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 -translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-indigo-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 translate-x-1/2 translate-y-1/2"></div>

        <div className="relative z-10 px-8 py-20 md:py-32 text-center max-w-5xl mx-auto space-y-8">
          <div className="inline-block px-5 py-2 rounded-full bg-white/10 border border-white/20 text-sm font-bold tracking-widest uppercase mb-4 backdrop-blur-md shadow-lg">
            🚀 {t.badge}
          </div>
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight leading-tight">
            {t.heroTitle}
          </h1>
          <p className="text-xl md:text-2xl text-slate-200 max-w-3xl mx-auto leading-relaxed font-light">
            {t.heroSubtitle}
          </p>
          <div className="pt-10 flex flex-col sm:flex-row gap-6 justify-center">
            <button 
              onClick={() => onNavigate('dashboard')}
              className="px-10 py-5 bg-white text-indigo-900 rounded-2xl font-bold text-lg hover:bg-indigo-50 transition-all transform hover:-translate-y-1 shadow-xl hover:shadow-2xl"
            >
              {t.ctaPrimary}
            </button>
            <button 
              onClick={() => onNavigate('learn')}
              className="px-10 py-5 bg-transparent border-2 border-white/30 text-white rounded-2xl font-bold text-lg hover:bg-white/10 transition-all backdrop-blur-sm"
            >
              {t.ctaSecondary}
            </button>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
        {[
            { val: "2,000+", label: t.stats.users, icon: "👥" },
            { val: "15+", label: t.stats.villages, icon: "🏡" },
            { val: "500+", label: t.stats.schemes, icon: "📜" },
            { val: "24/7", label: t.stats.support, icon: "🤖" }
        ].map((stat, i) => (
            <div key={i} className="bg-white p-8 rounded-2xl border border-slate-100 shadow-lg shadow-slate-200/50 text-center hover:shadow-xl transition-shadow">
                <div className="text-4xl mb-3">{stat.icon}</div>
                <div className="text-4xl font-black text-slate-800 mb-2">{stat.val}</div>
                <div className="text-sm text-slate-500 font-bold uppercase tracking-wider">{stat.label}</div>
            </div>
        ))}
      </div>

      {/* The Challenge vs The Solution Section */}
      <div className="py-8">
        <div className="grid md:grid-cols-2 gap-12 items-stretch">
            {/* Problem Card */}
            <div className="bg-red-50 p-10 rounded-3xl border border-red-100 relative overflow-hidden group">
                 <div className="absolute top-0 right-0 p-8 opacity-10 text-9xl text-red-900 transform translate-x-10 -translate-y-10">⚠️</div>
                 <div className="relative z-10">
                    <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center text-2xl mb-6">📉</div>
                    <h3 className="text-3xl font-bold text-red-900 mb-4">{t.problemTitle}</h3>
                    <p className="text-lg text-red-800/80 leading-relaxed">
                        {t.problemText}
                    </p>
                 </div>
            </div>

            {/* Solution Card */}
            <div className="bg-emerald-50 p-10 rounded-3xl border border-emerald-100 relative overflow-hidden group shadow-lg">
                 <div className="absolute top-0 right-0 p-8 opacity-10 text-9xl text-emerald-900 transform translate-x-10 -translate-y-10">✅</div>
                 <div className="relative z-10">
                    <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center text-2xl mb-6">🚀</div>
                    <h3 className="text-3xl font-bold text-emerald-900 mb-4">{t.solutionTitle}</h3>
                    <p className="text-lg text-emerald-800/80 leading-relaxed mb-6">
                        {t.solutionText}
                    </p>
                    <button 
                        onClick={() => onNavigate('dashboard')}
                        className="text-emerald-700 font-bold hover:text-emerald-900 flex items-center gap-2"
                    >
                        See the Impact ➜
                    </button>
                 </div>
            </div>
        </div>
      </div>

      {/* Features Grid */}
      <div className="py-8">
          <div className="text-center mb-16">
              <h2 className="text-4xl font-extrabold text-slate-900 tracking-tight">{t.featuresTitle}</h2>
              <p className="text-lg text-slate-600 mt-4 max-w-2xl mx-auto">{t.featuresSubtitle}</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature) => (
                <div key={feature.id} className={`group relative p-10 rounded-3xl border ${feature.color} bg-opacity-50 transition-all hover:shadow-xl hover:-translate-y-1 duration-300 overflow-hidden`}>
                    <div className="absolute top-0 right-0 p-8 opacity-10 text-9xl transform translate-x-10 -translate-y-10 group-hover:scale-110 transition-transform">
                        {feature.icon}
                    </div>
                    <div className="relative z-10">
                        <div className="text-5xl mb-6">{feature.icon}</div>
                        <h3 className="text-3xl font-bold mb-4">{feature.title}</h3>
                        <p className="mb-8 text-lg opacity-90 leading-relaxed">
                            {feature.desc}
                        </p>
                        <button 
                            onClick={() => onNavigate(feature.id)}
                            className={`px-8 py-3 rounded-xl text-white font-bold text-sm shadow-md transition-all ${feature.btnColor}`}
                        >
                            {t.openModule} ➜
                        </button>
                    </div>
                </div>
            ))}
          </div>
      </div>

      {/* Mission Section */}
      <div className="bg-slate-900 text-white rounded-3xl p-12 md:p-20 text-center border border-slate-800 shadow-2xl relative overflow-hidden">
          <div className="relative z-10">
            <h2 className="text-3xl font-bold mb-6">{t.missionTitle}</h2>
            <p className="text-xl text-slate-300 max-w-4xl mx-auto leading-relaxed mb-12 font-light">
                {t.missionText}
            </p>
            <div className="flex flex-wrap justify-center gap-8 md:gap-16 opacity-40 grayscale">
                <span className="text-2xl font-black tracking-widest">DIGITAL INDIA</span>
                <span className="text-2xl font-black tracking-widest">CSC</span>
                <span className="text-2xl font-black tracking-widest">NABARD</span>
                <span className="text-2xl font-black tracking-widest">PM-KISAN</span>
            </div>
          </div>
      </div>
    </div>
  );
};

export default LandingPage;