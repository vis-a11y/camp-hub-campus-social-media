import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  Settings, Grid, Bookmark, Users, MessageCircle, MoreHorizontal, Link as LinkIcon, 
  Image as ImageIcon, Edit, Check, Link2, LogOut, Award, ShieldCheck, Zap, Activity, Heart, MessageSquare, X, ChevronRight
} from 'lucide-react';
import PostCard from '../components/PostCard';
import toast from 'react-hot-toast';
import { getMediaUrl } from '../utils/media';

const ProfilePage = () => {
  const { id } = useParams();
  const { user: currentUser, logout, updateUser } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [activeTab, setActiveTab] = useState('posts');
  const [showEditModal, setShowEditModal] = useState(false);
  const [showConnectionsModal, setShowConnectionsModal] = useState(false);
  const [connectionType, setConnectionType] = useState('followers');
  const [connections, setConnections] = useState([]);
  const [isUpdating, setIsUpdating] = useState(false);
  const [editForm, setEditForm] = useState({ firstName: '', lastName: '', bio: '', website: '', branch: '' });
  const [isFollowing, setIsFollowing] = useState(false);
  const [savedPosts, setSavedPosts] = useState([]);
  const [loadingSaved, setLoadingSaved] = useState(false);
  const fileInputRef = useRef();

  const isOwnProfile = !id || id === currentUser?._id;

  useEffect(() => {
    fetchProfile();
    if (activeTab === 'saved') fetchSavedPosts();
  }, [id, currentUser, activeTab]);

  const fetchSavedPosts = async () => {
    setLoadingSaved(true);
    try {
      const { data } = await axios.get('/api/academic/posts/saved');
      setSavedPosts(data);
    } catch {
      setSavedPosts([]);
    } finally {
      setLoadingSaved(false);
    }
  };

  const fetchProfile = async () => {
    try {
      const profileId = id || currentUser?._id;
      const { data } = await axios.get(`/api/auth/users/${profileId}`);
      setUser(data);
      setEditForm({
        firstName: data.firstName,
        lastName: data.lastName,
        bio: data.bio || '',
        website: data.website || '',
        branch: data.branch || ''
      });
      setIsFollowing(data.followers?.some((follower) => (follower?._id || follower)?.toString() === currentUser?._id));
      
      const { data: userPosts } = await axios.get(`/api/academic/posts/user/${profileId}`);
      setPosts(userPosts);
    } catch (error) {
       setUser(null);
    }
  };

  const fetchConnections = async (type) => {
    setConnectionType(type);
    setShowConnectionsModal(true);
    try {
      const profileId = id || currentUser?._id;
      const { data } = await axios.get(`/api/auth/users/${profileId}/${type}`);
      setConnections(data);
    } catch {
      setConnections([]);
    }
  };

  const handleUpdateProfile = async () => {
    setIsUpdating(true);
    try {
      const { data } = await axios.put('/api/auth/me', editForm);
      updateUser(data);
      setUser(data);
      setShowEditModal(false);
      toast.success('Profile updated');
    } catch {
      toast.error('Update failed');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleUploadPic = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const formData = new FormData();
    formData.append('file', file);
    try {
      const { data: uploadData } = await axios.post('/api/upload', formData);
      const { data: userData } = await axios.put('/api/auth/me', { profilePic: uploadData.url });
      updateUser(userData);
      setUser(userData);
      toast.success('Profile picture updated');
    } catch {
      toast.error('Upload failed');
    }
  };

  const handleFollow = async () => {
    const prevFollowing = isFollowing;
    setIsFollowing(!isFollowing);
    try {
      await axios.put(`/api/auth/users/${user._id}/follow`);
    } catch {
      setIsFollowing(prevFollowing);
      toast.error('Action failed');
    }
  };

  if (!user) return <div className="min-h-screen flex items-center justify-center bg-white dark:bg-black text-slate-400 font-medium font-sans">Loading profile...</div>;

  return (
    <>
      <div className="max-w-[1000px] mx-auto px-4 py-10 animate-fade-in pb-32">
      {/* Header - Premium Redesign */}
      <header className="premium-card p-8 sm:p-12 mb-10 flex flex-col sm:flex-row items-center sm:items-start gap-10 sm:gap-20 bg-slate-50/50 dark:bg-white/5 relative overflow-hidden">
        {/* Background Accent Gradients */}
        <div className="absolute -top-24 -right-24 w-64 h-64 accent-gradient-bg opacity-10 blur-3xl rounded-full"></div>
        <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-indigo-500 opacity-10 blur-3xl rounded-full"></div>

        {/* Avatar Area */}
        <div className="relative group cursor-pointer shrink-0" onClick={() => isOwnProfile && fileInputRef.current.click()}>
           <div className="w-28 h-28 sm:w-44 sm:h-44 rounded-3xl campus-story-ring p-1 shadow-2xl transition-transform duration-500 group-hover:scale-105">
              <div className="w-full h-full rounded-3xl overflow-hidden bg-slate-200 dark:bg-slate-800 border-4 border-white dark:border-slate-900 flex items-center justify-center">
                 {user.profilePic ? (
                    <img src={getMediaUrl(user.profilePic)} className="w-full h-full object-cover transition-transform group-hover:scale-110" alt="" />
                 ) : (
                    <span className="text-5xl font-bold accent-gradient-text uppercase">{user.firstName[0]}</span>
                 )}
              </div>
           </div>
           {isOwnProfile && (
             <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-white dark:bg-slate-800 rounded-xl shadow-xl flex items-center justify-center text-indigo-500 border border-slate-100 dark:border-white/5 opacity-0 group-hover:opacity-100 transition-opacity">
               <Edit size={18} />
             </div>
           )}
           <input type="file" ref={fileInputRef} hidden onChange={handleUploadPic} />
        </div>

        {/* Info Area */}
        <div className="flex-1 space-y-6 text-center sm:text-left pt-4 z-10">
           <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
              <div>
                  <h2 className="text-3xl sm:text-4xl font-extrabold text-main tracking-tight leading-none">
{user.firstName} {user.lastName}</h2>
                 <p className="text-indigo-500 font-bold text-sm tracking-widest uppercase mt-1">@{user.firstName?.toLowerCase()}_{user.lastName?.toLowerCase()}</p>
              </div>
              <div className="flex gap-3">
                  {isOwnProfile ? (
                    <>
                      <button onClick={() => setShowEditModal(true)} className="premium-button text-[12px] uppercase tracking-wider py-2 px-6">Edit Profile</button>
                      <button className="p-2 bg-slate-100 dark:bg-white/5 rounded-xl text-slate-500 dark:text-slate-400 hover:text-indigo-500 transition-all border border-slate-200 dark:border-white/10">
                        <Settings size={22} />
                      </button>
                    </>
                  ) : (
                    <>
                      <button 
                        onClick={handleFollow}
                        className={`px-8 py-2.5 rounded-xl text-sm font-bold transition-all shadow-lg active:scale-95 ${
                          isFollowing ? 'bg-slate-100 dark:bg-white/10 text-slate-700 dark:text-white border border-slate-200 dark:border-white/10' : 'accent-gradient-bg text-white shadow-indigo-500/20'
                        }`}
                      >
                        {isFollowing ? 'Following' : 'Follow Student'}
                      </button>
                      <button className="p-2.5 bg-slate-100 dark:bg-white/10 rounded-xl text-slate-700 dark:text-white border border-slate-200 dark:border-white/10 hover:bg-slate-200" onClick={() => navigate(`/chats?user=${user._id}`)}>
                         <MessageCircle size={22} />
                      </button>
                    </>
                  )}
              </div>
           </div>

           <div className="flex justify-center sm:justify-start gap-12 border-y border-slate-200 dark:border-white/5 py-6">
              <div className="text-center sm:text-left">
                  <p className="text-xl font-black text-main leading-none">{posts.length}</p>
                 <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Publications</p>
              </div>
              <button onClick={() => fetchConnections('followers')} className="text-center sm:text-left hover:opacity-50 transition-all">
                  <p className="text-xl font-black text-main leading-none">{user.followers?.length || 0}</p>
                 <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Connections</p>
              </button>
              <button onClick={() => fetchConnections('following')} className="text-center sm:text-left hover:opacity-50 transition-all">
                  <p className="text-xl font-black text-main leading-none">{user.following?.length || 0}</p>
                 <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Connected to</p>
              </button>
           </div>

           <div className="space-y-4">
              <div className="flex flex-wrap gap-4 items-center justify-center sm:justify-start">
                 <div className="flex items-center gap-2 px-3 py-1 bg-indigo-500/10 text-indigo-500 rounded-full text-xs font-bold uppercase tracking-wider">
                    <Award size={14} /> {user.role}
                 </div>
                 <div className="flex items-center gap-2 px-3 py-1 bg-emerald-500/10 text-emerald-500 rounded-full text-xs font-bold uppercase tracking-wider">
                    <Activity size={14} /> {user.branch} Campus
                 </div>
              </div>
              <p className="text-[15px] text-sub leading-relaxed max-w-2xl font-medium">
                 {user.bio || 'This student is busy exploring the campus knowledge base.'}
              </p>
              {user.website && (
                <a href={user.website} target="_blank" className="inline-flex items-center gap-2 accent-gradient-text font-bold text-sm hover:underline">
                  <Link2 size={16} className="text-indigo-500" /> {user.website.replace('https://', '')}
                </a>
              )}
           </div>
        </div>
      </header>

      {/* Navigation Tabs - Redesigned */}
      <div className="flex justify-center gap-x-12 sm:gap-x-24 mb-10 border-b border-slate-200 dark:border-white/5">
         {[
           { id: 'posts', icon: Grid, label: 'KNOWLEDGE' },
           { id: 'saved', icon: Bookmark, label: 'SAVED', hidden: !isOwnProfile },
           { id: 'tagged', icon: Users, label: 'SQUAD' }
         ].filter(t => !t.hidden).map(tab => (
           <button 
             key={tab.id}
             onClick={() => setActiveTab(tab.id)}
             className={`pb-4 text-[12px] font-bold tracking-[0.2em] flex items-center gap-2 transition-all relative ${
               activeTab === tab.id ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-400 hover:text-slate-600'
             }`}
           >
             <tab.icon size={16} strokeWidth={activeTab === tab.id ? 2.5 : 2} /> {tab.label}
             {activeTab === tab.id && <div className="absolute bottom-0 left-0 right-0 h-1 accent-gradient-bg rounded-t-full"></div>}
           </button>
         ))}
      </div>

      {/* Grid Content */}
      <div className="animate-fade-in">
        {activeTab === 'posts' && (
          <div className="grid grid-cols-3 gap-1 md:gap-6">
            {posts.length > 0 ? (
              posts.map(post => (
                <div 
                  key={post._id} 
                  className="premium-card aspect-square relative group overflow-hidden cursor-pointer bg-slate-100 dark:bg-slate-900 border-none group"
                  onClick={() => navigate(`/dashboard?post=${post._id}`)}
                >
                   {post.media ? (
                     <img src={getMediaUrl(post.media)} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" alt="" />
                   ) : (
                     <div className="w-full h-full flex items-center justify-center p-8 bg-indigo-500/5">
                        <p className="text-sm font-bold text-slate-500 text-center line-clamp-4 leading-relaxed italic">"{post.content}"</p>
                     </div>
                   )}
                   {/* Hover Overlay - Premium */}
                   <div className="absolute inset-0 bg-indigo-600/80 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center gap-8 text-white scale-110 group-hover:scale-100">
                      <div className="flex flex-col items-center">
                         <Heart size={28} fill="white" className="mb-2" />
                         <span className="text-lg font-bold">{post.likes?.length || 0}</span>
                      </div>
                      <div className="flex flex-col items-center">
                         <MessageSquare size={28} fill="white" className="mb-2" />
                         <span className="text-lg font-bold">{post.comments?.length || 0}</span>
                      </div>
                   </div>
                </div>
              ))
            ) : (
              <div className="col-span-full py-40 flex flex-col items-center premium-card bg-slate-50/50 dark:bg-white/5 border-dashed border-2">
                <div className="w-20 h-20 bg-slate-100 dark:bg-white/5 rounded-3xl flex items-center justify-center text-slate-300 mb-6">
                  <ImageIcon size={40} />
                </div>
                <p className="text-xl font-bold text-slate-700 dark:text-slate-300">No Publications Yet</p>
                <p className="text-sm text-slate-400 mt-2">Share your first campus update to get started</p>
              </div>
            )}
          </div>
        )}

        {/* Other Tabs Placeholders */}
        {activeTab === 'saved' && (
          <div className="grid grid-cols-3 gap-1 md:gap-6 animate-fade-in">
             {loadingSaved ? (
                [1,2,3].map(i => <div key={i} className="aspect-square bg-slate-100 dark:bg-white/5 animate-pulse rounded-2xl"></div>)
             ) : savedPosts.length > 0 ? (
               savedPosts.map(post => (
                 <div 
                   key={post._id} 
                   className="premium-card aspect-square relative group overflow-hidden cursor-pointer"
                   onClick={() => navigate(`/dashboard?post=${post._id}`)}
                 >
                    {post.media ? (
                      <img src={post.media} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" alt="" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center p-8 bg-indigo-500/5">
                         <p className="text-sm font-bold text-slate-500 text-center line-clamp-4 leading-relaxed uppercase tracking-widest">{post.content}</p>
                      </div>
                    )}
                    <div className="absolute inset-0 bg-indigo-600/80 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center gap-8 text-white">
                        <div className="flex flex-col items-center">
                           <Heart size={28} fill="white" className="mb-2" />
                           <span className="text-lg font-bold">{post.likes?.length || 0}</span>
                        </div>
                    </div>
                 </div>
               ))
             ) : (
               <div className="col-span-full py-40 flex flex-col items-center premium-card border-dashed border-2">
                  <Bookmark size={40} className="text-slate-300 mb-4" />
                  <p className="text-xl font-bold text-slate-700 dark:text-slate-300 uppercase tracking-widest">Archive Empty</p>
                  <p className="text-sm text-slate-400 mt-2">Posts you save will appear here</p>
               </div>
             )}
          </div>
        )}
        {activeTab === 'tagged' && <div className="py-40 text-center premium-card bg-slate-50/10 font-bold text-slate-400 uppercase tracking-widest">Not mentioned yet</div>}
      </div>

      {/* Redesigned Edit Profile Modal */}
      {showEditModal && (
        <div className="modal-backdrop px-4 z-[200]">
           <div className="bg-white dark:bg-slate-900 w-full max-w-xl rounded-3xl overflow-hidden shadow-3xl border border-slate-200 dark:border-white/10 animate-fade-in flex flex-col">
              <div className="p-6 border-b border-slate-200 dark:border-white/10 flex justify-between items-center bg-slate-50/50 dark:bg-white/5">
                 <button onClick={() => setShowEditModal(false)} className="w-10 h-10 flex items-center justify-center hover:bg-slate-200 dark:hover:bg-white/10 rounded-full transition-all"><X size={22} /></button>
                 <h3 className="text-lg font-bold dark:text-white">Customize Identity</h3>
                 <button onClick={handleUpdateProfile} disabled={isUpdating} className="premium-button py-2 px-6 text-xs uppercase tracking-widest">{isUpdating ? 'Saving...' : 'Update'}</button>
              </div>
              
              <div className="p-8 space-y-8 bg-white dark:bg-slate-900 overflow-y-auto no-scrollbar max-h-[70vh]">
                 <div className="flex items-center gap-6 p-6 bg-slate-100 dark:bg-white/5 rounded-3xl border border-slate-200 dark:border-white/5">
                    <div className="w-20 h-20 rounded-2xl overflow-hidden shadow-2xl shrink-0 group relative">
                       {user.profilePic ? <img src={getMediaUrl(user.profilePic)} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center font-bold text-indigo-500 text-3xl accent-gradient-bg opacity-10 underline">{user.firstName[0]}</div>}
                       <button onClick={() => fileInputRef.current?.click()} className="absolute inset-0 bg-black/50 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity">
                          <ImageIcon size={20} />
                       </button>
                    </div>
                    <div>
                        <p className="font-bold text-lg text-slate-900 dark:text-white leading-none mb-2">{user.firstName}_{user.lastName?.toLowerCase()}</p>
                        <p className="text-indigo-500 text-sm font-bold uppercase tracking-wider">{user.role}</p>
                    </div>
                 </div>

                 <div className="grid gap-6">
                    <div className="space-y-2">
                       <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Full Identity</label>
                       <div className="grid grid-cols-2 gap-4">
                          <input className="premium-input" value={editForm.firstName} onChange={e => setEditForm({...editForm, firstName: e.target.value})} placeholder="First name" />
                          <input className="premium-input" value={editForm.lastName} onChange={e => setEditForm({...editForm, lastName: e.target.value})} placeholder="Last name" />
                       </div>
                    </div>
                    <div className="space-y-2">
                       <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Campus Bio</label>
                       <textarea className="premium-input min-h-[120px] resize-none py-4" value={editForm.bio} onChange={e => setEditForm({...editForm, bio: e.target.value})} placeholder="Tell students about your interests, branch, or current research..." />
                    </div>
                    <div className="space-y-2">
                       <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Campus Branch</label>
                       <select 
                          className="premium-input py-3.5 appearance-none cursor-pointer bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20width%3D%2220%22%20height%3D%2220%22%20viewBox%3D%220%200%2020%2020%22%20fill%3D%22none%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cpath%20d%3D%22M5%207L10%2012L15%207%22%20stroke%3D%22%2394A3B8%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22/%3E%3C/svg%3E')] bg-[length:20px] bg-[right_1rem_center] bg-no-repeat pr-10"
                          value={editForm.branch} 
                          onChange={e => setEditForm({...editForm, branch: e.target.value})}
                       >
                          <option value="Computer Engineering">Computer Engineering</option>
                          <option value="Information Technology Engineering">Information Technology Engineering</option>
                          <option value="Civil Engineering">Civil Engineering</option>
                          <option value="Mechanical Engineering">Mechanical Engineering</option>
                          <option value="EXTC Engineering">EXTC Engineering</option>
                          <option value="Others">Others</option>
                       </select>
                    </div>
                    <div className="space-y-2">
                       <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Portfolio Link</label>
                       <input className="premium-input" value={editForm.website} onChange={e => setEditForm({...editForm, website: e.target.value})} placeholder="https://yourportfolio.com" />
                    </div>
                 </div>
              </div>
           </div>
        </div>
      )}

      {/* Redesigned Connections Modal */}
      {showConnectionsModal && (
         <div className="modal-backdrop px-4 z-[200]">
            <div className="bg-white dark:bg-slate-900 w-full max-w-md rounded-3xl overflow-hidden shadow-3xl border border-slate-200 dark:border-white/10 animate-fade-in flex flex-col">
               <div className="p-6 border-b border-slate-200 dark:border-white/10 flex justify-between items-center bg-slate-50/50 dark:bg-white/5">
                  <div className="w-10"></div>
                  <h3 className="text-lg font-bold capitalize dark:text-white tracking-tight">{connectionType} Hub</h3>
                  <button onClick={() => setShowConnectionsModal(false)} className="w-10 h-10 flex items-center justify-center hover:bg-slate-200 dark:hover:bg-white/10 rounded-full transition-all"><X size={24} /></button>
               </div>
               
               <div className="p-6 space-y-4 overflow-y-auto no-scrollbar max-h-[60vh]">
                  {connections.length > 0 ? connections.map(c => (
                     <div key={c._id} className="flex items-center justify-between group p-3 hover:bg-slate-100 dark:hover:bg-white/5 rounded-2xl transition-all cursor-pointer" onClick={() => { navigate(`/profile/${c._id}`); setShowConnectionsModal(false); }}>
                        <div className="flex items-center gap-4">
                           <div className="w-14 h-14 rounded-2xl overflow-hidden shadow-lg shrink-0 border-2 border-transparent group-hover:border-indigo-500/50 transition-all">
                              {c.profilePic ? <img src={getMediaUrl(c.profilePic)} className="w-full h-full object-cover" /> : <div className="w-full h-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center font-bold text-indigo-500 uppercase">{c.firstName?.[0]}</div>}
                           </div>
                           <div>
                              <p className="text-[15px] font-bold text-slate-900 dark:text-white leading-tight mb-1">{c.firstName} {c.lastName}</p>
                              <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">{c.role || 'Campus User'}</p>
                           </div>
                        </div>
                        <div className="p-2 bg-indigo-500/10 text-indigo-600 rounded-xl">
                           <ChevronRight size={20} />
                        </div>
                     </div>
                  )) : (
                     <div className="text-center py-16 opacity-30">
                        <Users size={48} className="mx-auto mb-4" />
                        <p className="text-sm font-bold uppercase tracking-widest">No Connections Found</p>
                     </div>
                  )}
               </div>
            </div>
         </div>
      )}
      </div>
    </>
  );
};

export default ProfilePage;
