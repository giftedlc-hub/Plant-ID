import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Leaf, Stethoscope, MessageSquare, Sprout, Info } from 'lucide-react';
import CameraScanner from './components/CameraScanner';
import ChatInterface from './components/ChatInterface';
import ResultCard from './components/ResultCard';
import { identifyPlant, diagnoseDisease } from './lib/gemini';

type Tab = 'identify' | 'diagnose' | 'assistant';

export default function App() {
  const [activeTab, setActiveTab] = useState<Tab>('identify');
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleCapture = async (base64Image: string) => {
    setIsProcessing(true);
    setResult(null);
    setError(null);

    try {
      let aiResponse: string;
      if (activeTab === 'identify') {
        aiResponse = await identifyPlant(base64Image);
      } else {
        aiResponse = await diagnoseDisease(base64Image);
      }
      setResult(aiResponse);
    } catch (err) {
      console.error("AI processing error:", err);
      setError("Something went wrong. Please try again with a clearer photo.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleReset = () => {
    setResult(null);
    setError(null);
    setIsProcessing(false);
  };

  return (
    <div className="min-h-screen bg-[#F5F5F0] text-emerald-950 font-sans selection:bg-emerald-200">
      {/* Header */}
      <header className="bg-white border-b border-emerald-100 sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-emerald-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-emerald-200">
              <Sprout size={24} />
            </div>
            <h1 className="text-2xl font-black tracking-tight text-emerald-900">FloraCare AI</h1>
          </div>
          <div className="hidden sm:flex items-center gap-6">
            <button
              onClick={() => setActiveTab('identify')}
              className={`flex items-center gap-2 font-semibold transition-colors ${activeTab === 'identify' ? 'text-emerald-600' : 'text-emerald-400 hover:text-emerald-600'}`}
            >
              <Leaf size={20} /> Identify
            </button>
            <button
              onClick={() => setActiveTab('diagnose')}
              className={`flex items-center gap-2 font-semibold transition-colors ${activeTab === 'diagnose' ? 'text-emerald-600' : 'text-emerald-400 hover:text-emerald-600'}`}
            >
              <Stethoscope size={20} /> Diagnose
            </button>
            <button
              onClick={() => setActiveTab('assistant')}
              className={`flex items-center gap-2 font-semibold transition-colors ${activeTab === 'assistant' ? 'text-emerald-600' : 'text-emerald-400 hover:text-emerald-600'}`}
            >
              <MessageSquare size={20} /> Assistant
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-8 sm:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Left Column: Hero & Info */}
          <div className="lg:col-span-5 flex flex-col justify-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-6"
            >
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-xs font-bold uppercase tracking-wider">
                <Info size={14} /> AI-Powered Plant Care
              </div>
              <h2 className="text-5xl sm:text-6xl font-black leading-[0.9] tracking-tighter text-emerald-900">
                {activeTab === 'identify' ? 'Identify Any Plant Instantly.' : activeTab === 'diagnose' ? 'Diagnose Plant Diseases.' : 'Your Personal Plant Expert.'}
              </h2>
              <p className="text-lg text-emerald-700 max-w-md leading-relaxed">
                {activeTab === 'identify' 
                  ? 'Take a photo of any plant to discover its species, scientific name, and detailed care instructions.' 
                  : activeTab === 'diagnose' 
                  ? 'Is your plant wilting or spotted? Our AI analyzes health issues and provides expert treatment plans.' 
                  : 'Chat with our AI botanist for personalized advice on watering, sunlight, and keeping your greenery thriving.'}
              </p>
              
              <div className="flex flex-wrap gap-4 pt-4">
                <div className="flex items-center gap-2 text-sm font-medium text-emerald-800 bg-white px-4 py-2 rounded-full shadow-sm border border-emerald-50">
                  <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" /> 98% Accuracy
                </div>
                <div className="flex items-center gap-2 text-sm font-medium text-emerald-800 bg-white px-4 py-2 rounded-full shadow-sm border border-emerald-50">
                  <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" /> Real-time Analysis
                </div>
              </div>
            </motion.div>
          </div>

          {/* Right Column: Interactive Area */}
          <div className="lg:col-span-7">
            <AnimatePresence mode="wait">
              {activeTab === 'assistant' ? (
                <motion.div
                  key="assistant"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                >
                  <ChatInterface />
                </motion.div>
              ) : (
                <motion.div
                  key="scanner"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="space-y-6"
                >
                  <CameraScanner 
                    onCapture={handleCapture} 
                    onReset={handleReset} 
                    isProcessing={isProcessing} 
                  />
                  
                  {error && (
                    <div className="p-4 bg-red-50 border border-red-100 text-red-700 rounded-2xl text-sm font-medium flex items-center gap-2">
                      <AlertTriangle size={18} /> {error}
                    </div>
                  )}

                  {result && (
                    <ResultCard 
                      type={activeTab === 'identify' ? 'identify' : 'diagnose'} 
                      content={result} 
                      onClose={handleReset} 
                    />
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </main>

      {/* Mobile Navigation */}
      <nav className="sm:hidden fixed bottom-6 left-6 right-6 bg-white/80 backdrop-blur-xl border border-emerald-100 rounded-full shadow-2xl p-2 flex items-center justify-between z-50">
        <button
          onClick={() => setActiveTab('identify')}
          className={`flex-1 flex flex-col items-center gap-1 py-2 rounded-full transition-all ${activeTab === 'identify' ? 'bg-emerald-600 text-white shadow-lg' : 'text-emerald-400'}`}
        >
          <Leaf size={20} />
          <span className="text-[10px] font-bold uppercase tracking-widest">Identify</span>
        </button>
        <button
          onClick={() => setActiveTab('diagnose')}
          className={`flex-1 flex flex-col items-center gap-1 py-2 rounded-full transition-all ${activeTab === 'diagnose' ? 'bg-emerald-600 text-white shadow-lg' : 'text-emerald-400'}`}
        >
          <Stethoscope size={20} />
          <span className="text-[10px] font-bold uppercase tracking-widest">Diagnose</span>
        </button>
        <button
          onClick={() => setActiveTab('assistant')}
          className={`flex-1 flex flex-col items-center gap-1 py-2 rounded-full transition-all ${activeTab === 'assistant' ? 'bg-emerald-600 text-white shadow-lg' : 'text-emerald-400'}`}
        >
          <MessageSquare size={20} />
          <span className="text-[10px] font-bold uppercase tracking-widest">Expert</span>
        </button>
      </nav>

      {/* Footer */}
      <footer className="max-w-5xl mx-auto px-6 py-12 text-center text-emerald-400 text-sm font-medium border-t border-emerald-100 mt-12">
        <p>&copy; 2026 FloraCare AI. Powered by Google Gemini.</p>
      </footer>
    </div>
  );
}

function AlertTriangle({ size }: { size: number }) {
  return <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><path d="M12 9v4"/><path d="M12 17h.01"/></svg>;
}
