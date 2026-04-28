import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import PostCard from '../components/PostCard';
import StoriesBar from '../components/StoriesBar';
import { 
  TrendingUp, Clock, HelpCircle, Zap, Activity, Info, Rocket, ChevronRight, Image as ImageIcon, Plus, Terminal, X, Camera, Sparkles, MessageSquare, PlusSquare, Search, Award
} from 'lucide-react';
import toast from 'react-hot-toast';
import { useLocation, useNavigate } from 'react-router-dom';
import { getMediaUrl } from '../utils/media';

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
        content: postText || ' ', 
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
    <>
    <div className="max-w-[1440px] mx-auto px-4 md:px-8 xl:px-12 py-10 animate-fade-in pb-32">
        <div className="feed-grid">
           {/* Left: Main Feed Content */}
           <div className="feed-main">
              {/* Stories Reel Area */}
              <div className="mb-12">
                <StoriesBar />
              </div>

              {/* Premium Post Signal Box */}
              <div 
                className="premium-card p-6 mb-12 flex items-center gap-6 bg-white dark:bg-white/5 cursor-pointer hover:border-indigo-500/30 transition-all group overflow-hidden relative"
                onClick={() => setShowCreateModal(true)}
              >
                 <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 blur-3xl -z-10 group-hover:bg-indigo-500/10 transition-colors"></div>
                 <div className="w-14 h-14 rounded-2xl overflow-hidden shadow-xl border-2 border-white dark:border-slate-800 shrink-0">
                    {user?.profilePic ? (
                      <img 
                        src={getMediaUrl(user.profilePic)} 
                        className="w-full h-full object-cover" 
                        alt=""
                      />
                    ) : (
                      <div className="w-full h-full bg-indigo-500 flex items-center justify-center font-bold text-white uppercase text-xl">{user?.firstName?.[0] || '?'}</div>
                    )}
                 </div>
                 <div className="flex-1 px-6 py-4 bg-slate-50 dark:bg-black/20 rounded-2xl border border-slate-100 dark:border-white/5 text-slate-400 font-bold text-[14px] group-hover:text-slate-600 dark:group-hover:text-slate-200 transition-colors">
                    Tell the hub something interesting, {user?.firstName || 'Explorer'}...
                 </div>
                 <div className="w-14 h-14 rounded-2xl bg-indigo-500 text-white flex items-center justify-center shadow-2xl shadow-indigo-500/30 group-hover:scale-105 transition-all group-hover:rotate-12">
                    <PlusSquare size={24} strokeWidth={2.5} />
                 </div>
              </div>

              {/* Filtering Tabs */}
              <div className="flex items-center gap-10 mb-10 pb-4 border-b border-slate-200 dark:border-white/5 mx-2">
                 {[
                   { id: 'latest',   label: 'Sync Feed',   icon: Clock },
                   { id: 'trending', label: 'Trending', icon: TrendingUp }
                 ].map(tab => (
                   <button 
                     key={tab.id}
                     onClick={() => setActiveTab(tab.id)}
                     className={`group flex items-center gap-3 transition-all relative py-2 ${
                        activeTab === tab.id ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-400 hover:text-slate-900 dark:hover:text-white'
                     }`}
                   >
                      <tab.icon size={20} className={activeTab === tab.id ? 'animate-pulse' : ''} />
                      <span className="text-sm font-black uppercase tracking-widest">{tab.label}</span>
                      {activeTab === tab.id && (
                        <div className="absolute -bottom-4 left-0 right-0 h-1.5 accent-gradient-bg rounded-t-full shadow-[0_0_15px_rgba(99,102,241,0.5)]"></div>
                      )}
                   </button>
                 ))}
              </div>

              <div className="space-y-12">
                {loading ? (
                   [1, 2].map(i => (
                     <div key={i} className="h-[600px] w-full bg-slate-100 dark:bg-white/5 animate-pulse rounded-3xl"></div>
                   ))
                ) : posts.length > 0 ? (
                   posts.map(post => <PostCard key={post._id} post={post} onDelete={() => fetchPosts()} />)
                ) : (
                   <div className="py-40 text-center flex flex-col items-center">
                      <div className="w-24 h-24 bg-slate-100 dark:bg-white/5 rounded-3xl flex items-center justify-center mb-8 border border-slate-200 dark:border-white/10">
                        <Activity size={40} className="text-slate-300" />
                      </div>
                      <p className="text-[12px] font-black uppercase tracking-[0.5em] text-slate-400">Hub is quiet right now</p>
                      <button onClick={fetchPosts} className="mt-8 text-indigo-500 font-black hover:underline uppercase tracking-widest text-[11px]">Reconnect to Sync</button>
                   </div>
                )}
              </div>
           </div>

           {/* Right: Premium Sidebar */}
           <div className="feed-side hidden lg:block">
              <div className="sticky top-28 space-y-10">
                 {/* Current User Card */}
                 <div className="premium-card p-8 bg-white dark:bg-white/5 relative overflow-hidden group">
                    <div className="absolute -top-12 -right-12 w-32 h-32 bg-indigo-500/10 blur-3xl rounded-full group-hover:scale-150 transition-transform duration-700"></div>
                    {user ? (
                       <div className="flex flex-col items-center text-center">
                          <div 
                            className="w-24 h-24 rounded-3xl campus-story-ring p-1 shadow-2xl cursor-pointer group mb-6 overflow-hidden transition-all duration-500 hover:scale-105" 
                            onClick={() => navigate('/profile')}
                          >
                             <div className="w-full h-full rounded-2xl overflow-hidden border-4 border-white dark:border-slate-900">
                                {user.profilePic ? (
                                  <img 
                                    src={getMediaUrl(user.profilePic)} 
                                    className="w-full h-full object-cover transition-transform group-hover:scale-110" 
                                    alt=""
                                  />
                                ) : (
                                  <div className="w-full h-full bg-indigo-500 flex items-center justify-center font-bold text-3xl text-white uppercase">{user.firstName?.[0]}</div>
                                )}
                             </div>
                          </div>
                          <h3 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tighter">
                            {user.firstName} {user.lastName}
                          </h3>
                          <p className="text-[12px] text-indigo-500 font-black uppercase tracking-widest mt-1">@{user.firstName?.toLowerCase()}_{user.lastName?.toLowerCase()}</p>
                          
                          <div className="w-full grid grid-cols-2 gap-4 mt-8 pt-8 border-t border-slate-100 dark:border-white/5">
                             <div className="text-center">
                                <p className="text-lg font-black text-slate-900 dark:text-white">{user?.friends?.length || 0}</p>
                                <p className="text-[9px] uppercase font-black text-slate-400 tracking-widest">SQUAD</p>
                             </div>
                             <div className="text-center">
                                <p className="text-lg font-black text-slate-900 dark:text-white uppercase">{user?.role || 'STUDENT'}</p>
                                <p className="text-[9px] uppercase font-black text-slate-400 tracking-widest">RANK</p>
                             </div>
                          </div>
                       </div>
                    ) : (
                       <div className="flex flex-col items-center py-10">
                          <Zap size={48} className="text-indigo-500 mb-6" />
                          <p className="text-lg font-black text-slate-900 dark:text-white mb-2 uppercase">GUEST NODE</p>
                          <button onClick={() => navigate('/login')} className="premium-button py-2 px-8 text-[10px]">SYNC NOW</button>
                       </div>
                    )}
                 </div>

                 {/* Suggestions Hub */}
                 <div className="premium-card p-8">
                    <div className="flex items-center justify-between mb-8">
                       <h4 className="text-[12px] font-black text-slate-900 dark:text-white uppercase tracking-widest">Discovery Hub</h4>
                       <Award size={18} className="text-indigo-500" />
                    </div>
                    
                    <div className="space-y-6">
                        {suggestions.map(s => (
                           <div key={s._id} className="flex items-center justify-between group">
                              <div className="flex items-center gap-4 cursor-pointer" onClick={() => navigate(`/profile/${s._id}`)}>
                                 <div className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-white/5 flex items-center justify-center text-sm font-black text-indigo-500 uppercase overflow-hidden border border-slate-200 dark:border-white/10 group-hover:border-indigo-500/50 transition-all">
                                    {s.profilePic ? (
                                      <img 
                                        src={getMediaUrl(s.profilePic)} 
                                        className="w-full h-full object-cover" 
                                        alt=""
                                      />
                                    ) : s.firstName?.[0]}
                                 </div>
                                 <div>
                                    <p className="text-[14px] font-black text-slate-900 dark:text-white group-hover:text-indigo-500 transition-colors uppercase tracking-tight leading-none mb-1">{s.firstName} {s.lastName?.[0]}.</p>
                                    <p className="text-[11px] text-slate-400 font-bold uppercase tracking-widest">{s.branch?.split(' ')[0] || 'CAMPUS'}</p>
                                 </div>
                              </div>
                              <button onClick={(e) => { e.stopPropagation(); handleFollow(s._id); }} className="w-10 h-10 bg-indigo-500/10 hover:bg-indigo-500 text-indigo-600 hover:text-white rounded-xl transition-all active:scale-90 flex items-center justify-center shadow-lg hover:shadow-indigo-500/20">
                                <Plus size={18} strokeWidth={3} />
                              </button>
                           </div>
                        ))}
                    </div>
                 </div>

                 {/* Premium Quick Footer */}
                 <div className="p-4 opacity-40 space-y-6 border-l-2 border-slate-100 dark:border-white/5 ml-4">
                    <div className="flex flex-wrap gap-x-6 gap-y-3">
                       {['DIRECTORY', 'ARCHIVE', 'SAFETY', 'POLICIES', 'CORE'].map(l => (
                          <a key={l} href="#" className="text-[10px] font-black text-slate-500 hover:text-indigo-500 transition-all tracking-widest">{l}</a>
                       ))}
                    </div>
                    <p className="text-[9px] font-black text-slate-400 tracking-[0.3em] uppercase">© 2026 HUB OS • ESTABLISHED FOR EXCELLENCE</p>
                 </div>
              </div>
           </div>
        </div>

        {/* Create Modal */}
        {showCreateModal && (
          <div className="modal-backdrop px-4">
             <div className="bg-white dark:bg-[#0a0d17] w-full max-w-[650px] rounded-[32px] shadow-[0_40px_100px_-15px_rgba(0,0,0,0.5)] overflow-hidden border border-slate-200 dark:border-white/10 flex flex-col h-[750px] animate-scale-in">
                <div className="p-6 border-b border-slate-200 dark:border-white/10 flex justify-between items-center bg-slate-50/50 dark:bg-white/5">
                   <button onClick={() => setShowCreateModal(false)} className="w-12 h-12 flex items-center justify-center hover:bg-slate-200 dark:hover:bg-white/10 rounded-2xl transition-all"><X size={24} /></button>
                   <h3 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tighter">Signal Output</h3>
                   <button 
                     onClick={handleCreatePost}
                     disabled={!postText.trim() && !imagePreview}
                     className="premium-button py-2.5 px-8 disabled:opacity-30"
                   >
                     Publish
                   </button>
                </div>
                
                <div className="flex-1 flex flex-col overflow-y-auto no-scrollbar">
                   {/* Media Upload Area */}
                   <div className="w-full h-[450px] bg-slate-50 dark:bg-black/40 flex items-center justify-center relative border-b border-slate-200 dark:border-white/5 overflow-hidden">
                      {!imagePreview ? (
                         <label className="flex flex-col items-center gap-6 cursor-pointer hover:scale-105 transition-all p-12 text-center group">
                            <div className="w-24 h-24 bg-indigo-500/10 rounded-[32px] flex items-center justify-center text-indigo-500 mb-2 group-hover:rotate-12 transition-transform shadow-xl">
                               <ImageIcon size={48} />
                            </div>
                            <div>
                               <p className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tighter">Visual Signal</p>
                               <p className="text-[12px] text-slate-400 font-bold uppercase tracking-widest mt-2">Max payload: 50MB</p>
                            </div>
                            <input type="file" className="hidden" accept="image/*,video/*" onChange={handleImageChange} />
                            <div className="mt-4 px-10 py-4 bg-indigo-500 hover:bg-indigo-600 text-white rounded-2xl text-[11px] font-black shadow-2xl shadow-indigo-500/30 transition-all uppercase tracking-[0.2em]">Initiate Upload</div>
                         </label>
                      ) : (
                         <div className="w-full h-full relative group">
                            {selectedFile?.type?.startsWith('video/') ? (
                               <video src={imagePreview} className="w-full h-full object-cover" controls autoPlay loop muted />
                            ) : (
                               <img src={imagePreview} className="w-full h-full object-cover" alt="" />
                            )}
                            <button onClick={() => {setImagePreview(null); setSelectedFile(null);}} className="absolute top-8 right-8 p-5 bg-black/60 text-white rounded-3xl hover:bg-black transition-all shadow-2xl backdrop-blur-xl border border-white/10"><X size={28} /></button>
                         </div>
                      )}
                   </div>

                   {/* Post Details */}
                   <div className="p-8 flex flex-col flex-1 bg-white dark:bg-[#0a0d17]">
                      <div className="flex items-center gap-4 mb-8">
                         <div className="w-12 h-12 rounded-2xl overflow-hidden shadow-2xl border-2 border-indigo-500/20">
                            {user?.profilePic ? <img src={getMediaUrl(user.profilePic)} className="w-full h-full object-cover" alt="" /> : <div className="w-full h-full bg-indigo-500/10 flex items-center justify-center font-bold text-indigo-500 uppercase">{user?.firstName?.[0]}</div>}
                         </div>
                         <div>
                            <p className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-tight">Syncing as {user?.firstName}</p>
                            <p className="text-[11px] text-indigo-500 font-black uppercase tracking-widest">{user?.role || 'MEMBER'}</p>
                         </div>
                      </div>
                      
                      <textarea 
                        className="w-full flex-1 bg-transparent border-none text-xl outline-none text-slate-900 dark:text-white resize-none py-2 placeholder:text-slate-400 font-bold tracking-tight"
                        placeholder="Define your campus signal..." 
                        value={postText}
                        onChange={e => setPostText(e.target.value)}
                      />

                      {/* Category Chipset */}
                      <div className="mt-10 flex flex-wrap gap-4 pt-8 border-t border-slate-100 dark:border-white/5">
                          {['general', 'doubt'].map(type => (
                             <button key={type} onClick={() => setPostType(type)} className={`px-8 py-3 rounded-2xl text-[11px] font-black uppercase tracking-[0.2em] transition-all shadow-md ${postType === type ? 'accent-gradient-bg text-white shadow-indigo-500/30' : 'bg-slate-100 dark:bg-white/5 text-slate-500 hover:bg-slate-200 dark:hover:bg-white/10'}`}>{type}</button>
                          ))}
                          
                          <button 
                            onClick={() => setShowMusicPicker(!showMusicPicker)}
                            className={`px-8 py-3 rounded-2xl text-[11px] font-black uppercase tracking-[0.2em] transition-all shadow-md ${selectedMusic ? 'bg-emerald-500 text-white' : 'bg-slate-100 dark:bg-white/5 text-slate-500'} flex items-center gap-2`}
                          >
                             <Activity size={16} /> {selectedMusic ? selectedMusic.title : 'Audio Feed'}
                          </button>
                      </div>
                   </div>
                </div>
             </div>
          </div>
        )}
     </div>
    </>
  );
};

export default Dashboard;rd;
