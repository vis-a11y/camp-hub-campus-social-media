import axios from 'axios';

/**
 * Normalizes a media URL for production/development environments.
 * Maps legacy localhost URLs and relative paths to the production API base.
 * 
 * @param {string} url - The raw URL or path from the database.
 * @returns {string} - The corrected absolute URL.
 */
export const getMediaUrl = (url) => {
  if (!url) return '';
  
  const baseUrl = (axios.defaults.baseURL || '').replace(/\/$/, ''); // Remove trailing slash if exists

  if (url.startsWith('http')) {
    if (url.includes('localhost:')) {
      const parts = url.split('/uploads/');
      if (parts.length > 1) return `${baseUrl}/uploads/${parts[1]}`;
    }
    return url;
  }
  
  const cleanUrl = url.startsWith('/') ? url : `/${url}`;
  return `${baseUrl}${cleanUrl}`;
};
