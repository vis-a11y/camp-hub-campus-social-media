import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { Search, Compass, Users, TrendingUp, Zap, MessageSquare, Heart, Sparkles, LayoutGrid } from 'lucide-react';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { getMediaUrl } from '../utils/media';

const ExplorePage = () => {
  const { user: currentUser } = useAuth();
  const navigate = useNavigate();
  const [people, setPeople] = useState([]);
  const [posts, setPosts] = useState([]);
  const [activeTab, setActiveTab] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (searchQuery.trim()) {
      const timer = setTimeout(() => handleSearch(), 500);
      return () => clearTimeout(timer);
    } else {
      fetchExploreContent();
    }
  }, [activeTab, searchQuery]);

  const fetchExploreContent = async () => {
    setLoading(true);
    try {
      if (activeTab === 'people') {
        const { data } = await axios.get('/api/auth/users');
        setPeople(data);
      } else {
        const { data } = await axios.get(`/api/academic/posts?sort=trending`);
        setPosts(data);
      }
    } catch {
       setPosts([]);
       setPeople([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (e) => {
    e?.preventDefault();
    if (!searchQuery.trim()) return;
    setLoading(true);
    try {
      const { data } = await axios.get(`/api/auth/users/search?q=${encodeURIComponent(searchQuery)}`);
      setPeople(data.users || []);
      setPosts(data.posts || []);
    } catch {
       toast.error('Search failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="animate-fade-in space-y-12 pb-20">
      {/* SEARCH HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
        <div className="space-y-2">
           <h1 className="text-5xl font-black text-slate-900 dark:text-white tracking-tighter uppercase">
             Discovery <span className="accent-gradient-text italic">Zone</span>
           </h1>
           <p className="text-slate-500 font-medium text-lg">Exploring campus signal frequencies...</p>
        </div>
        
        <div className="relative group w-full md:w-[400px]">
           <Search size={22} className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-all" />
           <input 
             value={searchQuery}
             onChange={e => setSearchQuery(e.target.value)}
             className="premium-input pl-16 py-4 text-lg" 
             placeholder="Search Hub..." 
           />
        </div>
      </div>

      {/* TABS */}
      <div className="flex gap-10 border-b border-slate-100 dark:border-white/5 overflow-x-auto no-scrollbar">
          {[
            { id: 'all', label: 'All Signals', icon: LayoutGrid },
            { id: 'people', label: 'Nodes', icon: Users },
            { id: 'trending', label: 'Trending', icon: TrendingUp }
          ].map(tab => {
             const active = activeTab === tab.id;
             return (
               <button 
                 key={tab.id}
                 onClick={() => setActiveTab(tab.id)}
                 className={`pb-5 text-sm font-black uppercase tracking-[0.2em] transition-all flex items-center gap-2 relative ${
                   active ? 'text-indigo-500 border-b-4 border-indigo-500' : 'text-slate-400 hover:text-slate-600'
                 }`}
               >
                  <tab.icon size={18} />
                  {tab.label}
               </button>
             );
          })}
      </div>

      {/* EXPLORE GRID */}
      {loading ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
           {[1, 2, 3, 4, 5, 6, 7, 8].map(i => <div key={i} className="aspect-square premium-card animate-pulse"></div>)}
        </div>
      ) : activeTab === 'people' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
           {people.map(p => (
              <div 
                key={p._id} 
                className="premium-card p-6 flex items-center gap-5 cursor-pointer hover:border-indigo-500/30 group transition-all"
                onClick={() => navigate(`/profile/${p._id}`)}
              >
                 <div className="w-16 h-16 rounded-2xl overflow-hidden shadow-xl border-2 border-transparent group-hover:border-indigo-500 transition-all">
                    {p.profilePic ? (
                      <img src={getMediaUrl(p.profilePic)} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full bg-indigo-500 flex items-center justify-center font-black text-white text-xl uppercase">{p.firstName?.[0]}</div>
                    )}
                 </div>
                 <div className="flex-1">
                    <h4 className="text-lg font-black text-slate-900 dark:text-white tracking-tighter uppercase">{p.firstName} {p.lastName}</h4>
                    <p className="text-[11px] text-slate-400 font-bold uppercase tracking-widest">{p.role}</p>
                 </div>
                 <div className="p-3 bg-indigo-500/5 text-indigo-500 rounded-xl group-hover:bg-indigo-500 group-hover:text-white transition-all">
                    <Users size={20} />
                 </div>
              </div>
           ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-8">
           {posts.length > 0 ? posts.map((post, idx) => (
              <div 
                key={post._id} 
                className={`premium-card relative aspect-square cursor-pointer group overflow-hidden ${idx % 7 === 0 ? 'col-span-2 row-span-2' : ''}`}
                onClick={() => navigate(`/dashboard?post=${post._id}`)}
              >
                  {post.media ? (
                    <img 
                      src={getMediaUrl(post.media)} 
                      className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" 
                      alt="" 
                    />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center p-8 text-center bg-indigo-500/5">
                        <Sparkles size={32} className="text-indigo-500 mb-4 opacity-20" />
                        <p className="text-sm font-black text-slate-400 uppercase tracking-widest line-clamp-4">{post.content}</p>
                    </div>
                  )}
                  
                  {/* OVERLAY */}
                  <div className="absolute inset-0 bg-indigo-600/60 opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center gap-10 text-white backdrop-blur-sm">
                      <div className="flex flex-col items-center gap-2 scale-50 group-hover:scale-100 transition-all delay-75">
                         <Heart size={32} fill="white" />
                         <span className="text-xl font-black">{post.likes?.length || 0}</span>
                      </div>
                      <div className="flex flex-col items-center gap-2 scale-50 group-hover:scale-100 transition-all delay-150">
                         <MessageSquare size={32} fill="white" />
                         <span className="text-xl font-black">{post.comments?.length || 0}</span>
                      </div>
                  </div>
              </div>
           )) : (
             <div className="col-span-full py-48 text-center opacity-20">
                <Compass size={80} className="mx-auto mb-6" />
                <p className="text-2xl font-black uppercase tracking-[0.4em]">Signal Void</p>
             </div>
           )}
        </div>
      )}
    </div>
  );
};

export default ExplorePage;
