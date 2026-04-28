import React from 'react';
import { Bell, Heart, MessageSquare, UserPlus, Zap, ArrowRight, BarChart3 } from 'lucide-react';

const NotificationsPage = () => {
  return (
    <div className="animate-fade-in space-y-12 pb-20">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-2">
           <h1 className="text-5xl font-black text-slate-900 dark:text-white tracking-tighter uppercase">
             Campus <span className="accent-gradient-text italic">Analytics</span>
           </h1>
           <p className="text-slate-500 font-medium text-lg">Monitoring signal activity and notifications...</p>
        </div>
        <div className="flex gap-4">
           <div className="premium-card px-6 py-3 flex items-center gap-3 bg-indigo-500/5 border-indigo-500/10">
              <BarChart3 className="text-indigo-500" size={20} />
              <span className="text-sm font-black uppercase tracking-widest text-slate-900 dark:text-white">Active</span>
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
         {/* NOTIFICATIONS LIST */}
         <div className="lg:col-span-2 space-y-6">
            {[
              { type: 'like', user: 'Alex Node', time: '2m', text: 'interacted with your signal' },
              { type: 'comment', user: 'Sarah Sync', time: '15m', text: 'injected a comment into your thread' },
              { type: 'follow', user: 'Identity_042', time: '1h', text: 'is now connected to your node' }
            ].map((notif, idx) => (
              <div key={idx} className="premium-card p-6 flex items-center justify-between group hover:bg-slate-50 dark:hover:bg-white/5 transition-all cursor-pointer">
                 <div className="flex items-center gap-5">
                    <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 flex items-center justify-center text-indigo-500 group-hover:scale-110 transition-transform">
                       {notif.type === 'like' && <Heart size={24} fill="currentColor" />}
                       {notif.type === 'comment' && <MessageSquare size={24} fill="currentColor" />}
                       {notif.type === 'follow' && <UserPlus size={24} />}
                    </div>
                    <div>
                       <p className="text-slate-900 dark:text-white font-black uppercase tracking-tighter text-sm">
                          {notif.user} <span className="text-slate-400 normal-case font-medium lowercase italic ml-1">{notif.text}</span>
                       </p>
                       <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{notif.time} ago</p>
                    </div>
                 </div>
                 <ArrowRight size={20} className="text-slate-200 group-hover:text-indigo-500 group-hover:translate-x-2 transition-all" />
              </div>
            ))}
         </div>

         {/* SIDEBAR ANALYTICS */}
         <div className="space-y-8">
            <div className="premium-card p-8 bg-black dark:bg-white/5 text-white">
               <div className="flex items-center justify-between mb-8">
                  <h3 className="text-lg font-black uppercase tracking-tighter">Identity Score</h3>
                  <Zap size={24} className="text-amber-400" fill="currentColor" />
               </div>
               <div className="text-6xl font-black mb-2 tracking-tighter">982</div>
               <p className="text-xs font-bold text-slate-400 uppercase tracking-[0.2em]">High Frequency Activity</p>
            </div>
            
            <div className="premium-card p-8 space-y-6">
               <h3 className="text-lg font-black uppercase tracking-tighter dark:text-white">Recent Metrics</h3>
               {[
                 { label: 'Signal Reach', val: '+24%' },
                 { label: 'Peer Sync', val: '99.9%' }
               ].map(stat => (
                 <div key={stat.label} className="flex justify-between items-center">
                    <span className="text-sm font-bold text-slate-400 uppercase tracking-widest">{stat.label}</span>
                    <span className="text-indigo-500 font-black">{stat.val}</span>
                 </div>
               ))}
            </div>
         </div>
      </div>
    </div>
  );
};

export default NotificationsPage;
