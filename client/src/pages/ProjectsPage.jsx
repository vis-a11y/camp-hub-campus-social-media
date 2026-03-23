import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { 
  Rocket, Code, Users, Search, Plus, MoreHorizontal, Github, 
  Globe, Terminal, Activity, Zap, ShieldCheck, ChevronRight, LayoutGrid, Info
} from 'lucide-react';
import toast from 'react-hot-toast';

const ProjectsPage = () => {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');

  const projects = [

    {
      id: 2,
      name: 'Solar Grid Sync',
      description: 'Monitoring and optimizing the SSJ campus solar grid using IoT sensors and real-time dashboarding.',
      lead: 'rohan_gupta',
      team: 8,
      tags: ['IoT', 'Dashboard', 'Sensors', 'ESP32'],
      status: 'In Development',
      image: 'https://images.unsplash.com/photo-1542831371-29b0f74f9713?w=800'
    },
    {
      id: 3,
      name: 'DecenTrust - P2P Verify',
      description: 'Blockchain-based P2P document verification for college certifications and records.',
      lead: 'it_dept_official',
      team: 4,
      tags: ['Solidity', 'Web3', 'Blockchain', 'Security'],
      status: 'Research',
      image: 'https://images.unsplash.com/photo-1517649763962-0c623066013b?w=800'
    }
  ];

  const handleJoin = (projectName) => {
    toast.success(`Collaboration Request Sent to ${projectName}`, {
        icon: '🚀',
        style: { borderRadius: '20px', background: '#0ea5e9', color: '#fff', fontSize: '11px', fontWeight: '900' }
    });
  };

  return (
    <div className="max-w-[935px] mx-auto px-4 py-12 animate-fade-in pb-32">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-8 mb-16">
         <div className="flex flex-col">
            <h2 className="text-4xl font-black text-slate-900 dark:text-white tracking-tighter italic uppercase leading-none">STUDENT <span className="text-sky-500">PROJECTS</span></h2>
            <p className="text-[10px] text-slate-400 font-black uppercase tracking-[0.5em] mt-3 italic flex items-center gap-2">
               <Rocket size={14} className="text-sky-500" /> MISSION HUB v9.3
            </p>
         </div>
         <button 
           className="flex items-center gap-3 bg-slate-900 dark:bg-white text-white dark:text-black px-10 py-4 rounded-[1.5rem] text-[10px] font-black uppercase tracking-widest shadow-4xl hover:scale-110 active:scale-95 transition-all italic border border-white/5"
           onClick={() => toast.error('Creation Module Temporarily Locked')}
         >
            <Plus size={24} strokeWidth={3} /> INITIALIZE PROJECT
         </button>
      </div>

      {/* Categories & Search */}
      <div className="flex flex-col md:flex-row gap-10 mb-16">
          <div className="flex-1 relative group">
             <Search size={22} className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-sky-500 transition-colors" />
             <input 
               value={searchQuery}
               onChange={e => setSearchQuery(e.target.value)}
               className="w-full bg-slate-50 dark:bg-slate-900 border-2 border-transparent focus:border-sky-500 rounded-[2rem] pl-16 pr-8 py-6 text-sm font-black outline-none transition-all uppercase tracking-widest italic shadow-inner" 
               placeholder="Scan mission nodes..." 
             />
          </div>
          <div className="flex gap-4 overflow-x-auto no-scrollbar pb-2">
             {['All', 'IoT', 'Web3', 'Mobile'].map(cat => (
               <button 
                 key={cat}
                 onClick={() => setActiveCategory(cat.toLowerCase())}
                 className={`px-8 py-4 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] italic border-2 transition-all ${activeCategory === cat.toLowerCase() ? 'bg-sky-500 text-white border-sky-500 shadow-xl shadow-sky-500/20' : 'bg-white dark:bg-black border-slate-100 dark:border-slate-800 text-slate-400 hover:text-slate-900 dark:hover:text-white'}`}
               >
                 {cat}
               </button>
             ))}
          </div>
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
         {projects.map(project => (
            <div key={project.id} className="bg-white dark:bg-black border border-slate-100 dark:border-slate-900 rounded-[3rem] overflow-hidden group/card hover:shadow-4xl transition-all duration-700 relative flex flex-col">
               <div className="h-72 overflow-hidden relative">
                  <img src={project.image} alt="" className="w-full h-full object-cover group-hover/card:scale-110 transition-transform duration-1000 shadow-inner" />
                  <div className="absolute top-8 left-8 flex gap-3">
                     <span className={`px-5 py-2 rounded-full text-[9px] font-black uppercase tracking-widest italic shadow-3xl ${project.status === 'Active' ? 'bg-emerald-500/90 text-white' : 'bg-amber-500/90 text-white'}`}>
                        {project.status}
                     </span>
                  </div>
                  <div className="absolute bottom-8 right-8 flex gap-3">
                     {[Github, Globe].map((Icon, i) => <button key={i} className="p-3 bg-white/95 dark:bg-black/95 rounded-xl hover:text-sky-500 transition-all shadow-4xl"><Icon size={18} /></button>)}
                  </div>
               </div>
               <div className="p-10 space-y-6 flex-1 flex flex-col">
                  <div className="flex flex-wrap gap-2 mb-2">
                     {project.tags.map(tag => (
                        <span key={tag} className="text-[8px] font-black uppercase tracking-[0.2em] text-sky-500 bg-sky-50 dark:bg-sky-900/10 px-3 py-1 rounded-lg border border-sky-100 dark:border-sky-800 italic">{tag}</span>
                     ))}
                  </div>
                  <h3 className="text-3xl font-black text-slate-900 dark:text-white tracking-tighter italic uppercase leading-none">{project.name}</h3>
                  <p className="text-sm font-medium text-slate-500 dark:text-slate-400 leading-relaxed italic opacity-80 mb-4 h-20 line-clamp-3">"{project.description}"</p>
                  
                  <div className="mt-auto pt-8 border-t border-slate-50 dark:border-slate-950 flex flex-col justify-between items-center sm:flex-row gap-6">
                     <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-slate-900 dark:bg-slate-800 rounded-2xl flex items-center justify-center font-black italic text-sky-500 rotate-6 shadow-2xl uppercase border border-white/5 shadow-sky-500/10">{project.lead[0]}</div>
                         <div>
                            <p className="text-[10px] font-black uppercase tracking-widest italic text-slate-400">Node Lead</p>
                            <p className="text-xs font-black uppercase tracking-tight text-slate-900 dark:text-white leading-none mt-1">{project.lead}</p>
                         </div>
                     </div>
                     <button 
                       onClick={() => handleJoin(project.name)}
                       className="bg-sky-500 text-white px-10 py-4 rounded-2xl text-[10px] font-black uppercase tracking-[0.3em] shadow-4xl shadow-sky-500/30 hover:scale-110 active:scale-95 transition-all italic border border-white/10"
                     >
                        Sync Collaboration
                     </button>
                  </div>
               </div>
            </div>
         ))}
      </div>

    </div>
  );
};

export default ProjectsPage;
