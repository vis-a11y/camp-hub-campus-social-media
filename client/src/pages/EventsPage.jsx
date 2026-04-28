import React from 'react';
import { Calendar, MapPin, Clock, Users, Plus, Zap, ArrowRight, Star } from 'lucide-react';

const EventsPage = () => {
  return (
    <div className="animate-fade-in space-y-12 pb-20">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-2">
           <h1 className="text-5xl font-black text-slate-900 dark:text-white tracking-tighter uppercase">
             Campus <span className="accent-gradient-text italic">Chronicles</span>
           </h1>
           <p className="text-slate-500 font-medium text-lg">Synchronizing upcoming campus events and workshops...</p>
        </div>
        <button className="premium-button flex items-center gap-3">
          <Plus size={20} strokeWidth={3} />
          <span>Post Event</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
         {[
           { title: 'AI Ethics Summit', date: 'Oct 24', time: '10:00 AM', location: 'Main Hall', type: 'Conference' },
           { title: 'Tech Carnival 2026', date: 'Nov 12', time: '02:00 PM', location: 'Campus Arena', type: 'Festival' },
           { title: 'Startup Pitch Deck', date: 'Oct 28', time: '04:00 PM', location: 'Innovation Lab', type: 'Workshop' }
         ].map((event, idx) => (
           <div key={idx} className="premium-card overflow-hidden group hover:border-indigo-500/30 transition-all cursor-pointer">
              <div className="h-48 bg-slate-100 dark:bg-white/5 relative overflow-hidden">
                 <img src={`https://images.unsplash.com/photo-1540575861501-7cf05a4b125a?auto=format&fit=crop&q=80&w=1000&u=${idx}`} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000" />
                 <div className="absolute top-4 right-4 bg-white/90 dark:bg-black/60 backdrop-blur-md px-4 py-2 rounded-2xl text-center">
                    <p className="text-lg font-black text-indigo-500 leading-none">{event.date.split(' ')[1]}</p>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{event.date.split(' ')[0]}</p>
                 </div>
              </div>
              <div className="p-8 space-y-6">
                 <div className="space-y-2">
                    <span className="text-[10px] font-black text-indigo-500 uppercase tracking-widest bg-indigo-500/5 px-3 py-1 rounded-full">{event.type}</span>
                    <h3 className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tighter">{event.title}</h3>
                 </div>
                 
                 <div className="flex flex-wrap gap-6 text-sm font-bold text-slate-400 uppercase tracking-widest">
                    <div className="flex items-center gap-2"><Clock size={16} /> {event.time}</div>
                    <div className="flex items-center gap-2"><MapPin size={16} /> {event.location}</div>
                 </div>

                 <button className="w-full py-4 bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/5 rounded-2xl text-xs font-black uppercase tracking-[0.2em] group-hover:bg-indigo-500 group-hover:text-white transition-all">
                    Register Node
                 </button>
              </div>
           </div>
         ))}
      </div>
    </div>
  );
};

export default EventsPage;
