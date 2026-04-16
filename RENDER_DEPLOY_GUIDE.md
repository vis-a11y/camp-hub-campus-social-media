# 🚀 Render Deployment Guide for CampChat Server

Follow these steps to deploy your backend server to Render.

## 1. Prepare your GitHub Repository
Ensure your latest changes are pushed to GitHub. Render will connect to your repository to automate deployments.

## 2. Create a Web Service on Render
1. Log in to [Render](https://dashboard.render.com/).
2. Click **New +** and select **Web Service**.
3. Connect your GitHub repository.
4. Set the following configurations:
   - **Name**: `campchat-server` (or your preferred name)
   - **Environment**: `Node`
   - **Region**: Chooses the one closest to you.
   - **Branch**: `main` (or your development branch)
   - **Root Directory**: `server` (IMPORTANT: since your backend is in a subdirectory)
   - **Build Command**: `npm install`
   - **Start Command**: `node index.js` (or `npm start`)

## 3. Configure Environment Variables
In the **Environment** tab of your Render service, add the following variables:

| Key | Value | Description |
|-----|-------|-------------|
| `NODE_ENV` | `production` | Optimizes performance and logging |
| `MONGODB_URI` | `your_mongodb_atlas_connection_string` | Your database connection string |
| `PORT` | `10000` | (Optional) Render sets this automatically, but you can specify |
| `CLIENT_URL` | `https://your-frontend-url.onrender.com` | Your deployed frontend URL (for CORS) |
| `JWT_SECRET` | `your_random_secret_string` | Used for authentication |

## 4. Important Considerations

### Disk Storage for Uploads
Render's filesystem is **ephemeral**, meaning files uploaded to the `/uploads` directory will be deleted every time the server restarts or redeploys.
- **Solution 1**: Use Render **Disks** (Paid feature) to persist the `/uploads` folder.
- **Solution 2**: Use a cloud storage service like **Cloudinary** or **AWS S3** instead of local disk storage.

### Health Check
I have added a `/health` endpoint to your `index.js`. Render uses this to verify if your server is up and running.

## 5. Deployment
- Click **Create Web Service**.
- Wait for the build and deployment process to complete.
- Once finished, you will get a URL like `https://campchat-server.onrender.com`.

---

### 💡 Pro Tip
Update your Frontend (`client/.env`) `VITE_API_BASE_URL` with your new Render backend URL!
