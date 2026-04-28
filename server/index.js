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
const helmet = require('helmet');
const compression = require('compression');

dotenv.config();

// AUTO-CLEANUP: Removing unwanted/redundant files on startup
const filesToRemove = [
  path.join(__dirname, 'railway.json'),
  path.join(__dirname, '../client/railway.json'),
  path.join(__dirname, '../package-lock.json'), // Empty root lockfile
  path.join(__dirname, 'seed.js')
];

filesToRemove.forEach(file => {
  if (fs.existsSync(file)) {
     try {
       fs.unlinkSync(file);
       console.log(`🧹 Auto-Clean: Removed ${path.basename(file)}`);
     } catch (err) {
       console.warn(`⚠️ Could not auto-remove ${file}:`, err.message);
     }
  }
});

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

// CLOUDINARY CONFIGURATION (For Persistent Storage)
let cloudUpload = null;
if (process.env.CLOUDINARY_CLOUD_NAME) {
  const cloudinary = require('cloudinary').v2;
  const { CloudinaryStorage } = require('multer-storage-cloudinary');

  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
  });

  const cloudStorage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
      folder: 'campus-hub-media',
      allowed_formats: ['jpg', 'png', 'jpeg', 'gif', 'mp4', 'webp'],
      resource_type: 'auto'
    }
  });
  cloudUpload = multer({ storage: cloudStorage });
  console.log('☁️  Cloudinary storage initialized for persistent media.');
}

// Middleware
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" },
  contentSecurityPolicy: false, // Disable CSP to allow all external media sources reliably
}));
app.use(compression()); // Compress responses

const corsOptions = {
  origin: (origin, callback) => {
    // Add Vercel and localhost origins
    const allowedOrigins = [
      process.env.CLIENT_URL,
      'http://localhost:5173',
      'http://localhost:3000',
    ].filter(Boolean);

    // Allow requests with no origin (like mobile apps or curl)
    if (!origin) return callback(null, true);

    // Check if origin is allowed, or if it's a Vercel preview/production URL
    const isAllowed = allowedOrigins.some(url => origin.startsWith(url)) || 
                      origin.endsWith('.vercel.app') ||
                      process.env.NODE_ENV !== 'production';

    if (isAllowed) {
      callback(null, true);
    } else {
      console.warn('🛑 CORS Blocked Origin:', origin);
      console.warn('💡 Tip: Add this origin to your CLIENT_URL or the allowed list.');
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept'],
  optionsSuccessStatus: 200,
};
app.use(cors(corsOptions));
app.options('*', cors(corsOptions)); // Enable pre-flight for all routes
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));
app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));

app.use('/uploads', express.static(uploadsDir));

app.post('/api/upload', (req, res, next) => {
  // Use Cloudinary if configured, otherwise local disk
  const uploader = cloudUpload ? cloudUpload.single('file') : upload.single('file');
  
  uploader(req, res, (err) => {
    if (err) {
      console.error('Upload Error:', err);
      return res.status(400).json({ message: 'File upload failed', error: err.message });
    }
    if (!req.file) return res.status(400).json({ message: 'No file received' });
    
    // Cloudinary returns the full URL in 'path', Multer-disk returns 'filename'
    const url = req.file.path || `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
    res.json({ 
      url, 
      filename: req.file.filename || req.file.public_id,
      storage: cloudUpload ? 'cloudinary' : 'local'
    });
  });
});

const mongoURI = process.env.MONGODB_URI;

// Robust MongoDB Connection Logic
if (!mongoURI && process.env.NODE_ENV === 'production') {
  console.error('❌ CRITICAL ERROR: MONGODB_URI is not defined in environment variables!');
  console.error('💡 ACTION REQUIRED: Add MONGODB_URI (your Atlas string) to your deployment platform settings.');
  // In production, we should ideally not fall back to localhost if we expect persistence
}

const finalMongoURI = (mongoURI && mongoURI.startsWith('mongodb')) 
  ? mongoURI 
  : 'mongodb://localhost:27017/campchat';

if (mongoURI && !mongoURI.startsWith('mongodb')) {
  console.warn(`⚠️ Warning: MONGODB_URI is invalid. Falling back to local MongoDB.`);
}

console.log('📡 Attempting to connect to MongoDB...');
if (finalMongoURI.includes('localhost')) {
  console.warn('⚠️ USING LOCAL DATABASE: Data will NOT persist on cloud platforms (Render/Vercel).');
}

mongoose.connect(finalMongoURI, {
  serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of hanging
})
  .then(() => {
    console.log('✅ Connected to MongoDB Successfully');
    console.log(`📂 Database Host: ${mongoose.connection.host}`);
  })
  .catch((err) => {
    console.error('❌ MongoDB Connection Error:', err.message);
    console.error('💡 TROUBLESHOOTING:');
    console.error('   1. Check if MONGODB_URI is correct in your .env or dashboard.');
    console.error('   2. Ensure your IP address is whitelisted in MongoDB Atlas.');
    console.error('   3. If running locally, make sure MongoDB service is active.');
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

