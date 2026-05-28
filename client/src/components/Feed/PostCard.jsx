import { Heart, MessageCircle, Send, Bookmark } from 'lucide-react';
import { useState, useRef } from 'react';
import { useAuth } from '../../context/AuthContext';
import './PostCard.css';

const PostCard = ({ post, onUpdate }) => {
  const { user } = useAuth();
  const [commentText, setCommentText] = useState('');
  const [isLiking, setIsLiking] = useState(false);
  const [liked, setLiked] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);
  const [showHeart, setShowHeart] = useState(false);
  const [showAllComments, setShowAllComments] = useState(false);
  const [isCommenting, setIsCommenting] = useState(false);
  const doubleTapRef = useRef(null);

  const handleLike = async () => {
    if (isLiking) return;
    setIsLiking(true);
    setLiked(l => !l);
    try {
      const res = await fetch(`http://localhost:5000/api/posts/${post.id}/like`, { method: 'POST' });
      if (res.ok) { const updated = await res.json(); onUpdate(updated); }
    } catch (err) { console.error(err); }
    setIsLiking(false);
  };

  // Double-tap to like
  const handleImageClick = () => {
    if (doubleTapRef.current) {
      clearTimeout(doubleTapRef.current);
      doubleTapRef.current = null;
      if (!liked) {
        setLiked(true);
        setShowHeart(true);
        setTimeout(() => setShowHeart(false), 900);
        handleLike();
      }
    } else {
      doubleTapRef.current = setTimeout(() => { doubleTapRef.current = null; }, 300);
    }
  };

  const handleComment = async (e) => {
    e.preventDefault();
    if (!commentText.trim() || isCommenting) return;
    setIsCommenting(true);
    try {
      const res = await fetch(`http://localhost:5000/api/posts/${post.id}/comment`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: user.username, text: commentText })
      });
      if (res.ok) { const updated = await res.json(); onUpdate(updated); setCommentText(''); }
    } catch (err) { console.error(err); }
    setIsCommenting(false);
  };

  const formatTime = (iso) => {
    if (!iso) return '';
    const diff = Date.now() - new Date(iso).getTime();
    const m = Math.floor(diff / 60000);
    if (m < 1) return 'Just now';
    if (m < 60) return `${m}m`;
    const h = Math.floor(m / 60);
    if (h < 24) return `${h}h`;
    return `${Math.floor(h / 24)}d`;
  };

  const visibleComments = showAllComments ? post.comments : post.comments?.slice(-2);

  return (
    <article className="post-card">
      {/* Header */}
      <div className="post-header">
        <div className="post-header-user">
          <img
            src={post.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(post.username)}`}
            alt={post.username} className="avatar post-avatar"
          />
          <div>
            <span className="post-username">{post.username}</span>
            <span className="post-time">{formatTime(post.timestamp)}</span>
          </div>
        </div>
        <button className="post-options">•••</button>
      </div>

      {/* Image with double-tap */}
      <div className="post-image-container" onClick={handleImageClick}>
        <img src={post.imageUrl} alt="Post content" className="post-image" />
        {showHeart && (
          <div className="like-animation">
            <Heart fill="white" color="white" size={80} />
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="post-actions">
        <div className="post-actions-left">
          <button className="action-btn" onClick={handleLike}>
            <Heart
              fill={liked ? '#ed4956' : 'none'}
              color={liked ? '#ed4956' : 'currentColor'}
              style={{ transition: 'transform 0.1s', transform: liked ? 'scale(1.15)' : 'scale(1)' }}
            />
          </button>
          <button className="action-btn" onClick={() => document.getElementById(`comment-${post.id}`).focus()}>
            <MessageCircle />
          </button>
          <button className="action-btn"><Send /></button>
        </div>
        <button className="action-btn" onClick={() => setBookmarked(b => !b)}>
          <Bookmark fill={bookmarked ? 'currentColor' : 'none'} />
        </button>
      </div>

      {/* Info */}
      <div className="post-info">
        <div className="post-likes">
          {(post.likes || 0) + (liked ? 1 : 0)} likes
        </div>

        {post.caption && (
          <div className="post-caption">
            <span className="post-username">{post.username}</span> {post.caption}
          </div>
        )}

        {post.comments?.length > 2 && !showAllComments && (
          <button className="post-comments-count" onClick={() => setShowAllComments(true)}>
            View all {post.comments.length} comments
          </button>
        )}

        {visibleComments?.map(c => (
          <div key={c.id} className="post-caption">
            <span className="post-username">{c.username}</span> {c.text}
          </div>
        ))}

        <form className="post-add-comment" onSubmit={handleComment}>
          <input
            id={`comment-${post.id}`}
            type="text"
            placeholder="Add a comment..."
            value={commentText}
            onChange={e => setCommentText(e.target.value)}
          />
          {commentText.trim() && (
            <button type="submit" disabled={isCommenting} className="comment-post-btn">Post</button>
          )}
        </form>
      </div>
    </article>
  );
};

export default PostCard;
