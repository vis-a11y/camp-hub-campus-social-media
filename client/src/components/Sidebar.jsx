import React, { useState } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { 
  Home, Compass, MessageSquare, Calendar, Users, Activity, UserCircle, 
  Settings, LogOut, Plus, ChevronRight, Zap, Layers, Sparkles
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Sidebar = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [isHovered, setIsHovered] = useState(null);

  const menuItems = [
    { icon: Home,          label: 'Feed',          path: '/dashboard' },
    { icon: Compass,       label: 'Discovery',     path: '/explore' },
    { icon: MessageSquare, label: 'Messages',      path: '/chats' },
    { icon: Calendar,      label: 'Experiences',   path: '/events' },
    { icon: Users,         label: 'Societies',     path: '/connections' },
    { icon: Activity,      label: 'Analytics',     path: '/projects' },
    { icon: UserCircle,    label: 'Identity',      path: '/profile' },
  ];

  const isActive = (path) => {
    const base = path.split('?')[0];
    return location.pathname === base;
  };

  return (
    <div className="hidden lg:flex fixed left-0 top-0 bottom-0 w-[85px] xl:w-[280px] bg-white dark:bg-[#030711] border-r border-slate-200 dark:border-white/5 p-4 xl:p-8 flex-col z-[100] transition-all duration-500 ease-out shadow-2xl dark:shadow-none no-scrollbar">
      {/* Premium Logo Area */}
      <div className="flex items-center gap-4 mb-12 xl:px-2 group cursor-pointer" onClick={() => navigate('/dashboard')}>
        <div className="w-12 h-12 accent-gradient-bg rounded-2xl flex items-center justify-center text-white shadow-xl shadow-indigo-500/20 group-hover:scale-110 group-hover:rotate-12 transition-all duration-500">
          <Zap size={24} fill="white" strokeWidth={0} />
        </div>
        <div className="hidden xl:block">
          <h1 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tighter leading-none">
            Campus <br /><span className="accent-gradient-text">Hub</span>
          </h1>
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 space-y-2">
        <p className="hidden xl:block text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-6 ml-2 opacity-50">Main Operations</p>
        {menuItems.map((item, idx) => (
          <NavLink
            key={idx}
            to={item.path}
            onMouseEnter={() => setIsHovered(idx)}
            onMouseLeave={() => setIsHovered(null)}
            className={() => `
              group flex items-center gap-4 px-4 py-3.5 rounded-2xl transition-all duration-300 relative overflow-hidden
              ${isActive(item.path) 
                ? 'bg-indigo-500/10 dark:bg-indigo-500/5 text-indigo-600 dark:text-indigo-400' 
                : 'text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-white/5 hover:text-slate-900 dark:hover:text-white'
              }
            `}
          >
            {/* Active Indicator Line */}
            {isActive(item.path) && (
               <div className="absolute left-0 top-1/4 bottom-1/4 w-1 accent-gradient-bg rounded-r-full shadow-lg"></div>
            )}

            <div className="relative z-10">
               <item.icon size={24} className={`transition-all duration-300 ${isActive(item.path) ? 'scale-110' : 'group-hover/item:scale-110 group-hover/item:rotate-3'}`} strokeWidth={isActive(item.path) ? 2.5 : 2} />
               {item.hasNew && (
                  <div className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-rose-500 border-2 border-white dark:border-slate-950 rounded-full animate-pulse"></div>
               )}
            </div>
            
            <span className={`text-[15px] hidden xl:block z-10 uppercase tracking-widest font-bold ${isActive(item.path) ? 'opacity-100' : 'opacity-80 group-hover/item:opacity-100'}`}>
               {item.label}
            </span>

            {/* Subtle Hover Glow */}
            <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/0 to-indigo-500/0 group-hover/item:from-indigo-500/5 transition-all"></div>
          </button>
        ))}

        <div className="mt-8 pt-8 border-t border-slate-200 dark:border-white/5 px-4 hidden xl:block">
           <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.3em] mb-4">Operations</p>
           <button 
             onClick={() => navigate('/dashboard?create=true')}
             className="w-full py-4 accent-gradient-bg rounded-2xl text-white text-xs font-bold uppercase tracking-widest shadow-xl shadow-indigo-500/20 hover:scale-[1.03] active:scale-95 transition-all flex items-center justify-center gap-3"
           >
              <Plus size={18} strokeWidth={3} /> Publish Update
           </button>
        </div>
      </nav>

      {/* Profile/Identity Section */}
      <div className="relative mt-auto">
        {showMore && (
           <div className="absolute bottom-full left-0 w-full mb-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-3xl shadow-3xl overflow-hidden animate-fade-in z-[110] backdrop-blur-xl">
              <div className="p-3 space-y-1">
                 {[
                   { icon: Settings, label: 'Control Center', path: '/settings' },
                   { icon: Bookmark, label: 'Archived Files', path: '/profile' }
                 ].map(i => (
                   <button key={i.label} className="w-full flex items-center justify-between p-4 text-[13px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 hover:text-indigo-500 hover:bg-slate-50 dark:hover:bg-white/5 rounded-2xl transition-all">
                      <div className="flex items-center gap-4">
                         <i.icon size={18} /> {i.label}
                      </div>
                      <ChevronRight size={14} />
                   </button>
                 ))}
                 <div className="h-[1px] bg-slate-100 dark:bg-white/5 my-3 mx-2"></div>
                 <ThemeToggle className="hover:bg-slate-50 dark:hover:bg-white/5 rounded-2xl" />
                 <div className="h-[1px] bg-slate-100 dark:bg-white/5 my-3 mx-2"></div>
                 <button onClick={logout} className="w-full flex items-center gap-4 p-4 text-[13px] text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-500/10 rounded-2xl transition-all font-bold uppercase tracking-wider">
                    <LogOut size={18} /> Terminate Session
                 </button>
              </div>
           </div>
        )}

        <button 
          onClick={() => user ? setShowMore(!showMore) : navigate('/login')}
          className={`w-full flex items-center gap-4 p-4 rounded-2xl transition-all duration-300 ${showMore ? 'bg-slate-100 dark:bg-white/5 shadow-inner' : 'hover:bg-slate-50 dark:hover:bg-white/5'}`}
        >
          <div className="w-10 h-10 rounded-xl overflow-hidden shadow-lg border-2 border-transparent group-hover:border-indigo-500/50 transition-all shrink-0">
             {user?.profilePic ? (
               <img 
                 src={getMediaUrl(user.profilePic)} 
                 className="w-full h-full object-cover" 
                 onError={(e) => { e.target.src = `https://ui-avatars.com/api/?name=${user.firstName}+${user.lastName}&background=6366f1&color=fff&bold=true`; }}
               />
             ) : (
               <div className="w-full h-full bg-slate-100 dark:bg-white/5 flex items-center justify-center text-indigo-500 font-bold">
                 {user ? user.firstName?.[0] : '?'}
               </div>
             )}
          </div>
          <div className="hidden xl:flex flex-col items-start overflow-hidden">
             <span className="text-[14px] font-bold text-slate-900 dark:text-white truncate w-full">
               {user ? `${user.firstName} ${user.lastName}` : 'Guest Node'}
             </span>
             <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
               {user?.role || 'Limited Access'}
             </span>
          </div>
          {user && <Menu size={20} className={`ml-auto hidden xl:block transition-all ${showMore ? 'rotate-90 text-indigo-500' : 'text-slate-400'}`} />}
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
