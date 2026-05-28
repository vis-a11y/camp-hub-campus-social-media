const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json({ limit: '50mb' }));

const dbPath = path.join(__dirname, 'db.json');

const readDB = () => {
  const data = fs.readFileSync(dbPath, 'utf8');
  return JSON.parse(data);
};

const writeDB = (data) => {
  fs.writeFileSync(dbPath, JSON.stringify(data, null, 2), 'utf8');
};

// Ensure DB has all needed arrays
const ensureDB = () => {
  const db = readDB();
  let changed = false;
  ['users','stories','posts','messages','events','groups','groupMessages'].forEach(key => {
    if (!db[key]) { db[key] = []; changed = true; }
  });
  if (changed) writeDB(db);
  return db;
};

// GET all posts
app.get('/api/posts', (req, res) => {
  const db = ensureDB();
  res.json(db.posts);
});

// POST new post
app.post('/api/posts', (req, res) => {
  const db = ensureDB();
  const newPost = {
    id: Date.now().toString(),
    ...req.body,
    likes: 0,
    comments: [],
    timestamp: new Date().toISOString()
  };
  db.posts.unshift(newPost);
  writeDB(db);
  res.status(201).json(newPost);
});

// GET user stories
app.get('/api/stories', (req, res) => {
  const db = ensureDB();
  // Filter out stories older than 24h
  const cutoff = Date.now() - 24 * 60 * 60 * 1000;
  const fresh = db.stories.filter(s => new Date(s.createdAt).getTime() > cutoff);
  if (fresh.length !== db.stories.length) { db.stories = fresh; writeDB(db); }
  res.json(fresh);
});

// POST create a story
app.post('/api/stories', (req, res) => {
  const db = ensureDB();
  const story = {
    id: Date.now().toString(),
    userId: req.body.userId,
    username: req.body.username,
    avatar: req.body.avatar,
    imageUrl: req.body.imageUrl,
    caption: req.body.caption || '',
    viewed: false,
    viewers: [],
    createdAt: new Date().toISOString()
  };
  db.stories.push(story);
  writeDB(db);
  res.status(201).json(story);
});

// POST mark story viewed
app.post('/api/stories/:id/view', (req, res) => {
  const db = ensureDB();
  const idx = db.stories.findIndex(s => s.id === req.params.id);
  if (idx > -1 && !db.stories[idx].viewers.includes(req.body.userId)) {
    db.stories[idx].viewers.push(req.body.userId);
    writeDB(db);
  }
  res.json({ ok: true });
});

// GET all users
app.get('/api/users', (req, res) => {
  const db = readDB();
  res.json(db.users);
});

// POST login
app.post('/api/login', (req, res) => {
  const db = readDB();
  const { username, password } = req.body;
  const user = db.users.find(u => u.username === username);
  
  if (user && user.password === password) {
    const { password: _, ...safeUser } = user;
    res.json(safeUser);
  } else {
    res.status(401).json({ message: 'Invalid credentials' });
  }
});

