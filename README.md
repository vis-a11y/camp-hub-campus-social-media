# 🏫 CampChat - Campus Hub

CampChat is a real-time campus community platform designed for students and faculty to connect, share resources, and collaborate on projects.

## 🚀 Features
- **Real-time Chat**: Connect with peers instantly using Socket.io.
- **Academic Hub**: Share posts, polls, and academic resources.
- **Event Management**: Faculty can create events and students can register.
- **Study Groups**: Create and join focused study communities.
- **Secure Authentication**: JWT-based login and registration.

## 🛠️ Tech Stack
- **Frontend**: React, Tailwind CSS, Vite.
- **Backend**: Node.js, Express, MongoDB (Mongoose).
- **Communication**: Socket.io for real-time messaging.
- **Security**: Helmet, JWT, and detailed environment validation.

## 📦 Project Structure
- `/client`: React frontend.
- `/server`: Express backend API.

## 🚦 Getting Started

### Prerequisites
- Node.js (v16+)
- MongoDB (Local or Atlas)

### Setup
1. **Clone the repo**:
   ```bash
   git clone https://github.com/vis-a-11y/CampChat---Campus-Hub.git
   ```

2. **Backend Setup**:
   ```bash
   cd server
   npm install
   # Create .env based on .env.example
   npm run dev
   ```

3. **Frontend Setup**:
   ```bash
   cd client
   npm install
   # Create .env based on .env.example
   npm run dev
   ```

## 📄 License
This project is licensed under the ISC License.
