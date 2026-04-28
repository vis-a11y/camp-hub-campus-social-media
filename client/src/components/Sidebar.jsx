import React, { useState } from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  Home, Compass, MessageSquare, Users, Bell, 
  Heart, User, LogOut, Settings, PlusSquare, 
  Zap, Calendar, BookOpen, Layers, BarChart3
} from 'lucide-react';

const Sidebar = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [isHovered, setIsHovered] = useState(null);

  // AUTH GUARD: Component should not even be mounted if no user
  if (!user) return null;

  const menuItems = [
    { icon: Home,          label: 'Feed',          path: '/dashboard' },
    { icon: Compass,       label: 'Discovery',     path: '/explore' },
    { icon: MessageSquare, label: 'Messages',      path: '/chats' },
    { icon: Layers,        label: 'Experiences',   path: '/study-groups' },
    { icon: Users,         label: 'Societies',     path: '/connections' },
    { icon: BarChart3,     label: 'Analytics',     path: '/notifications' },
    { icon: User,          label: 'Identity',      path: '/profile' }
  ];

  return (
    <aside className="fixed left-0 top-0 h-screen w-[85px] xl:w-[280px] bg-white/80 dark:bg-[#020617]/80 backdrop-blur-3xl border-r border-slate-100 dark:border-white/5 z-50 transition-all duration-500 flex flex-col hidden lg:flex">
      
      {/* BRANDING */}
      <div className="flex items-center gap-3 p-8 mb-4">
        <div className="w-12 h-12 accent-gradient-bg rounded-[18px] flex items-center justify-center text-white shadow-xl shadow-indigo-500/20 rotate-3 group hover:rotate-0 transition-all">
          <Zap size={24} fill="white" strokeWidth={0} />
        </div>
        <div className="flex flex-col hidden xl:flex">
          <span className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tighter leading-none">Campus</span>
          <span className="text-xl font-black accent-gradient-text uppercase tracking-tighter leading-none italic">Hub</span>
        </div>
      </div>

      {/* NAVIGATION */}
      <nav className="flex-1 px-4 space-y-2 mt-4">
        {menuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            onMouseEnter={() => setIsHovered(item.label)}
            onMouseLeave={() => setIsHovered(null)}
            className={({ isActive }) => `
              flex items-center gap-4 px-5 py-4 rounded-2xl transition-all relative group
              ${isActive 
                ? 'bg-indigo-500/10 text-indigo-500' 
                : 'text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-white/5'}
            `}
          >
            {({ isActive }) => (
              <>
                <item.icon size={24} strokeWidth={isActive ? 2.5 : 2} />
                <span className={`text-[15px] font-bold uppercase tracking-widest hidden xl:block ${isHovered === item.label ? 'translate-x-1' : ''} transition-transform`}>
                  {item.label}
                </span>
                
                {/* Active Indicator */}
                <div className={`absolute left-0 w-1 h-8 bg-indigo-500 rounded-r-full transition-all duration-300 ${isActive ? 'opacity-100 scale-100' : 'opacity-0 scale-0'}`} />
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* USER FOOTER */}
      <div className="p-6 mt-auto border-t border-slate-100 dark:border-white/5 bg-slate-50/30 dark:bg-black/20">
        <div className="flex items-center justify-between xl:justify-start gap-4">
           <div 
             className="w-12 h-12 rounded-2xl overflow-hidden border-2 border-indigo-500/20 cursor-pointer hover:scale-105 transition-all"
             onClick={() => navigate('/profile')}
           >
              {user.profilePic ? (
                <img src={user.profilePic} className="w-full h-full object-cover" alt="" />
              ) : (
                <div className="w-full h-full bg-indigo-500 flex items-center justify-center font-black text-white">{user.firstName?.[0]}</div>
              )}
           </div>
           
           <div className="flex-1 hidden xl:block">
              <p className="text-[13px] font-black text-slate-900 dark:text-white truncate uppercase tracking-tighter">{user.firstName} {user.lastName}</p>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{user.role}</p>
           </div>

           <button 
             onClick={logout}
             className="p-3 text-slate-400 hover:text-rose-500 hover:bg-rose-500/5 rounded-xl transition-all"
             title="Terminate Session"
           >
             <LogOut size={20} />
           </button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
