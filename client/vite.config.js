import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],

  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:5001', // local backend
        changeOrigin: true,
        secure: false,
      },
      '/socket.io': {
        target: 'http://localhost:5001',
        ws: true,
      },
    },
  },

  build: {
    chunkSizeWarningLimit: 1000, // 🔥 fixes chunk size warning
  },

  // NOTE: For production deployments (e.g., on Vercel), ensure the following:
  // - Set VITE_API_BASE_URL environment variable to your backend URL
  //   Example: https://your-backend-domain.up.railway.app/api
  // - This allows AuthContext.jsx to make requests to the correct backend
  // - In local development, this is not needed; the Vite dev server proxy handles it
});
