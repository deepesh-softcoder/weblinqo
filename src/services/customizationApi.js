import api from './api';
import useUserStore from '../stores/userStore';
import toast from 'react-hot-toast';

// Customization API Functions
export const customizationApi = {
  saveCustomization: async (customizationData) => {
    try {
      const payload = {
        background: customizationData.background,
        textColor: customizationData.textColor,
        buttonColor: customizationData.buttonColor,
        buttonTextColor: customizationData.buttonTextColor,
        buttonStyle: customizationData.buttonStyle || "solid"
      };

      const response = await api.post('/api/v1/template/custom/select', payload);
      
      if (response.status === 200) {
        // Update Zustand state directly from service
        const { updateNested } = useUserStore.getState();
        
        if (customizationData.background) {
          // Check if it's a color or image URL
          updateNested("template.background", customizationData.background);
        }
        if (customizationData.textColor) {
          updateNested("template.textColor", customizationData.textColor);
        }
        if (customizationData.buttonColor) {
          updateNested("template.buttonColor", customizationData.buttonColor);
        }
        if (customizationData.buttonTextColor) {
          updateNested("template.buttonTextColor", customizationData.buttonTextColor);
        }
        if (customizationData.buttonStyle) {
          updateNested("template.buttonStyle", customizationData.buttonStyle);
        }
        
        toast.success("Customization saved successfully!");
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error saving customization:', error);
      toast.error(error.response?.data?.message || "Failed to save customization");
      return false;
    }
  },

  // customization for digital card
  saveDcCustomization: async (customizationData) => {
    try {
      const payload = {
        upperBgColor: customizationData.upperBgColor,
        bottomBgColor: customizationData.bottomBgColor,
        textColor: customizationData.textColor,
        buttonColor: customizationData.buttonColor,
        buttonTextColor: customizationData.buttonTextColor,
        buttonStyle: customizationData.buttonStyle || "solid"
      };

      const response = await api.post('/api/v1/template/custom/card/select', payload);
      
      if (response.status === 200) {
        // Update Zustand state directly from service
        const { updateDcNested } = useUserStore.getState();
        
        if (customizationData.upperBgColor) {
          // Check if it's a color or image URL
          updateDcNested("template.upperBgColor", customizationData.upperBgColor);
        }
        if (customizationData.bottomBgColor) {
          updateDcNested("template.bottomBgColor", customizationData.bottomBgColor);
        }
        if (customizationData.textColor) {
          updateDcNested("template.textColor", customizationData.textColor);
        }
        if (customizationData.buttonColor) {
          updateDcNested("template.buttonColor", customizationData.buttonColor);
        }
        if (customizationData.buttonTextColor) {
          updateDcNested("template.buttonTextColor", customizationData.buttonTextColor);
        }
        if (customizationData.buttonStyle) {
          updateDcNested("template.buttonStyle", customizationData.buttonStyle);
        }
        
        // toast.success("Customization saved successfully!");
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error saving customization:', error);
      toast.error(error.response?.data?.message || "Failed to save customization");
      return false;
    }
  },

  // upload background image api
  uploadBackgroundImage: async (file) => {
    try {
      // File size validation (5MB limit)
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Image size should be less than 5MB");
        return null;
      }

      const formData = new FormData();
      formData.append('file', file);

      const response = await api.post('/api/v1/template/background/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.status === 200) {
        console.log('response',response);
        const imageUrl = response.data?.data?.profileImageUrl || response.data?.profileImageUrl;
        if (imageUrl) {
          // Update Zustand state directly from service
          const { updateNested } = useUserStore.getState();
          updateNested("template.background", imageUrl);
          
          // toast.success("Background image uploaded successfully!");
          return imageUrl;
        } else {
          toast.error("Failed to get image URL from response");
          return null;
        }
      }
      return null;
    } catch (error) {
      console.error('Error uploading background image:', error);
      toast.error(error.response?.data?.message || "Failed to upload background image");
      return null;
    }
  },

  // upload background image api for digital card
  uploadBackgroundImageDc: async (file) => {
    try {
      // File size validation (5MB limit)
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Image size should be less than 5MB");
        return null;
      }

      const formData = new FormData();
      formData.append('file', file);

      const response = await api.post('/api/v1/template/background/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.status === 200) {
        console.log('response',response);
        const imageUrl = response.data?.data?.profileImageUrl || response.data?.profileImageUrl;
        if (imageUrl) {
          // Update Zustand state directly from service
          const { updateDcNested } = useUserStore.getState();
          updateDcNested("template.upperBgColor", imageUrl);
          
          // toast.success("Background image uploaded successfully!");
          return imageUrl;
        } else {
          toast.error("Failed to get image URL from response");
          return null;
        }
      }
      return null;
    } catch (error) {
      console.error('Error uploading background image:', error);
      toast.error(error.response?.data?.message || "Failed to upload background image");
      return null;
    }
  },

  //  update user profile state
  updateNestedProfile: (path, value) => {
    useUserStore.getState().updateNested(path, value);
  },

  // update Digital card profile state for digital card
  updateDcNestedProfile: (path, value) => {
    useUserStore.getState().updateDcNested(path, value);
  },

  //get current user profile
  getCurrentProfile: () => {
    return useUserStore.getState().userProfile;
  }
};

export default customizationApi;
