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
  
  // If it's already a full HTTP URL
  if (url.startsWith('http')) {
    // Legacy mapping: Swap development localhost with current production baseURL
    if (url.includes('localhost:')) {
      const path = url.split('/uploads/')[1];
      const baseUrl = axios.defaults.baseURL || '';
      return `${baseUrl}/uploads/${path}`;
    }
    return url;
  }
  
  // Handle relative paths (e.g., /uploads/file.jpg)
  const baseUrl = axios.defaults.baseURL || '';
  const cleanUrl = url.startsWith('/') ? url : `/${url}`;
  return `${baseUrl}${cleanUrl}`;
};
