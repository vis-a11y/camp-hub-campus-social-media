import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { Users, UserPlus, Search, MapPin, Award, ArrowRight, UserMinus, PlusCircle, Compass, Zap, Terminal, Activity, ChevronLeft, X } from 'lucide-react';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { getMediaUrl } from '../utils/media';

const ConnectionsPage = () => {
  const { user: currentUser } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('followers');
  const [connections, setConnections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchConnections();
  }, [activeTab]);

  const fetchConnections = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get(`/api/auth/users/${currentUser._id}/${activeTab}`);
      setConnections(data);
    } catch {
       setConnections([]);
    } finally {
      setLoading(false);
    }
  };

  const handleUnfollow = async (userId) => {
    try {
      await axios.put(`/api/auth/users/${userId}/follow`);
      setConnections(connections.filter(c => c._id !== userId));
      toast.success('Unfollowed');
    } catch {
      toast.error('Action failed');
    }
  };

  const filtered = connections.filter(c => 
    `${c.firstName} ${c.lastName}`.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="max-w-[600px] mx-auto min-h-screen bg-white dark:bg-black pb-32">
      {/* Header */}
      <div className="sticky top-0 bg-white/80 dark:bg-black/80 backdrop-blur-md z-40 px-4 h-16 border-b border-slate-100 dark:border-white/10 flex flex-col justify-center">
         <div className="flex items-center">
            <button onClick={() => navigate(-1)} className="mr-4 hover:opacity-50 transition-all"><ChevronLeft size={28} /></button>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white lowercase">{currentUser.firstName}_{currentUser.lastName?.toLowerCase()}</h2>
         </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-100 dark:border-white/10">
          {[
            { id: 'followers', label: 'Followers', count: connections.length },
            { id: 'following', label: 'Following', count: connections.length }
          ].map(tab => {
             const active = activeTab === tab.id;
             return (
               <button 
                 key={tab.id}
                 onClick={() => setActiveTab(tab.id)}
                 className={`flex-1 py-3 text-[14px] font-semibold transition-all relative ${
                   active ? 'text-slate-900 dark:text-white border-b-2 border-slate-900 dark:border-white' : 'text-slate-400'
                 }`}
               >
                  {tab.count} {tab.label}
               </button>
             );
          })}
      </div>

      {/* Search Bar */}
      <div className="p-4">
        <div className="relative group flex items-center">
           <Search size={16} className="absolute left-4 text-slate-400" />
           <input 
             value={search}
             onChange={e => setSearch(e.target.value)}
             className="w-full bg-slate-100 dark:bg-white/10 rounded-lg pl-10 pr-4 py-2 text-[14px] outline-none transition-all placeholder:text-slate-500 font-normal dark:text-white" 
             placeholder="Search" 
           />
        </div>
      </div>

      {/* Connections List */}
      <div className="px-4 py-2">
        {loading ? (
          <div className="space-y-6 pt-4">
             {[1, 2, 3, 4, 5].map(i => <div key={i} className="h-12 bg-slate-100 dark:bg-white/5 animate-pulse rounded-lg"></div>)}
          </div>
        ) : (
          <div className="space-y-4">
             {filtered.map(c => (
                <div key={c._id} className="flex items-center justify-between group cursor-pointer" onClick={() => navigate(`/profile/${c._id}`)}>
                   <div className="flex items-center gap-3">
                      <div className="w-11 h-11 rounded-full overflow-hidden border border-slate-200 dark:border-white/10">
                         {c.profilePic ? (
                            <img 
                              src={getMediaUrl(c.profilePic)} 
                              className="w-full h-full object-cover" 
                              alt="" 
                              onError={(e) => { e.target.src = `https://ui-avatars.com/api/?name=${c.firstName}+${c.lastName}&background=6366f1&color=fff&bold=true`; }}
                            />
                         ) : (
                           <div className="w-full h-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center font-bold text-sky-500 uppercase">{c.firstName?.[0]}</div>
                         )}
                      </div>
                      <div>
                         <p className="text-[14px] font-bold text-slate-900 dark:text-white lowercase">{c.firstName}_{c.lastName?.toLowerCase()}</p>
                         <p className="text-[14px] text-slate-500 font-medium">{c.firstName} {c.lastName}</p>
                      </div>
                   </div>
                   
                   {activeTab === 'following' ? (
                      <button onClick={(e) => { e.stopPropagation(); handleUnfollow(c._id); }} className="bg-slate-100 dark:bg-white/10 text-slate-900 dark:text-white rounded-lg px-4 py-1.5 text-[13px] font-bold hover:opacity-80 transition-all">Following</button>
                   ) : (
                      <button onClick={(e) => { e.stopPropagation(); navigate(`/profile/${c._id}`); }} className="bg-sky-500 text-white rounded-lg px-4 py-1.5 text-[13px] font-bold hover:opacity-80 transition-all">Follow</button>
                   )}
                </div>
             ))}

             {filtered.length === 0 && (
                <div className="py-32 text-center text-slate-400">
                   <Users size={64} className="mx-auto mb-4 opacity-20" />
                   <p className="text-xl font-bold">No {activeTab} yet</p>
                </div>
             )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ConnectionsPage;
