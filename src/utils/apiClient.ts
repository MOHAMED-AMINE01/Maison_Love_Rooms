import { API_URL } from '../constants';

export const adminFetch = async (endpoint: string, options: RequestInit = {}) => {
  const token = localStorage.getItem('adminToken');
  const headers = {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
    ...options.headers,
  };

  return fetch(`${API_URL}${endpoint}`, {
    credentials: 'include',
    ...options,
    headers,
  });
};
