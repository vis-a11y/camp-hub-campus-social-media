import React from 'react';
import { useTheme } from '../../context/ThemeContext';
import { Sun, Moon, Zap, Activity, Terminal } from 'lucide-react';

const ThemeToggle = () => {
  const { theme, toggleTheme, isDark } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="w-full flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-900/50 hover:bg-sky-500 hover:text-white rounded-[1.5rem] border-2 border-transparent transition-all group relative overflow-hidden shadow-sm"
    >
      <div className="absolute inset-0 bg-gradient-to-tr from-sky-500/10 to-transparent group-hover:from-white/20"></div>
      
      <div className="flex items-center gap-4 relative z-10 transition-transform group-active:scale-95">
         <div className={`p-2 rounded-xl border shadow-xl transition-all ${isDark ? 'bg-black text-sky-500 border-white/10' : 'bg-white text-amber-500 border-slate-100'}`}>
            {isDark ? <Moon size={18} fill="currentColor" /> : <Sun size={18} fill="currentColor" />}
         </div>
         <span className="text-[10px] font-black uppercase tracking-[0.3em] italic">
            {isDark ? 'Dark Sync' : 'Light Sync'}
         </span>
      </div>
      
      <div className="flex items-center gap-2 relative z-10 opacity-30 group-hover:opacity-100 transition-opacity">
         <Terminal size={12} className="text-sky-500" />
      </div>

      <div className={`absolute -right-2 -bottom-2 opacity-5 scale-150 rotate-12 transition-transform duration-1000 group-hover:scale-100 group-hover:rotate-0 ${isDark ? 'text-sky-500' : 'text-amber-500'}`}>
         {isDark ? <Activity size={80} /> : <Zap size={80} />}
      </div>
    </button>
  );
};

export default ThemeToggle;
