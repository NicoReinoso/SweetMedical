import axios from "axios";

// utils/api.js
const api = axios.create({ baseURL: 'http://localhost:3001' });

// Agrega el token en CADA request automáticamente
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Si el backend responde 401 → token expirado
api.interceptors.response.use(null, (error) => {
  if (error.response?.status === 401) {
    localStorage.removeItem('token');
    window.location.href = '/login';
  }
  return 
Promise.reject(error);
});

export default api;
