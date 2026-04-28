import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Camera, Plus, Zap, Heart, MessageSquare, Share2, MoreHorizontal } from 'lucide-react';
import PostCard from '../components/PostCard';
import { useAuth } from '../context/AuthContext';

const Dashboard = () => {
  const { user } = useAuth();
  const [posts, setPosts] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [postsRes, usersRes] = await Promise.all([
          axios.get('/api/academic/posts'),
          axios.get('/api/auth/users')
        ]);
        setPosts(postsRes.data);
        setUsers(usersRes.data);
      } catch (err) {
        console.warn('Sync failed');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="animate-fade-in max-w-[800px] mx-auto space-y-12 pb-32">
      
      {/* CAMPUS STORIES */}
      <div className="flex gap-6 overflow-x-auto no-scrollbar py-2">
         <div className="flex flex-col items-center gap-2 shrink-0 cursor-pointer group">
            <div className="w-20 h-20 rounded-full p-[3px] bg-slate-200 dark:bg-white/5 relative">
               <div className="w-full h-full rounded-full overflow-hidden border-4 border-white dark:border-[#020617] bg-slate-100 flex items-center justify-center">
                  {user?.profilePic ? <img src={user.profilePic} className="w-full h-full object-cover" /> : <Camera className="text-slate-400" size={24} />}
               </div>
               <div className="absolute bottom-0 right-0 bg-indigo-500 text-white p-1 rounded-full border-4 border-white dark:border-[#020617] group-hover:scale-110 transition-transform">
                  <Plus size={14} strokeWidth={4} />
               </div>
            </div>
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">My Signal</span>
         </div>

         {users.slice(0, 10).map((u) => (
           <div key={u._id} className="flex flex-col items-center gap-2 shrink-0 cursor-pointer group">
              <div className="w-20 h-20 rounded-full campus-story-ring p-[3px] transition-transform group-active:scale-90">
                 <div className="w-full h-full rounded-full overflow-hidden border-4 border-white dark:border-[#020617] bg-slate-100 flex items-center justify-center text-white font-black">
                    {u.profilePic ? <img src={u.profilePic} className="w-full h-full object-cover" /> : u.firstName?.[0]}
                 </div>
              </div>
              <span className="text-[11px] font-black text-slate-900 dark:text-white uppercase tracking-tighter truncate w-20 text-center">{u.firstName}</span>
           </div>
         ))}
      </div>

      {/* FEED */}
      <div className="space-y-8">
        {loading ? (
          [1, 2].map(i => <div key={i} className="premium-card h-96 animate-pulse"></div>)
        ) : posts.length > 0 ? (
          posts.map(post => <PostCard key={post._id} post={post} />)
        ) : (
          <div className="premium-card p-20 text-center opacity-20">
             <Zap size={48} className="mx-auto mb-4" />
             <p className="font-black uppercase tracking-widest">Waiting for campus signals...</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