// POST register
app.post('/api/register', (req, res) => {
  const db = readDB();
  const { username, fullName, password, role } = req.body;
  
  if (db.users.find(u => u.username === username)) {
    return res.status(400).json({ message: 'Username already exists' });
  }

  const newUser = {
    id: Date.now().toString(),
    username,
    fullName,
    password,
    role,
    avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(fullName)}&background=random`
  };
  
  db.users.push(newUser);
  writeDB(db);
  
  const { password: _, ...safeUser } = newUser;
  res.status(201).json(safeUser);
});

// GET specific user's posts
app.get('/api/users/:id/posts', (req, res) => {
  const db = ensureDB();
  const userPosts = db.posts.filter(p => p.userId === req.params.id);
  res.json(userPosts);
});

// PUT update user profile
app.put('/api/users/:id', (req, res) => {
  const db = ensureDB();
  const idx = db.users.findIndex(u => u.id === req.params.id);
  if (idx === -1) return res.status(404).json({ message: 'User not found' });

  const allowed = ['fullName', 'bio', 'department', 'year', 'avatar', 'coverPhoto'];
  allowed.forEach(field => {
    if (req.body[field] !== undefined) db.users[idx][field] = req.body[field];
  });

  writeDB(db);
  const { password: _, ...safeUser } = db.users[idx];
  res.json(safeUser);
});

// POST like a post
app.post('/api/posts/:id/like', (req, res) => {
  const db = readDB();
  const postIndex = db.posts.findIndex(p => p.id === req.params.id);
  if (postIndex > -1) {
    db.posts[postIndex].likes += 1;
    writeDB(db);
    res.json(db.posts[postIndex]);
  } else {
    res.status(404).json({ message: 'Post not found' });
  }
});

// POST comment on a post
app.post('/api/posts/:id/comment', (req, res) => {
  const db = readDB();
  const postIndex = db.posts.findIndex(p => p.id === req.params.id);
  if (postIndex > -1) {
    const newComment = {
      id: Date.now().toString(),
      username: req.body.username,
      text: req.body.text
    };
    db.posts[postIndex].comments.push(newComment);
    writeDB(db);
    res.json(db.posts[postIndex]);
  } else {
    res.status(404).json({ message: 'Post not found' });
  }
});

// GET messages
app.get('/api/messages', (req, res) => {
  const db = readDB();
  res.json(db.messages);
});

// POST message
app.post('/api/messages', (req, res) => {
  const db = readDB();
  const newMessage = {
    id: Date.now().toString(),
    ...req.body,
    timestamp: new Date().toISOString()
  };
  db.messages.push(newMessage);
  writeDB(db);
  res.status(201).json(newMessage);
});

// --- EVENTS ---

// GET all events
app.get('/api/events', (req, res) => {
  const db = readDB();
  res.json(db.events);
});

// POST create event
app.post('/api/events', (req, res) => {
  const db = readDB();
  const newEvent = {
    id: Date.now().toString(),
    ...req.body,
    attendees: [],
    timestamp: new Date().toISOString()
  };
  db.events.unshift(newEvent);
  writeDB(db);
  res.status(201).json(newEvent);
});

// POST apply to event
app.post('/api/events/:id/apply', (req, res) => {
  const db = readDB();
  const eventIndex = db.events.findIndex(e => e.id === req.params.id);
  
  if (eventIndex > -1) {
    const { userId, username, fullName } = req.body;
    
    // Check if already applied
    if (db.events[eventIndex].attendees.find(a => a.userId === userId)) {
      return res.status(400).json({ message: 'Already applied' });
    }

    const ticketCode = `TKT-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
    
    const attendee = {
      userId,
      username,
      fullName,
      ticketCode,
      appliedAt: new Date().toISOString()
    };
    
    db.events[eventIndex].attendees.push(attendee);
    writeDB(db);
    
    res.json({ event: db.events[eventIndex], ticketCode });
  } else {
    res.status(404).json({ message: 'Event not found' });
  }
});

app.listen(PORT, () => {
  ensureDB(); // Make sure all keys exist on startup
  console.log(`CampHub backend running on port ${PORT}`);
});

// --- GROUP CHATS ---

// GET all groups for a user
app.get('/api/groups', (req, res) => {
  const db = ensureDB();
  const { userId } = req.query;
  if (!userId) return res.json(db.groups);
  const userGroups = db.groups.filter(g => g.members.includes(userId));
  res.json(userGroups);
});

// POST create a group
app.post('/api/groups', (req, res) => {
  const db = ensureDB();
  const { name, description, createdBy, members } = req.body;
  const group = {
    id: Date.now().toString(),
    name,
    description: description || '',
    createdBy,
    members: [...new Set([createdBy, ...members])],
    createdAt: new Date().toISOString()
  };
  db.groups.push(group);
  writeDB(db);
  res.status(201).json(group);
});

// POST add member to group
app.post('/api/groups/:id/members', (req, res) => {
  const db = ensureDB();
  const idx = db.groups.findIndex(g => g.id === req.params.id);
  if (idx === -1) return res.status(404).json({ message: 'Group not found' });
  const { userId } = req.body;
  if (!db.groups[idx].members.includes(userId)) {
    db.groups[idx].members.push(userId);
    writeDB(db);
  }
  res.json(db.groups[idx]);
});

// GET messages for a group
app.get('/api/groups/:id/messages', (req, res) => {
  const db = ensureDB();
  const msgs = (db.groupMessages || []).filter(m => m.groupId === req.params.id);
  res.json(msgs);
});

// POST message to a group
app.post('/api/groups/:id/messages', (req, res) => {
  const db = ensureDB();
  const msg = {
    id: Date.now().toString(),
    groupId: req.params.id,
    senderId: req.body.senderId,
    senderName: req.body.senderName,
    senderAvatar: req.body.senderAvatar,
    text: req.body.text,
    timestamp: new Date().toISOString()
  };
  if (!db.groupMessages) db.groupMessages = [];
  db.groupMessages.push(msg);
  writeDB(db);
  res.status(201).json(msg);
});
