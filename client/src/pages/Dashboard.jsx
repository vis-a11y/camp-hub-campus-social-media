import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import PostCard from '../components/PostCard';
import StoriesBar from '../components/StoriesBar';
import { 
  TrendingUp, Clock, HelpCircle, Zap, Activity, Info, Rocket, ChevronRight, Image as ImageIcon, Plus, Terminal, X, Camera, Sparkles, MessageSquare, PlusSquare, Search
} from 'lucide-react';
import toast from 'react-hot-toast';
import { useLocation, useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [posts, setPosts] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('latest');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [postText, setPostText] = useState('');
  const [imagePreview, setImagePreview] = useState(null);
  const [postType, setPostType] = useState('general');
  const [selectedMusic, setSelectedMusic] = useState(null);
  const [showMusicPicker, setShowMusicPicker] = useState(false);

  const mockMusic = [
    { id: 1, title: 'Campus Lo-Fi', artist: 'Study Beats', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3' },
    { id: 2, title: 'Morning Lecture', artist: 'Ambient Focus', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3' },
    { id: 3, title: 'Gym Session', artist: 'High Energy', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3' },
  ];

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (params.get('create') === 'true') {
      setShowCreateModal(true);
    }
    fetchPosts();
    fetchSuggestions();
  }, [activeTab, location.search]);

  const fetchPosts = async () => {
    setLoading(true);
    const params = new URLSearchParams(location.search);
    const postId = params.get('post');

    try {
      if (postId) {
        const { data } = await axios.get(`/api/academic/posts/${postId}`);
        setPosts([data]);
      } else {
        const { data } = await axios.get(`/api/academic/posts?sort=${activeTab}`);
        setPosts(data);
      }
    } catch {
      setPosts([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchSuggestions = async () => {
    try {
      const { data } = await axios.get('/api/auth/users');
      // Filter out self and pick 5 random
      const filtered = data.filter(u => u._id !== user?._id).slice(0, 5);
      setSuggestions(filtered);
    } catch {
       setSuggestions([]);
    }
  };

  const [selectedFile, setSelectedFile] = useState(null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleCreatePost = async () => {
    if (!postText.trim() && !selectedFile) return;
    try {
      let mediaUrl = '';
      if (selectedFile) {
        const formData = new FormData();
        formData.append('file', selectedFile);
        const { data: uploadData } = await axios.post('/api/upload', formData);
        mediaUrl = uploadData.url;
      }
      
      await axios.post('/api/academic/posts', { 
        content: postText || ' ', // Space fallback if no caption to pass DB validation seamlessly
        media: mediaUrl,
        mediaType: selectedFile ? (selectedFile.type.startsWith('video/') ? 'video' : 'image') : 'image',
        music: selectedMusic,
        isNotice: postType === 'notice',
        isAnnouncement: postType === 'announcement',
        isDoubt: postType === 'doubt'
      });
      toast.success('Shared successfully');
      setShowCreateModal(false);
      setPostText('');
      setImagePreview(null);
      setSelectedFile(null);
      setPostType('general');
      fetchPosts();
    } catch {
      toast.error('Post failed to upload');
    }
  };

  const handleFollow = async (id) => {
    try {
      await axios.put(`/api/auth/users/${id}/follow`);
      toast.success('Following');
      setSuggestions(suggestions.filter(s => s._id !== id));
    } catch {
      toast.error('Action failed');
    }
  };

  return (
    <div className="max-w-[1440px] mx-auto px-4 md:px-8 xl:px-12 py-10 animate-fade-in pb-32">
        <div className="feed-grid">
           {/* Left: Main Feed Content */}
           <div className="feed-main">
              {/* Stories Reel Area */}
              <StoriesBar />

              {/* Filtering Tabs - Modern Style */}
              <div className="flex items-center gap-8 mb-8 pb-4 border-b border-slate-200 dark:border-white/5 mx-2">
                 {[
                   { id: 'latest',   label: 'Recent Feed',   icon: Clock },
                   { id: 'trending', label: 'Trending', icon: TrendingUp }
                 ].map(tab => (
                   <button 
                     key={tab.id}
                     onClick={() => setActiveTab(tab.id)}
                     className={`group flex items-center gap-2.5 transition-all relative py-2 ${
                        activeTab === tab.id ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-200'
                     }`}
                   >
                      <tab.icon size={18} className={activeTab === tab.id ? 'animate-pulse' : ''} />
                      <span className="text-sm font-bold tracking-tight uppercase">{tab.label}</span>
                      {activeTab === tab.id && (
                        <div className="absolute -bottom-4 left-0 right-0 h-1 accent-gradient-bg rounded-t-full shadow-[0_-4px_10px_rgba(99,102,241,0.3)]"></div>
                      )}
                   </button>
                 ))}
              </div>

              <div className="space-y-8">
                {loading ? (
                   [1, 2].map(i => (
                     <div key={i} className="h-[500px] w-full bg-slate-100 dark:bg-slate-900 animate-pulse rounded-3xl border border-slate-200 dark:border-white/5"></div>
                   ))
                ) : posts.length > 0 ? (
                   posts.map(post => <PostCard key={post._id} post={post} onDelete={() => fetchPosts()} />)
                ) : (
                   <div className="py-40 text-center opacity-40 flex flex-col items-center">
                      <div className="w-20 h-20 bg-slate-100 dark:bg-white/5 rounded-full flex items-center justify-center mb-6">
                        <Activity size={32} />
                      </div>
                      <p className="text-sm font-bold uppercase tracking-[0.4em] text-slate-500">End of Feed</p>
                      <button onClick={fetchPosts} className="mt-6 text-indigo-500 font-bold hover:underline">Refresh Content</button>
                   </div>
                )}
              </div>
           </div>

           {/* Right: Premium Sidebar */}
           <div className="feed-side hidden lg:block">
              <div className="sticky top-28 space-y-8">
                 {/* Current User Card */}
                 <div className="premium-card p-6 bg-slate-50/50 dark:bg-white/5">
                    {user ? (
                       <div className="flex items-center gap-4">
                          <div 
                            className="w-16 h-16 rounded-2xl campus-story-ring p-1 shadow-lg cursor-pointer group overflow-hidden" 
                            onClick={() => navigate('/profile')}
                          >
                             <div className="w-full h-full rounded-2xl overflow-hidden border-2 border-white dark:border-slate-800">
                                {user.profilePic ? (
                                  <img src={user.profilePic} className="w-full h-full object-cover transition-transform group-hover:scale-110" />
                                ) : (
                                  <div className="w-full h-full bg-indigo-500 flex items-center justify-center font-bold text-2xl text-white uppercase">{user.firstName?.[0]}</div>
                                )}
                             </div>
                          </div>
                          <div className="flex-1">
                             <p className="text-[16px] font-bold text-slate-900 dark:text-white leading-tight">
                               {user.firstName} {user.lastName}
                             </p>
                             <p className="text-[13px] text-slate-500 font-medium">@{user.firstName?.toLowerCase()}_{user.lastName?.toLowerCase()}</p>
                          </div>
                       </div>
                    ) : (
                       <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-xl bg-slate-100 dark:bg-white/5 flex items-center justify-center text-slate-400">
                             <Zap size={24} />
                          </div>
                          <div className="flex-1">
                             <p className="text-[15px] font-bold text-slate-900 dark:text-white leading-none">Guest Explorer</p>
                             <button onClick={() => navigate('/login')} className="text-[12px] text-indigo-500 font-bold hover:underline mt-1">Sign in to sync</button>
                          </div>
                       </div>
                    )}
                    <div className="mt-6 pt-6 border-t border-slate-200 dark:border-white/5 flex justify-between items-center">
                       <div className="text-center flex-1 border-r border-slate-200 dark:border-white/5">
                          <p className="text-sm font-bold text-slate-900 dark:text-white">{user?.friends?.length || 0}</p>
                          <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Friends</p>
                       </div>
                       <div className="text-center flex-1">
                          <p className="text-sm font-bold text-slate-900 dark:text-white">{user?.role || 'Student'}</p>
                          <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Rank</p>
                       </div>
                    </div>
                 </div>

                 {/* Suggestions Hub */}
                 <div className="premium-card p-6">
                    <div className="flex items-center justify-between mb-6">
                       <h4 className="text-[14px] font-bold text-slate-900 dark:text-white">People to Meet</h4>
                       <button className="text-[12px] font-bold text-indigo-500 hover:text-indigo-600">See all</button>
                    </div>
                    
                    <div className="space-y-5">
                        {suggestions.map(s => (
                           <div key={s._id} className="flex items-center justify-between group">
                              <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate(`/profile/${s._id}`)}>
                                 <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-white/5 flex items-center justify-center text-xs font-bold text-indigo-500 uppercase overflow-hidden border border-slate-100 dark:border-white/5">
                                    {s.profilePic ? <img src={s.profilePic} className="w-full h-full object-cover" /> : s.firstName?.[0]}
                                 </div>
                                 <div>
                                    <p className="text-[13px] font-bold text-slate-900 dark:text-white group-hover:text-indigo-500 transition-colors uppercase tracking-tight">{s.firstName} {s.lastName?.[0]}.</p>
                                    <p className="text-[11px] text-slate-400 mt-0.5">{s.branch || 'Campus Student'}</p>
                                 </div>
                              </div>
                              <button onClick={(e) => { e.stopPropagation(); handleFollow(s._id); }} className="p-2 bg-indigo-500/10 hover:bg-indigo-500 text-indigo-600 hover:text-white rounded-lg transition-all active:scale-90">
                                <Plus size={16} strokeWidth={3} />
                              </button>
                           </div>
                        ))}
                    </div>
                 </div>

                 {/* Premium Quick Footer */}
                 <div className="p-2 opacity-50 space-y-4">
                    <div className="flex flex-wrap gap-x-4 gap-y-2">
                       {['Directory', 'Library', 'Safety', 'Policies', 'Feedback', 'Careers'].map(l => (
                          <a key={l} href="#" className="text-[11px] font-semibold text-slate-500 hover:text-indigo-500 transition-all">{l}</a>
                       ))}
                    </div>
                    <p className="text-[10px] font-bold text-slate-400 tracking-widest uppercase">© 2026 Academic Hub • CampChat OS</p>
                 </div>
              </div>
           </div>
        </div>

        {/* Global Create CTA (Floating Action Button style but desktop visible) */}
        {!showCreateModal && (
          <button 
            onClick={() => setShowCreateModal(true)}
            className="fixed bottom-10 right-10 w-16 h-16 accent-gradient-bg rounded-2xl shadow-2xl flex items-center justify-center text-white hover:scale-110 active:scale-90 transition-all z-50 animate-bounce cursor-pointer group"
          >
             <Plus size={32} strokeWidth={3} className="group-hover:rotate-90 transition-transform duration-300" />
          </button>
        )}

        {/* Create Modal - Redesigned */}
        {showCreateModal && (
          <div className="modal-backdrop px-4">
             <div className="bg-white dark:bg-slate-900 w-full max-w-[600px] rounded-3xl shadow-3xl overflow-hidden border border-slate-200 dark:border-white/10 flex flex-col h-[700px] animate-fade-in">
                <div className="p-5 border-b border-slate-200 dark:border-white/10 flex justify-between items-center">
                   <button onClick={() => setShowCreateModal(false)} className="w-10 h-10 flex items-center justify-center hover:bg-slate-100 dark:hover:bg-white/5 rounded-full transition-all"><X size={24} /></button>
                   <h3 className="text-[18px] font-bold text-slate-900 dark:text-white">New Campus Publication</h3>
                   <button 
                     onClick={handleCreatePost}
                     disabled={!postText.trim() && !imagePreview}
                     className="premium-button text-[13px] uppercase tracking-widest py-2 px-6 disabled:opacity-30"
                   >
                     Publish
                   </button>
                </div>
                
                <div className="flex-1 flex flex-col overflow-y-auto no-scrollbar">
                   {/* Media Upload Area - Premium */}
                   <div className="w-full h-[400px] bg-slate-50 dark:bg-neutral-950 flex items-center justify-center relative border-b border-slate-200 dark:border-white/5">
                      {!imagePreview ? (
                         <label className="flex flex-col items-center gap-6 cursor-pointer hover:scale-105 transition-all p-10 text-center">
                            <div className="w-20 h-20 bg-indigo-500/10 rounded-3xl flex items-center justify-center text-indigo-500 mb-2">
                               <ImageIcon size={40} />
                            </div>
                            <div>
                               <p className="text-xl font-bold text-slate-900 dark:text-white">Visual Content</p>
                               <p className="text-sm text-slate-500 mt-1 max-w-[240px]">Drop high-quality images or student life videos here</p>
                            </div>
                            <input type="file" className="hidden" accept="image/*,video/*" onChange={handleImageChange} />
                            <div className="mt-2 px-8 py-3 bg-indigo-500 hover:bg-indigo-600 text-white rounded-2xl text-sm font-bold shadow-xl shadow-indigo-500/20 transition-all uppercase tracking-widest">Browse Files</div>
                         </label>
                      ) : (
                         <div className="w-full h-full relative">
                            {selectedFile?.type?.startsWith('video/') ? (
                               <video src={imagePreview} className="w-full h-full object-cover" controls autoPlay loop muted />
                            ) : (
                               <img src={imagePreview} className="w-full h-full object-cover" />
                            )}
                            <button onClick={() => {setImagePreview(null); setSelectedFile(null);}} className="absolute top-6 right-6 p-4 bg-black/60 text-white rounded-2xl hover:bg-black transition-all shadow-2xl backdrop-blur-md border border-white/10"><X size={24} /></button>
                         </div>
                      )}
                   </div>

                   {/* Post Details */}
                   <div className="p-6 flex flex-col flex-1">
                      <div className="flex items-center gap-3 mb-6">
                         <div className="w-10 h-10 rounded-xl overflow-hidden shadow-md">
                            {user?.profilePic ? <img src={user.profilePic} className="w-full h-full object-cover" /> : <div className="w-full h-full bg-indigo-500/10 flex items-center justify-center font-bold text-indigo-500 uppercase">{user?.firstName?.[0]}</div>}
                         </div>
                         <div>
                            <p className="text-sm font-bold text-slate-900 dark:text-white">Posting as {user?.firstName}</p>
                            <p className="text-xs text-slate-400 font-medium">{user?.role || 'Campus User'}</p>
                         </div>
                      </div>
                      
                      <textarea 
                        className="w-full flex-1 bg-transparent border-none text-[16px] outline-none text-slate-900 dark:text-white resize-none py-2 placeholder:text-slate-400 font-medium"
                        placeholder="Share your thoughts, academic updates, or doubts with the community..." 
                        value={postText}
                        onChange={e => setPostText(e.target.value)}
                      />

                      {/* Category Chipset */}
                      <div className="mt-8 flex flex-wrap gap-3 pt-6 border-t border-slate-200 dark:border-white/5">
                          {['general', 'doubt'].map(type => (
                             <button key={type} onClick={() => setPostType(type)} className={`px-6 py-2.5 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all ${postType === type ? 'accent-gradient-bg text-white shadow-lg shadow-indigo-500/20' : 'bg-slate-100 dark:bg-white/5 text-slate-500 hover:text-slate-900 dark:hover:text-white outline-1 outline-slate-200'}`}>{type}</button>
                          ))}
                          
                          {/* Music Button */}
                          <button 
                            onClick={() => setShowMusicPicker(!showMusicPicker)}
                            className={`px-6 py-2.5 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all ${selectedMusic ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/20' : 'bg-slate-100 dark:bg-white/5 text-slate-500 hover:text-slate-900 dark:hover:text-white outline-1 outline-slate-200'} flex items-center gap-2`}
                          >
                             <Activity size={14} /> {selectedMusic ? selectedMusic.title : 'Add Music'}
                          </button>

                          {(user?.role === 'faculty' || user?.role === 'admin') && ['announcement', 'notice'].map(type => (
                             <button key={type} onClick={() => setPostType(type)} className={`px-6 py-2.5 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all ${postType === type ? 'bg-indigo-600 text-white shadow-lg' : 'bg-slate-100 dark:bg-white/5 text-slate-500 hover:text-slate-900 dark:hover:text-white outline-1 outline-slate-200'}`}>{type}</button>
                          ))}
                      </div>

                      {/* Music Picker Dropdown */}
                      {showMusicPicker && (
                        <div className="mt-4 p-4 bg-slate-50 dark:bg-white/5 rounded-2xl border border-slate-200 dark:border-white/5 space-y-2 animate-scale-in">
                           <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 px-2">Select Track</p>
                           {mockMusic.map(m => (
                             <button 
                               key={m.id} 
                               onClick={() => { setSelectedMusic(m); setShowMusicPicker(false); }}
                               className="w-full text-left p-3 hover:bg-white dark:hover:bg-white/5 rounded-xl flex items-center justify-between group transition-all"
                             >
                                <div>
                                   <p className="text-sm font-bold text-slate-900 dark:text-white">{m.title}</p>
                                   <p className="text-[11px] text-slate-500">{m.artist}</p>
                                </div>
                                <div className="p-2 bg-indigo-500/10 text-indigo-500 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity">
                                   <Plus size={14} />
                                </div>
                             </button>
                           ))}
                        </div>
                      )}
                    </div>
                </div>
             </div>
          </div>
        )}
    </div>
  );
};

export default Dashboard;
