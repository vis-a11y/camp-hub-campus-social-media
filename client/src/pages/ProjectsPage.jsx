import React from 'react';
import { Layers, Plus, ExternalLink, Github, Star, Zap, Layout, Code2 } from 'lucide-react';

const ProjectsPage = () => {
  return (
    <div className="animate-fade-in space-y-12 pb-20">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-2">
           <h1 className="text-5xl font-black text-slate-900 dark:text-white tracking-tighter uppercase">
             Venture <span className="accent-gradient-text italic">Matrix</span>
           </h1>
           <p className="text-slate-500 font-medium text-lg">Collaborating on campus-wide technical ventures...</p>
        </div>
        <button className="premium-button flex items-center gap-3">
          <Plus size={20} strokeWidth={3} />
          <span>New Venture</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
         {[
           { title: 'Hub OS Redesign', desc: 'Complete reconstruction of the campus interface using React 19.', stars: 124, tech: 'React / Tailwind' },
           { title: 'Eco-Sync Bot', desc: 'IoT integration for monitoring campus energy signals.', stars: 42, tech: 'Python / MQTT' }
         ].map((project, idx) => (
           <div key={idx} className="premium-card p-10 flex flex-col gap-8 group hover:border-indigo-500/30 transition-all cursor-pointer">
              <div className="flex items-center justify-between">
                 <div className="w-16 h-16 accent-gradient-bg rounded-[22px] flex items-center justify-center text-white shadow-2xl">
                    <Code2 size={32} />
                 </div>
                 <div className="flex gap-4">
                    <button className="p-3 bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/5 rounded-2xl text-slate-400 hover:text-indigo-500 transition-all"><Github size={20} /></button>
                    <button className="p-3 bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/5 rounded-2xl text-slate-400 hover:text-indigo-500 transition-all"><ExternalLink size={20} /></button>
                 </div>
              </div>
              
              <div className="space-y-3">
                 <h3 className="text-3xl font-black text-slate-900 dark:text-white uppercase tracking-tighter leading-tight">{project.title}</h3>
                 <p className="text-slate-500 font-medium leading-relaxed">{project.desc}</p>
              </div>

              <div className="flex items-center justify-between pt-8 border-t border-slate-100 dark:border-white/5">
                 <div className="flex items-center gap-4">
                    <span className="text-[10px] font-black text-indigo-500 uppercase tracking-widest bg-indigo-500/5 px-4 py-1.5 rounded-full border border-indigo-500/10">{project.tech}</span>
                 </div>
                 <div className="flex items-center gap-2 text-amber-500 font-black">
                    <Star size={18} fill="currentColor" />
                    <span>{project.stars}</span>
                 </div>
              </div>
           </div>
         ))}
      </div>
    </div>
  );
};

export default ProjectsPage;
