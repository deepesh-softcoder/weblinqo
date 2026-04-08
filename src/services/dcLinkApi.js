import useUserStore from '../stores/userStore';
import api from './api';
import toast from 'react-hot-toast';

// Digital Card API Functions
export const dcLinkApi = {
  
  // Get current user's digital card
  fetchDcData: async () => {
    try {
      const response = await api.get('/api/v1/card/me', {
        headers: {
          'accept': '*/*'
        }
      });

      if (response.status === 200) {
        useUserStore.getState().setUserDcProfile(response.data?.data || response.data);
        return response.data?.data || response.data;
      }
      return null;
    } catch (error) {
      if(error?.response?.status === 404) {
        useUserStore.getState().setUserDcProfile({avatar: '',
          name: '',
          designation: '',
          phone: '',
          email: '',
          website: '',
          tagline: '',
          socials: {},
        });
      }
      console.error('Error fetching digital card:', error);
      // toast.error(error.response?.data?.message || "Failed to fetch digital card");
      return null;
    }
  },

  // Create a new digital card
  createCard: async (cardData) => {
    try {
      const response = await api.post('/api/v1/card', cardData, {
        headers: {
          'accept': '*/*',
          'Content-Type': 'application/json'
        }
      });

      if (response.status === 200 || response.status === 201) {
        // toast.success('Digital card created successfully');
        return response.data?.data || response.data;
      }
      return null;
    } catch (error) {
      console.error('Error creating digital card:', error);
      // toast.error(error.response?.data?.message || "Failed to create digital card");
      return null;
    }
  },

  // Update existing digital card
  updateCard: async (cardData) => {
    try {
      const response = await api.put('/api/v1/card', cardData, {
        headers: {
          'accept': '*/*',
          'Content-Type': 'application/json'
        }
      });

      if (response.status === 200 || response.status === 201) {
        // toast.success(response.data?.message);
        return response.data?.data || response.data;
      }
      return null;
    } catch (error) {
      console.error('Error updating digital card:', error);
      // toast.error(error.response?.data?.message || "Failed to update digital card");
      return null;
    }
  },

  // Update social links for digital card
  updateSocials: async (socialsData) => {
    try {
      const response = await api.put('/api/v1/card/socials', socialsData, {
        headers: {
          'accept': '*/*',
          'Content-Type': 'application/json'
        }
      });

      if (response.status === 200 || response.status === 201) {
        // toast.success('Social links updated successfully');
        return response.data?.data || response.data;
      }
      return null;
    } catch (error) {
      console.error('Error updating social links:', error);
      // toast.error(error.response?.data?.message || "Failed to update social links");
      return null;
    }
  },

  // Toggle branding
  toggleBranding: async (enabled) => {
    try {
      const response = await api.post(`/api/v1/card/branding?enabled=${enabled}`, {
        headers: {
          'accept': '*/*'
        }
      });
      if (response.status === 200) {
        // toast.success(response.data?.message);
        return response.data?.data || response.data
      }
    } catch (error) {
      console.error('Error toggling branding', error)
    }
  },

  // Toggle field visibility
  toggleFieldVisibility: async (field, visible) => {
    try {
      const response = await api.post(`/api/v1/card/visibility?field=${field}&visible=${visible}`, {
        headers: {
          'accept': '*/*'
        }
      })
      if (response.status === 200) {
        // toast.success(response.data?.message)
        return response.data?.data || response.data
      }    
    } catch (error) {
      console.error('Error toggling field visibility', error);      
    }
  },

  // Delete a specific social link
  deleteSocialLink: async (platform) => {
    try {
      const response = await api.delete(`/api/v1/card/socials/${platform}`, {
        headers: {
          'accept': '*/*'
        }
      });

      if (response.status === 200 || response.status === 204) {
        // toast.success(`${platform} social link deleted successfully`);
        return response.data?.data || response.data;
      }
      return null;
    } catch (error) {
      console.error('Error deleting social link:', error);
      toast.error(error.response?.data?.message || `Failed to delete ${platform} social link`);
      return null;
    }
  },

  // Add more digital card related API functions here as needed
  // For example:
  // - deleteCard
  // - getCardById
  // - updateCardSettings
  // - getCardAnalytics
  // etc.
};

export default dcLinkApi;
