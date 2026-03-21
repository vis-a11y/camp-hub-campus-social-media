import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { Send, Trash2, Heart, MessageSquare } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import toast from 'react-hot-toast';

const CommentSection = ({ postId, comments: initialComments, onCommentAdded }) => {
  const { user } = useAuth();
  const [comments, setComments] = useState(initialComments || []);
  const [newComment, setNewComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newComment.trim() || isSubmitting) return;

    setIsSubmitting(true);
    try {
      const { data } = await axios.post(`/api/academic/posts/${postId}/comment`, { text: newComment });
      setComments(data.comments);
      setNewComment('');
      if (onCommentAdded) onCommentAdded(data.comments.length);
      toast.success('Thought Transmitted');
    } catch (error) {
      toast.error('Failed to comment');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (commentId) => {
    try {
      await axios.delete(`/api/academic/posts/${postId}/comment/${commentId}`);
      const updated = comments.filter(c => c._id !== commentId);
      setComments(updated);
      if (onCommentAdded) onCommentAdded(updated.length);
      toast.success('Signal Erased');
    } catch (error) {
      toast.error('Error deleting comment');
    }
  };

  return (
    <div className="space-y-3 pt-2 animate-fade-in border-t border-slate-100 dark:border-slate-800/60 mt-2">
      <div className="max-h-[300px] overflow-y-auto no-scrollbar space-y-2 pr-1">
        {comments.length === 0 ? (
          <p className="text-[11px] text-slate-400 py-2">Be the first to comment...</p>
        ) : (
          comments.map((comment) => (
            <div key={comment._id} className="flex gap-2 group/comment items-start text-sm">
                <span className="font-bold text-slate-900 dark:text-white cursor-pointer hover:opacity-50 transition-opacity">
                   {comment.user?.firstName}_{comment.user?.lastName?.toLowerCase()}
                </span>
                <span className="text-slate-800 dark:text-slate-200 flex-1 leading-snug">{comment.text}</span>
                <div className="flex items-center gap-2 opacity-0 group-hover/comment:opacity-100 transition-opacity">
                   <button className="text-slate-400 hover:text-rose-500"><Heart size={12} /></button>
                   {(comment.user?._id === user._id || user.role === 'admin') && (
                     <button
                       onClick={() => handleDelete(comment._id)}
                       className="text-slate-400 hover:text-rose-500"
                     >
                       <Trash2 size={12} />
                     </button>
                   )}
                </div>
            </div>
          ))
        )}
      </div>

      <form onSubmit={handleSubmit} className="flex gap-3 items-center pt-3 border-t border-slate-100 dark:border-slate-800/60">
        <input
          type="text"
          className="flex-1 bg-transparent border-none text-sm font-medium text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:ring-0 outline-none"
          placeholder="Add a comment..."
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
        />
        <button
          type="submit"
          disabled={!newComment.trim() || isSubmitting}
          className={`text-sm font-bold transition-all ${
            newComment.trim() ? 'text-sky-500 hover:text-slate-900 dark:hover:text-white' : 'text-sky-500/30'
          }`}
        >
          {isSubmitting ? '...' : 'Post'}
        </button>
      </form>
    </div>
  );
};

export default CommentSection;
