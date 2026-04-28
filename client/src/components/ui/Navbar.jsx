import React from 'react';
import { Zap, Search, Bell } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Navbar = () => {
  const navigate = useNavigate();

  return (
    <div className="w-full px-6 py-5 flex items-center justify-between">
      <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate('/dashboard')}>
        <div className="w-10 h-10 accent-gradient-bg rounded-xl flex items-center justify-center text-white shadow-lg">
          <Zap size={22} fill="white" strokeWidth={0} />
        </div>
        <div className="flex flex-col">
          <span className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tighter leading-none">Hub</span>
        </div>
      </div>

      <div className="flex items-center gap-4">
         <button className="p-3 bg-slate-100 dark:bg-white/5 rounded-xl border border-slate-200 dark:border-white/10" onClick={() => navigate('/notifications')}>
            <Bell size={22} className="text-slate-600 dark:text-slate-400" />
         </button>
      </div>
    </div>
  );
};

export default Navbar;
