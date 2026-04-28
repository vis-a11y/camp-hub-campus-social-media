import React, { useState } from 'react';
import { MessageSquare, Send, Search, MoreVertical, ShieldCheck, Zap } from 'lucide-react';

const ChatSystem = () => {
  return (
    <div className="animate-fade-in h-[calc(100vh-160px)] flex gap-8">
      {/* CONTACTS */}
      <div className="w-[380px] hidden xl:flex flex-col gap-6">
         <div className="premium-card flex-1 p-8 flex flex-col gap-8 bg-indigo-500/5 border-indigo-500/10">
            <div className="space-y-2">
               <h2 className="text-3xl font-black text-slate-900 dark:text-white uppercase tracking-tighter leading-none">Signal <br /><span className="accent-gradient-text">Channels</span></h2>
               <p className="text-xs font-black text-slate-400 uppercase tracking-widest pt-2">Encrypted Peer-to-Peer</p>
            </div>

            <div className="relative group">
               <Search size={18} className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-all" />
               <input className="premium-input pl-14 py-3.5 bg-white/50 dark:bg-black/20" placeholder="Search Channels..." />
            </div>

            <div className="flex-1 overflow-y-auto pr-2 space-y-4 no-scrollbar">
               {[1, 2, 3, 4, 5].map(i => (
                 <div key={i} className="flex items-center gap-4 p-4 rounded-2xl hover:bg-white dark:hover:bg-white/5 cursor-pointer transition-all border border-transparent hover:border-slate-100 dark:hover:border-white/5 group">
                    <div className="w-12 h-12 rounded-2xl bg-slate-200 overflow-hidden shrink-0 border-2 border-transparent group-hover:border-indigo-500 transition-all">
                       <img src={`https://i.pravatar.cc/100?u=chat${i}`} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                       <h4 className="font-black text-slate-900 dark:text-white uppercase tracking-tighter truncate">User Node_0{i}</h4>
                       <p className="text-xs text-slate-400 font-bold truncate">Last signal received 2m ago</p>
                    </div>
                    <div className="w-2 h-2 rounded-full bg-indigo-500 shadow-[0_0_8px_#6366f1]"></div>
                 </div>
               ))}
            </div>
         </div>
      </div>

      {/* CHAT AREA */}
      <div className="flex-1 premium-card flex flex-col overflow-hidden relative border-none bg-slate-50 dark:bg-[#0f172a]/40">
         {/* CHAT HEADER */}
         <div className="p-8 border-b border-slate-200 dark:border-white/5 flex items-center justify-between bg-white/80 dark:bg-black/20 backdrop-blur-3xl">
            <div className="flex items-center gap-4">
               <div className="w-12 h-12 rounded-2xl bg-indigo-500 flex items-center justify-center text-white shadow-xl shadow-indigo-500/20">
                  <Zap size={24} fill="white" />
               </div>
               <div>
                  <h3 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tighter">Secure Signal Link</h3>
                  <p className="text-[10px] font-black text-emerald-500 uppercase tracking-widest flex items-center gap-2">
                    <ShieldCheck size={12} /> Identity Verified
                  </p>
               </div>
            </div>
            <button className="p-3 text-slate-400 hover:text-indigo-500 transition-all"><MoreVertical size={24} /></button>
         </div>

         {/* MESSAGES */}
         <div className="flex-1 p-10 overflow-y-auto space-y-8 no-scrollbar">
            <div className="flex justify-center mb-8">
               <span className="px-6 py-2 bg-slate-200/50 dark:bg-white/5 rounded-full text-[10px] font-black text-slate-400 uppercase tracking-widest">Operation Started: Today</span>
            </div>
            
            <div className="flex flex-col gap-6">
               <div className="flex gap-4 max-w-[80%]">
                  <div className="w-10 h-10 rounded-xl bg-indigo-500/10 flex items-center justify-center text-indigo-500 font-black shrink-0">U</div>
                  <div className="p-6 bg-white dark:bg-white/5 rounded-3xl rounded-tl-none border border-slate-100 dark:border-white/5 shadow-sm">
                     <p className="text-sm font-medium leading-relaxed dark:text-slate-300">Synchronizing project parameters for the upcoming sprint. Are we aligned on the UI reconstruction?</p>
                  </div>
               </div>

               <div className="flex gap-4 max-w-[80%] ml-auto flex-row-reverse">
                  <div className="w-10 h-10 rounded-xl bg-indigo-500 flex items-center justify-center text-white font-black shrink-0">ME</div>
                  <div className="p-6 accent-gradient-bg text-white rounded-3xl rounded-tr-none shadow-xl shadow-indigo-500/20">
                     <p className="text-sm font-black leading-relaxed">Signal received. Reconstruction is 100% complete. Ready for dispatch.</p>
                  </div>
               </div>
            </div>
         </div>

         {/* INPUT */}
         <div className="p-8 bg-white/80 dark:bg-black/20 backdrop-blur-3xl border-t border-slate-200 dark:border-white/5">
            <div className="flex gap-4">
               <input className="premium-input bg-slate-100/50 dark:bg-white/5" placeholder="Enter signal text..." />
               <button className="w-16 h-16 flex items-center justify-center accent-gradient-bg text-white rounded-2xl shadow-xl shadow-indigo-500/20 active:scale-95 transition-all">
                  <Send size={24} strokeWidth={3} />
               </button>
            </div>
         </div>
      </div>
    </div>
  );
};

export default ChatSystem;
