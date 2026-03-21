import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { 
  Bell, Heart, MessageSquare, UserPlus, Sparkles, 
  Trash2, CheckCircle2, MoreVertical, X, Settings, Zap, Terminal, Activity, ShieldAlert, BadgeCheck, ChevronLeft
} from 'lucide-react';
import { formatDistanceToNow, isToday, isYesterday, isThisWeek } from 'date-fns';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const NotificationsPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get('/api/academic/notifications');
      setNotifications(data);
      await axios.put('/api/academic/notifications/mark-all-read');
    } catch {
       setNotifications([]);
    } finally {
      setLoading(false);
    }
  };

  const deleteNotification = async (id) => {
    try {
      await axios.delete(`/api/academic/notifications/${id}`);
      setNotifications(notifications.filter(n => n._id !== id));
    } catch {
      toast.error('Failed to delete');
    }
  };

  const groupNotifications = (notifications) => {
    const today = [];
    const yesterday = [];
    const earlier = [];

    notifications.forEach(n => {
      const date = new Date(n.createdAt);
      if (isToday(date)) today.push(n);
      else if (isYesterday(date)) yesterday.push(n);
      else earlier.push(n);
    });

    return { today, yesterday, earlier };
  };

  const notificationCounts = groupNotifications(notifications);
  const { today, yesterday, earlier } = notificationCounts;

  const NotificationItem = ({ n }) => (
    <div className="flex items-center justify-between gap-4 py-3 group animate-fade-in relative z-10 px-4 hover:bg-slate-50 dark:hover:bg-white/5 transition-colors cursor-pointer" onClick={() => n.post && navigate(`/dashboard?post=${n.post}`)}>
      <div className="flex items-center gap-4 flex-1">
        <div className="relative shrink-0" onClick={(e) => { e.stopPropagation(); navigate(`/profile/${n.sender?._id}`); }}>
          <div className="w-11 h-11 rounded-full overflow-hidden border border-slate-200 dark:border-white/10">
             {n.sender?.profilePic ? (
               <img src={n.sender.profilePic} alt="" className="w-full h-full object-cover" />
             ) : (
               <div className="w-full h-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center font-bold text-sky-500 uppercase">{n.sender?.firstName?.[0]}</div>
             )}
          </div>
          {!n.read && <div className="absolute top-0 right-0 w-3 h-3 bg-sky-500 border-2 border-white dark:border-black rounded-full"></div>}
        </div>

        <div className="flex-1 text-[14px] leading-tight text-slate-900 dark:text-white">
           <span className="font-bold lowercase hover:underline" onClick={(e) => { e.stopPropagation(); navigate(`/profile/${n.sender?._id}`); }}>{n.sender?.firstName}_{n.sender?.lastName?.toLowerCase()}</span>
           <span className="ml-1.5 font-normal text-slate-800 dark:text-slate-200">
              {n.type === 'like' && 'liked your post.'}
              {n.type === 'comment' && 'commented on your post.'}
              {n.type === 'follow' && 'started following you.'}
              {n.type === 'general' && n.message}
           </span>
           <span className="ml-2 text-slate-400 font-medium">{formatDistanceToNow(new Date(n.createdAt))}</span>
        </div>
      </div>

      {n.type === 'follow' ? (
        <button className="bg-sky-500 text-white rounded-lg px-4 py-1.5 text-[13px] font-bold hover:opacity-80 transition-all shrink-0">Follow</button>
      ) : n.postImage ? (
        <div className="w-11 h-11 rounded-sm overflow-hidden bg-slate-100 dark:bg-white/10 shrink-0">
           <img src={n.postImage} className="w-full h-full object-cover" alt="" />
        </div>
      ) : (
        <button onClick={(e) => { e.stopPropagation(); deleteNotification(n._id); }} className="p-2 text-slate-300 hover:text-rose-500 opacity-0 group-hover:opacity-100"><X size={18} /></button>
      )}
    </div>
  );

  return (
    <div className="max-w-[600px] mx-auto min-h-screen bg-white dark:bg-black pb-32">
      {/* Header */}
      <div className="sticky top-0 bg-white/80 dark:bg-black/80 backdrop-blur-md z-40 px-4 h-16 border-b border-slate-100 dark:border-white/10 flex items-center">
         <button onClick={() => navigate(-1)} className="mr-4 hover:opacity-50 transition-all"><ChevronLeft size={28} /></button>
         <h2 className="text-xl font-bold text-slate-900 dark:text-white">Notifications</h2>
      </div>

      <div className="py-2">
        {loading ? (
          <div className="space-y-6 pt-10 px-4">
             {[1, 2, 3, 4, 5].map(i => <div key={i} className="h-12 bg-slate-100 dark:bg-white/5 animate-pulse rounded-lg"></div>)}
          </div>
        ) : notifications.length === 0 ? (
          <div className="py-48 text-center px-10">
             <div className="w-16 h-16 rounded-full border-2 border-slate-900 dark:border-white flex items-center justify-center mx-auto mb-6">
                <Heart size={32} />
             </div>
             <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Activity on your posts</h3>
             <p className="text-slate-400 text-sm">When someone likes or comments on one of your posts, you'll see it here.</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100/50 dark:divide-white/5">
             {today.length > 0 && (
               <div className="py-2">
                 <h4 className="px-4 py-2 text-[16px] font-bold text-slate-900 dark:text-white">Today</h4>
                 {today.map(n => <NotificationItem key={n._id} n={n} />)}
               </div>
             )}
             {yesterday.length > 0 && (
               <div className="py-2">
                 <h4 className="px-4 py-2 text-[16px] font-bold text-slate-900 dark:text-white">Yesterday</h4>
                 {yesterday.map(n => <NotificationItem key={n._id} n={n} />)}
               </div>
             )}
             {earlier.length > 0 && (
               <div className="py-2">
                 <h4 className="px-4 py-2 text-[16px] font-bold text-slate-900 dark:text-white">Earlier</h4>
                 {earlier.map(n => <NotificationItem key={n._id} n={n} />)}
               </div>
             )}
          </div>
        )}
      </div>
    </div>
  );
};

export default NotificationsPage;
