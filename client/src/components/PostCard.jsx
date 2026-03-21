import React, { useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { 
  Heart, MessageSquare, Share2, Bookmark, MoreHorizontal, Trash2, BadgeCheck, Smile
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

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
    try {
      const { data } = await axios.post(`/api/academic/posts/${post._id}/like`);
      setLikes(data.likes);
    } catch {
      setLikes(prev => isLiked ? prev.filter(id => id !== user?._id) : [...prev, user?._id]);
    }
  };

  const handleDoubleTap = () => {
    if (!isLiked) handleLike();
    setShowHeartAnim(true);
    setTimeout(() => setShowHeartAnim(false), 800);
  };

  const handleSave = async () => {
    try {
      const { data } = await axios.post(`/api/academic/posts/${post._id}/save`);
      setIsSaved(data.saved);
      toast.success(data.saved ? 'Added to saved' : 'Removed from saved');
    } catch {
      toast.error('Failed to save post');
    }
  };

  const submitComment = async (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    try {
      await axios.post(`/api/academic/posts/${post._id}/comment`, { text: commentText });
      setCommentText('');
      toast.success('Comment posted');
    } catch {
      toast.error('Failed to post comment');
    }
  };

  const handleDelete = async () => {
     if (window.confirm('Delete post?')) {
        try {
            await axios.delete(`/api/academic/posts/${post._id}`);
            onDelete(post._id);
            toast.success('Post deleted');
        } catch {
            onDelete(post._id);
        }
     }
  };

  return (
    <div className="premium-card overflow-hidden animate-fade-in mb-8 group">
      {/* Post Header */}
      <div className="flex items-center justify-between p-4 bg-slate-50/50 dark:bg-white/5 border-b border-slate-100 dark:border-white/5">
        <div className="flex items-center gap-3">
          <div 
            className="w-10 h-10 rounded-full campus-story-ring border-2 border-transparent cursor-pointer overflow-hidden shadow-sm" 
            onClick={() => navigate(`/profile/${post.author?._id}`)}
          >
            {post.author?.profilePic ? (
              <img src={post.author.profilePic} className="w-full h-full object-cover rounded-full bg-white dark:bg-slate-800" />
            ) : (
              <div className="w-full h-full bg-indigo-500 flex items-center justify-center font-bold text-white uppercase text-sm">
                {post.author?.firstName?.[0]}
              </div>
            )}
          </div>
          <div>
             <div className="flex items-center gap-2 flex-wrap">
                <h4 
                  className="text-[15px] font-bold text-slate-900 dark:text-white hover:accent-gradient-text transition-all cursor-pointer" 
                  onClick={() => navigate(`/profile/${post.author?._id}`)}
                >
                  {post.author?.firstName} {post.author?.lastName}
                </h4>
                {post.author?.role !== 'student' && <BadgeCheck size={16} className="text-indigo-500 fill-indigo-500/10" />}
                
                {/* Official Broadcast Badges - Modern Style */}
                <div className="flex gap-2">
                  {post.isAnnouncement && <span className="px-2 py-0.5 bg-rose-500/10 text-rose-500 text-[10px] font-bold uppercase tracking-wider rounded-md border border-rose-500/20">Staff Only</span>}
                  {post.isNotice && <span className="px-2 py-0.5 bg-indigo-500/10 text-indigo-500 text-[10px] font-bold uppercase tracking-wider rounded-md border border-indigo-500/20">Notice</span>}
                  {post.isDoubt && <span className="px-2 py-0.5 bg-amber-500/10 text-amber-600 dark:text-amber-400 text-[10px] font-bold uppercase tracking-wider rounded-md border border-amber-500/20">Doubt</span>}
                </div>
             </div>
             <p className="text-[12px] text-slate-400 font-medium">@{post.author?.firstName?.toLowerCase()}_{post.author?.lastName?.toLowerCase()} • {formatDistanceToNow(new Date(post.createdAt))} ago</p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
           {user?._id === post.author?._id && (
             <button onClick={handleDelete} className="p-2 text-slate-400 hover:text-rose-500 transition-colors">
               <Trash2 size={18} />
             </button>
           )}
           <button className="p-2 text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors">
             <MoreHorizontal size={20} />
           </button>
        </div>
      </div>

      {/* Post Image Content */}
      {post.media && (
        <div className="w-full relative bg-slate-100 dark:bg-slate-900 overflow-hidden cursor-pointer select-none border-b border-slate-100 dark:border-white/5" onDoubleClick={handleDoubleTap}>
           <img src={post.media} alt="" className="w-full object-contain max-h-[600px] mx-auto transition-transform duration-500 group-hover:scale-[1.01]" />
           {showHeartAnim && (
              <div className="absolute inset-0 flex items-center justify-center animate-heart-scale pointer-events-none z-10">
                 <Heart size={100} className="fill-white text-white drop-shadow-2xl opacity-90" />
              </div>
           )}
           {/* Music Track Indicator */}
           {post.music && (
             <div 
               className="absolute bottom-6 left-6 z-20 flex items-center gap-2 px-3 py-1.5 bg-black/40 backdrop-blur-md rounded-full border border-white/10 cursor-pointer hover:bg-black/60 transition-all group/music"
               onClick={(e) => { e.stopPropagation(); setIsPlaying(!isPlaying); if (isPlaying) audioRef.current.pause(); else audioRef.current.play(); }}
             >
                <div className={`w-2 h-2 rounded-full bg-emerald-500 ${isPlaying ? 'animate-pulse' : ''}`}></div>
                <span className="text-[10px] font-bold text-white uppercase tracking-widest">{post.music.title} — {post.music.artist}</span>
                <audio ref={audioRef} src={post.music.audioUrl} loop hidden />
             </div>
           )}

           <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>
           <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-white drop-shadow-lg opacity-0 group-hover:opacity-100 transition-all pointer-events-none">
              <div className="flex items-center gap-4">
                 <div className="flex items-center gap-1.5"><Heart size={20} fill="white" /> <span className="text-sm font-bold">{likes.length}</span></div>
                 <div className="flex items-center gap-1.5"><MessageSquare size={20} fill="white" /> <span className="text-sm font-bold">{post.comments?.length || 0}</span></div>
              </div>
           </div>
        </div>
      )}

      {/* Action Bar & Info */}
      <div className="p-5">
        <div className="flex items-center justify-between mb-4">
          <div className="flex gap-5 items-center">
            <button onClick={handleLike} className={`group/btn flex items-center gap-2 transition-all active:scale-125 ${isLiked ? 'text-rose-500' : 'text-slate-500 dark:text-slate-400 hover:text-rose-500'}`}>
               <Heart size={24} className={`${isLiked ? 'fill-rose-500 shadow-rose-500' : 'group-hover/btn:scale-110'}`} />
               <span className="text-sm font-bold">{likes.length > 0 && likes.length}</span>
            </button>
            <button onClick={() => setShowComments(!showComments)} className="group/btn flex items-center gap-2 text-slate-500 dark:text-slate-400 hover:text-indigo-500 transition-all">
               <MessageSquare size={24} className="group-hover/btn:scale-110" />
               <span className="text-sm font-bold">{post.comments?.length > 0 && post.comments.length}</span>
            </button>
            <button className="text-slate-500 dark:text-slate-400 hover:text-green-500 transition-all">
               <Share2 size={24} />
            </button>
          </div>
          <button onClick={handleSave} className={`transition-all active:scale-125 ${isSaved ? 'text-indigo-500' : 'text-slate-500 dark:text-slate-400 hover:text-indigo-500'}`}>
             <Bookmark size={24} className={isSaved ? 'fill-indigo-500' : ''} />
          </button>
        </div>

        {/* Caption */}
        <div className="space-y-2">
           <div className="text-[15px] leading-relaxed">
              <span className="font-bold text-main mr-2">
                {post.author?.firstName?.toLowerCase()}_{post.author?.lastName?.toLowerCase()}
              </span>
              <span className="text-sub">{post.content}</span>
           </div>
           
           {post.comments?.length > 0 && !showComments && (
              <button 
                onClick={() => setShowComments(true)}
                className="text-sm font-semibold accent-gradient-text hover:opacity-80 transition-all"
              >
                 View all {post.comments.length} comments
              </button>
           )}
        </div>

        {/* Comments Section */}
        {showComments && (
           <div className="mt-6 space-y-4 pt-4 border-t border-slate-100 dark:border-white/5 animate-fade-in">
              <div className="max-h-60 overflow-y-auto pr-2 no-scrollbar">
                {post.comments?.map((c, i) => (
                   <div key={i} className="flex gap-3 mb-4 last:mb-0 group/comment">
                      <div className="w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center text-[10px] font-bold text-indigo-500 uppercase">
                        {c.author?.firstName?.[0] || 'U'}
                      </div>
                      <div className="flex-1 bg-slate-50 dark:bg-white/5 p-3 rounded-2xl rounded-tl-none">
                        <div className="flex justify-between items-center mb-1">
                          <span className="font-bold text-xs text-slate-900 dark:text-white">
                            {c.author?.firstName || 'user'}_
                          </span>
                        </div>
                        <p className="text-sm text-slate-600 dark:text-slate-300">{c.text}</p>
                      </div>
                   </div>
                ))}
              </div>
           </div>
        )}
      </div>

      {/* Add Comment Input */}
      <div className="px-5 py-4 bg-slate-50/50 dark:bg-white/5 border-t border-slate-100 dark:border-white/5">
        <form onSubmit={submitComment} className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full overflow-hidden hidden sm:block">
            {user?.profilePic ? <img src={user.profilePic} className="w-full h-full object-cover" /> : <div className="w-full h-full bg-indigo-500/10 flex items-center justify-center font-bold text-xs text-indigo-500 uppercase">{user?.firstName?.[0]}</div>}
          </div>
          <div className="flex-1 relative">
            <input 
              type="text" 
              placeholder="Add a comment..." 
              className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-full px-5 py-2.5 text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all dark:text-white"
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
            />
          </div>
          <button 
            type="submit" 
            disabled={!commentText.trim()}
            className="text-indigo-500 font-bold text-sm disabled:opacity-30 hover:text-indigo-600 transition-colors px-2"
          >
             Post
          </button>
        </form>
      </div>
    </div>
  );
};

export default PostCard;
