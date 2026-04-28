import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import PostCard from '../components/PostCard';
import { 
  Plus, Image as ImageIcon, Send, Sparkles, 
  TrendingUp, Calendar, Zap, MessageSquare, 
  Search, Filter, LayoutGrid, Camera
} from 'lucide-react';
import toast from 'react-hot-toast';

const Dashboard = () => {
  const { user } = useAuth();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [newPost, setNewPost] = useState({ content: '', media: null });
  const [imagePreview, setImagePreview] = useState(null);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const { data } = await axios.get('/api/academic/posts');
      setPosts(data);
    } catch (err) {
      toast.error('Sync failed');
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setNewPost({ ...newPost, media: file });
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleCreatePost = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('content', newPost.content);
    if (newPost.media) formData.append('media', newPost.media);

    try {
      const { data } = await axios.post('/api/academic/posts', formData);
      setPosts([data, ...posts]);
      setNewPost({ content: '', media: null });
      setImagePreview(null);
      setShowCreate(false);
      toast.success('Signal Dispatched');
    } catch (err) {
      toast.error('Dispatch failed');
    }
  };

  return (
    <div className="animate-fade-in max-w-[800px] mx-auto space-y-12 pb-32">
      
      {/* CAMPUS STORIES (INSTAGRAM STYLE) */}
      <div className="flex gap-6 overflow-x-auto no-scrollbar py-2 px-2">
         {/* My Story */}
         <div className="flex flex-col items-center gap-2 shrink-0 cursor-pointer group">
            <div className="w-20 h-20 rounded-full p-[3px] bg-slate-200 dark:bg-white/5 relative">
               <div className="w-full h-full rounded-full overflow-hidden border-4 border-white dark:border-[#020617] bg-slate-100 flex items-center justify-center">
                  {user?.profilePic ? <img src={user.profilePic} className="w-full h-full object-cover" /> : <Camera className="text-slate-400" size={24} />}
               </div>
               <div className="absolute bottom-0 right-0 bg-indigo-500 text-white p-1 rounded-full border-4 border-white dark:border-[#020617] group-hover:scale-110 transition-transform">
                  <Plus size={14} strokeWidth={4} />
               </div>
            </div>
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">My Story</span>
         </div>

         {/* Mock Stories */}
         {[1, 2, 3, 4, 5, 6, 7].map(i => (
           <div key={i} className="flex flex-col items-center gap-2 shrink-0 cursor-pointer group">
              <div className="w-20 h-20 rounded-full campus-story-ring p-[3px] transition-transform group-active:scale-90">
                 <div className="w-full h-full rounded-full overflow-hidden border-4 border-white dark:border-[#020617] bg-slate-100">
                    <img src={`https://i.pravatar.cc/150?u=story${i}`} className="w-full h-full object-cover" />
                 </div>
              </div>
              <span className="text-[11px] font-black text-slate-900 dark:text-white uppercase tracking-tighter truncate w-20 text-center">Node_0{i}</span>
           </div>
         ))}
      </div>

      {/* CREATE TRIGGER (INSTAGRAM STYLE) */}
      <div 
        className="premium-card p-6 flex items-center gap-6 cursor-pointer hover:bg-slate-50 dark:hover:bg-white/5 transition-all"
        onClick={() => setShowCreate(true)}
      >
         <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 flex items-center justify-center text-indigo-500">
            <Plus size={24} />
         </div>
         <span className="text-lg font-medium text-slate-400 italic">Broadcast a new signal to the campus...</span>
      </div>

      {/* CREATE MODAL */}
      {showCreate && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
           <div className="absolute inset-0 bg-black/80 backdrop-blur-md" onClick={() => setShowCreate(false)}></div>
           <div className="premium-card w-full max-w-[600px] p-8 animate-scale-in relative bg-white dark:bg-[#0f172a]">
              <h2 className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tighter mb-8">New Broadcast</h2>
              <form onSubmit={handleCreatePost} className="space-y-6">
                 <textarea 
                    className="w-full bg-transparent border-none text-xl font-medium placeholder:text-slate-400 focus:ring-0 resize-none h-40 dark:text-white"
                    placeholder="Describe your signal..."
                    value={newPost.content}
                    onChange={(e) => setNewPost({...newPost, content: e.target.value})}
                 />
                 
                 {imagePreview && (
                    <div className="relative rounded-3xl overflow-hidden max-h-[300px] border border-white/10">
                       <img src={imagePreview} className="w-full h-full object-cover" alt="" />
                    </div>
                 )}

                 <div className="flex items-center justify-between pt-6 border-t border-slate-100 dark:border-white/5">
                    <label className="flex items-center gap-3 text-indigo-500 font-bold cursor-pointer p-2 hover:bg-indigo-500/5 rounded-xl transition-all">
                       <ImageIcon size={24} />
                       <input type="file" hidden onChange={handleFileChange} />
                    </label>
                    <button type="submit" className="premium-button px-12 py-3">Dispatch</button>
                 </div>
              </form>
           </div>
        </div>
      )}

      {/* FEED */}
      <div className="space-y-12">
        {loading ? (
          [1, 2].map(i => <div key={i} className="premium-card h-[500px] animate-pulse"></div>)
        ) : (
          posts.map(post => <PostCard key={post._id} post={post} onDelete={(id) => setPosts(posts.filter(p => p._id !== id))} />)
        )}
      </div>
    </div>
  );
};

export default Dashboard;
