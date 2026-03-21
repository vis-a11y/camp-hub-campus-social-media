import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { Search, Compass, Users, TrendingUp, Zap, MessageSquare, Clock, MapPin, Activity, Heart } from 'lucide-react';
import PostCard from '../components/PostCard';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

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

  const handleFollow = async (e, userId) => {
    e.stopPropagation();
    try {
      await axios.put(`/api/auth/users/${userId}/follow`);
      toast.success('Relationship updated');
      fetchExploreContent();
    } catch {
       toast.error('Operation failed');
    }
  };

  return (
    <div className="max-w-[935px] mx-auto px-1 sm:px-4 py-8 sm:py-12 animate-fade-in pb-32 bg-white dark:bg-black min-h-screen">
      {/* Search Header (Instagram Style) */}
      <div className="mb-8 px-2">
        <form onSubmit={handleSearch} className="relative group max-w-full">
           <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
           <input 
             value={searchQuery}
             onChange={e => setSearchQuery(e.target.value)}
             className="w-full bg-slate-100 dark:bg-white/10 border-none rounded-lg pl-12 pr-4 py-2 text-[14px] outline-none transition-all placeholder:text-slate-500 font-normal dark:text-white" 
             placeholder="Search" 
           />
        </form>
      </div>

      {/* Control Tabs (Minimalist) */}
      <div className="flex gap-8 mb-8 px-2 border-b border-slate-100 dark:border-white/10 overflow-x-auto no-scrollbar">
          {[
            { id: 'all', label: 'All' },
            { id: 'people', label: 'Accounts' },
            { id: 'latest', label: 'Audio' },
            { id: 'trending', label: 'Trending' }
          ].map(tab => {
             const active = activeTab === tab.id;
             return (
               <button 
                 key={tab.id}
                 onClick={() => setActiveTab(tab.id)}
                 className={`pb-3 text-[14px] font-semibold transition-all relative ${
                   active ? 'text-slate-900 dark:text-white border-b-2 border-slate-900 dark:border-white' : 'text-slate-400'
                 }`}
               >
                  {tab.label}
               </button>
             );
          })}
      </div>

      {/* Grid Rendering (Instagram Explore Grid) */}
      {loading ? (
        <div className="grid grid-cols-3 gap-1 sm:gap-4">
           {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(i => <div key={i} className="aspect-square bg-slate-100 dark:bg-white/5 animate-pulse rounded-sm sm:rounded-md"></div>)}
        </div>
      ) : (
        <div>
           {activeTab === 'people' ? (
             <div className="space-y-4 px-2">
                {people.map(p => (
                   <div key={p._id} className="flex items-center justify-between group cursor-pointer" onClick={() => navigate(`/profile/${p._id}`)}>
                      <div className="flex items-center gap-4">
                         <div className="w-12 h-12 rounded-full overflow-hidden border border-slate-200 dark:border-white/10">
                            {p.profilePic ? <img src={p.profilePic} className="w-full h-full object-cover" /> : <div className="w-full h-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center font-bold text-sky-500 uppercase">{p.firstName?.[0]}</div>}
                         </div>
                         <div>
                            <p className="text-[14px] font-bold text-slate-900 dark:text-white lowercase">{p.firstName}_{p.lastName?.toLowerCase()}</p>
                            <p className="text-[13px] text-slate-500 font-medium">{p.firstName} {p.lastName} • {p.role}</p>
                         </div>
                      </div>
                      <button 
                        onClick={(e) => handleFollow(e, p._id)}
                        className="bg-sky-500 text-white rounded-lg px-6 py-1.5 text-[13px] font-bold hover:opacity-80 transition-all"
                      >
                        Follow
                      </button>
                   </div>
                ))}
             </div>
           ) : (
             <div className="grid grid-cols-3 gap-1 sm:gap-7">
                {posts.length > 0 ? posts.map((post, idx) => (
                   <div 
                    key={post._id} 
                    className={`relative aspect-square cursor-pointer group overflow-hidden bg-slate-100 dark:bg-white/5 ${idx % 10 === 0 ? 'col-span-1 row-span-1 sm:col-span-2 sm:row-span-2' : ''}`}
                    onClick={() => navigate(`/dashboard?post=${post._id}`)}
                   >
                       {post.media ? (
                           <img src={post.media} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" alt="" />
                       ) : (
                           <div className="w-full h-full flex flex-col items-center justify-center p-4 text-center">
                               <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest line-clamp-3">{post.content}</p>
                           </div>
                       )}
                       {/* Hover Overlay */}
                       <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-6 text-white font-bold">
                           <div className="flex items-center gap-2">
                              <Heart size={20} fill="white" /> {post.likes?.length || 0}
                           </div>
                           <div className="flex items-center gap-2">
                              <MessageSquare size={20} fill="white" /> {post.comments?.length || 0}
                           </div>
                       </div>
                   </div>
                )) : (
                    <div className="col-span-3 py-48 text-center opacity-20">
                        <Compass size={64} className="mx-auto mb-4" />
                        <p className="text-sm font-bold uppercase tracking-widest uppercase">No content discovered</p>
                    </div>
                )}
             </div>
           )}
        </div>
      )}
    </div>
  );
};

export default ExplorePage;
