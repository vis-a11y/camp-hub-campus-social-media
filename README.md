# 🏫 CampChat - The Ultimate Campus Operating System

[![Vercel](https://img.shields.io/badge/Deploy-Vercel-black?style=for-the-badge&logo=vercel)](https://vercel.com)
[![Render](https://img.shields.io/badge/Backend-Render-46E3B7?style=for-the-badge&logo=render)](https://render.com)
[![React](https://img.shields.io/badge/Frontend-React-61DAFB?style=for-the-badge&logo=react)](https://reactjs.org)
[![MongoDB](https://img.shields.io/badge/Database-MongoDB-47A248?style=for-the-badge&logo=mongodb)](https://mongodb.com)

**CampChat** is a state-of-the-art, real-time campus community platform designed to bridge the gap between students, faculty, and administration. It combines the power of social networking with academic productivity tools.

---

## ✨ Key Features

### 💬 Communication Hub
- **Real-time Direct Messaging**: Instant connectivity powered by Socket.io.
- **Study Groups**: Create focused communities for specific subjects or interests.
- **Push Notifications**: Stay updated with signals for follows, likes, and messages.

### 📚 Academic Excellence
- **Resource Sharing**: Upload and access study materials and notes.
- **Project Showcases**: Display your technical work and collaborate with others.
- **Smart Search**: Find peers and content across the entire campus network.

### 🏢 Campus Life
- **Event Management**: Faculty-driven event creation with student registrations.
- **Dynamic Feed**: An Instagram-inspired dashboard for campus updates.
- **Premium UI**: Glassmorphism design with Dark/Light mode support.

---

## 🛠️ Technology Stack

| Layer | Technology |
| :--- | :--- |
| **Frontend** | React 18, Vite, Tailwind CSS, Lucide Icons |
| **Backend** | Node.js, Express.js |
| **Database** | MongoDB Atlas, Mongoose |
| **Real-time** | Socket.io |
| **Auth** | JWT (JSON Web Tokens), BCrypt |
| **State** | React Context API |

---

## 📦 Project Architecture

```text
├── client/                # React Frontend (Vite)
│   ├── src/
│   │   ├── components/    # Reusable UI components
│   │   ├── context/       # Auth & Theme state management
│   │   ├── pages/         # Screen-level components
│   │   └── utils/         # Helper functions
│   └── vercel.json        # SPA Routing for Vercel
├── server/                # Node.js Backend
│   ├── controllers/       # Business logic
│   ├── models/            # MongoDB Schemas
│   ├── routes/            # API Endpoints
│   └── socket/            # Real-time event handlers
└── RENDER_DEPLOY_GUIDE.md # Deployment instructions
```

---

## 🚦 Getting Started

### Prerequisites
- **Node.js** v16.x or higher
- **MongoDB** (Local or Atlas Cluster)
- **Git**

### Installation

1. **Clone the Hub**
   ```bash
   git clone https://github.com/vis-a-11y/CampChat---Campus-Hub.git
   cd CampChat---Campus-Hub
   ```

2. **Backend Setup**
   ```bash
   cd server
   npm install
   # Create a .env file based on .env.example
   npm run dev
   ```

3. **Frontend Setup**
   ```bash
   cd client
   npm install
   # Create a .env file based on .env.example
   npm run dev
   ```

---

## 🌐 Deployment Details

### Frontend (Vercel)
The client is optimized for Vercel with a custom `vercel.json` to handle client-side routing.
- **Environment Variables**: Ensure `VITE_API_BASE_URL` is set to your backend URL.

### Backend (Render)
The server is configured for seamless deployment on Render.
- **CORS Config**: Properly handles cross-origin requests from the Vercel domain.

---

## 📄 License
This project is licensed under the **ISC License**. Built with ❤️ for the campus community.
