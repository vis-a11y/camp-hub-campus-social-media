import React, { useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { 
  Heart, MessageSquare, Share2, Bookmark, 
  MoreHorizontal, Trash2, BadgeCheck, Send, Sparkles
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
  const [showHeartAnim, setShowHeartAnim] = useState(false);

  const isLiked = likes.includes(user?._id);

  const handleLike = async () => {
    if (!user) return toast.error('Auth required');
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

  const submitComment = async (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    try {
      await axios.post(`/api/academic/posts/${post._id}/comment`, { text: commentText });
      setCommentText('');
      toast.success('Injected');
    } catch {
      toast.error('Failed');
    }
  };

  return (
    <div className="premium-card overflow-hidden animate-fade-in group relative border-none bg-white dark:bg-white/5">
      {/* HEADER */}
      <div className="flex items-center justify-between p-6">
        <div className="flex items-center gap-4">
          <div 
            className="w-12 h-12 rounded-2xl campus-story-ring p-[2px] cursor-pointer" 
            onClick={() => navigate(`/profile/${post.author?._id}`)}
          >
            <div className="w-full h-full rounded-[14px] bg-white dark:bg-slate-900 overflow-hidden">
               {post.author?.profilePic ? (
                 <img src={getMediaUrl(post.author.profilePic)} className="w-full h-full object-cover" />
               ) : (
                 <div className="w-full h-full bg-indigo-500 flex items-center justify-center text-white font-black">{post.author?.firstName?.[0]}</div>
               )}
            </div>
          </div>
          <div>
             <h4 className="font-black text-slate-900 dark:text-white uppercase tracking-tighter hover:text-indigo-500 cursor-pointer transition-colors" onClick={() => navigate(`/profile/${post.author?._id}`)}>
               {post.author?.firstName} {post.author?.lastName}
             </h4>
             <p className="text-[10px] text-slate-400 font-bold uppercase tracking-[0.2em]">{formatDistanceToNow(new Date(post.createdAt))} ago</p>
          </div>
        </div>
        <button className="p-2 text-slate-400 hover:text-indigo-500 transition-all"><MoreHorizontal size={20} /></button>
      </div>

      {/* CONTENT */}
      {post.media && (
        <div className="relative aspect-video bg-slate-100 dark:bg-black/20 cursor-pointer select-none" onDoubleClick={handleDoubleTap}>
           <img src={getMediaUrl(post.media)} className="w-full h-full object-contain" alt="" />
           {showHeartAnim && (
              <div className="absolute inset-0 flex items-center justify-center animate-heart-scale z-10">
                 <Heart size={100} className="fill-white text-white drop-shadow-2xl" />
              </div>
           )}
        </div>
      )}

      {/* ACTIONS */}
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
           <div className="flex gap-8 items-center">
              <button onClick={handleLike} className={`flex items-center gap-2 font-black text-sm transition-all active:scale-125 ${isLiked ? 'text-rose-500' : 'text-slate-400 hover:text-rose-500'}`}>
                 <Heart size={24} className={isLiked ? 'fill-rose-500' : ''} />
                 {likes.length > 0 && likes.length}
              </button>
              <button onClick={() => setShowComments(!showComments)} className="flex items-center gap-2 font-black text-sm text-slate-400 hover:text-indigo-500 transition-all">
                 <MessageSquare size={24} />
                 {post.comments?.length > 0 && post.comments.length}
              </button>
              <button className="text-slate-400 hover:text-emerald-500 transition-all"><Share2 size={24} /></button>
           </div>
           <button className="text-slate-400 hover:text-indigo-500 transition-all"><Bookmark size={24} /></button>
        </div>

        <div className="space-y-2">
           <p className="text-[15px] leading-relaxed dark:text-slate-200">
             <span className="font-black mr-2 uppercase tracking-tighter">{post.author?.firstName}</span>
             {post.content}
           </p>
        </div>

        {/* COMMENT BOX */}
        <form onSubmit={submitComment} className="flex items-center gap-4 pt-4 border-t border-slate-100 dark:border-white/5">
           <input 
             type="text" 
             placeholder="Add a comment..."
             className="flex-1 bg-transparent border-none text-sm font-medium focus:ring-0 dark:text-white"
             value={commentText}
             onChange={(e) => setCommentText(e.target.value)}
           />
           <button type="submit" disabled={!commentText.trim()} className="text-indigo-500 font-black text-xs uppercase tracking-widest disabled:opacity-20 transition-all">Post</button>
        </form>
      </div>
    </div>
  );
};

export default PostCard;
