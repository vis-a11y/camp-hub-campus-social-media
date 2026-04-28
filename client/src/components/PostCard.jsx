import React, { useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { 
  Heart, MessageSquare, Share2, Bookmark, MoreHorizontal, Trash2, BadgeCheck, Smile, Send, Sparkles, Zap
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { getMediaUrl } from '../utils/media';

const PostCard = ({ post, onDelete }) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [likes, setLikes] = useState(post.likes || []);
  const [showComments, setShowComments] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [isSaved, setIsSaved] = useState(user?.savedPosts?.includes(post._id));
  const [showHeartAnim, setShowHeartAnim] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = React.useRef(null);

  const isLiked = likes.includes(user?._id);

  const handleLike = async () => {
    if (!user) return toast.error('Sign in to interact');
    try {
      const { data } = await axios.post(`/api/academic/posts/${post._id}/like`);
      setLikes(data.likes);
    } catch {
      setLikes(prev => isLiked ? prev.filter(id => id !== user?._id) : [...prev, user?._id]);
    }
  };

  const handleDoubleTap = () => {
    if (!user) return toast.error('Sign in to interact');
    if (!isLiked) handleLike();
    setShowHeartAnim(true);
    setTimeout(() => setShowHeartAnim(false), 800);
  };

  const handleSave = async () => {
    if (!user) return toast.error('Sign in to save posts');
    try {
      const { data } = await axios.post(`/api/academic/posts/${post._id}/save`);
      setIsSaved(data.saved);
      toast.success(data.saved ? 'Signal Stored' : 'Signal Removed');
    } catch {
      toast.error('Sync failed');
    }
  };

  const submitComment = async (e) => {
    e.preventDefault();
    if (!user) return toast.error('Authentication required');
    if (!commentText.trim()) return;
    try {
      await axios.post(`/api/academic/posts/${post._id}/comment`, { text: commentText });
      setCommentText('');
      toast.success('Comment injected');
    } catch {
      toast.error('Injection failed');
    }
  };

  const handleDelete = async () => {
     if (window.confirm('Erase this signal permanently?')) {
        try {
            await axios.delete(`/api/academic/posts/${post._id}`);
            onDelete(post._id);
            toast.success('Signal purged');
        } catch {
            onDelete(post._id);
        }
     }
  };

  return (
    <div className="premium-card overflow-hidden animate-fade-in group border-none relative">
      <div className="absolute inset-0 bg-indigo-500/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>
      
      {/* Post Header */}
      <div className="flex items-center justify-between p-6 bg-white/50 dark:bg-black/20 backdrop-blur-md">
        <div className="flex items-center gap-4">
          <div 
            className="w-14 h-14 rounded-2xl campus-story-ring p-1 shadow-2xl cursor-pointer overflow-hidden transition-all duration-500 hover:scale-110 active:scale-95" 
            onClick={() => navigate(`/profile/${post.author?._id}`)}
          >
            <div className="w-full h-full rounded-xl overflow-hidden border-2 border-white dark:border-slate-900 bg-slate-100 dark:bg-slate-800">
              {post.author?.profilePic ? (
                <img src={getMediaUrl(post.author.profilePic)} className="w-full h-full object-cover" alt="" />
              ) : (
                <div className="w-full h-full bg-indigo-500 flex items-center justify-center font-black text-white uppercase text-xl">
                  {post.author?.firstName?.[0]}
                </div>
              )}
            </div>
          </div>
          <div>
             <div className="flex items-center gap-2 mb-0.5">
                <h4 
                  className="text-[16px] font-black text-slate-900 dark:text-white hover:text-indigo-500 transition-colors cursor-pointer uppercase tracking-tighter" 
                  onClick={() => navigate(`/profile/${post.author?._id}`)}
                >
                  {post.author?.firstName} {post.author?.lastName}
                </h4>
                {post.author?.role !== 'student' && (
                  <div className="p-1 bg-indigo-500 rounded-lg text-white shadow-lg shadow-indigo-500/20">
                    <BadgeCheck size={12} fill="white" strokeWidth={3} className="text-indigo-500" />
                  </div>
                )}
                
                {/* Status Badges */}
                <div className="flex gap-2 ml-2">
                  {post.isAnnouncement && <span className="px-3 py-1 bg-rose-500/10 text-rose-500 text-[9px] font-black uppercase tracking-widest rounded-xl border border-rose-500/20">Staff Signal</span>}
                  {post.isNotice && <span className="px-3 py-1 bg-indigo-500/10 text-indigo-500 text-[9px] font-black uppercase tracking-widest rounded-xl border border-indigo-500/20">Notice</span>}
                  {post.isDoubt && <span className="px-3 py-1 bg-amber-500/10 text-amber-600 dark:text-amber-400 text-[9px] font-black uppercase tracking-widest rounded-xl border border-amber-500/20">Query</span>}
                </div>
             </div>
             <p className="text-[11px] text-slate-400 font-bold uppercase tracking-widest">
               @{post.author?.firstName?.toLowerCase()}_{post.author?.lastName?.toLowerCase()} • {formatDistanceToNow(new Date(post.createdAt))}
             </p>
          </div>
        </div>
        
        <div className="flex items-center gap-1">
           {user?._id === post.author?._id && (
             <button onClick={handleDelete} className="p-3 text-slate-400 hover:text-rose-500 transition-all hover:scale-110 active:scale-95">
               <Trash2 size={20} />
             </button>
           )}
           <button className="p-3 text-slate-400 hover:text-indigo-500 transition-all hover:scale-110">
             <MoreHorizontal size={22} />
           </button>
        </div>
      </div>

      {/* Post Image Content */}
      {post.media && (
        <div className="w-full relative bg-slate-100 dark:bg-black/40 overflow-hidden cursor-pointer select-none border-y border-slate-100 dark:border-white/5" onDoubleClick={handleDoubleTap}>
           <img src={getMediaUrl(post.media)} alt="" className="w-full object-contain max-h-[750px] mx-auto transition-all duration-700 group-hover:scale-[1.02]" />
           
           {showHeartAnim && (
              <div className="absolute inset-0 flex items-center justify-center animate-heart-scale pointer-events-none z-10">
                 <Heart size={120} className="fill-white text-white drop-shadow-[0_0_40px_rgba(255,255,255,0.5)] opacity-95" />
              </div>
           )}

           {/* Audio Feed UI */}
           {post.music && (
             <div 
               className="absolute bottom-8 left-8 z-20 flex items-center gap-3 px-5 py-2.5 bg-black/60 backdrop-blur-2xl rounded-2xl border border-white/10 cursor-pointer hover:bg-black transition-all group/music shadow-2xl"
               onClick={(e) => { e.stopPropagation(); setIsPlaying(!isPlaying); if (isPlaying) audioRef.current.pause(); else audioRef.current.play(); }}
             >
                <div className={`w-3 h-3 rounded-full bg-emerald-500 ${isPlaying ? 'animate-ping' : ''} shadow-[0_0_10px_#10b981]`}></div>
                <div className="flex flex-col">
                   <span className="text-[10px] font-black text-white uppercase tracking-widest">{post.music.title}</span>
                   <span className="text-[9px] font-bold text-slate-400 uppercase">{post.music.artist}</span>
                </div>
                <audio ref={audioRef} src={getMediaUrl(post.music.audioUrl)} loop hidden />
             </div>
           )}

           <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>
        </div>
      )}

      {/* Action Bar */}
      <div className="p-6">
        <div className="flex items-center justify-between mb-8">
          <div className="flex gap-8 items-center">
            <button onClick={handleLike} className={`group/btn flex items-center gap-2.5 transition-all active:scale-125 ${isLiked ? 'text-rose-500' : 'text-slate-500 dark:text-slate-400 hover:text-rose-500'}`}>
               <Heart size={28} className={`${isLiked ? 'fill-rose-500' : 'group-hover/btn:scale-110'}`} />
               <span className="text-sm font-black tracking-tight">{likes.length > 0 && likes.length}</span>
            </button>
            <button onClick={() => setShowComments(!showComments)} className="group/btn flex items-center gap-2.5 text-slate-500 dark:text-slate-400 hover:text-indigo-500 transition-all active:scale-110">
               <MessageSquare size={28} className="group-hover/btn:scale-110" />
               <span className="text-sm font-black tracking-tight">{post.comments?.length > 0 && post.comments.length}</span>
            </button>
            <button className="text-slate-500 dark:text-slate-400 hover:text-emerald-500 transition-all hover:scale-110 active:scale-95">
               <Share2 size={28} />
            </button>
          </div>
          <button onClick={handleSave} className={`transition-all hover:scale-110 active:scale-125 ${isSaved ? 'text-indigo-500' : 'text-slate-500 dark:text-slate-400 hover:text-indigo-500'}`}>
             <Bookmark size={28} className={isSaved ? 'fill-indigo-500' : ''} />
          </button>
        </div>

        {/* Content Section */}
        <div className="space-y-4">
           <div className="text-[16px] leading-relaxed">
              <span className="font-black text-slate-900 dark:text-white mr-3 uppercase tracking-tighter">
                {post.author?.firstName?.toLowerCase()}_{post.author?.lastName?.toLowerCase()}
              </span>
              <span className="text-slate-600 dark:text-slate-300 font-medium">{post.content}</span>
           </div>
           
           {post.comments?.length > 0 && !showComments && (
              <button 
                onClick={() => setShowComments(true)}
                className="text-xs font-black text-indigo-500 hover:text-indigo-600 transition-all uppercase tracking-widest pt-2 flex items-center gap-2"
              >
                 <Sparkles size={14} /> Open Thread ({post.comments.length} updates)
              </button>
           )}
        </div>

        {/* Comments Deep-Dive */}
        {showComments && (
           <div className="mt-8 space-y-6 pt-8 border-t border-slate-100 dark:border-white/5 animate-fade-in">
              <div className="max-h-[400px] overflow-y-auto pr-4 no-scrollbar space-y-6">
                {post.comments?.map((c, i) => (
                   <div key={i} className="flex gap-4 group/comment animate-slide-in" style={{animationDelay: `${i * 0.1}s`}}>
                      <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-white/5 flex items-center justify-center border border-slate-200 dark:border-white/10 overflow-hidden shrink-0">
                        {c.user?.profilePic ? (
                          <img src={getMediaUrl(c.user.profilePic)} className="w-full h-full object-cover" alt="" />
                        ) : (
                          <span className="text-[12px] font-black text-indigo-500 uppercase">{c.user?.firstName?.[0] || 'U'}</span>
                        )}
                      </div>
                      <div className="flex-1 bg-slate-50 dark:bg-white/5 p-4 rounded-2xl rounded-tl-none border border-slate-100 dark:border-white/5">
                        <div className="flex justify-between items-center mb-1.5">
                          <span className="font-black text-[12px] text-slate-900 dark:text-white uppercase tracking-tight">
                            {c.user?.firstName || 'user'}_{c.user?.lastName?.toLowerCase() || ''}
                          </span>
                        </div>
                        <p className="text-[14px] text-slate-600 dark:text-slate-400 font-medium leading-relaxed">{c.text}</p>
                      </div>
                   </div>
                ))}
              </div>
           </div>
        )}
      </div>

      {/* Command Input Area */}
      <div className="px-6 py-5 bg-slate-50/50 dark:bg-black/20 border-t border-slate-100 dark:border-white/5">
        <form onSubmit={submitComment} className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl overflow-hidden shrink-0 shadow-inner bg-white dark:bg-white/5 flex items-center justify-center">
            {user?.profilePic ? (
              <img src={getMediaUrl(user.profilePic)} className="w-full h-full object-cover" alt="" />
            ) : (
              <div className="w-full h-full bg-indigo-500/10 flex items-center justify-center font-black text-[12px] text-indigo-500 uppercase">{user?.firstName?.[0]}</div>
            )}
          </div>
          <div className="flex-1 relative">
            <input 
              type="text" 
              placeholder="Inject your signal..." 
              className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/5 rounded-2xl px-6 py-3.5 text-sm font-bold focus:ring-8 focus:ring-indigo-500/5 focus:border-indigo-500/50 outline-none transition-all dark:text-white placeholder:text-slate-400"
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
            />
          </div>
          <button 
            type="submit" 
            disabled={!commentText.trim()}
            className="w-12 h-12 flex items-center justify-center accent-gradient-bg text-white rounded-2xl disabled:opacity-30 hover:scale-105 active:scale-95 transition-all shadow-xl shadow-indigo-500/20"
          >
             <Send size={18} strokeWidth={3} />
          </button>
        </form>
      </div>
    </div>
  );
};

export default PostCard;
