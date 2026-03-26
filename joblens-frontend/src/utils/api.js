// src/utils/api.js
// Centralised Axios instance — all API calls go through here
// The proxy in package.json forwards /api/* to http://localhost:5000

import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  headers: { 'Content-Type': 'application/json' },
});

// Automatically attach JWT token to every request if it exists
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('joblens_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default api;
