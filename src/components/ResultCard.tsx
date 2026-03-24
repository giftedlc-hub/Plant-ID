import React from 'react';
import { motion } from 'motion/react';
import Markdown from 'react-markdown';
import { Leaf, AlertTriangle, CheckCircle } from 'lucide-react';

interface ResultCardProps {
  type: 'identify' | 'diagnose';
  content: string;
  onClose: () => void;
}

export default function ResultCard({ type, content, onClose }: ResultCardProps) {
  const isHealthy = content.toLowerCase().includes('healthy') || content.toLowerCase().includes('no disease');

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      className="w-full max-w-md mx-auto bg-white rounded-3xl shadow-2xl overflow-hidden border border-emerald-100 mt-6"
    >
      <div className={`p-4 flex items-center gap-3 text-white ${type === 'identify' ? 'bg-emerald-600' : isHealthy ? 'bg-emerald-500' : 'bg-amber-500'}`}>
        <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
          {type === 'identify' ? <Leaf size={24} /> : isHealthy ? <CheckCircle size={24} /> : <AlertTriangle size={24} />}
        </div>
        <div>
          <h3 className="font-bold text-lg">{type === 'identify' ? 'Plant Identified' : 'Health Diagnosis'}</h3>
          <p className="text-xs opacity-80">{type === 'identify' ? 'Species & Care Tips' : 'Condition & Treatment'}</p>
        </div>
      </div>

      <div className="p-6 overflow-y-auto max-h-[400px]">
        <div className="markdown-body prose prose-emerald prose-sm max-w-none">
          <Markdown>{content}</Markdown>
        </div>
      </div>

      <div className="p-4 bg-emerald-50 border-t border-emerald-100 flex justify-end">
        <button
          onClick={onClose}
          className="px-6 py-2 bg-emerald-600 text-white rounded-full font-medium hover:bg-emerald-700 transition-colors shadow-sm"
        >
          Got it!
        </button>
      </div>
    </motion.div>
  );
}
