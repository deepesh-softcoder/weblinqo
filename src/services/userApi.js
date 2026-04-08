import api from './api';
import useUserStore from '../stores/userStore';
import toast from 'react-hot-toast';

// User API Functions
export const userApi = {
  
  fetchUserProfile: async () => {
    try {
      const response = await api.get('/api/v1/user/profile');
      if (response.status === 200 || response.status === 201) {
        const profileData = response.data?.data;
        if (profileData) {
          useUserStore.getState().setUserProfile(profileData);
          return profileData;
        }
      }
      return null;
    } catch (error) {
      console.error('Error fetching user profile:', error);
      // toast.error(error.response?.data?.message || "Failed to fetch user profile");
      return null;
    }
  },

  /**
   * Send contact message from Contact page
   * @param {{ name: string, email: string, message: string }} payload
   * @returns {Promise<boolean>} Success status
   */
  sendContactMessage: async ({ name, email, message }) => {
    try {
      const response = await api.post('/api/v1/contact', { name, email, message }, { skipAuth: true });
      if (response.status === 200 || response.status === 201) {
        toast.success(response?.data?.message || "Message sent successfully!");
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error sending contact message:', error);
      // toast.error(error.response?.data?.message || "Failed to send message");
      return false;
    }
  },

 
  updateUserProfile: async (profileData) => {
    try {
      const response = await api.post('/api/v1/user/profile', profileData);
      if (response.status === 200 || response.status === 201) {
        toast.success(response?.data?.message || "Profile updated successfully!");
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error updating user profile:', error);
      // toast.error(error.response?.data?.message || "Failed to update profile");
      return false;
    }
  },

  /**
   * Upload profile image
   * @param {File} file - Image file to upload
   * @returns {Promise<string|null>} Image URL or null if failed
   */
  uploadProfileImage: async (file) => {
    try {
      // File size validation (5MB limit)
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Image size should be less than 5MB");
        return null;
      }

      const formData = new FormData();
      formData.append('file', file);

      const response = await api.post('/api/v1/user/profile-image', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.status === 200) {
        const imageUrl = response.data?.data?.profileImageUrl;
        if (imageUrl) {
          toast.success("Profile image uploaded successfully!");
          return imageUrl;
        } else {
          toast.error("Failed to get image URL from response");
          return null;
        }
      }
      return null;
    } catch (error) {
      console.error('Error uploading profile image:', error);
      toast.error(error.response?.data?.message || "Failed to upload profile image");
      return null;
    }
  },

  /**
   * Check slug availability
   * @param {string} slug - Slug to check
   * @returns {Promise<boolean>} Availability status
   */
  checkSlugAvailability: async (slug) => {
    try {
      const response = await api.get("/api/v1/user/check-slug", {
        params: { slug },
      });
      return response.data.data.available;
    } catch (error) {
      console.error('Error checking slug availability:', error);
      return false;
    }
  },

  /**
   * Update user slug
   * @param {string} slug - New slug
   * @returns {Promise<boolean>} Success status
   */
  updateUserSlug: async (slug) => {
    try {
      await api.post("/api/v1/user/slug", { slug });
      toast.success("Username updated successfully");
      return true;
    } catch (error) {
      console.error('Error updating user slug:', error);
      toast.error("Failed to save username. Please try again.");
      return false;
    }
  },

  /**
   * Get onboarding screen status
   * @returns {Promise<Object|null>} Onboarding data or null if failed
   */
  getOnboardingScreen: async () => {
    try {
      const response = await api.get('/api/v1/user/onboarding-screen');
      if (response.status === 200) {
        return response.data.data;
      }
      return null;
    } catch (error) {
      console.error('Error fetching onboarding screen:', error);
      return null;
    }
  },

  /**
   * Get subscription status
   * @returns {Promise<Object|null>} Subscription data or null if failed
   */
  getSubscriptionStatus: async () => {
    try {
      const response = await api.get("/api/v1/subscription/status");
      if (response.status === 200) {
        const subscriptionData = response.data.data;
        // Update Zustand store with subscription data
        useUserStore.getState().setSubscription(subscriptionData);
        return subscriptionData;
      }
      return null;
    } catch (error) {
      console.error('Error fetching subscription status:', error);
      return null;
    }
  },

  /**
   * Get checkout URL
   * @returns {Promise<string|null>} Checkout URL or null if failed
   */
  getCheckoutUrl: async () => {
    try {
      const response = await api.get("/api/v1/subscription/checkout-url");
      if (response.status === 200) {
        return response.data.data.checkoutUrl;
      }
      return null;
    } catch (error) {
      console.error('Error fetching checkout URL:', error);
      return null;
    }
  },

  /**
   * Update subscription
   * @param {string} action - Action to perform on subscription
   * @param {string} planId - Plan ID for the subscription
   * @returns {Promise<boolean>} Success status
   */
  updateSubscription: async (action, planId) => {
    try {
      const response = await api.post('/api/v1/subscription/update', {
        action,
        planId
      });
      if (response.status === 200) {
        const updatedSubscriptionData = response?.data?.data;
        // Update Zustand store with updated subscription data
        if (updatedSubscriptionData) {
          useUserStore.getState().updateSubscription(updatedSubscriptionData);
        }
        // toast.success("Subscription updated successfully!");
        return updatedSubscriptionData;
      }
      return false;
    } catch (error) {
      console.error('Error updating subscription:', error);
      toast.error(error.response?.data?.message || "Failed to update subscription");
      return false;
    }
  },

  /**
   * Refresh access token using refresh token
   * @param {string} refreshToken - The refresh token
   * @returns {Promise<Object|null>} Token data or null if failed
   */
  refreshToken: async (refreshToken) => {
    try {
      const response = await api.post('/api/v1/auth/refresh-token', {
        refreshToken
      });
      
      if (response.status === 200) {
        const { accessToken, refreshToken: newRefreshToken } = response.data.data;
        
        // Update tokens in store
        useUserStore.getState().setAccessToken(accessToken);
        useUserStore.getState().setRefreshToken(newRefreshToken);
        
        return {
          accessToken,
          refreshToken: newRefreshToken,
          expiresInMillis: response.data.data.expiresInMillis
        };
      }
      return null;
    } catch (error) {
      console.error('Error refreshing token:', error);
      // If refresh fails, clear all tokens and redirect to login
      useUserStore.getState().resetAll();
      window.location.href = '/login';
      return null;
    }
  },

  /**
   * Delete user account
   * @returns {Promise<boolean>} Success status
   */
  deleteUser: async () => {
    try {
      const response = await api.delete('/api/v1/user/delete');
      if (response.status === 200 || response.status === 201) {
        
        toast.success(response?.data?.message);
        // Clear user data and redirect to login
        useUserStore.getState().resetAll();
        // window.location.href = '/login';
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error deleting user account:', error);
      toast.error(error.response?.data?.message || "Failed to delete account");
      return false;
    }
  },

  /**
   * Deactivate user account
   * @returns {Promise<boolean>} Success status
   */
  deactivateUser: async () => {
    try {
      const response = await api.delete('/api/v1/user/deactivate');
      if (response.status === 200 || response.status === 201) {
        
        toast.success(response?.data?.message);
        // Clear user data and redirect to login
        useUserStore.getState().resetAll();
        // window.location.href = '/login';
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error deactivating user account:', error);
      toast.error(error.response?.data?.message || "Failed to deactivate account");
      return false;
    }
  },

  /**
   * Resend OTP for email verification
   * @param {string} email - User email
   * @param {string} purpose - Purpose of OTP (e.g., "SIGNUP_EMAIL_VERIFICATION")
   * @returns {Promise<boolean>} Success status
   */
  resendOtp: async (email, purpose = "SIGNUP_EMAIL_VERIFICATION") => {
    try {
      const response = await api.post('/api/v1/auth/resend', {
        email,
        purpose
      });
      if (response.status === 200) {
        toast.success("Verification code sent to your email");
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error resending OTP:', error);
      toast.error(error.response?.data?.message || "Failed to resend verification code");
      return false;
    }
  },

  /**
   * Fetch digital card data using slug
   */
  fetchDigitalCardBySlug: async (slug) => {
    try {
      const response = await api.get(`/api/v1/card/slug/${slug}`, { skipAuth: true });
      if (response.status === 200) {
        return response.data?.data;
      }
      return null;
    } catch (error) {
      console.error('Error fetching digital card by slug:', error);
      return null;
    }
  }
};

export default userApi;
