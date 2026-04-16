const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const http = require('http');
const { Server } = require('socket.io');
const morgan = require('morgan');
const path = require('path');
const multer = require('multer');
const fs = require('fs');

dotenv.config();

const app = express();
const server = http.createServer(app);

// Use socket.io with updated CORS
const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL || '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true,
  },
});

// Trust proxy for Render (needed for req.protocol to be 'https')
app.set('trust proxy', 1);

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadsDir),
  filename: (req, file, cb) => {
    const unique = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    cb(null, unique + path.extname(file.originalname));
  },
});
const upload = multer({ storage });

// Middleware
const corsOptions = {
  origin: process.env.CLIENT_URL || '*',
  optionsSuccessStatus: 200,
};
app.use(cors(corsOptions));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));
app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));

app.use('/uploads', express.static(uploadsDir));

app.post('/api/upload', upload.single('file'), (req, res) => {
  if (!req.file) return res.status(400).json({ message: 'No file uploaded' });
  
  // Use a relative path or a full URL based on the environment
  const protocol = req.headers['x-forwarded-proto'] || req.protocol;
  const url = `${protocol}://${req.get('host')}/uploads/${req.file.filename}`;
  res.json({ url, filename: req.file.filename });
});

const mongoURI = process.env.MONGODB_URI;

// Render/Railway and Production environments strict check
if (!mongoURI && (process.env.RAILWAY_ENVIRONMENT || process.env.RENDER)) {
  console.error('\n❌ CRITICAL ERROR: MONGODB_URI is not defined in Production Environment!');
  console.error('💡 To fix this:');
  console.log('   1. Open your Render/Railway Dashboard.');
  console.log('   2. Go to your Server service -> Environment Variables.');
  console.log('   3. Add a new variable called MONGODB_URI.');
  console.log('   4. Paste your MongoDB connection string.\n');
  process.exit(1);
}

console.log('📡 Attempting to connect to MongoDB...');

mongoose.connect(mongoURI || 'mongodb://localhost:27017/campchat')
  .then(() => console.log('✅ Connected to MongoDB'))
  .catch((err) => {
    console.error('❌ MongoDB Connection Error:', err.message);
    if (!mongoURI) {
      console.error('💡 TIP: You are trying to connect to localhost. This WILL fail on Render. Set your MONGODB_URI in the dashboard.');
    }
  });

// Routes
const authRoutes = require('./routes/authRoutes');
const academicRoutes = require('./routes/academicRoutes');
const chatRoutes = require('./routes/chatRoutes');
const messageRoutes = require('./routes/messageRoutes');

app.use('/api/auth', authRoutes);
app.use('/api/academic', academicRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/message', messageRoutes);

// Health check endpoint for Render
app.get('/health', (req, res) => res.status(200).send('OK'));
app.get('/', (req, res) => res.json({ message: 'CampChat API is running 🚀' }));

// Socket.io Implementation
io.on('connection', (socket) => {
  console.log('Connected to socket.io');

  socket.on('setup', (userData) => {
    if (!userData?._id) return;
    socket.userId = userData._id.toString();
    socket.join(userData._id);
    console.log('User setup:', userData._id);
    socket.emit('connected');
  });

  socket.on('join chat', (room) => {
    socket.join(room);
    console.log('User joined room:', room);
  });

  socket.on('typing', (room) => socket.in(room).emit('typing'));
  socket.on('stop typing', (room) => socket.in(room).emit('stop typing'));

  socket.on('new message', (newMessageRecieved) => {
    var chat = newMessageRecieved.chat;
    if (!chat.users) return console.log('Chat.users not defined');

    chat.users.forEach((user) => {
      if (user._id == newMessageRecieved.sender._id) return;
      socket.in(user._id).emit('message recieved', newMessageRecieved);
    });
  });

  socket.on('disconnect', () => {
    console.log('USER DISCONNECTED');
    if (socket.userId) {
      socket.leave(socket.userId);
    }
  });
});

const PORT = process.env.PORT || 5001; 
server.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));

