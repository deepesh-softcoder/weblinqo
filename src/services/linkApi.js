import api from './api';
import toast from 'react-hot-toast';
import userApi from './userApi';

// Link Page API Functions
export const linkApi = {
  
  // api method for upload video
  uploadVideo: async (file) => {
    try {
      // If file is a File object, validate size (assuming 5MB limit for videos)
      if (file instanceof File && file.size > 50 * 1024 * 1024) {
        toast.error("Video size should be less than 5MB");
        return null;
      }

      const payload = {
        file: file instanceof File ? file : file
      };

      const response = await api.post('/api/v1/user/video/upload', payload, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.status === 200) {
        // toast.success("Video uploaded successfully!");
        return response.data?.data || response.data;
      }
      return null;
    } catch (error) {
      console.error('Error uploading video:', error);
      toast.error(error.response?.data?.message || "Failed to upload video");
      return null;
    }
  },

  // api method for upload video from data
  uploadVideoFormData: async (file) => {
    try {
      // File size validation (5MB limit for videos)
      if (file.size > 50 * 1024 * 1024) {
        toast.error("Video size should be less than 5MB");
        return null;
      }

      const formData = new FormData();
      formData.append('file', file);

      const response = await api.post('/api/v1/user/video/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.status === 200) {
        // toast.success("Video uploaded successfully!");
        return response.data?.data || response.data;
      }
      return null;
    } catch (error) {
      console.error('Error uploading video:', error);
      toast.error(error.response?.data?.message || "Failed to upload video");
      return null;
    }
  },

  // api method for upload user's video url
  updateUserVideo: async (videoUrl) => {
    try {
      const response = await api.put('/api/v1/user/video', null, {
        params: {
          videoUrl: videoUrl
        }
      });

      if (response.status === 200) {
        // toast.success("Video updated successfully!");
        return response.data?.data || response.data;
      }
      return null;
    } catch (error) {
      console.error('Error updating user video:', error);
      toast.error(error.response?.data?.message || "Failed to update video");
      return null;
    }
  },

  // Enable or disable video visibility/status
  updateVideoStatus: async (enabled) => {
    try {
      const response = await api.put('/api/v1/user/video/status', null, {
        params: {
          enabled: enabled
        }
      });

      if (response.status === 200) {
        // toast.success(`Video branding ${enabled ? 'enabled' : 'disabled'} successfully!`);
        return response.data?.data || response.data;
      }
      return null;
    } catch (error) {
      console.error('Error updating video status:', error);
      toast.error(error.response?.data?.message || "Failed to update video status");
      return null;
    }
  },

  // Enable or disable branding status
  updateBrandingStatus: async (enabled) => {
    try {
      const response = await api.put('/api/v1/user/branding/status', null, {
        params: {
          enabled: enabled
        }
      });

      if (response.status === 200) {
        // toast.success(`Branding ${!enabled ? 'removed' : 'enabled'} successfully!`);
        return response.data?.data || response.data;
      }
      return null;
    } catch (error) {
      console.error('Error updating branding status:', error);
      toast.error(error.response?.data?.message || "Failed to update branding status");
      return null;
    }
  },

  // Upload an icon for a link
  uploadLinkIcon: async (file) => {
    try {
      // File size validation (2MB limit for icons)
      if (file.size > 2 * 1024 * 1024) {
        toast.error("Icon size should be less than 2MB");
        return null;
      }

      // File type validation
      if (!file?.type?.startsWith('image/')) {
        toast.error("Please select a valid image file");
        return null;
      }

      const formData = new FormData();
      formData.append('file', file);

      const response = await api.post('/api/v1/link/upload/icon', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.status === 200) {
        // toast.success("Icon uploaded successfully!");
        return response.data?.data || response.data;
      }
      return null;
    } catch (error) {
      console.error('Error uploading link icon:', error);
      toast.error(error.response?.data?.message || "Failed to upload icon");
      return null;
    }
  },

  //  Enable or disable CTA (call-to-action) button
  updateCtaStatus: async (enabled) => {
    try {
      const response = await api.put('/api/v1/user/cta/status', null, {
        params: {
          enabled: enabled
        }
      });

      if (response.status === 200) {
        // toast.success(`CTA ${enabled ? 'enabled' : 'disabled'} successfully!`);
        return response.data?.data || response.data;
      }
      return null;
    } catch (error) {
      console.error('Error updating CTA status:', error);
      toast.error("Please add any contact details in your profile to enable CTA");
      return null;
    }
  },

  // Create a new CTA with type (CALL/EMAIL) and value
  createCta: async (ctaType, ctaValue) => {
    try {
      const response = await api.post('/api/v1/user/cta', {
        ctaType: ctaType,
        ctaValue: ctaValue
      });

      if (response.status === 200) {
        // toast.success("CTA created successfully!");
        return response.data?.data || response.data;
      }
      return null;
    } catch (error) {
      console.error('Error creating CTA:', error);
      toast.error(error.response?.data?.message || "Failed to create CTA");
      return null;
    }
  },

  // Subscribe an email to newsletter
  subscribeNewsletter: async (email) => {
    try {
      const response = await api.post("/api/v1/newsletter", { email });
  
      if (response.status === 200 || response.status === 201) {
        return response?.data;
      }
      return null;
    } catch (error) {
      console.error("Email failed:", error);
      throw error;
    }
  },
  
  // Enable or disable a specific link by ID
  toggleLink: async (linkId, enable) => {
    try {
      const response = await api.put(`/api/v1/link/${linkId}/toggle`, null, {
        params: {
          enable: enable
        }
      });

      if (response.status === 200) {
        // toast.success(`Link ${enable ? 'enabled' : 'disabled'} successfully!`);
        return response.data?.data || response.data;
      }
      return null;
    } catch (error) {
      console.error('Error toggling link:', error);
      toast.error(error.response?.data?.message || "Failed to toggle link");
      return null;
    }
  },

  // Delete user's video
  deleteVideo: async () => {
    try {
      const response = await api.delete("/api/v1/user/video");
  
      if (response.status === 200) {
        // toast.success("Video deleted successfully!");
        await userApi.fetchUserProfile();
        return response.data?.data || response.data;
      }
  
      const data = await response.data?.data || response.data;
      console.log("Video deleted:", data);
      return data;
    } catch (error) {
      console.error("Delete failed:", error);
      throw error;
    }
  },

  // Delete user's CTA
  deleteCta: async () => {
    try {
      const response = await api.delete("/api/v1/user/cta");
  
      if (response.status === 200) {
        // toast.success("CTA deleted successfully!");
        await userApi.fetchUserProfile();
        return response.data?.data || response.data;
      }
  
      const data = await response.data?.data || response.data;
      console.log("CTA deleted:", data);
      return data;
    } catch (error) {
      console.error("Delete failed:", error);
      throw error;
    }
  }

  // Add more link page related API functions here as needed
  // For example:
  // - fetchLinks
  // - createLink
  // - updateLink
  // - deleteLink
  // - reorderLinks
  // etc.
};

export default linkApi;
