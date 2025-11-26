
import React, { useEffect, useRef, useState, useCallback } from 'react';
import { GoogleGenAI, LiveServerMessage, Modality } from '@google/genai';
import { createBlob, decode, decodeAudioData } from '../utils/audioUtils';
import { Language } from '../types';
import { labels, languageNames } from '../utils/localization';

interface LiveAssistantProps {
    language: Language;
}

interface TranscriptItem {
    role: 'user' | 'model';
    text: string;
    isFinal: boolean;
}

const LiveAssistant: React.FC<LiveAssistantProps> = ({ language }) => {
  const [isActive, setIsActive] = useState(false);
  const [status, setStatus] = useState<'disconnected' | 'connecting' | 'connected' | 'error'>('disconnected');
  const [transcripts, setTranscripts] = useState<TranscriptItem[]>([]);
  
  const t = labels[language].live;

  // Refs for audio handling
  const audioContextRef = useRef<AudioContext | null>(null);
  const inputContextRef = useRef<AudioContext | null>(null);
  const nextStartTimeRef = useRef<number>(0);
  const streamRef = useRef<MediaStream | null>(null);
  const sessionRef = useRef<Promise<any> | null>(null);
  const processorRef = useRef<ScriptProcessorNode | null>(null);
  const sourceRef = useRef<MediaStreamAudioSourceNode | null>(null);
  const sourcesRef = useRef<Set<AudioBufferSourceNode>>(new Set());
  
  // Visualizer Refs
  const analyserRef = useRef<AnalyserNode | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animationFrameRef = useRef<number | null>(null);

  // Transcription accumulation refs (to handle streaming chunks)
  const currentInputTransRef = useRef<string>("");
  const currentOutputTransRef = useRef<string>("");

  const stopSession = useCallback(async () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    
    if (processorRef.current && inputContextRef.current) {
      processorRef.current.disconnect();
      if (sourceRef.current) sourceRef.current.disconnect();
    }

    if (inputContextRef.current) {
      await inputContextRef.current.close();
      inputContextRef.current = null;
    }

    if (audioContextRef.current) {
      await audioContextRef.current.close();
      audioContextRef.current = null;
    }
    
    if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
    }
    
    if (sessionRef.current) {
        try {
            const session = await sessionRef.current;
            session.close();
        } catch (e) {
            console.error("Error closing session:", e);
        }
        sessionRef.current = null;
    }

    setIsActive(false);
    setStatus('disconnected');
    nextStartTimeRef.current = 0;
    sourcesRef.current.forEach(s => {
        try { s.stop(); } catch (e) {}
    });
    sourcesRef.current.clear();
  }, []);

  const drawVisualizer = () => {
    if (!canvasRef.current || !analyserRef.current) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const analyser = analyserRef.current;
    
    if (!ctx) return;

    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);
    
    const draw = () => {
        animationFrameRef.current = requestAnimationFrame(draw);
        analyser.getByteFrequencyData(dataArray);

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        const barWidth = (canvas.width / bufferLength) * 2.5;
        let barHeight;
        let x = 0;

        // Use a gradient for bars
        const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
        gradient.addColorStop(0, '#059669'); // Green-600
        gradient.addColorStop(1, '#34d399'); // Green-400
        ctx.fillStyle = gradient;

        for (let i = 0; i < bufferLength; i++) {
            barHeight = dataArray[i] / 2;
            ctx.fillRect(x, canvas.height - barHeight, barWidth, barHeight);
            x += barWidth + 1;
        }
    };
    
    draw();
  };

  const startSession = async () => {
    try {
      if (isActive) return;
      setStatus('connecting');
      nextStartTimeRef.current = 0;

      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      
      // Initialize Contexts
      inputContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
      
      await audioContextRef.current.resume();

      // Setup Visualizer (Analyser) for Output Audio
      const analyser = audioContextRef.current.createAnalyser();
      analyser.fftSize = 256;
      analyserRef.current = analyser;
      
      // Connect Analyser to Destination
      analyser.connect(audioContextRef.current.destination);

      // Start Visualizer Drawing
      drawVisualizer();

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      const sessionPromise = ai.live.connect({
        model: 'gemini-2.5-flash-native-audio-preview-09-2025',
        config: {
          responseModalities: [Modality.AUDIO],
          // Enable transcription with empty objects
          inputAudioTranscription: {},
          outputAudioTranscription: {},
          speechConfig: {
            voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Fenrir' } },
          },
          systemInstruction: `You are a warm, patient, and helpful assistant for villagers in a rural community. Speak simply, slowly, and clearly in ${languageNames[language]}. Your goal is to help them understand digital tools, government schemes, and basic healthcare. Avoid complex jargon.`,
        },
        callbacks: {
          onopen: () => {
            setStatus('connected');
            setIsActive(true);
            
            if (!inputContextRef.current) return;
            const source = inputContextRef.current.createMediaStreamSource(stream);
            sourceRef.current = source;
            const processor = inputContextRef.current.createScriptProcessor(4096, 1, 1);
            processorRef.current = processor;
            
            processor.onaudioprocess = (e) => {
              const inputData = e.inputBuffer.getChannelData(0);
              const pcmBlob = createBlob(inputData);
              sessionPromise.then((session) => {
                session.sendRealtimeInput({ media: pcmBlob });
              });
            };
            
            source.connect(processor);
            processor.connect(inputContextRef.current.destination);
          },
          onmessage: async (message: LiveServerMessage) => {
            if (message.serverContent?.interrupted) {
                sourcesRef.current.forEach(source => { try { source.stop(); } catch (e) {} });
                sourcesRef.current.clear();
                nextStartTimeRef.current = 0;
                currentOutputTransRef.current = ""; 
                return;
            }

            // Handle Transcriptions
            const outputText = message.serverContent?.outputTranscription?.text;
            const inputText = message.serverContent?.inputTranscription?.text;

            if (inputText) {
                currentInputTransRef.current += inputText;
            }
            if (outputText) {
                currentOutputTransRef.current += outputText;
            }

            if (message.serverContent?.turnComplete) {
                // Flush transcriptions to state
                setTranscripts(prev => {
                    const newItems: TranscriptItem[] = [];
                    if (currentInputTransRef.current.trim()) {
                        newItems.push({ role: 'user', text: currentInputTransRef.current, isFinal: true });
                    }
                    if (currentOutputTransRef.current.trim()) {
                        newItems.push({ role: 'model', text: currentOutputTransRef.current, isFinal: true });
                    }
                    return [...prev, ...newItems];
                });
                // Reset refs
                currentInputTransRef.current = "";
                currentOutputTransRef.current = "";
            }

            // Handle Audio Output
            const base64Audio = message.serverContent?.modelTurn?.parts?.[0]?.inlineData?.data;
            if (base64Audio && audioContextRef.current && analyserRef.current) {
              nextStartTimeRef.current = Math.max(nextStartTimeRef.current, audioContextRef.current.currentTime);
              
              const audioBuffer = await decodeAudioData(
                decode(base64Audio),
                audioContextRef.current,
                24000,
                1
              );
              
              const source = audioContextRef.current.createBufferSource();
              source.buffer = audioBuffer;
              // Connect source -> Analyser -> Destination
              source.connect(analyserRef.current);
              
              source.addEventListener('ended', () => {
                sourcesRef.current.delete(source);
              });

              source.start(nextStartTimeRef.current);
              nextStartTimeRef.current += audioBuffer.duration;
              sourcesRef.current.add(source);
            }
          },
          onclose: () => {
            setStatus('disconnected');
            setIsActive(false);
          },
          onerror: (err) => {
            console.error(err);
            setStatus('error');
            setIsActive(false);
          }
        }
      });
      sessionRef.current = sessionPromise;

    } catch (error) {
      console.error("Failed to start session:", error);
      setStatus('error');
    }
  };

  useEffect(() => {
    return () => { stopSession(); };
  }, [stopSession]);

  // Auto-scroll transcript
  const scrollRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (scrollRef.current) {
        scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [transcripts]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-[600px]">
      
      {/* Left Panel: Visualizer & Controls */}
      <div className="bg-gradient-to-br from-emerald-50 to-teal-100 p-6 rounded-2xl shadow-xl border border-emerald-200 flex flex-col items-center justify-between">
          <div className="text-center space-y-4 mt-8">
            <h2 className="text-2xl font-bold text-teal-900">{t.title}</h2>
            <p className="text-teal-700 max-w-xs mx-auto">{t.subtitle}</p>
            <p className="text-sm italic text-teal-600 bg-white/50 px-3 py-1 rounded-full inline-block">
                {t.hint}
            </p>
          </div>

          {/* Visualizer Canvas */}
          <div className="w-full h-32 flex items-end justify-center px-4">
               <canvas 
                    ref={canvasRef} 
                    width="300" 
                    height="100" 
                    className="w-full h-full"
               />
          </div>

          {/* Mic Button */}
          <div className="relative group mb-8">
            {status === 'connected' && (
                <div className="absolute -inset-4 bg-teal-400 rounded-full opacity-30 animate-ping group-hover:opacity-50"></div>
            )}
            <button
                onClick={isActive ? stopSession : startSession}
                disabled={status === 'connecting'}
                className={`relative z-10 p-8 rounded-full transition-all duration-300 transform shadow-lg ${
                isActive 
                    ? 'bg-red-500 hover:bg-red-600 scale-110' 
                    : 'bg-teal-600 hover:bg-teal-700'
                }`}
            >
                {status === 'connecting' ? (
                <div className="w-12 h-12 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : isActive ? (
                <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="6" y="6" width="12" height="12" fill="white"></rect></svg>
                ) : (
                <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"></path><path d="M19 10v2a7 7 0 0 1-14 0v-2"></path><line x1="12" y1="19" x2="12" y2="23"></line><line x1="8" y1="23" x2="16" y2="23"></line></svg>
                )}
            </button>
            <div className="mt-4 text-center h-6">
                {status === 'connecting' && <span className="text-teal-600 font-medium animate-pulse">{t.status.connecting}</span>}
                {status === 'connected' && <span className="text-emerald-700 font-bold">{t.status.listening}</span>}
                {status === 'error' && <span className="text-red-600 font-bold">{t.status.error}</span>}
            </div>
          </div>
      </div>

      {/* Right Panel: Transcript History */}
      <div className="bg-white rounded-2xl shadow-lg border border-slate-200 flex flex-col overflow-hidden">
         <div className="p-4 bg-slate-50 border-b border-slate-200 flex justify-between items-center">
             <h3 className="font-bold text-slate-700 flex items-center gap-2">
                 <span>📝</span> {t.transcript}
             </h3>
             {transcripts.length > 0 && (
                 <button 
                    onClick={() => setTranscripts([])}
                    className="text-xs text-red-500 hover:text-red-700 font-medium"
                 >
                     {t.clear}
                 </button>
             )}
         </div>
         
         <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50/50">
             {transcripts.length === 0 ? (
                 <div className="h-full flex flex-col items-center justify-center text-slate-400 opacity-60">
                     <span className="text-4xl mb-2">💬</span>
                     <p className="text-sm">Conversation will appear here...</p>
                 </div>
             ) : (
                 transcripts.map((item, idx) => (
                     <div key={idx} className={`flex ${item.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                         <div className={`max-w-[80%] rounded-2xl p-3 shadow-sm ${
                             item.role === 'user' 
                             ? 'bg-indigo-600 text-white rounded-br-none' 
                             : 'bg-white border border-slate-200 text-slate-800 rounded-bl-none'
                         }`}>
                             <p className="text-xs font-bold opacity-70 mb-1 uppercase tracking-wider">
                                 {item.role === 'user' ? t.you : t.assistant}
                             </p>
                             <p className="leading-relaxed">{item.text}</p>
                         </div>
                     </div>
                 ))
             )}
         </div>
      </div>

    </div>
  );
};

export default LiveAssistant;
