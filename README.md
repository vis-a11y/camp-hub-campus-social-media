# ⚡ CampChat — Campus Social Media & Academic Hub

CampChat is a premium, high-performance social networking platform designed specifically for academic environments. It blends the immersive experience of modern social media (like Instagram) with the critical functionalities of a campus management system, creating a unified "Digital Core" for students, faculty, and administrators.

---

## ✨ Features

### 📸 **Instagram-Inspired Stories Hub**
- **Visual Narratives**: Shared student life through image-based stories.
- **Audio Scapes**: Background music integration for an immersive campus atmosphere.
- **Auto-Expiry**: Content rotates every 24 hours to keep the feed fresh.

### 🏛️ **Academic Identity**
- **Customizable Profiles**: Set your branch/department (Computer, IT, EXTC, Civil, Mechanical).
- **Social Graph**: Follow/Unfollow peers and professors.
- **Portfolio Sync**: Link your external projects and achievements.

### 📑 **Intelligent Feed & Discovery**
- **Dynamic Categorization**: Classify posts as *Doubt*, *Announcement*, or *General Hub*.
- **Trending Metrics**: Real-time engagement tracking to highlight the most discussed campus topics.
- **Resource Archiving**: Save critical notices or inspiring posts directly to your personal library.

### 🗓️ **Experiences & Events**
- **Campus Organizations**: Faculty and admins can publish official events.
- **One-Click Registration**: Secure your spot in workshops, webinars, or fests instantly.

### 💬 **Real-time Communication**
- **Socket.io Integration**: Instant messaging with "Typing" indicators and "Seen" status.
- **Circle Chats**: Connect with project partners or study groups seamlessly.

---

## 🛠️ Technology Stack

| Layer | Technology |
| :--- | :--- |
| **Frontend** | React 18, Vite, Tailwind CSS, Lucide React |
| **Backend** | Node.js, Express.js |
| **Database** | MongoDB (Mongoose ODM) |
| **Real-time**| Socket.io |
| **Animation**| Framer Motion & CSS Magic |

---

## 🚀 Getting Started

### 1. Repository Setup
```bash
git clone https://github.com/vis-a-11y/CampChat---Campus-Hub.git
cd CampChat---Campus-Hub
```

### 2. Configure Environment
Create a `.env` file in the `/server` directory:
```env
PORT=5001
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_premium_secret_key
ADMIN_EMAIL=your_admin@domain.com
ADMIN_PASSWORD=your_secure_pass
```

### 3. Install Dependencies
```bash
# Install Server Dependencies
cd server
npm install

# Install Client Dependencies
cd ../client
npm install
```

### 4. Initiate the Hub
```bash
# Run Backend (Port 5001)
cd server
npm run dev

# Run Frontend (Port 5173)
cd client
npm run dev
```

---

## 🛰️ API Protocol

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `POST` | `/api/auth/register` | Establish a new academic identity node. |
| `PUT` | `/api/auth/me` | Update node parameters and profile metadata. |
| `GET` | `/api/academic/posts` | Fetch the global feed sync. |
| `POST` | `/api/academic/stories` | Broadcast a new campus story. |

---

## 🛡️ License
Designed and developed for the modern academic ecosystem. All rights reserved. 🚀
