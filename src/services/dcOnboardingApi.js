import api from './api';
import toast from 'react-hot-toast';

// Digital Card Onboarding API Functions
export const dcOnboardingApi = {
  
//  Update card identity information
  updateCardIdentity: async (identityData) => {
    try {
      const response = await api.put('/api/v1/card/identity', identityData);
      
      if (response.status === 200 || response.status === 201) {
        toast.success(response?.data?.message || "Identity updated successfully!");
        return response.data?.data;
      }
      return null;
    } catch (error) {
      console.error('Error updating card identity:', error);
      toast.error(error.response?.data?.message || "Failed to update identity");
      return null;
    }
  },

  // Create or select user module
  createUserModule: async (module) => {
    try {
      const response = await api.post('/api/v1/user/module', { module });
      
      if (response.status === 200 || response.status === 201) {
        toast.success(response?.data?.message || "Module created successfully!");
        return response.data?.data;
      }
      return null;
    } catch (error) {
      console.error('Error creating user module:', error);
      toast.error(error.response?.data?.message || "Failed to create module");
      return null;
    }
  },

  // Update card contact information
  updateCardContact: async (contactData) => {
    try {
      const response = await api.put('/api/v1/card/contact', contactData);
      
      if (response.status === 200 || response.status === 201) {
        toast.success(response?.data?.message || "Contact updated successfully!");
        return response.data?.data;
      }
      return null;
    } catch (error) {
      console.error('Error updating card contact:', error);
      toast.error(error.response?.data?.message || "Failed to update contact");
      return null;
    }
  },

  // Update card social information
  updateCardSocial: async (socialData) => {
    try {
      const response = await api.put('/api/v1/card/social', socialData);
      
      if (response.status === 200 || response.status === 201) {
        toast.success(response?.data?.message || "Social links updated successfully!");
        return response.data?.data;
      }
      return null;
    } catch (error) {
      console.error('Error updating card social:', error);
      toast.error(error.response?.data?.message || "Failed to update social links");
      return null;
    }
  }
};

export default dcOnboardingApi;
