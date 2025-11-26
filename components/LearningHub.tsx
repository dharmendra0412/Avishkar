

import React, { useState, useEffect } from 'react';
import { generateDigitalLiteracyTip, generateQuiz, getDailyDigitalTip } from '../services/geminiService';
import { Language, QuizQuestion } from '../types';
import { labels } from '../utils/localization';

interface LearningHubProps {
    language: Language;
}

const LearningHub: React.FC<LearningHubProps> = ({ language }) => {
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);
  const [content, setContent] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [dailyTip, setDailyTip] = useState<string>('');

  // Quiz State
  const [quizMode, setQuizMode] = useState(false);
  const [quizLoading, setQuizLoading] = useState(false);
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [showScore, setShowScore] = useState(false);

  const t = labels[language].learning;

  // Load Daily Tip on mount or language change
  useEffect(() => {
    getDailyDigitalTip(language).then(setDailyTip);
  }, [language]);

  const topics = [
    { 
        id: 'upi', 
        label: t.topics.upi, 
        icon: '💸',
        image: 'https://placehold.co/600x400/e0e7ff/4338ca?text=UPI+Payment+Screen&font=roboto' 
    },
    { 
        id: 'email', 
        label: t.topics.email, 
        icon: '📧',
        image: 'https://placehold.co/600x400/f0f9ff/0369a1?text=Email+Inbox+View&font=roboto' 
    },
    { 
        id: 'news', 
        label: t.topics.news, 
        icon: '📰',
        image: 'https://placehold.co/600x400/fef2f2/991b1b?text=News+Check+App&font=roboto' 
    },
    { 
        id: 'farming', 
        label: t.topics.farming, 
        icon: '🌾',
        image: 'https://placehold.co/600x400/ecfccb/3f6212?text=Smart+Farming+Tools&font=roboto' 
    },
    { 
        id: 'safety', 
        label: t.topics.safety, 
        icon: '🔒',
        image: 'https://placehold.co/600x400/fff7ed/9a3412?text=Mobile+Security+Lock&font=roboto' 
    },
    { 
        id: 'digilocker', 
        label: t.topics.digilocker, 
        icon: '📂',
        image: 'https://placehold.co/600x400/f0fdf4/166534?text=Digital+Documents&font=roboto' 
    },
    { 
        id: 'booking', 
        label: t.topics.booking, 
        icon: '🚆',
        image: 'https://placehold.co/600x400/fdf4ff/86198f?text=Train+Ticket+Booking&font=roboto' 
    },
    { 
        id: 'social', 
        label: t.topics.social, 
        icon: '📱',
        image: 'https://placehold.co/600x400/f5f3ff/5b21b6?text=Social+Privacy+Settings&font=roboto' 
    },
    { 
        id: 'bills', 
        label: t.topics.bills, 
        icon: '🧾',
        image: 'https://placehold.co/600x400/e0f2fe/0369a1?text=Bill+Payments&font=roboto' 
    },
    { 
        id: 'maps', 
        label: t.topics.maps, 
        icon: '🗺️',
        image: 'https://placehold.co/600x400/ecfdf5/047857?text=Google+Maps+Nav&font=roboto' 
    },
    { 
        id: 'jobs', 
        label: t.topics.jobs, 
        icon: '💼',
        image: 'https://placehold.co/600x400/fffbeb/b45309?text=Job+Search+Portal&font=roboto' 
    },
    { 
        id: 'voice', 
        label: t.topics.voice, 
        icon: '🎤',
        image: 'https://placehold.co/600x400/f3e8ff/7e22ce?text=Google+Voice+Search&font=roboto' 
    },
  ];

  const handleTopicClick = async (topic: string) => {
    setSelectedTopic(topic);
    setLoading(true);
    setContent('');
    setQuizMode(false);
    resetQuiz();
    
    // We pass the topic but ask the service to generate content in the selected language
    const tip = await generateDigitalLiteracyTip(topic, language);
    setContent(tip);
    setLoading(false);
  };

  const handleStartQuiz = async () => {
      if (!selectedTopic) return;
      setQuizMode(true);
      setQuizLoading(true);
      resetQuiz();
      
      const quizData = await generateQuiz(selectedTopic, language);
      setQuestions(quizData);
      setQuizLoading(false);
  };

  const resetQuiz = () => {
      setQuestions([]);
      setCurrentQuestionIndex(0);
      setScore(0);
      setShowScore(false);
      setSelectedAnswer(null);
  };

  const handleAnswerSelect = (index: number) => {
      setSelectedAnswer(index);
  };

  const handleNextQuestion = () => {
      if (selectedAnswer === null) return;
      
      if (selectedAnswer === questions[currentQuestionIndex].correctAnswer) {
          setScore(s => s + 1);
      }

      const nextIndex = currentQuestionIndex + 1;
      if (nextIndex < questions.length) {
          setCurrentQuestionIndex(nextIndex);
          setSelectedAnswer(null);
      } else {
          setShowScore(true);
      }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-12">
      
      {/* Daily Tip Card */}
      <div className="bg-gradient-to-r from-amber-50 to-orange-50 p-6 rounded-2xl border border-amber-200 shadow-sm flex items-start gap-4">
          <div className="text-4xl bg-white p-2 rounded-full shadow-sm">💡</div>
          <div>
              <h3 className="font-bold text-amber-800 text-sm uppercase tracking-wide mb-1">{t.dailyTip}</h3>
              <p className="text-amber-900 font-medium italic text-lg leading-relaxed">
                  {dailyTip ? `"${dailyTip}"` : "..."}
              </p>
          </div>
      </div>

      <div className="text-center py-6">
        <h2 className="text-4xl font-extrabold text-slate-900 tracking-tight">{t.title}</h2>
        <p className="text-lg text-slate-600 mt-2 max-w-2xl mx-auto">{t.subtitle}</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {topics.map((item) => (
          <button
            key={item.id}
            onClick={() => handleTopicClick(item.label)}
            className={`group relative overflow-hidden rounded-2xl border-2 transition-all text-left bg-white ${
              selectedTopic === item.label
                ? 'border-indigo-600 ring-4 ring-indigo-50 shadow-xl scale-[1.02]'
                : 'border-slate-100 hover:border-indigo-300 hover:shadow-xl hover:-translate-y-1'
            }`}
          >
             {/* Mockup Image Area */}
            <div className="aspect-[4/3] bg-slate-100 relative overflow-hidden">
                <img 
                    src={item.image} 
                    alt={item.label} 
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent opacity-80 group-hover:opacity-100 transition-opacity"></div>
                
                {/* Icon Overlay */}
                <div className="absolute bottom-3 left-4 flex items-center gap-3">
                    <span className="text-3xl filter drop-shadow-lg">{item.icon}</span>
                </div>
                
                {/* Selection Indicator */}
                {selectedTopic === item.label && (
                    <div className="absolute top-3 right-3 bg-indigo-600 text-white rounded-full p-1.5 shadow-lg">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                    </div>
                )}
            </div>

            {/* Label Area */}
            <div className={`p-4 border-t ${selectedTopic === item.label ? 'bg-indigo-50 border-indigo-100' : 'border-slate-100'}`}>
                <span className={`font-bold block text-lg ${selectedTopic === item.label ? 'text-indigo-800' : 'text-slate-800'}`}>
                    {item.label}
                </span>
                <span className="text-xs font-medium text-slate-500 uppercase tracking-wide mt-1 block">Start Lesson ➜</span>
            </div>
          </button>
        ))}
      </div>

      {/* Content / Quiz Area */}
      <div className="bg-white rounded-3xl shadow-xl border border-slate-100 min-h-[500px] p-0 relative overflow-hidden mt-8 scroll-mt-24" id="learning-content">
        {!selectedTopic && (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-400 bg-slate-50/50">
            <div className="text-6xl mb-4 opacity-50">👆</div>
            <p className="text-xl font-medium">{t.select}</p>
          </div>
        )}

        {loading && (
          <div className="absolute inset-0 flex items-center justify-center flex-col gap-4 bg-white/90 z-20 backdrop-blur-sm">
            <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
            <span className="text-indigo-800 font-bold text-lg animate-pulse">{t.loading}</span>
          </div>
        )}

        {/* Lesson Content View */}
        {content && !loading && !quizMode && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 p-8 md:p-12">
            <div className="flex justify-between items-start mb-8 border-b border-slate-100 pb-6">
                <h3 className="text-3xl font-extrabold text-slate-800 flex items-center gap-3">
                    <span className="bg-indigo-100 p-2 rounded-lg text-2xl">
                        {topics.find(t => t.label === selectedTopic)?.icon}
                    </span>
                    {selectedTopic}
                </h3>
                <button 
                  onClick={() => setSelectedTopic(null)}
                  className="px-4 py-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                >
                    ✕
                </button>
            </div>
            
            <div className="prose prose-lg max-w-none prose-indigo mb-10">
              <div className="whitespace-pre-wrap text-slate-700 leading-relaxed bg-slate-50 p-8 rounded-2xl border border-slate-200 shadow-sm">
                {content}
              </div>
            </div>
            
            <div className="flex justify-end pt-4">
                <button
                    onClick={handleStartQuiz}
                    className="px-8 py-4 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 shadow-lg shadow-indigo-200 transition-all flex items-center gap-3 transform hover:-translate-y-1"
                >
                    <span className="text-xl">📝</span> 
                    <span>{t.quiz.button}</span>
                </button>
            </div>
          </div>
        )}

        {/* Quiz View */}
        {quizMode && (
            <div className="animate-in slide-in-from-right duration-500 max-w-2xl mx-auto p-8 md:p-16">
                {quizLoading ? (
                    <div className="text-center py-20">
                         <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-6"></div>
                         <p className="text-indigo-800 font-bold text-lg">{t.quiz.loading}</p>
                    </div>
                ) : showScore ? (
                    // Score Card
                    <div className="text-center py-10">
                        <div className="text-8xl mb-6 animate-bounce">
                            {score === questions.length ? '🏆' : '🎯'}
                        </div>
                        <h3 className="text-3xl font-bold text-slate-800 mb-2">{t.quiz.score}</h3>
                        <div className="text-6xl font-black text-indigo-600 mb-8 tracking-tight">
                            {score} <span className="text-3xl text-slate-300 font-normal">/ {questions.length}</span>
                        </div>
                        <p className="text-xl text-slate-600 mb-10 font-medium bg-slate-50 inline-block px-6 py-2 rounded-full">
                            {score === questions.length ? t.quiz.pass : t.quiz.fail}
                        </p>
                        <div className="flex justify-center gap-4">
                            <button 
                                onClick={handleStartQuiz} 
                                className="px-8 py-3 border-2 border-indigo-600 text-indigo-600 rounded-xl font-bold hover:bg-indigo-50 transition-colors"
                            >
                                {t.quiz.tryAgain}
                            </button>
                            <button 
                                onClick={() => { setQuizMode(false); }} 
                                className="px-8 py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 shadow-lg shadow-indigo-200 transition-colors"
                            >
                                {t.close}
                            </button>
                        </div>
                    </div>
                ) : questions.length > 0 ? (
                    // Question Card
                    <div>
                        <div className="flex justify-between items-center mb-8">
                            <h4 className="text-indigo-600 font-bold uppercase text-xs tracking-widest border border-indigo-200 px-3 py-1 rounded-full bg-indigo-50">
                                {t.quiz.title}
                            </h4>
                            <span className="bg-slate-100 text-slate-600 px-4 py-1.5 rounded-full text-sm font-bold shadow-sm">
                                {currentQuestionIndex + 1} / {questions.length}
                            </span>
                        </div>

                        <h3 className="text-2xl font-bold text-slate-900 mb-8 leading-relaxed">
                            {questions[currentQuestionIndex].question}
                        </h3>

                        <div className="space-y-4 mb-10">
                            {questions[currentQuestionIndex].options.map((option, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => handleAnswerSelect(idx)}
                                    className={`w-full text-left p-5 rounded-2xl border-2 transition-all flex items-center group ${
                                        selectedAnswer === idx 
                                        ? 'border-indigo-600 bg-indigo-600 text-white font-semibold shadow-lg scale-[1.01]' 
                                        : 'border-slate-200 bg-white hover:border-indigo-300 hover:shadow-md text-slate-700'
                                    }`}
                                >
                                    <span className={`flex-shrink-0 w-8 h-8 rounded-full border-2 mr-4 flex items-center justify-center text-sm font-bold transition-colors ${
                                        selectedAnswer === idx ? 'border-white bg-white text-indigo-600' : 'border-slate-300 text-slate-400 group-hover:border-indigo-400 group-hover:text-indigo-400'
                                    }`}>
                                        {String.fromCharCode(65 + idx)}
                                    </span>
                                    {option}
                                </button>
                            ))}
                        </div>

                        <div className="flex justify-between items-center pt-6 border-t border-slate-100">
                             <button 
                                onClick={() => setQuizMode(false)}
                                className="px-6 py-2 text-slate-400 font-medium hover:text-slate-600 transition-colors"
                             >
                                {t.close}
                            </button>
                            <button
                                onClick={handleNextQuestion}
                                disabled={selectedAnswer === null}
                                className="px-10 py-4 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed shadow-xl shadow-indigo-200 transition-all transform hover:-translate-y-1"
                            >
                                {currentQuestionIndex === questions.length - 1 ? t.quiz.submit : t.quiz.next} ➜
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className="text-center text-slate-400">No questions available.</div>
                )}
            </div>
        )}
      </div>
    </div>
  );
};

export default LearningHub;