import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { 
  Send, Search, Info, Phone, Video, Camera, Mic, Image, Heart, Smile, 
  MoreHorizontal, PlusCircle, X, ChevronLeft, CheckCheck, Zap, Terminal, Activity,
  Settings, UserPlus, Filter, Trash2, MessageSquare, Paperclip, MoreVertical
} from 'lucide-react';
import io from 'socket.io-client';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useLocation } from 'react-router-dom';

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:5001';
const socket = io(SOCKET_URL, { 
  autoConnect: false,
  transports: ['websocket', 'polling'], // Ensure both are tried
  withCredentials: true
});

const ChatSystem = () => {
  const { user } = useAuth();
  const location = useLocation();
  const [chats, setChats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeChat, setActiveChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [activeTab, setActiveTab] = useState('Primary'); 
  const scrollRef = useRef();

  useEffect(() => {
    fetchChats();
    socket.connect();
    socket.emit('setup', user);

    socket.on('message recieved', (newMessageRecieved) => {
        if (!activeChat || activeChat._id !== newMessageRecieved.chat._id) {
            fetchChats();
        } else {
            setMessages((prev) => [...prev, newMessageRecieved]);
        }
    });

    return () => {
       socket.disconnect();
    };
  }, [user, activeChat]);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const userId = params.get('user');
    if (userId) accessChat(userId);
  }, [location.search]);

  useEffect(() => {
    if (searchQuery.trim()) {
       const timer = setTimeout(() => searchUsers(), 500);
       return () => clearTimeout(timer);
    } else {
       setSearchResults([]);
       setIsSearching(false);
    }
  }, [searchQuery]);

  const searchUsers = async () => {
     setIsSearching(true);
     try {
        const { data } = await axios.get(`/api/auth/users/search?q=${searchQuery}`);
        setSearchResults(data.users || []);
     } catch {
        setSearchResults([]);
     } finally {
        setIsSearching(false);
     }
  };

  const fetchChats = async () => {
    setLoading(true);
    try {
       const { data } = await axios.get('/api/chat');
       setChats(data);
    } catch (error) {
       setChats([]);
    } finally {
       setLoading(false);
    }
  };

  const accessChat = async (userId) => {
     try {
        const { data } = await axios.post('/api/chat', { userId });
        if (!chats.find(c => c._id === data._id)) setChats([data, ...chats]);
        setActiveChat(data);
        setSearchQuery('');
        setSearchResults([]);
     } catch (error) {
        console.error('Chat Access Error:', error.response?.data || error.message);
        toast.error('Error establishing connection');
     }
  };

  useEffect(() => {
    if (activeChat) {
      fetchMessages();
      socket.emit('join chat', activeChat._id);
    }
  }, [activeChat]);

  const fetchMessages = async () => {
     try {
        const { data } = await axios.get(`/api/message/${activeChat._id}`);
        setMessages(data);
        setTimeout(() => scrollRef.current?.scrollIntoView({ behavior: 'smooth' }), 100);
     } catch (error) {
        setMessages([]);
     }
  };

  const handleSend = async (e) => {
    e?.preventDefault();
    if (!newMessage.trim()) return;

    try {
       const { data } = await axios.post('/api/message', {
          content: newMessage,
          chatId: activeChat._id
       });
       
       socket.emit('new message', data);
       setMessages([...messages, data]);
       setNewMessage('');
       setTimeout(() => scrollRef.current?.scrollIntoView({ behavior: 'smooth' }), 100);
       fetchChats(); // Update latest message in sidebar
    } catch (error) {
       toast.error('Could not send message');
    }
  };

  const handleLike = async (msgId) => {
     try {
        setMessages(messages.map(m => m._id === msgId ? { ...m, liked: !m.liked } : m));
     } catch (error) {
        console.error('Like failed');
     }
  };

  const filteredChats = chats.filter(c => {
    const otherUser = c.users.find(u => u._id !== user?._id);
    return `${otherUser?.firstName} ${otherUser?.lastName}`.toLowerCase().includes(searchQuery.toLowerCase());
  });

  return (
    <div className="max-w-6xl mx-auto h-[calc(100vh-100px)] flex bg-white dark:bg-black rounded-lg border border-slate-100 dark:border-white/10 overflow-hidden animate-fade-in font-sans">
      {/* Sidebar List (IG Style) */}
      <div className={`w-full md:w-[350px] flex-col border-r border-slate-100 dark:border-white/10 ${activeChat ? 'hidden md:flex' : 'flex'}`}>
        <div className="p-5 flex items-center justify-between border-b border-slate-50 dark:border-white/5">
           <h2 className="text-xl font-bold lowercase">{user?.firstName}_{user?.lastName?.toLowerCase()}</h2>
           <UserPlus className="cursor-pointer hover:opacity-50" size={24} />
        </div>
        
        {/* Simple Tabs (Instagram Style) */}
        {!searchQuery && (
          <div className="flex border-b border-slate-50 dark:border-white/10">
             {['Primary', 'General', 'Requests'].map(tab => (
                <button 
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`flex-1 py-3 text-[14px] font-bold transition-all ${activeTab === tab ? 'text-slate-900 dark:text-white border-b-2 border-slate-900 dark:border-white' : 'text-slate-400'}`}
                >
                   {tab}
                </button>
             ))}
          </div>
        )}

        <div className="p-4">
           <div className="relative flex items-center bg-slate-100 dark:bg-white/10 rounded-lg px-4">
              <Search size={16} className="text-slate-400" />
              <input 
                className="w-full bg-transparent p-2.5 text-sm outline-none text-slate-900 dark:text-white" 
                placeholder="Search" 
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
              />
              {searchQuery && <X size={16} className="text-slate-400 cursor-pointer" onClick={() => setSearchQuery('')} />}
           </div>
        </div>

        <div className="flex-1 overflow-y-auto no-scrollbar">
           {searchQuery && (
              <div className="p-4">
                 <h4 className="text-[14px] font-bold text-slate-500 mb-4 lowercase">Suggested</h4>
                 {isSearching ? (
                   <div className="space-y-4 animate-pulse">
                      {[1, 2, 3].map(i => <div key={i} className="h-12 bg-slate-50 dark:bg-white/5 rounded-lg"></div>)}
                   </div>
                 ) : searchResults.length > 0 ? (
                    searchResults.map(u => (
                       <div key={u._id} onClick={() => accessChat(u._id)} className="flex items-center gap-3 p-3 hover:bg-slate-50 dark:hover:bg-white/5 rounded-xl cursor-pointer transition-all">
                          <div className="w-11 h-11 rounded-full overflow-hidden border border-slate-200 dark:border-white/10">
                             {u.profilePic ? <img src={u.profilePic} className="w-full h-full object-cover" /> : <div className="w-full h-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center font-bold text-sky-500 uppercase">{u.firstName?.[0]}</div>}
                          </div>
                          <div>
                             <p className="text-[14px] font-bold text-slate-900 dark:text-white lowercase">{u.firstName}_{u.lastName?.toLowerCase()}</p>
                             <p className="text-[13px] text-slate-400 font-medium">{u.firstName} {u.lastName}</p>
                          </div>
                       </div>
                    ))
                 ) : (
                    <p className="text-center text-slate-400 py-10 italic">No nodes matched in directory.</p>
                 )}
              </div>
           )}

           {!searchQuery && (
             loading ? (
               <div className="p-4 space-y-4">{[1, 2, 3, 4, 5].map(i => <div key={i} className="h-14 bg-slate-50 dark:bg-white/5 animate-pulse rounded-lg"></div>)}</div>
             ) : filteredChats.length > 0 ? (
               filteredChats.map(chat => {
                  const otherUser = chat.users.find(u => u._id !== user?._id);
                  const isActive = activeChat?._id === chat._id;
                  return (
                    <div 
                      key={chat._id} 
                      onClick={() => setActiveChat(chat)}
                      className={`flex items-center gap-3 p-4 px-5 cursor-pointer transition-all hover:bg-slate-50 dark:hover:bg-white/5 ${isActive ? 'bg-slate-50 dark:bg-white/5 border-l-4 border-slate-900 dark:border-white' : ''}`}
                    >
                       <div className="w-14 h-14 rounded-full border-2 border-slate-200 dark:border-white/10 p-0.5 relative">
                          {otherUser?.profilePic ? (
                            <img src={otherUser.profilePic} className="w-full h-full object-cover rounded-full" />
                          ) : (
                            <div className="w-full h-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center font-bold text-sky-500 rounded-full uppercase italic">{otherUser?.firstName?.[0]}</div>
                          )}
                          <div className="absolute bottom-0 right-0 w-4 h-4 bg-emerald-500 border-4 border-white dark:border-black rounded-full shadow-sm"></div>
                       </div>
                       <div className="flex-1 min-w-0">
                          <p className="text-[14px] font-bold text-slate-900 dark:text-white truncate lowercase">{otherUser?.firstName}_{otherUser?.lastName?.toLowerCase()}</p>
                          <p className="text-[13px] text-slate-400 truncate font-normal leading-tight">{chat.latestMessage?.content || 'No signals yet...'}</p>
                       </div>
                    </div>
                  );
               })
             ) : (
               <div className="p-20 text-center text-slate-400 lowercase italic opacity-40">Matrix nodes silent.</div>
             )
           )}
        </div>
      </div>

      {/* Chat Area (IG Style) */}
      <div className={`flex-1 flex flex-col bg-white dark:bg-black relative ${!activeChat ? 'hidden md:flex' : 'flex'}`}>
        {activeChat ? (
          <>
            <div className="p-4 px-6 border-b border-slate-100 dark:border-white/10 flex items-center justify-between z-10 bg-white/80 dark:bg-black/80 backdrop-blur-md">
               <div className="flex items-center gap-3">
                  <button onClick={() => setActiveChat(null)} className="md:hidden mr-2 hover:opacity-50 transition-all"><ChevronLeft size={24} /></button>
                  <div className="w-10 h-10 rounded-full border border-slate-100 dark:border-white/10 overflow-hidden shrink-0">
                     {activeChat.users.find(u => u._id !== user?._id)?.profilePic ? <img src={activeChat.users.find(u => u._id !== user?._id).profilePic} className="w-full h-full object-cover" /> : <div className="w-full h-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center font-bold text-sky-500 uppercase">{activeChat.users.find(u => u._id !== user?._id)?.firstName?.[0]}</div>}
                  </div>
                  <div className="flex flex-col">
                     <p className="text-[14px] font-bold leading-none lowercase">{activeChat.users.find(u => u._id !== user?._id)?.firstName}_{activeChat.users.find(u => u._id !== user?._id)?.lastName?.toLowerCase()}</p>
                     <p className="text-[11px] text-emerald-500 font-bold tracking-tight mt-1">active now</p>
                  </div>
               </div>
               <div className="flex gap-4">
                  <Phone size={22} className="cursor-pointer hover:opacity-50" />
                  <Video size={22} className="cursor-pointer hover:opacity-50" />
                  <Info size={22} className="cursor-pointer hover:opacity-50" />
               </div>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-4 no-scrollbar">
               {messages.map((m, i) => {
                  const isOwn = m.sender?._id === user?._id;
                  return (
                    <div key={i} className={`flex flex-col ${isOwn ? 'items-end' : 'items-start'} animate-fade-in group`}>
                       <div className="flex items-end gap-2 max-w-[70%] relative">
                          {!isOwn && (
                             <div className="w-7 h-7 rounded-full overflow-hidden border border-slate-100 dark:border-white/5 mb-1 shrink-0">
                                {m.sender?.profilePic ? <img src={m.sender.profilePic} className="w-full h-full object-cover" /> : <div className="w-full h-full bg-slate-50 flex items-center justify-center text-[10px] font-bold text-sky-500">{m.sender?.firstName?.[0]}</div>}
                             </div>
                          )}
                          <div 
                             onDoubleClick={() => handleLike(m._id)}
                             className={`px-4 py-2 rounded-2xl text-[14px] leading-relaxed transition-all relative ${isOwn ? 'bg-sky-500 text-white selection:bg-white/20' : 'bg-slate-100 dark:bg-white/10 text-slate-900 dark:text-white'}`}
                          >
                             {m.content}
                             {m.liked && <div className="absolute -bottom-2 -right-1 bg-white dark:bg-slate-900 rounded-full p-1 shadow-lg animate-heart-scale"><Heart size={10} className="fill-rose-500 text-rose-500" /></div>}
                          </div>
                       </div>
                    </div>
                  );
               })}
               <div ref={scrollRef} />
            </div>

            <div className="p-4 px-6 border-t border-slate-50 dark:border-white/5">
                <form onSubmit={handleSend} className="relative flex items-center bg-white dark:bg-black border border-slate-200 dark:border-white/10 rounded-full px-5 py-2 group focus-within:border-slate-400">
                   <Smile size={24} className="text-slate-900 dark:text-white mr-3 cursor-pointer hover:opacity-50" />
                   <input 
                      type="text" 
                      className="flex-1 bg-transparent py-2.5 text-[14px] outline-none text-slate-900 dark:text-white placeholder:text-slate-400 font-normal"
                      placeholder="Message..." 
                      value={newMessage}
                      onChange={e => setNewMessage(e.target.value)}
                   />
                   {newMessage.trim() ? (
                      <button className="text-sky-500 font-bold text-[14px] hover:text-slate-900 dark:hover:text-white transition-all">Send</button>
                   ) : (
                      <div className="flex gap-4">
                         <Mic size={24} className="cursor-pointer hover:opacity-50 text-slate-900 dark:text-white" />
                         <Image size={24} className="cursor-pointer hover:opacity-50 text-slate-900 dark:text-white" />
                         <Heart size={24} className="cursor-pointer hover:opacity-50 text-slate-900 dark:text-white" />
                      </div>
                   )}
                </form>
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center p-10 text-center">
            <div className="w-24 h-24 rounded-full border-2 border-slate-900 dark:border-white flex items-center justify-center mb-6">
               <MessageSquare size={48} className="text-slate-900 dark:text-white" />
            </div>
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white lowercase">your messages</h3>
            <p className="text-slate-400 text-[14px] mt-2 font-medium">Send private photos and messages to a friend or group.</p>
            <button className="mt-8 px-5 py-2 bg-sky-500 text-white rounded-lg text-sm font-bold shadow-lg hover:opacity-80 transition-all">Send message</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatSystem;
