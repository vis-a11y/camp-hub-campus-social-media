import React, { useState } from 'react';
import { Brain, FileText, Send, Sparkles, ChevronRight, CheckCircle2, Loader2, Zap, Terminal, Activity, Cpu, Wand2 } from 'lucide-react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const AIFeatures = () => {
  const { user } = useAuth();
  const [activeTool, setActiveTool] = useState('summarizer');
  const [inputText, setInputText] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleProcess = async () => {
    if (!inputText.trim()) return;
    setLoading(true);
    try {
      const endpoint = activeTool === 'summarizer' ? '/api/academic/ai/summarize' : '/api/academic/ai/solve-doubt';
      const payload = activeTool === 'summarizer' ? { text: inputText } : { doubt: inputText };
      
      const { data } = await axios.post(endpoint, payload, {
        headers: { Authorization: `Bearer ${user.token}` }
      });
      
      setResult(data.summary || data.response);
      toast.success('AI Neural Update Complete', { icon: '🧠' });
    } catch (error) {
      toast.error('AI Neural Link Failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="glass p-10 rounded-[4rem] border-4 border-white dark:border-slate-800/60 shadow-4xl relative overflow-hidden group bg-white/40 dark:bg-slate-900/40 backdrop-blur-3xl">
      {/* Background decoration */}
      <div className="absolute -top-32 -right-32 w-80 h-80 bg-sky-500/10 rounded-full blur-[120px] group-hover:bg-sky-500/20 transition-all duration-1000 animate-pulse"></div>
      <div className="absolute -bottom-32 -left-32 w-80 h-80 bg-indigo-500/10 rounded-full blur-[120px] group-hover:bg-indigo-500/20 transition-all duration-1000 animate-pulse-ring"></div>

      <div className="flex flex-col lg:flex-row gap-12 relative z-10">
        <div className="lg:w-1/3 space-y-6">
           <div className="flex items-center gap-5 mb-8">
              <div className="p-4 bg-gradient-to-br from-sky-400 to-indigo-600 rounded-[1.5rem] text-white shadow-3xl shadow-sky-500/20 animate-float rotate-3 border-2 border-white/20">
                 <Cpu size={32} strokeWidth={2.5} />
              </div>
              <div>
                 <h3 className="text-3xl font-black text-slate-900 dark:text-slate-100 italic tracking-tighter">AI Lab</h3>
                 <p className="text-[10px] font-black uppercase text-sky-500 tracking-[0.4em] mt-1 opacity-70 italic">Neural Override v4.0</p>
              </div>
           </div>

           <div className="space-y-3">
              {[
                { id: 'summarizer', label: 'Nodes Summarizer', icon: FileText, desc: 'Decrypt lecture streams' },
                { id: 'doubt-solver', label: 'Neural Doubt Solver', icon: Brain, desc: 'Initialize peer response' }
              ].map(tool => (
                <button
                  key={tool.id}
                  onClick={() => { setActiveTool(tool.id); setResult(null); }}
                  className={`w-full text-left p-6 rounded-[2rem] border-4 transition-all duration-500 group/btn relative overflow-hidden italic ${
                    activeTool === tool.id 
                    ? 'bg-slate-900 border-slate-900 text-white shadow-3xl translate-x-3' 
                    : 'bg-white/50 dark:bg-slate-800/50 border-white dark:border-slate-700/60 text-slate-600 dark:text-slate-400 hover:border-sky-500/30 hover:bg-white dark:hover:bg-slate-800 hover:translate-x-3'
                  }`}
                >
                  {activeTool === tool.id && (
                     <div className="absolute right-0 top-0 bottom-0 w-1.5 bg-sky-500 animate-pulse"></div>
                  )}
                  <div className="flex items-center justify-between mb-3">
                     <tool.icon size={24} className={activeTool === tool.id ? 'text-sky-400' : 'text-slate-400 group-hover/btn:text-sky-500'} strokeWidth={2.5} />
                     <ChevronRight size={20} className={`transition-transform duration-500 ${activeTool === tool.id ? 'rotate-90 text-sky-400' : 'text-slate-300 group-hover/btn:text-sky-500 group-hover/btn:translate-x-1'}`} />
                  </div>
                  <p className="font-black text-sm uppercase tracking-widest">{tool.label}</p>
                  <p className={`text-[9px] font-black uppercase tracking-[0.2em] mt-2 ${activeTool === tool.id ? 'text-slate-400' : 'text-slate-500'} opacity-60`}>
                    {tool.desc}
                  </p>
                </button>
              ))}
           </div>
        </div>

        <div className="flex-1 space-y-8">
           <div className="relative group/textarea">
              <div className="absolute inset-0 bg-sky-500/5 rounded-[2.5rem] blur-2xl opacity-0 group-focus-within/textarea:opacity-100 transition-opacity duration-1000"></div>
              <textarea
                className="w-full bg-white/60 dark:bg-slate-950/60 border-4 border-white dark:border-slate-800 rounded-[2.5rem] p-8 min-h-[250px] focus:border-sky-500/50 outline-none transition-all font-bold text-slate-800 dark:text-slate-200 placeholder:text-slate-300 placeholder:italic italic leading-relaxed shadow-inner relative z-10 text-[15px]"
                placeholder={activeTool === 'summarizer' ? 'Broadcast your lecture bytes here...' : 'Explain quantum entanglement protocols like I am 5...'}
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
              />
              <button 
                onClick={handleProcess}
                disabled={loading}
                className="absolute bottom-6 right-6 px-10 py-4 bg-sky-500 hover:bg-sky-600 disabled:opacity-50 text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.3em] shadow-3xl shadow-sky-500/30 flex items-center gap-3 group/send active:scale-95 transition-all italic z-20 border-2 border-white/20"
              >
                {loading ? <Loader2 size={18} className="animate-spin" /> : <><Wand2 size={20} strokeWidth={3} className="group-hover/send:rotate-12 transition-transform" /> Neural Process</>}
              </button>
           </div>

           {result && (
             <div className="animate-slide-up p-10 bg-gradient-to-br from-sky-500/10 via-white/5 to-indigo-500/10 rounded-[3.5rem] border-4 border-white dark:border-slate-800 shadow-4xl relative overflow-hidden group/result backdrop-blur-3xl">
                <div className="absolute top-8 right-8 bg-emerald-500 rounded-full p-1.5 shadow-2xl animate-bounce">
                  <CheckCircle2 className="text-white" size={24} strokeWidth={3} />
                </div>
                <h4 className="text-[10px] font-black uppercase text-sky-600 dark:text-sky-400 tracking-[0.4em] mb-6 italic flex items-center gap-2">
                   <Activity size={18} /> AI Neural Insight Result
                </h4>
                <div className="prose prose-sm dark:prose-invert max-w-none text-slate-700 dark:text-slate-300 font-bold leading-relaxed italic text-[14px]">
                   {result}
                </div>
                <div className="mt-10 flex flex-wrap gap-4">
                   <button className="text-[9px] font-black uppercase tracking-[0.2em] px-8 py-3.5 bg-white dark:bg-slate-900 rounded-2xl shadow-xl hover:shadow-2xl hover:bg-slate-50 transition-all border-2 border-slate-100 dark:border-slate-800 italic active:scale-95">Commit to Matrix</button>
                   <button className="text-[9px] font-black uppercase tracking-[0.2em] px-8 py-3.5 bg-sky-500/10 text-sky-500 rounded-2xl shadow-xl hover:bg-sky-500 hover:text-white transition-all border-2 border-sky-500/20 italic active:scale-95">Broadcast to Cluster</button>
                </div>
             </div>
           )}
        </div>
      </div>
    </div>
  );
};

export default AIFeatures;
