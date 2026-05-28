import { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { Users, Plus, ArrowLeft, Send, UserPlus, X, MessageCircle } from 'lucide-react';
import './MessagesPage.css';

const MessagesPage = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('direct'); // 'direct' | 'groups'
  const [activeChat, setActiveChat] = useState(null);   // { type: 'direct'|'group', id, name, avatar }
  const [allUsers, setAllUsers] = useState([]);
  const [groups, setGroups] = useState([]);
  const [directMessages, setDirectMessages] = useState([]);
  const [groupMessages, setGroupMessages] = useState([]);
  const [newText, setNewText] = useState('');
  const [showCreateGroup, setShowCreateGroup] = useState(false);
  const [newGroupName, setNewGroupName] = useState('');
  const [newGroupDesc, setNewGroupDesc] = useState('');
  const [selectedMembers, setSelectedMembers] = useState([]);
  const messagesEndRef = useRef(null);

  const fetchAll = () => {
    fetch('http://localhost:5000/api/users')
      .then(r => r.json()).then(d => setAllUsers(d.filter(u => u.id !== user?.id)));
    fetch('http://localhost:5000/api/messages')
      .then(r => r.json()).then(d => setDirectMessages(d));
    fetch(`http://localhost:5000/api/groups?userId=${user?.id}`)
      .then(r => r.json()).then(d => setGroups(d));
  };

  useEffect(() => { if (user) fetchAll(); }, [user]);

  useEffect(() => {
    if (activeChat?.type === 'group') {
      fetch(`http://localhost:5000/api/groups/${activeChat.id}/messages`)
        .then(r => r.json()).then(d => setGroupMessages(d));
    }
  }, [activeChat]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [directMessages, groupMessages, activeChat]);

  // ---- DIRECT MESSAGES ----
  const getDirectChats = () => allUsers.map(u => {
    const msgs = directMessages.filter(m =>
      (m.senderId === user.id && m.receiverId === u.id) ||
      (m.senderId === u.id && m.receiverId === user.id)
    );
    const last = msgs[msgs.length - 1];
    return { id: u.id, name: u.fullName || u.username, avatar: u.avatar, lastMsg: last?.text || 'Say hello 👋', time: last?.timestamp || '' };
  });

  const getActiveDMMessages = () => directMessages.filter(m =>
    (m.senderId === user.id && m.receiverId === activeChat?.id) ||
    (m.senderId === activeChat?.id && m.receiverId === user.id)
  );

  const sendDM = async (e) => {
    e.preventDefault();
    if (!newText.trim()) return;
    const res = await fetch('http://localhost:5000/api/messages', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ senderId: user.id, receiverId: activeChat.id, text: newText })
    });
    if (res.ok) {
      const msg = await res.json();
      setDirectMessages(prev => [...prev, msg]);
      setNewText('');
    }
  };

  // ---- GROUP MESSAGES ----
  const sendGroupMsg = async (e) => {
    e.preventDefault();
    if (!newText.trim()) return;
    const res = await fetch(`http://localhost:5000/api/groups/${activeChat.id}/messages`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ senderId: user.id, senderName: user.fullName || user.username, senderAvatar: user.avatar, text: newText })
    });
    if (res.ok) {
      const msg = await res.json();
      setGroupMessages(prev => [...prev, msg]);
      setNewText('');
    }
  };

  // ---- CREATE GROUP ----
  const createGroup = async (e) => {
    e.preventDefault();
    if (!newGroupName.trim() || selectedMembers.length === 0) return;
    const res = await fetch('http://localhost:5000/api/groups', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: newGroupName, description: newGroupDesc, createdBy: user.id, members: selectedMembers })
    });
    if (res.ok) {
      const g = await res.json();
      setGroups(prev => [...prev, g]);
      setShowCreateGroup(false);
      setNewGroupName(''); setNewGroupDesc(''); setSelectedMembers([]);
      setActiveChat({ type: 'group', id: g.id, name: g.name });
      setActiveTab('groups');
    }
  };

  const toggleMember = (uid) =>
    setSelectedMembers(prev => prev.includes(uid) ? prev.filter(x => x !== uid) : [...prev, uid]);

  const formatTime = (iso) => {
    if (!iso) return '';
    const d = new Date(iso);
    return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const activeMsgs = activeChat?.type === 'group' ? groupMessages : getActiveDMMessages();

  return (
    <div className="messages-container">
      {/* ---- SIDEBAR ---- */}
      <div className={`messages-sidebar ${activeChat ? 'hide-on-mobile' : ''}`}>
        <div className="messages-header">
          <h2>{user?.username}</h2>
          <button className="icon-btn" onClick={() => setShowCreateGroup(true)} title="New Group">
            <Users size={22} />
          </button>
        </div>

        {/* TABS */}
        <div className="msg-tabs">
          <button className={activeTab === 'direct' ? 'active' : ''} onClick={() => setActiveTab('direct')}>
            <MessageCircle size={15} /> Direct
          </button>
          <button className={activeTab === 'groups' ? 'active' : ''} onClick={() => setActiveTab('groups')}>
            <Users size={15} /> Groups
          </button>
        </div>

        <div className="chat-list">
          {activeTab === 'direct' && getDirectChats().map(chat => (
            <div
              key={chat.id}
              className={`chat-item ${activeChat?.id === chat.id && activeChat?.type === 'direct' ? 'active' : ''}`}
              onClick={() => setActiveChat({ type: 'direct', id: chat.id, name: chat.name, avatar: chat.avatar })}
            >
              <img src={chat.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(chat.name)}`} alt={chat.name} className="avatar chat-avatar" />
              <div className="chat-info">
                <span className="chat-name">{chat.name}</span>
                <span className="chat-last-message">{chat.lastMsg}</span>
              </div>
            </div>
          ))}

          {activeTab === 'groups' && groups.map(g => (
            <div
              key={g.id}
              className={`chat-item ${activeChat?.id === g.id && activeChat?.type === 'group' ? 'active' : ''}`}
              onClick={() => setActiveChat({ type: 'group', id: g.id, name: g.name })}
            >
              <div className="group-avatar-placeholder"><Users size={20} /></div>
              <div className="chat-info">
                <span className="chat-name">{g.name}</span>
                <span className="chat-last-message">{g.members.length} members · {g.description || 'Group chat'}</span>
              </div>
            </div>
          ))}

          {activeTab === 'groups' && groups.length === 0 && (
            <div className="empty-state-small">
              <p>No groups yet</p>
              <button className="btn-primary" style={{marginTop: '10px', fontSize: '13px'}} onClick={() => setShowCreateGroup(true)}>Create Group</button>
            </div>
          )}
        </div>
      </div>

      {/* ---- CHAT WINDOW ---- */}
      <div className={`chat-window ${!activeChat ? 'hide-on-mobile' : ''}`}>
        {activeChat ? (
          <div className="chat-active">
            <div className="chat-window-header">
              <button className="icon-btn back-btn" onClick={() => setActiveChat(null)}><ArrowLeft size={20} /></button>
              {activeChat.type === 'group'
                ? <div className="group-avatar-placeholder sm"><Users size={16} /></div>
                : <img src={activeChat.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(activeChat.name)}`} alt={activeChat.name} className="avatar" style={{ width: 36, height: 36 }} />
              }
              <div>
                <span className="chat-window-name">{activeChat.name}</span>
                {activeChat.type === 'group' && (
                  <span style={{ fontSize: 12, color: 'var(--secondary-text)', display: 'block' }}>
                    {groups.find(g => g.id === activeChat.id)?.members.length} members
                  </span>
                )}
              </div>
            </div>

            <div className="chat-messages-area">
              {activeMsgs.length === 0 && (
                <div className="empty-state-small"><p>No messages yet. Say hi! 👋</p></div>
              )}
              {activeMsgs.map(msg => {
                const isMine = msg.senderId === user.id;
                return (
                  <div key={msg.id} className={`message-wrap ${isMine ? 'mine' : 'theirs'}`}>
                    {!isMine && activeChat.type === 'group' && (
                      <img src={msg.senderAvatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(msg.senderName || 'U')}`}
                        alt={msg.senderName} className="avatar msg-avatar" style={{ width: 28, height: 28 }} />
                    )}
                    <div className="message-bubble-wrap">
                      {!isMine && activeChat.type === 'group' && <span className="msg-sender-name">{msg.senderName}</span>}
                      <div className={`message ${isMine ? 'sent' : 'received'}`}>{msg.text}</div>
                      <span className="msg-time">{formatTime(msg.timestamp)}</span>
                    </div>
                  </div>
                );
              })}
              <div ref={messagesEndRef} />
            </div>

            <form className="chat-input-area" onSubmit={activeChat.type === 'group' ? sendGroupMsg : sendDM}>
              <input
                type="text"
                placeholder={`Message ${activeChat.name}...`}
                value={newText}
                onChange={e => setNewText(e.target.value)}
              />
              <button type="submit" className="send-btn" disabled={!newText.trim()}>
                <Send size={18} />
              </button>
            </form>
          </div>
        ) : (
          <div className="no-chat-selected">
            <MessageCircle size={64} opacity={0.15} />
            <h3>Your Messages</h3>
            <p>Send private messages or create a group to connect with campus friends.</p>
            <div style={{ display: 'flex', gap: 10, marginTop: 16 }}>
              <button className="btn-primary" onClick={() => setActiveTab('direct')}>Send Message</button>
              <button className="btn-secondary" onClick={() => setShowCreateGroup(true)}>
                <Users size={16} /> New Group
              </button>
            </div>
          </div>
        )}
      </div>

      {/* ---- CREATE GROUP MODAL ---- */}
      {showCreateGroup && (
        <div className="modal-overlay" onClick={() => setShowCreateGroup(false)}>
          <div className="create-group-modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Create New Group</h3>
              <button className="icon-btn" onClick={() => setShowCreateGroup(false)}><X size={20} /></button>
            </div>
            <form onSubmit={createGroup} className="group-form">
              <input
                type="text"
                placeholder="Group Name *"
                value={newGroupName}
                onChange={e => setNewGroupName(e.target.value)}
                required
              />
              <input
                type="text"
                placeholder="Description (optional)"
                value={newGroupDesc}
                onChange={e => setNewGroupDesc(e.target.value)}
              />
              <p className="form-label">Add Members ({selectedMembers.length} selected)</p>
              <div className="member-list">
                {allUsers.map(u => (
                  <div
                    key={u.id}
                    className={`member-item ${selectedMembers.includes(u.id) ? 'selected' : ''}`}
                    onClick={() => toggleMember(u.id)}
                  >
                    <img src={u.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(u.fullName || u.username)}`}
                      alt={u.username} className="avatar" style={{ width: 38, height: 38 }} />
                    <div>
                      <p style={{ fontWeight: 600, fontSize: 14 }}>{u.fullName || u.username}</p>
                      <p style={{ fontSize: 12, color: 'var(--secondary-text)' }}>{u.role === 'faculty' ? '📚 Faculty' : '🎓 Student'}</p>
                    </div>
                    {selectedMembers.includes(u.id) && <span className="check-mark">✓</span>}
                  </div>
                ))}
              </div>
              <button
                type="submit"
                className="btn-primary"
                style={{ marginTop: 12, width: '100%' }}
                disabled={!newGroupName.trim() || selectedMembers.length === 0}
              >
                Create Group
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default MessagesPage;
