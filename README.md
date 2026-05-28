<div align="center">
  <h1>🎓 Campus Hub</h1>
  <p><em>The Ultimate Social Experience for College Campuses</em></p>

  <!-- Badges -->
  <p>
    <img src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" alt="React" />
    <img src="https://img.shields.io/badge/Vite-B73BFE?style=for-the-badge&logo=vite&logoColor=FFD62E" alt="Vite" />
    <img src="https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white" alt="NodeJS" />
    <img src="https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white" alt="Express" />
  </p>
</div>

---

## 📖 Overview

**Campus Hub** is a beautifully designed, highly interactive social media platform tailored specifically for university and college ecosystems. Built to mirror the premium feel of modern social networks (like Instagram), it bridges the gap between **students** and **faculty**. 

Whether it's sharing campus moments on your Feed, managing official collegiate events, or collaborating via Group Chats, Campus Hub is the digital center of your campus.

---

## 📑 Table of Contents
- [✨ Key Features](#-key-features)
- [🏗 System Architecture](#-system-architecture)
- [📂 Project Structure](#-project-structure)
- [🔌 API Overview](#-api-overview)
- [🚀 Quick Start](#-quick-start)
- [📱 Workflows & Usage](#-workflows--usage)
- [🤝 Contributing](#-contributing)
- [📄 License](#-license)

---

## ✨ Key Features

### 📸 Premium Feed & Stories
- **Dynamic Feed:** Infinite-scrolling feed of posts from the campus community.
- **Micro-interactions:** Double-tap to like with animated heart pop-ups, bookmark saving, and nested comment threads.
- **Stories System:** 24-hour ephemeral stories with a full-screen viewer, auto-advancing progress bars, tap-to-navigate, and view-count tracking.

### 💬 Advanced Messaging
- **Real-Time DMs:** Private 1-on-1 messaging between any users.
- **Group Chats:** Create study groups or club chats. Add members dynamically and chat in a shared workspace.

### 📅 Event Management Hub
- **Faculty Controls:** Only Faculty members can create, edit, and oversee official events.
- **Student Applications:** Students can apply to events and receive uniquely generated digital ticket codes (e.g., `TKT-9X3B1A`).

### 👤 Deep Customization
- **Rich Profiles:** Users can upload profile avatars, cover photos, set bios, and list their academic Department and Year of Study.
- **Dual-Role Ecosystem:** Distinct visual identifiers and permissions for Students 🎓 vs. Faculty 📚.

---

## 🏗 System Architecture

The application follows a decoupled Client-Server architecture:

- **Frontend (Client)**: Built with **React** and powered by **Vite** for lightning-fast HMR. Uses the Context API for global state (Authentication) and native CSS variables for dynamic theming and layout management.
- **Backend (Server)**: A **Node.js/Express.js** RESTful API that handles user authentication, data validation, and business logic.
- **Storage**: Currently utilizes a persistent flat-file JSON database (`db.json`) for lightweight, zero-config deployment. Includes auto-healing data structures on boot.

---

## 📂 Project Structure

```text
campus Hub/
├── client/                     # Frontend React Application
│   ├── src/
│   │   ├── components/         # Reusable UI components (Feed, Stories, Modals)
│   │   ├── context/            # Global state (AuthContext)
│   │   ├── pages/              # Route views (Discover, Events, Messages, etc.)
│   │   ├── App.jsx             # Main Router configuration
│   │   └── index.css           # Global design tokens and utilities
│   └── package.json            
│
├── backend/                    # Backend Express API
│   ├── server.js               # Main API routes and server config
│   ├── db.json                 # Flat-file database (Auto-generated)
│   └── package.json
│
├── start-camphub.bat           # 1-Click Windows Startup Script
└── push-to-github.bat          # 1-Click Git Push Script
```

---

## 🔌 API Overview

The backend exposes a comprehensive REST API. Key endpoints include:

- `POST /api/register` & `POST /api/login` — Authentication
- `GET/POST /api/posts` — Feed generation and post creation
- `POST /api/posts/:id/like` & `/comment` — Post interactions
- `GET/POST /api/stories` — Ephemeral content management
- `GET/POST /api/groups` — Group chat creation and lookup
- `POST /api/events/:id/apply` — Event ticket generation

---

## 🚀 Quick Start

### Prerequisites
- Node.js (v16.x or higher recommended)
- Git

### 1. Clone & Install
```bash
git clone https://github.com/vis-a11y/camp-hub-campus-social-media.git
cd "campus Hub"

# Install backend dependencies
cd backend && npm install

# Install frontend dependencies
cd ../client && npm install
```

### 2. Run the Application
**For Windows Users:**
We have included a batch script for zero-friction startups. Simply double click `start-camphub.bat` in the root directory.

**Manual Startup:**
Open two terminals:
```bash
# Terminal 1 (Backend)
cd backend
npm run dev

# Terminal 2 (Frontend)
cd client
npm run dev
```
Navigate to `http://localhost:5173` in your browser.

---

## 📱 Workflows & Usage

1. **Onboarding**: Register a new account. Choose your role carefully, as it impacts your permissions (e.g., Event creation).
2. **Profile Setup**: Head to the Profile tab. Click **Edit Profile** to upload a cover photo, profile picture, and fill out your bio and department.
3. **Sharing**: Click the `+` icon in the bottom navigation bar to post to the main feed.
4. **Networking**: Navigate to the **Messages** tab to create a new Study Group and invite your classmates.

---

## 🤝 Contributing

We welcome contributions to make Campus Hub even better!

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.

<div align="center">
  <p>Built with ❤️ for Campus Communities</p>
</div>
