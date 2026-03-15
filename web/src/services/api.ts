import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authApi = {
  login: (credentials: any) => api.post('/auth/login', credentials),
  register: (credentials: any) => api.post('/auth/register', credentials),
  getMe: () => api.get('/auth/me'),
};

export const pairingApi = {
  initiate: (deviceName: string) => api.post('/pairing/initiate', { deviceName }),
  complete: (data: any) => api.post('/pairing/complete', data),
};

export default api;
