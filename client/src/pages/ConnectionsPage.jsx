import React from 'react';
import { Users, Search, Plus, Zap, MessageCircle, MoreHorizontal, UserPlus } from 'lucide-react';

const ConnectionsPage = () => {
  return (
    <div className="animate-fade-in space-y-12 pb-20">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-2">
           <h1 className="text-5xl font-black text-slate-900 dark:text-white tracking-tighter uppercase">
             Peer <span className="accent-gradient-text italic">Network</span>
           </h1>
           <p className="text-slate-500 font-medium text-lg">Managing your campus node connections...</p>
        </div>
        <div className="relative group w-full md:w-[350px]">
           <Search size={20} className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-all" />
           <input className="premium-input pl-14 py-3.5" placeholder="Search Peers..." />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
         {[1, 2, 3, 4, 5, 6].map(i => (
           <div key={i} className="premium-card p-8 flex flex-col items-center text-center group hover:border-indigo-500/30 transition-all">
              <div className="w-24 h-24 rounded-[32px] campus-story-ring p-1 mb-6">
                 <div className="w-full h-full rounded-[28px] bg-white dark:bg-slate-900 overflow-hidden">
                    <img src={`https://i.pravatar.cc/150?u=peer${i}`} className="w-full h-full object-cover" />
                 </div>
              </div>
              
              <div className="space-y-1 mb-8">
                 <h3 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tighter">Student_Node_0{i}</h3>
                 <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic">Connected via Computer Science</p>
              </div>

              <div className="flex gap-4 w-full">
                 <button className="premium-button flex-1 py-3 text-xs flex items-center justify-center gap-2">
                    <MessageCircle size={16} /> Signal
                 </button>
                 <button className="p-3 bg-slate-100 dark:bg-white/5 border border-slate-100 dark:border-white/5 rounded-2xl text-slate-400 hover:text-indigo-500 transition-all">
                    <UserPlus size={20} />
                 </button>
              </div>
           </div>
         ))}
      </div>
    </div>
  );
};

export default ConnectionsPage;
