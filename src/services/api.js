import axios from 'axios';
import useUserStore from '../stores/userStore';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

const api = axios.create({
  baseURL: `${API_BASE_URL}`,
});

// ✅ Safe usage outside React component
api.interceptors.request.use(config => {
  const accessToken = useUserStore.getState().accessToken;
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  return config;
});

api.interceptors.response.use(
  response => response,
  async error => {
    const originalRequest = error.config;
    
    // Handle 401/403 errors (token expired or invalid)
    if (error.response?.status === 401 || error.response?.status === 403) {
      // Prevent infinite retry loops
      if (originalRequest._retry) {
        console.error('Token refresh failed, logging out...');
        useUserStore.getState().resetAll();
        window.location.href = '/login';
        return Promise.reject(error);
      }
      
      originalRequest._retry = true;
      
      try {
        // Attempt to refresh token
        const refreshToken = useUserStore.getState().refreshToken;
        if (refreshToken) {
          const response = await axios.post(
            `${API_BASE_URL}/api/v1/auth/refresh-token`,
            { refreshToken }
          );
          
          if (response.status === 200 && response.data?.data) {
            const { accessToken, refreshToken: newRefreshToken } = response.data.data;
            
            // Update tokens in store
            useUserStore.getState().setAccessToken(accessToken);
            useUserStore.getState().setRefreshToken(newRefreshToken);
            useUserStore.getState().setAccessTokenExpiry(Date.now());
            useUserStore.getState().setRefreshTokenExpiry(Date.now());
            
            // Retry original request with new token
            originalRequest.headers.Authorization = `Bearer ${accessToken}`;
            return api(originalRequest);
          }
        }
      } catch (refreshError) {
        console.error('Token refresh failed:', refreshError);
        useUserStore.getState().resetAll();
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
      
      // If refresh fails, logout
      useUserStore.getState().resetAll();
      window.location.href = '/login';
    }
    
    return Promise.reject(error);
  }
);

// API functions to check if modules exist
export const checkDigitalCardExists = async () => {
  try {
    const response = await api.get('/api/v1/card/exists');
    return response.data?.data?.exists || false;
  } catch (error) {
    console.error('Error checking digital card existence:', error);
    return false;
  }
};

// Api function to check if link in bio exists or not
export const checkLinkInBioExists = async () => {
  try {
    const response = await api.get('/api/v1/user/link-in-bio/exists');
    return response.data?.data?.exists || false;
  } catch (error) {
    console.error('Error checking link in bio existence:', error);
    return false;
  }
};

export default api;
