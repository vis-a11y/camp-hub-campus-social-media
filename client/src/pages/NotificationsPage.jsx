import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Heart, MessageCircle, UserPlus } from 'lucide-react';
import './NotificationsPage.css';

const NotificationsPage = () => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    // Build notifications from posts that belong to the current user
    fetch('http://localhost:5000/api/posts')
      .then(res => res.json())
      .then(posts => {
        const myPosts = posts.filter(p => p.userId === user?.id);
        const notifs = [];

        myPosts.forEach(post => {
          // Likes
          if (post.likes > 0) {
            notifs.push({
              id: `like-${post.id}`,
              type: 'like',
              text: `Someone liked your post`,
              preview: post.imageUrl,
              time: post.timestamp,
            });
          }
          // Comments
          (post.comments || []).forEach(c => {
            notifs.push({
              id: `comment-${c.id}`,
              type: 'comment',
              text: `${c.username} commented: "${c.text}"`,
              preview: post.imageUrl,
              time: post.timestamp,
            });
          });
        });

        // Sort newest first
        notifs.sort((a, b) => new Date(b.time) - new Date(a.time));
        setNotifications(notifs);
      })
      .catch(err => console.error(err));
  }, [user]);

  const getIcon = (type) => {
    if (type === 'like') return <Heart size={20} fill="#ed4956" color="#ed4956" />;
    if (type === 'comment') return <MessageCircle size={20} color="#0095f6" />;
    return <UserPlus size={20} color="#9b59b6" />;
  };

  const formatTime = (iso) => {
    const diff = Date.now() - new Date(iso).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 60) return `${mins}m ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h ago`;
    return `${Math.floor(hrs / 24)}d ago`;
  };

  return (
    <div className="notifications-page">
      <div className="notifications-header">
        <h2>Notifications</h2>
      </div>

      {notifications.length === 0 ? (
        <div className="notif-empty">
          <Heart size={48} opacity={0.2} />
          <p>No notifications yet</p>
          <span>When people like or comment on your posts, you'll see it here.</span>
        </div>
      ) : (
        <div className="notif-list">
          {notifications.map(n => (
            <div key={n.id} className="notif-item">
              <div className="notif-icon-wrap">{getIcon(n.type)}</div>
              <p className="notif-text">{n.text}</p>
              {n.preview && (
                <img src={n.preview} alt="preview" className="notif-preview" />
              )}
              <span className="notif-time">{formatTime(n.time)}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default NotificationsPage;
