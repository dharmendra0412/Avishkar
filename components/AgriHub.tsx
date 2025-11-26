

import React, { useState, useRef, useEffect } from 'react';
import { analyzeCropImage, getFarmingAdvice, getAgriDashboardData } from '../services/geminiService';
import { Language, AgriDashboardData } from '../types';
import { labels } from '../utils/localization';

interface AgriHubProps {
    language: Language;
}

const AgriHub: React.FC<AgriHubProps> = ({ language }) => {
    const t = labels[language].agri;
    const [activeTab, setActiveTab] = useState<'doctor' | 'advisor'>('doctor');
    
    // Doctor State
    const [selectedImage, setSelectedImage] = useState<string | null>(null);
    const [diagnosis, setDiagnosis] = useState<string>('');
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Advisor / Smart Farm State
    const [location, setLocation] = useState('Nagpur, Maharashtra');
    const [dashboardData, setDashboardData] = useState<AgriDashboardData | null>(null);
    const [isLoadingData, setIsLoadingData] = useState(false);
    const [query, setQuery] = useState('');
    const [advice, setAdvice] = useState('');
    const [isAdvising, setIsAdvising] = useState(false);

    // Load initial data for Smart Farm
    useEffect(() => {
        if (activeTab === 'advisor' && !dashboardData) {
            handleFetchDashboard();
        }
    }, [activeTab]);

    const handleFetchDashboard = async () => {
        setIsLoadingData(true);
        const data = await getAgriDashboardData(location, language);
        setDashboardData(data);
        setIsLoadingData(false);
    };

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                const base64String = reader.result as string;
                setSelectedImage(base64String);
                setDiagnosis(''); // Clear previous diagnosis
            };
            reader.readAsDataURL(file);
        }
    };

    const handleAnalysis = async () => {
        if (!selectedImage) return;
        setIsAnalyzing(true);
        // Extract base64 data part (remove "data:image/jpeg;base64,")
        const mimeType = selectedImage.split(';')[0].split(':')[1];
        const base64Data = selectedImage.split(',')[1];
        const result = await analyzeCropImage(base64Data, mimeType, language);
        setDiagnosis(result || "Could not analyze.");
        setIsAnalyzing(false);
    };

    const handleAdviceSearch = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!query.trim()) return;
        setIsAdvising(true);
        const result = await getFarmingAdvice(query, language);
        setAdvice(result || "No advice available.");
        setIsAdvising(false);
    };

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-green-800">{t.title}</h2>
            </div>

            {/* Tabs */}
            <div className="flex rounded-xl bg-white shadow-sm p-1 border border-green-100 mb-6">
                <button
                    onClick={() => setActiveTab('doctor')}
                    className={`flex-1 py-3 px-6 rounded-lg font-bold transition-all ${
                        activeTab === 'doctor' 
                        ? 'bg-green-600 text-white shadow-md' 
                        : 'text-green-700 hover:bg-green-50'
                    }`}
                >
                    🌱 {t.tabs.doctor}
                </button>
                <button
                    onClick={() => setActiveTab('advisor')}
                    className={`flex-1 py-3 px-6 rounded-lg font-bold transition-all ${
                        activeTab === 'advisor' 
                        ? 'bg-green-600 text-white shadow-md' 
                        : 'text-green-700 hover:bg-green-50'
                    }`}
                >
                    🚜 {t.tabs.advisor}
                </button>
            </div>

            {/* Content Area */}
            <div className="bg-white rounded-2xl shadow-lg border border-green-100 p-6 min-h-[400px]">
                {activeTab === 'doctor' ? (
                    <div className="flex flex-col items-center max-w-lg mx-auto">
                        <h3 className="text-xl font-bold text-slate-800 mb-2">{t.doctor.uploadTitle}</h3>
                        <p className="text-slate-500 mb-6 text-center">{t.doctor.uploadDesc}</p>

                        <div 
                            onClick={() => fileInputRef.current?.click()}
                            className="w-full h-64 border-2 border-dashed border-green-300 rounded-xl flex flex-col items-center justify-center cursor-pointer hover:bg-green-50 transition-colors bg-slate-50 relative overflow-hidden group"
                        >
                            {selectedImage ? (
                                <img src={selectedImage} alt="Crop" className="w-full h-full object-cover" />
                            ) : (
                                <>
                                    <span className="text-4xl mb-2">📸</span>
                                    <span className="text-green-600 font-medium">{t.doctor.button}</span>
                                </>
                            )}
                            {/* Overlay on hover if image exists */}
                            {selectedImage && (
                                <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                    <span className="text-white font-bold">Click to change</span>
                                </div>
                            )}
                        </div>
                        <input 
                            type="file" 
                            accept="image/*" 
                            ref={fileInputRef} 
                            className="hidden" 
                            onChange={handleImageUpload}
                        />

                        {selectedImage && !isAnalyzing && !diagnosis && (
                            <button 
                                onClick={handleAnalysis}
                                className="mt-6 w-full bg-green-600 text-white py-3 rounded-xl font-bold hover:bg-green-700 transition-colors shadow-lg shadow-green-200"
                            >
                                🔍 Analyze Disease
                            </button>
                        )}

                        {isAnalyzing && (
                            <div className="mt-8 text-center">
                                <div className="w-10 h-10 border-4 border-green-600 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
                                <span className="text-green-700 font-medium animate-pulse">{t.doctor.analyzing}</span>
                            </div>
                        )}

                        {diagnosis && (
                            <div className="mt-8 w-full bg-green-50 border border-green-200 rounded-xl p-6 animate-in slide-in-from-bottom-4">
                                <h4 className="text-green-800 font-bold mb-3 uppercase tracking-wider text-sm">{t.doctor.result}</h4>
                                <div className="prose prose-green text-slate-700 whitespace-pre-wrap">
                                    {diagnosis}
                                </div>
                                <button 
                                    onClick={() => { setSelectedImage(null); setDiagnosis(''); }}
                                    className="mt-4 text-green-600 text-sm font-semibold hover:text-green-800"
                                >
                                    Start New Scan
                                </button>
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="space-y-8 animate-in fade-in">
                        {/* Location Header */}
                        <div className="flex flex-col md:flex-row gap-4 items-end bg-green-50 p-4 rounded-xl border border-green-100">
                             <div className="flex-1 w-full">
                                <label className="block text-xs font-bold text-green-700 uppercase mb-1">{t.advisor.locationLabel}</label>
                                <input 
                                    type="text" 
                                    value={location}
                                    onChange={(e) => setLocation(e.target.value)}
                                    className="w-full px-4 py-2 rounded-lg border-green-200 focus:ring-green-500 focus:border-green-500 text-green-900 font-medium"
                                />
                             </div>
                             <button 
                                onClick={handleFetchDashboard}
                                disabled={isLoadingData}
                                className="w-full md:w-auto px-6 py-2 bg-green-600 text-white rounded-lg font-bold hover:bg-green-700 transition-colors"
                             >
                                {isLoadingData ? t.advisor.loading : t.advisor.fetchButton}
                             </button>
                        </div>

                        {/* Dashboard Cards */}
                        {dashboardData && (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Weather Card */}
                                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-6 rounded-xl border border-blue-100 shadow-sm relative overflow-hidden flex flex-col justify-between">
                                    <div>
                                        <div className="absolute top-0 right-0 p-4 opacity-10 text-9xl">☁️</div>
                                        <h4 className="text-lg font-bold text-blue-900 mb-4 flex items-center gap-2">
                                            <span>🌦️</span> {t.advisor.weatherTitle}
                                        </h4>
                                        <div className="flex items-center gap-4 mb-4">
                                            <span className="text-5xl">{dashboardData.weather.icon}</span>
                                            <div>
                                                <div className="text-3xl font-bold text-slate-800">{dashboardData.weather.temp}</div>
                                                <div className="text-blue-700 font-medium">{dashboardData.weather.condition}</div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="bg-white/60 p-3 rounded-lg text-sm text-blue-800 font-medium border border-blue-100">
                                        💡 {dashboardData.weather.advice}
                                    </div>
                                </div>

                                {/* Mandi Prices Card */}
                                <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                                    <h4 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                                        <span>💰</span> {t.advisor.marketTitle}
                                    </h4>
                                    <div className="space-y-3">
                                        {dashboardData.prices.map((item, idx) => (
                                            <div key={idx} className="flex justify-between items-center p-3 bg-slate-50 rounded-lg">
                                                <span className="font-semibold text-slate-700">{item.crop}</span>
                                                <div className="flex items-center gap-3">
                                                    <span className="font-mono font-bold text-slate-800">{item.price}</span>
                                                    <span className={`text-xs px-2 py-0.5 rounded-full font-bold ${
                                                        item.change === 'up' ? 'bg-green-100 text-green-700' : 
                                                        item.change === 'down' ? 'bg-red-100 text-red-700' : 'bg-slate-200 text-slate-600'
                                                    }`}>
                                                        {item.change === 'up' ? '▲' : item.change === 'down' ? '▼' : '−'}
                                                    </span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Forecast Section */}
                        {dashboardData && dashboardData.forecast && (
                            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                                <h4 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                                    <span>📅</span> {t.advisor.forecastTitle}
                                </h4>
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                    {dashboardData.forecast.map((day, idx) => (
                                        <div key={idx} className="bg-slate-50 p-4 rounded-lg border border-slate-100 text-center">
                                            <div className="text-sm font-bold text-slate-500 uppercase">{day.day}</div>
                                            <div className="text-xs text-slate-400 mb-2">{day.date}</div>
                                            <div className="text-3xl mb-2">{day.icon}</div>
                                            <div className="text-lg font-bold text-slate-800 mb-1">{day.condition}</div>
                                            <div className="text-sm font-medium text-slate-600">
                                                <span className="text-red-500">H: {day.tempHigh}</span> • <span className="text-blue-500">L: {day.tempLow}</span>
                                            </div>
                                            <div className="text-xs text-blue-600 mt-2 font-medium bg-blue-50 py-1 rounded">
                                                💧 {day.rainProb} {t.advisor.chanceOfRain}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        <hr className="border-slate-100" />

                        {/* Chat Section */}
                        <div className="max-w-2xl mx-auto">
                            <h3 className="text-xl font-bold text-slate-800 mb-4">{t.advisor.askTitle}</h3>
                            
                            <form onSubmit={handleAdviceSearch} className="flex gap-2 mb-6">
                                <div className="relative flex-1">
                                    <input 
                                        type="text" 
                                        value={query}
                                        onChange={(e) => setQuery(e.target.value)}
                                        placeholder={t.advisor.placeholder}
                                        className="w-full px-4 py-3 pr-10 rounded-xl border border-slate-200 focus:ring-2 focus:ring-green-500 focus:outline-none"
                                    />
                                    {/* Mic Icon (Visual cue only for now) */}
                                    <button type="button" className="absolute right-3 top-3 text-slate-400 hover:text-green-600">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                                        </svg>
                                    </button>
                                </div>
                                <button 
                                    type="submit"
                                    disabled={isAdvising || !query.trim()}
                                    className="bg-green-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-green-700 disabled:opacity-50 shadow-md shadow-green-100"
                                >
                                    {isAdvising ? '...' : t.advisor.button}
                                </button>
                            </form>

                            {advice && (
                                <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-6 rounded-xl border border-green-100 text-slate-800 leading-relaxed shadow-inner animate-in fade-in slide-in-from-bottom-2">
                                    <div className="flex gap-3 mb-4">
                                        <span className="text-2xl">👨‍🌾</span>
                                        <h4 className="font-bold text-lg text-green-800">Expert Advice</h4>
                                    </div>
                                    <div className="whitespace-pre-wrap">{advice}</div>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AgriHub;