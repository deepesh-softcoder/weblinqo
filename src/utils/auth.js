// Store whole user object under 'user' key in localStorage
export const setUser = (user) => {
  localStorage.setItem('user', JSON.stringify(user));
};

// get the user from the local storage
export const getUser = () => {
  const userJson = localStorage.getItem('user');
  return userJson ? JSON.parse(userJson) : null;
};

// remove the user from local storage
export const removeUser = () => {
  localStorage.removeItem('user');
};

// Helper to set access token inside user object
export const setAuthToken = (token) => {
  const user = getUser() || {};
  user.token = token;
  user.isAuthenticated = true;
  setUser(user);
};

// Helper to set refresh token inside user object
export const setRefreshToken = (token) => {
  const user = getUser() || {};
  user.refreshToken = token;
  setUser(user);
};

// Get auth token from user object
export const getAuthToken = () => {
  const user = getUser();
  return user?.token || null;
};

// Check if user is authenticated (has authToken)
export const isAuthenticated = () => {
  return Boolean(getAuthToken());
};

// Get Authorization header for API calls
export const getAuthHeader = () => {
  const token = getAuthToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
};

// Remove user from localStorage (logout)
export const removeAuthTokens = () => {
  removeUser();
};
