import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import axios from 'axios';
import {
  Search, Bell, MessageSquare, LogOut, Sun, Moon,
  Sparkles, Heart, UserPlus, Compass, X, Zap, User as UserIcon
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import toast from 'react-hot-toast';

const Navbar = () => {
  const { user, logout } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [showNotifs, setShowNotifs] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState(null);
  const [searchLoading, setSearchLoading] = useState(false);
  const notifRef = useRef(null);
  const searchRef = useRef(null);
  const searchTimer = useRef(null);

  useEffect(() => {
    fetchUnreadCount();
    const interval = setInterval(fetchUnreadCount, 30000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleClick = (e) => {
      if (notifRef.current && !notifRef.current.contains(e.target)) setShowNotifs(false);
      if (searchRef.current && !searchRef.current.contains(e.target)) setSearchResults(null);
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const fetchUnreadCount = async () => {
    try {
      const { data } = await axios.get('/api/academic/notifications/unread-count');
      setUnreadCount(data.count);
    } catch {}
  };

  const fetchNotifications = async () => {
    try {
      const { data } = await axios.get('/api/academic/notifications');
      setNotifications(data.slice(0, 8));
    } catch {}
  };

  const handleBellClick = () => {
    if (!showNotifs) fetchNotifications();
    setShowNotifs(v => !v);
  };

  const markAllRead = async () => {
    try {
      await axios.put('/api/academic/notifications/mark-all-read');
      setUnreadCount(0);
      setNotifications(n => n.map(x => ({ ...x, read: true })));
    } catch {}
  };

  const handleSearch = (q) => {
    setSearchQuery(q);
    clearTimeout(searchTimer.current);
    if (!q.trim()) { setSearchResults(null); return; }
    setSearchLoading(true);
    searchTimer.current = setTimeout(async () => {
      try {
        const { data } = await axios.get(`/api/auth/users/search?q=${encodeURIComponent(q)}`);
        setSearchResults(data);
      } catch { setSearchResults({ users: [], posts: [] }); }
      finally { setSearchLoading(false); }
    }, 350);
  };

  const notifIcon = (type) => {
    if (type === 'like')    return <Heart size={14} className="text-rose-400" />;
    if (type === 'follow')  return <UserPlus size={14} className="text-sky-400" />;
    if (type === 'comment') return <MessageSquare size={14} className="text-indigo-400" />;
    return <Sparkles size={14} className="text-indigo-400" />;
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="sticky top-0 z-40 bg-white/80 dark:bg-slate-950/80 backdrop-blur-xl py-3 border-b border-slate-100 dark:border-white/5 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">

          {/* Logo - Matches Sidebar */}
          <div className="flex items-center gap-2.5 cursor-pointer group" onClick={() => navigate('/dashboard')}>
            <div className="w-9 h-9 accent-gradient-bg rounded-xl flex items-center justify-center shadow-lg group-hover:rotate-12 transition-transform">
              <Zap size={18} fill="white" className="text-white" />
            </div>
            <span className="text-lg font-black tracking-tighter text-slate-900 dark:text-white hidden sm:block uppercase">
              Campus <span className="accent-gradient-text italic">Hub</span>
            </span>
          </div>

          {/* Search Hub */}
          <div className="hidden md:flex flex-1 max-w-sm mx-10" ref={searchRef}>
            <div className="relative w-full group">
              <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
              <input
                value={searchQuery}
                onChange={e => handleSearch(e.target.value)}
                type="text"
                className="premium-input py-2.5 pl-12 pr-4 text-sm shadow-inner"
                placeholder="Synchronize with people..."
              />
              {searchQuery && (
                <button onClick={() => { setSearchQuery(''); setSearchResults(null); }} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                  <X size={14} />
                </button>
              )}

              {/* Search Result Node */}
              {(searchResults || searchLoading) && (
                <div className="absolute top-full mt-3 w-full bg-white dark:bg-slate-900 rounded-3xl overflow-hidden shadow-3xl border border-slate-100 dark:border-white/10 z-50 animate-fade-in">
                  {searchLoading ? (
                    <div className="p-8 text-center text-slate-400 text-xs font-bold uppercase tracking-widest animate-pulse">Scanning Hub...</div>
                  ) : (
                    <div className="p-2">
                       {searchResults?.users?.length > 0 ? (
                         searchResults.users.map(u => (
                           <button key={u._id} onClick={() => { navigate(`/profile/${u._id}`); setSearchResults(null); setSearchQuery(''); }}
                             className="flex items-center gap-4 w-full p-3 rounded-2xl hover:bg-slate-50 dark:hover:bg-white/5 text-left transition-all">
                             <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-indigo-500 text-sm font-bold flex-shrink-0 border border-slate-200 dark:border-white/5">
                               {u.profilePic ? <img src={u.profilePic} alt="" className="w-full h-full rounded-xl object-cover"/> : u.firstName?.[0] || 'U'}
                             </div>
                             <div>
                               <p className="text-sm font-bold text-slate-900 dark:text-white leading-none mb-1">{u.firstName} {u.lastName}</p>
                               <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{u.role} • {u.branch}</p>
                             </div>
                           </button>
                         ))
                       ) : (
                         <div className="p-8 text-center text-slate-400 text-xs font-bold uppercase tracking-widest">No Node Located</div>
                       )}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Action Signals */}
          <div className="flex items-center gap-2">
            <button onClick={toggleTheme} className="w-10 h-10 flex items-center justify-center text-slate-400 hover:text-indigo-500 hover:bg-indigo-500/5 rounded-xl transition-all">
              {isDark ? <Sun size={20} /> : <Moon size={20} />}
            </button>

            <div className="relative" ref={notifRef}>
              <button onClick={handleBellClick} className="w-10 h-10 flex items-center justify-center text-slate-400 hover:text-indigo-500 hover:bg-indigo-500/5 rounded-xl transition-all relative">
                <Bell size={20} />
                {unreadCount > 0 && (
                  <span className="absolute top-2 right-2 w-4 h-4 bg-rose-500 text-white flex items-center justify-center rounded-full text-[9px] font-black border-2 border-white dark:border-slate-950">
                    {unreadCount > 9 ? '9+' : unreadCount}
                  </span>
                )}
              </button>

              {showNotifs && (
                <div className="absolute right-0 top-full mt-3 w-80 bg-white/95 dark:bg-slate-950/95 backdrop-blur-2xl rounded-[32px] shadow-3xl border border-slate-100 dark:border-white/5 z-50 overflow-hidden animate-scale-in">
                  <div className="px-6 py-5 border-b border-slate-100 dark:border-white/5 flex items-center justify-between">
                     <h5 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-widest">Signals</h5>
                     <button onClick={markAllRead} className="text-[10px] font-black text-indigo-500 uppercase tracking-widest hover:text-indigo-600 transition-colors">Clear</button>
                  </div>
                  <div className="max-h-80 overflow-y-auto no-scrollbar">
                    {notifications.length === 0 ? (
                      <div className="py-20 flex flex-col items-center opacity-20">
                         <Bell size={40} className="mb-4" />
                         <p className="text-[10px] font-black uppercase tracking-[0.2em]">Silence Detected</p>
                      </div>
                    ) : notifications.map(n => (
                      <div key={n._id} className={`flex gap-4 items-center px-6 py-4 hover:bg-slate-50 dark:hover:bg-white/5 transition-all cursor-pointer border-b border-slate-50 dark:border-white/5 ${!n.read ? 'bg-indigo-500/5' : ''}`}>
                         <div className="w-10 h-10 rounded-xl bg-white dark:bg-slate-900 flex items-center justify-center flex-shrink-0 shadow-md border border-slate-100 dark:border-white/5 overflow-hidden">
                           {n.sender?.profilePic
                             ? <img src={n.sender.profilePic} alt="" className="w-full h-full object-cover" />
                             : <span className="text-sm font-bold text-indigo-500 uppercase">{n.sender?.firstName?.[0]}</span>}
                         </div>
                         <div className="flex-1 min-w-0">
                           <p className="text-xs text-slate-900 dark:text-slate-200 leading-snug">
                             <span className="font-bold text-slate-900 dark:text-white">{n.sender?.firstName} {n.sender?.lastName}</span>{' '}
                             {n.message}
                           </p>
                           <p className="text-[9px] font-bold text-slate-400 mt-1 uppercase tracking-tighter">{formatDistanceToNow(new Date(n.createdAt))} ago</p>
                         </div>
                         <div className="flex-shrink-0 p-2 bg-indigo-500/5 text-indigo-500 rounded-lg">{notifIcon(n.type)}</div>
                      </div>
                    ))}
                  </div>
                  <button onClick={() => { navigate('/notifications'); setShowNotifs(false); }}
                    className="w-full py-5 text-[10px] font-black text-indigo-500 hover:text-indigo-600 hover:bg-indigo-500/5 transition-all text-center uppercase tracking-[0.3em] border-t border-slate-100 dark:border-white/5">
                    Hub Activity Center
                  </button>
                </div>
              )}
            </div>

            <button onClick={() => navigate('/chats')} className="w-10 h-10 flex items-center justify-center text-slate-400 hover:text-indigo-500 hover:bg-indigo-500/5 rounded-xl transition-all">
              <MessageSquare size={20} />
            </button>

            <button onClick={() => navigate('/profile')} className="ml-3 p-0.5 rounded-xl campus-story-ring group transition-transform active:scale-90 flex items-center justify-center">
              <div className="w-9 h-9 rounded-xl overflow-hidden border-2 border-white dark:border-slate-950 flex items-center justify-center bg-slate-100 dark:bg-slate-800 text-indigo-500 text-xs font-bold">
                {user.profilePic ? <img src={user.profilePic} alt="" className="w-full h-full object-cover" /> : user.firstName?.[0] || 'U'}
              </div>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
