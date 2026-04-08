import api from './api';

/**
 * Account API - fetch account profile metadata
 */

/**
 * Get the current user's account profile metadata
 */
export const getAccountProfileMeta = async () => {
  try {
    const response = await api.get('/api/v1/user/meta');
    return response.data;
  } catch (error) {
    console.error('Error fetching account profile meta:', error);
    throw error;
  }
};

/**
 * Update the current user's basic account info
 */
export const updateAccountInfo = async (payload) => {
  try {
    const response = await api.put('/api/v1/user/meta/info', payload);
    return response.data;
  } catch (error) {
    console.error('Error updating account profile info:', error);
    throw error;
  }
};

/**
 * Update the current user's avatar URL
 */
export const updateAccountAvatar = async (payload) => {
  try {
    const response = await api.put('/api/v1/user/meta/avatar', payload);
    return response.data;
  } catch (error) {
    console.error('Error updating account avatar:', error);
    throw error;
  }
};

/**
 * Update the current user's notification preferences
 * Payload shape example:
 * { emailNotifications: true }
 */
export const updateAccountNotifications = async (emailNotifications) => {
  try {
    const response = await api.put(
      '/api/v1/user/meta/notifications',
      { emailNotifications }
    );
    return response.data;
  } catch (error) {
    console.error('Error updating account notifications:', error);
    throw error;
  }
};
