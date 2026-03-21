import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  Home, Search, PlusSquare, Heart, User, 
  Bell, MessageSquare, Compass, Rocket, Zap, Activity
} from 'lucide-react';

const BottomNav = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();

  const menuItems = [
    { icon: Home,          path: '/dashboard' },
    { icon: Search,        path: '/explore' },
    { icon: Zap,           path: '/projects' },
    { icon: Bell,          path: '/notifications' },
    { icon: User,          path: '/profile' }
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <div className="lg:hidden fixed bottom-10 left-8 right-8 h-20 glass-morphism rounded-[2.5rem] flex items-center justify-around px-4 z-50 shadow-3xl animate-slide-up border border-white/20 dark:border-white/5">
      <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500/5 to-transparent rounded-[2.5rem] pointer-events-none"></div>
      
      {menuItems.map((item, i) => (
        <button
          key={i}
          onClick={() => navigate(item.path)}
          className={`relative w-14 h-14 flex items-center justify-center rounded-2xl transition-all duration-300 group ${
            isActive(item.path) 
            ? 'scale-110 -translate-y-4' 
            : 'text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          {isActive(item.path) && (
             <div className="absolute inset-0 accent-gradient-bg rounded-2xl blur-lg opacity-40 animate-pulse"></div>
          )}
          
          <item.icon 
            size={24} 
            className={`relative z-10 transition-all duration-500 ${
              isActive(item.path) 
              ? 'text-white' 
              : 'stroke-[2.5]'
            }`} 
          />
          
          {isActive(item.path) && (
             <div className="absolute inset-0 accent-gradient-bg rounded-2xl shadow-xl shadow-indigo-500/30"></div>
          )}
        </button>
      ))}
      
      {/* Mobile Activity Hub PING */}
      <div className="absolute -top-1 w-1.5 h-1.5 bg-indigo-500 rounded-full left-1/2 -translate-x-1/2 animate-ping"></div>
    </div>
  );
};

export default BottomNav;
