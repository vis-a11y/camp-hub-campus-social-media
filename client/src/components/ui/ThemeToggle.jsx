import React from 'react';
import { Sun, Moon, Zap } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <button 
      onClick={toggleTheme}
      className="p-3 bg-white dark:bg-white/5 border border-slate-100 dark:border-white/10 rounded-2xl shadow-xl hover:scale-110 active:scale-95 transition-all group"
      title="Toggle Core Phase"
    >
      <div className="relative w-6 h-6">
        <Sun 
          className={`absolute inset-0 text-amber-500 transition-all duration-500 ${theme === 'dark' ? 'opacity-0 rotate-90 scale-0' : 'opacity-100 rotate-0 scale-100'}`} 
          size={24} 
        />
        <Moon 
          className={`absolute inset-0 text-indigo-400 transition-all duration-500 ${theme === 'light' ? 'opacity-0 -rotate-90 scale-0' : 'opacity-100 rotate-0 scale-100'}`} 
          size={24} 
        />
      </div>
    </button>
  );
};

export default ThemeToggle;
