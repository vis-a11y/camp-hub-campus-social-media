import axios from 'axios';

/**
 * Normalizes a media URL for production/development environments.
 * Maps legacy localhost URLs and relative paths to the production API base.
 * 
 * @param {string} url - The raw URL or path from the database.
 * @returns {string} - The corrected absolute URL.
 */
export const getMediaUrl = (url, name = 'User') => {
  if (!url || url === '' || url === 'undefined' || url === 'null') {
    return `https://ui-avatars.com/api/?name=${name.split(' ').join('+')}&background=6366f1&color=fff&bold=true`;
  }
  
  // Use VITE_API_BASE_URL or fallback to current origin for robustness
  const apiBase = import.meta.env.VITE_API_BASE_URL || axios.defaults.baseURL || 'https://campchat-campus-hub-2.onrender.com';
  const baseUrl = apiBase.replace(/\/$/, ''); 

  // If it's already an absolute URL
  if (url.startsWith('http')) {
    // 1. Force HTTPS on production URLs to avoid mixed content errors
    let secureUrl = url.replace(/^http:/, 'https:');
    
    // 2. Map legacy localhost to the current API base
    if (secureUrl.includes('localhost:')) {
      const parts = secureUrl.split('/uploads/');
      if (parts.length > 1) return `${baseUrl}/uploads/${parts[1]}`;
    }
    return secureUrl;
  }
  
  // 3. Handle relative paths
  const cleanUrl = url.startsWith('/') ? url : `/${url}`;
  return `${baseUrl}${cleanUrl}`;
};
