import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, Compass, MessageSquare, User, Layers } from 'lucide-react';

const BottomNav = () => {
  const links = [
    { icon: Home,          path: '/dashboard' },
    { icon: Compass,       label: 'explore'   , path: '/explore' },
    { icon: Layers,        path: '/study-groups' },
    { icon: MessageSquare, path: '/chats' },
    { icon: User,          path: '/profile' }
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 h-20 bg-white/80 dark:bg-[#020617]/80 backdrop-blur-3xl border-t border-slate-100 dark:border-white/5 z-50 flex items-center justify-around px-6">
      {links.map((link, idx) => (
        <NavLink
          key={idx}
          to={link.path}
          className={({ isActive }) => `
            p-3 rounded-2xl transition-all
            ${isActive 
              ? 'text-indigo-500 bg-indigo-500/10' 
              : 'text-slate-400 hover:text-slate-900 dark:hover:text-white'}
          `}
        >
          {({ isActive }) => (
            <link.icon size={26} strokeWidth={isActive ? 3 : 2} />
          )}
        </NavLink>
      ))}
    </nav>
  );
};

export default BottomNav;
