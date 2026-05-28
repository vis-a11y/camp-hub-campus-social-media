# 🎓 CampHub | Campus Social Media Platform

CampHub is a modern, role-based social media platform designed for institution-wide engagement. It features an Instagram-inspired visual aesthetic, multi-tenant college isolation, and a robust feature set for students, faculty, and administrators.

## 🏗️ New Project Architecture

The project has been upgraded to a modular **React + Node.js** stack. All active production code is located in the following directories:

### 📱 1. Frontend (`/client`)
- **Framework**: React 18 + Vite
- **Styling**: Advanced CSS (Instagram Design System)
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **Features**: Multi-tenant selector, Anonymous Feed, Placement Board, Study Groups (with Resource Library), Events Hub, and Messages.

### ⚙️ 2. Backend (`/backend`)
- **Framework**: Node.js + Express
- **Database**: JSON-based persistent storage (`db.json`)
- **Auth**: Role-based access control (RBAC).

---

## 🚀 Getting Started

### Launch Frontend:
```bash
cd client
npm install
npm run dev
```

### Launch Backend:
```bash
cd backend
npm install
npm start
```

---

## ⚠️ Legacy Notice
The following files/folders are **deprecated** and are no longer part of the production build:
- `/js`
- `index.html` (Root)
- `style.css` (Root)
- `package.json` / `vite.config.js` (Root)

*Please use the configurations inside the `/client` directory for all development and deployment tasks.*
