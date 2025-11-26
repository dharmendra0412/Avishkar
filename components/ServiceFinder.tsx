

import React, { useState, useEffect } from 'react';
import { getSchemeRecommendations, simplifyGovernmentScheme } from '../services/geminiService';
import { Language } from '../types';
import { labels } from '../utils/localization';

interface ServiceFinderProps {
    language: Language;
}

const ServiceFinder: React.FC<ServiceFinderProps> = ({ language }) => {
  const [profile, setProfile] = useState('');
  const [recommendations, setRecommendations] = useState<any[]>([]);
  const [relatedSchemes, setRelatedSchemes] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [simplifiedView, setSimplifiedView] = useState<{ id: string, text: string } | null>(null);
  const [simplifying, setSimplifying] = useState(false);
  
  const t = labels[language].serviceFinder;

  useEffect(() => {
    const savedProfile = localStorage.getItem('gramsetu_user_profile');
    if (savedProfile) {
      setProfile(savedProfile);
    }
  }, []);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile.trim()) return;

    localStorage.setItem('gramsetu_user_profile', profile);

    setLoading(true);
    setRecommendations([]);
    setRelatedSchemes([]);
    setSimplifiedView(null);
    
    const result = await getSchemeRecommendations(profile, language);
    try {
        const cleanJson = result.replace(/```json|```/g, '').trim();
        const data = JSON.parse(cleanJson);
        
        // Handle response object structure
        if (data && !Array.isArray(data)) {
            setRecommendations(data.recommendations || []);
            setRelatedSchemes(data.related || []);
        } else if (Array.isArray(data)) {
            // Fallback for array response if model ignores structure
            setRecommendations(data);
        }
    } catch (e) {
        console.error("Failed to parse JSON", e);
    }
    setLoading(false);
  };

  const handleSimplify = async (id: string, schemeName: string, schemeDesc: string) => {
    setSimplifying(true);
    const simpleText = await simplifyGovernmentScheme(`${schemeName}: ${schemeDesc}`, language);
    setSimplifiedView({ id, text: simpleText });
    setSimplifying(false);
  };

  const handleLearnMore = (scheme: any) => {
      let url = scheme.link;
      // Fallback to Google Search if link is missing or looks like a placeholder
      if (!url || url === 'N/A' || url.length < 5) {
          url = `https://www.google.com/search?q=${encodeURIComponent(scheme.name + ' scheme official website')}`;
      }
      window.open(url, '_blank');
  };

  const SchemeCard = ({ scheme, index, type }: { scheme: any, index: number, type: 'primary' | 'related' }) => {
      const id = `${type}-${index}`;
      return (
        <div className={`p-6 rounded-xl shadow-md border-l-4 ${type === 'primary' ? 'bg-white border-indigo-500' : 'bg-slate-50 border-slate-400'}`}>
            <div className="flex justify-between items-start mb-2">
                <h3 className="text-xl font-bold text-slate-800">{scheme.name}</h3>
                {type === 'primary' && (
                    <span className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded-full font-bold">{t.recommended}</span>
                )}
            </div>
            <p className="text-slate-600 mb-4">{scheme.benefit}</p>
            <div className="flex flex-wrap gap-3">
                <button className="px-4 py-2 bg-slate-100 text-slate-700 rounded-lg text-sm font-medium hover:bg-slate-200">
                    {scheme.action}
                </button>
                <button 
                    onClick={() => handleSimplify(id, scheme.name, scheme.benefit)}
                    className="px-4 py-2 bg-amber-100 text-amber-800 rounded-lg text-sm font-medium hover:bg-amber-200 flex items-center gap-2"
                >
                    <span>📢</span> {t.simplify}
                </button>
                <button 
                    onClick={() => handleLearnMore(scheme)}
                    className="px-4 py-2 bg-blue-50 text-blue-700 rounded-lg text-sm font-medium hover:bg-blue-100 flex items-center gap-2 transition-colors border border-blue-100"
                >
                    <span>🌐</span> {t.learnMore}
                </button>
            </div>
            
            {simplifiedView?.id === id && (
                <div className="mt-4 p-4 bg-amber-50 rounded-lg border border-amber-200 text-amber-900 animate-in slide-in-from-top-2">
                    {simplifying ? (
                        <span className="animate-pulse">{t.translating}</span>
                    ) : (
                        <>
                            <h4 className="font-bold text-sm uppercase tracking-wide text-amber-700 mb-2">{t.explanation}</h4>
                            <p>{simplifiedView.text}</p>
                        </>
                    )}
                </div>
            )}
        </div>
      );
  };

  return (
    <div className="max-w-3xl mx-auto">
      <div className="bg-indigo-600 rounded-2xl p-8 text-white mb-8 shadow-xl">
        <h2 className="text-2xl font-bold mb-4">{t.title}</h2>
        <form onSubmit={handleSearch} className="space-y-4">
            <div>
                <label className="block text-indigo-100 text-sm mb-2">{t.label}</label>
                <input 
                    type="text" 
                    value={profile}
                    onChange={(e) => setProfile(e.target.value)}
                    className="w-full px-4 py-3 rounded-lg text-slate-900 focus:outline-none focus:ring-4 focus:ring-indigo-400"
                    placeholder={t.placeholder}
                />
            </div>
            <button 
                type="submit" 
                disabled={loading}
                className="bg-white text-indigo-700 font-bold py-3 px-6 rounded-lg hover:bg-indigo-50 transition-colors disabled:opacity-70"
            >
                {loading ? t.loading : t.button}
            </button>
        </form>
      </div>

      <div className="space-y-8">
        {/* Primary Recommendations */}
        {recommendations.length > 0 && (
            <div className="space-y-6">
                {recommendations.map((scheme, idx) => (
                    <SchemeCard key={`rec-${idx}`} scheme={scheme} index={idx} type="primary" />
                ))}
            </div>
        )}

        {/* Related Schemes */}
        {relatedSchemes.length > 0 && (
            <div className="pt-6 border-t border-slate-200">
                <h3 className="text-lg font-bold text-slate-700 mb-4">{t.relatedSchemes}</h3>
                <div className="space-y-6">
                    {relatedSchemes.map((scheme, idx) => (
                        <SchemeCard key={`rel-${idx}`} scheme={scheme} index={idx} type="related" />
                    ))}
                </div>
            </div>
        )}

        {recommendations.length === 0 && !loading && (
             <div className="text-center text-slate-400 mt-8">
                 {/* Placeholder message if needed */}
             </div>
        )}
      </div>
    </div>
  );
};

export default ServiceFinder;
