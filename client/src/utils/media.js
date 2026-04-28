/**
 * HUB MEDIA UTILITY v2.0
 * Intelligent URL normalization for Cloudinary and Local Fallbacks.
 */
export const getMediaUrl = (path) => {
  if (!path) return '';
  
  // If it's already a full cloud URL, return it
  if (path.startsWith('http')) return path;
  
  // Clean up relative path
  const cleanPath = path.startsWith('/') ? path.slice(1) : path;
  
  // Production Fallback to Render if not absolute
  const API_BASE = import.meta.env.VITE_API_BASE_URL || 'https://campchat-campus-hub-2.onrender.com';
  const baseUrl = API_BASE.replace(/\/$/, '');
  
  return `${baseUrl}/${cleanPath}`;
};
