import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { 
  User, Settings, Grid, Bookmark, 
  MapPin, Link as LinkIcon, Calendar, 
  Edit3, Camera, Zap, CheckCircle
} from 'lucide-react';
import PostCard from '../components/PostCard';
import { getMediaUrl } from '../utils/media';
import toast from 'react-hot-toast';

const ProfilePage = () => {
  const { id } = useParams();
  const { user: currentUser, setUser } = useAuth();
  const [user, setUserData] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('posts');

  const profileId = id || currentUser?._id;
  const isOwnProfile = profileId === currentUser?._id;

  useEffect(() => {
    fetchProfile();
  }, [profileId]);

  const fetchProfile = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get(`/api/auth/users/${profileId}`);
      setUserData(data);
      const postsRes = await axios.get(`/api/academic/posts/user/${profileId}`);
      setPosts(postsRes.data);
    } catch (err) {
      toast.error('Identity Retrieval Failed');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdatePic = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const formData = new FormData();
    formData.append('profilePic', file);
    try {
      const { data } = await axios.put('/api/auth/profile-pic', formData);
      setUserData({ ...user, profilePic: data.profilePic });
      if (isOwnProfile) setUser({ ...currentUser, profilePic: data.profilePic });
      toast.success('Identity Updated');
    } catch {
      toast.error('Update Failed');
    }
  };

  if (loading) return <div className="py-20 text-center animate-pulse text-slate-500 font-black uppercase tracking-widest">Scanning Identity...</div>;
  if (!user) return <div className="py-20 text-center text-slate-500 font-black uppercase tracking-widest">Node Not Found</div>;

  return (
    <div className="animate-fade-in space-y-12 pb-20">
      {/* PROFILE HEADER */}
      <div className="premium-card p-10 lg:p-16 flex flex-col md:flex-row gap-12 items-center md:items-start bg-indigo-500/5 border-indigo-500/10">
         <div className="relative group">
            <div className="w-40 h-40 md:w-48 md:h-48 rounded-[40px] campus-story-ring p-1 shadow-2xl">
               <div className="w-full h-full rounded-[36px] bg-white dark:bg-slate-900 overflow-hidden relative">
                  {user.profilePic ? (
                    <img src={getMediaUrl(user.profilePic)} className="w-full h-full object-cover" alt="" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-indigo-500 text-white text-6xl font-black">{user.firstName?.[0]}</div>
                  )}
                  {isOwnProfile && (
                    <label className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center cursor-pointer">
                       <Camera size={32} className="text-white" />
                       <input type="file" hidden onChange={handleUpdatePic} />
                    </label>
                  )}
               </div>
            </div>
            {user.role !== 'student' && (
              <div className="absolute -bottom-2 -right-2 bg-indigo-500 text-white p-2 rounded-2xl shadow-xl">
                 <CheckCircle size={24} fill="white" className="text-indigo-500" />
              </div>
            )}
         </div>

         <div className="flex-1 space-y-8 text-center md:text-left">
            <div className="space-y-2">
               <div className="flex flex-col md:flex-row md:items-center gap-4 md:gap-8 justify-center md:justify-start">
                  <h1 className="text-4xl font-black text-slate-900 dark:text-white uppercase tracking-tighter leading-none">
                    {user.firstName} {user.lastName}
                  </h1>
                  <div className="flex gap-4 justify-center">
                     {isOwnProfile ? (
                       <button className="bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 px-6 py-2.5 rounded-xl text-sm font-black uppercase tracking-widest hover:bg-slate-50 dark:hover:bg-white/10 transition-all">Edit Profile</button>
                     ) : (
                       <button className="premium-button py-2.5 px-8">Follow</button>
                     )}
                     <button className="p-2.5 bg-slate-100 dark:bg-white/5 rounded-xl border border-slate-200 dark:border-white/10"><Settings size={20} /></button>
                  </div>
               </div>
               <p className="text-lg font-bold text-slate-400 uppercase tracking-widest">@{user.firstName?.toLowerCase()}_{user.lastName?.toLowerCase()} • {user.role}</p>
            </div>

            <div className="flex gap-10 justify-center md:justify-start">
               {[
                 { label: 'Signals', value: posts.length },
                 { label: 'Nodes', value: user.followers?.length || 0 },
                 { label: 'Connected', value: user.following?.length || 0 }
               ].map(stat => (
                 <div key={stat.label} className="flex flex-col">
                    <span className="text-2xl font-black text-slate-900 dark:text-white">{stat.value}</span>
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{stat.label}</span>
                 </div>
               ))}
            </div>

            <div className="space-y-2 text-slate-500 font-medium max-w-xl">
               <p>{user.bio || 'Identity bio not established.'}</p>
            </div>
         </div>
      </div>

      {/* TABS */}
      <div className="flex justify-center gap-16 border-t border-slate-100 dark:border-white/5 pt-8">
          {[
            { id: 'posts', label: 'Signals', icon: Grid },
            { id: 'saved', label: 'Stored', icon: Bookmark },
            { id: 'tagged', label: 'Mentions', icon: User }
          ].map(tab => {
             const active = activeTab === tab.id;
             return (
               <button 
                 key={tab.id}
                 onClick={() => setActiveTab(tab.id)}
                 className={`flex items-center gap-2 text-[11px] font-black uppercase tracking-[0.3em] transition-all relative pb-8 ${
                   active ? 'text-indigo-500' : 'text-slate-400'
                 }`}
               >
                  <tab.icon size={16} />
                  {tab.label}
                  {active && <div className="absolute top-0 left-0 right-0 h-1 bg-indigo-500 rounded-b-full shadow-[0_0_15px_rgba(99,102,241,0.5)]" />}
               </button>
             );
          })}
      </div>

      {/* FEED */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
         {posts.map(post => <PostCard key={post._id} post={post} />)}
      </div>
    </div>
  );
};

export default ProfilePage;
