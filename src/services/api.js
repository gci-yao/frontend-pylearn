import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://192.168.1.67:8001/api';

const api = axios.create({ baseURL: API_URL });

// Inject token
api.interceptors.request.use(cfg => {
  const token = localStorage.getItem('access_token');
  if (token) cfg.headers.Authorization = `Bearer ${token}`;
  return cfg;
});

// Auto-refresh on 401
api.interceptors.response.use(
  res => res,
  async err => {
    const original = err.config;
    if (err.response?.status === 401 && !original._retry) {
      original._retry = true;
      const refresh = localStorage.getItem('refresh_token');
      if (refresh) {
        try {
          const { data } = await axios.post(`${API_URL}/auth/refresh/`, { refresh });
          localStorage.setItem('access_token', data.access);
          original.headers.Authorization = `Bearer ${data.access}`;
          return api(original);
        } catch {
          localStorage.clear();
          window.location.href = '/login';
        }
      }
    }
    return Promise.reject(err);
  }
);

export const authService = {
  register: data => api.post('/auth/register/', data),
  login: data => api.post('/auth/login/', data),
  me: () => api.get('/auth/me/'),
  updateProfile: data => api.patch('/auth/me/', data),
};

export const courseService = {
  getLevels: () => api.get('/levels/'),
  getModule: id => api.get(`/modules/${id}/`),
  toggleModule: id => api.post(`/modules/${id}/toggle/`),
  getProgress: () => api.get('/progress/'),
  getStats: () => api.get('/stats/'),
};

export default api;
