import axios from 'axios';
import toast from 'react-hot-toast';
import { getAccessToken } from '../stores/userStore'; // ✅ remains safe
import userStore from '../stores/userStore'; // ✅ use utility (explained below)

const API_URL = process.env.REACT_APP_API_BASE_URL;

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// ✅ Request Interceptor
api.interceptors.request.use(
  (config) => {
    config.headers = config.headers || {};

    // 🚫 Skip Authorization header if explicitly told
    if (!config.skipAuth) {
      const token = getAccessToken();
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }

    // ✅ Add x-admin-key if it's an admin route
    if (config.url?.startsWith('/api/v1/admin')) {
      const adminKey = localStorage.getItem('x-admin-key');
      if (adminKey) {
        config.headers['x-admin-key'] = adminKey;
      }
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// ✅ Response Interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message = error.response?.data?.message || 'Something went wrong';
    toast.error(message);

    if (error.response?.status === 401) {
      const {resetAll} = userStore(); // ✅ use utility to access store
      resetAll(); // ✅ reset user state
      window.location.href = '/login';
    }

    return Promise.reject(error);
  }
);

export default api;
