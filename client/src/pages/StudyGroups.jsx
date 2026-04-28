import React, { useState } from 'react';
import { Layers, Plus, Search, Users, MessageSquare, ArrowRight, Zap, Star } from 'lucide-react';

const StudyGroups = () => {
  return (
    <div className="animate-fade-in space-y-12">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-2">
           <h1 className="text-5xl font-black text-slate-900 dark:text-white tracking-tighter uppercase">
             Campus <span className="accent-gradient-text italic">Experiences</span>
           </h1>
           <p className="text-slate-500 font-medium text-lg">Initialize collaborative study nodes...</p>
        </div>
        <button className="premium-button flex items-center gap-3">
          <Plus size={20} strokeWidth={3} />
          <span>New Experience</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
         {[
           { name: 'Quantum Physics Beta', members: 12, category: 'Science', active: true },
           { name: 'Advanced UI/UX Sync', members: 45, category: 'Design', active: true },
           { name: 'Web3 Architecture', members: 8, category: 'Engineering', active: false }
         ].map((group, idx) => (
           <div key={idx} className="premium-card p-8 flex flex-col gap-6 group hover:border-indigo-500/30 transition-all cursor-pointer">
              <div className="flex items-center justify-between">
                 <div className="w-14 h-14 accent-gradient-bg rounded-2xl flex items-center justify-center text-white shadow-xl">
                    <Layers size={28} />
                 </div>
                 <div className={`px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${group.active ? 'bg-emerald-500/10 text-emerald-500' : 'bg-slate-100 text-slate-400'}`}>
                    {group.active ? 'Active Node' : 'Standby'}
                 </div>
              </div>
              
              <div className="space-y-1">
                 <h3 className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tighter">{group.name}</h3>
                 <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">{group.category} • {group.members} Members</p>
              </div>

              <div className="flex items-center justify-between pt-6 border-t border-slate-100 dark:border-white/5">
                 <div className="flex -space-x-3">
                    {[1, 2, 3, 4].map(i => (
                      <div key={i} className="w-10 h-10 rounded-full border-4 border-white dark:border-slate-900 bg-slate-200 overflow-hidden">
                         <img src={`https://i.pravatar.cc/100?u=${idx}${i}`} className="w-full h-full object-cover" />
                      </div>
                    ))}
                 </div>
                 <button className="flex items-center gap-2 text-indigo-500 font-black text-xs uppercase tracking-widest group-hover:gap-4 transition-all">
                    Initiate Sync <ArrowRight size={16} />
                 </button>
              </div>
           </div>
         ))}
      </div>
    </div>
  );
};

export default StudyGroups;
