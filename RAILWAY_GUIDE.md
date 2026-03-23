# 🚀 Railway Deployment Guide for Campus Hub

This project is now configured for deployment on [Railway](https://railway.app/). Due to the split structure (`client` and `server`), you should deploy them as **two separate services** within the same project.

## 🛠 Configuration Changes Made
1.  **Backend (`server/index.js`)**: Updated to use `process.env.PORT` for compatibility with Railway's dynamic port assignment.
2.  **Frontend (`client/App.jsx` & `ChatSystem.jsx`)**: Added support for environment variables (`VITE_API_BASE_URL` and `VITE_SOCKET_URL`) so the frontend can connect to your backend on Railway.
3.  **Backend Configuration**: Added a `railway.json` in the `server` folder to guide the build process.

---

## 🏗 Deployment Steps

### 1. Backend Service (Express)
1.  In the Railway Dashboard, click **New** -> **GitHub Repo** -> select this repo.
2.  In the "Service Settings", set the **Root Directory** to `server`.
3.  **Environment Variables**: Add the following variables to the `server` service:
    *   `PORT`: `5001` (or leave it to Railway's default)
    *   `MONGODB_URI`: (Copy-paste your MongoDB connection string from a Railway MongoDB plugin or an external provider)
    *   `JWT_SECRET`: (Your secret key)
    *   `JWT_REFRESH_SECRET`: (Your refresh secret key)
    *   `ALLOWED_DOMAIN`: (e.g., `gmail.com`)
    *   `ADMIN_EMAIL`: (e.g., `admin@example.com`)
    *   `ADMIN_PASSWORD`: (Your admin password)

### 2. Frontend Service (React/Vite)
1.  Click **New** -> **GitHub Repo** -> select the same repo again.
2.  In the "Service Settings", set the **Root Directory** to `client`.
3.  **Environment Variables**: Add the following variables to the `client` service:
    *   `VITE_API_BASE_URL`: (The URL of your **Backend Service** e.g., `https://backend-production.up.railway.app`)
    *   `VITE_SOCKET_URL`: (The same as above)
4.  Railway will automatically detect it's a Vite app and deploy it.

---

## 📝 Important Notes
*   **MongoDB**: I recommend creating a **MongoDB** service on Railway and copying its `DATABASE_URL` into your backend's `MONGODB_URI`.
*   **Multer/Uploads**: Files stored in the `server/uploads` directory are **ephemeral** (they will be deleted on every redeploy). For long-term storage, consider integrating a service like **Cloudinary** or **AWS S3**.
*   **CORS**: Currently, the backend allows ALL origins (`cors: { origin: '*' }`). This is fine for initial deployment, but you can restrict it to your client URL for better security.

Your project is now ready for Railway! 🚀
