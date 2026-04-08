import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import OnboardingLayout from '../../../../components/layouts/onboarding-layout';
import { FiUpload, FiEdit2, FiTrash2, FiUser, FiX, FiCheck } from 'react-icons/fi';
import { motion } from 'framer-motion';
import { toast } from 'react-hot-toast';
import { dcOnboardingApi } from '../../../../services/dcOnboardingApi';
import { userApi } from '../../../../services/userApi';
import useLoaderStore from '../../../../stores/loaderStore';

const IdentityPage = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const [formData, setFormData] = useState({
    name: '',
    designation: '',
    avatar: null
  });
  const { showLoader, hideLoader } = useLoaderStore();
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [uploadStatus, setUploadStatus] = useState(null);
  const [errors, setErrors] = useState({});

  // Handle input changes for name and designation
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle avatar file selection
  const handleAvatarChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploadStatus(null);
    setErrors(prev => ({ ...prev, avatar: null }));

    // Validate file type
    if (!file?.type?.startsWith('image/')) {
      setErrors(prev => ({ ...prev, avatar: 'Please select an image file (JPEG, PNG, etc.)' }));
      return;
    }

     // Validate file size (max 2MB)
    if (file.size > 2 * 1024 * 1024) { // 2MB limit
      setErrors(prev => ({ ...prev, avatar: 'Image size should be less than 2MB' }));
      return;
    }

    try {
      setUploadStatus('uploading');
      const avatarUrl = await uploadAvatar(file);
      setFormData(prev => ({
        ...prev,
        avatar: avatarUrl
      }));
      
      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setAvatarPreview(e.target.result);
      };
      reader.readAsDataURL(file);
      
      setUploadStatus('success');
      setTimeout(() => setUploadStatus(null), 2000);
    } catch (error) {
      setUploadStatus('error');
      setErrors(prev => ({ ...prev, avatar: 'Image upload failed. Please try again.' }));
      console.error(error);
    }
  };

  // Validate avatar before submitting
  const validateAvatar = () => {
    if (!formData.avatar) {
      setErrors(prev => ({ ...prev, avatar: 'Profile photo is required' }));
      return false;
    }
    setErrors(prev => ({ ...prev, avatar: null }));
    return true;
  };

  // Trigger hidden file input click
  const triggerFileInput = () => {
    fileInputRef.current.click();
  };

  // Remove selected avatar
  const removeImage = (e) => {
    e.stopPropagation();
    setFormData(prev => ({
      ...prev,
      avatar: null
    }));
    setAvatarPreview(null);
    setErrors(prev => ({ ...prev, avatar: null }));
  };

  // Handle continue button click
  const handleContinue = async () => {
    if (!formData.name.trim()) {
      toast.error('Please enter your name');
      return;
    }

    if (!formData.designation.trim()) {
      toast.error('Please enter your designation');
      return;
    }

    if (!validateAvatar()) {
      toast.error('Please upload a profile photo');
      return;
    }

    showLoader();
    
    try {
      // Prepare identity data for API call
      const identityData = {
        name: formData.name.trim(),
        designation: formData.designation.trim(),
        avatar: formData.avatar ?? null
      };

      // Call the updateCardIdentity API
      const result = await dcOnboardingApi.updateCardIdentity(identityData);
      
      if (result) {
        navigate('/onboarding/card-contact');
      } else {
        toast.error('Failed to save identity information. Please try again.');
      }
    } catch (error) {
      console.error('Error saving identity data:', error);
      toast.error('An error occurred. Please try again.');
    } finally {
      hideLoader();
    }
  };

  // Helper function to upload avatar
  const uploadAvatar = async (file) => {
    if (!file) return null;
    try {
      const avatarUrl = await userApi.uploadProfileImage(file);
      return avatarUrl;
    } catch (error) {
      console.error('Error uploading avatar:', error);
      throw error;
    }
  };

  return (
    <OnboardingLayout
      title="Card Identity"
      subtitle="Tell us about yourself"
      currentStep={6}
      totalSteps={9}
      showContinue={true}
      canProceed={!!formData.name.trim() && !!formData.designation.trim() && !!formData.avatar}
      onContinue={handleContinue}
      showSkip={false}
      skipText="Skip for now"
    >
      <div className="max-w-2xl mx-auto">
        <div className="space-y-6">
          {/* Avatar Upload */}
          <div className="flex flex-col items-center">
            <label className="text-sm font-medium text-gray-700 mb-4 flex items-center">
              <span className="bg-indigo-100 text-indigo-800 w-5 h-5 rounded-full flex items-center justify-center mr-2 text-xs">1</span>
              Profile Photo *
            </label>
            <motion.div 
              whileHover={{ scale: 1.02 }}
              className="relative group"
            >
              <div 
                onClick={triggerFileInput}
                className={`relative w-32 h-32 rounded-full bg-gray-100 border-4 ${
                  errors.avatar ? 'border-red-500' : 'border-white'
                } shadow-md overflow-hidden cursor-pointer transition-all duration-200`}
              >
                {avatarPreview ? (
                  <img 
                    src={avatarPreview} 
                    alt="Profile" 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-300">
                    <FiUser className="w-12 h-12" />
                  </div>
                )}
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 flex items-center justify-center transition-all duration-200">
                  {uploadStatus === 'uploading' ? (
                    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-white"></div>
                  ) : uploadStatus === 'success' ? (
                    <FiCheck className="text-green-400 w-6 h-6" />
                  ) : uploadStatus === 'error' ? (
                    <FiX className="text-red-400 w-6 h-6" />
                  ) : (
                    <FiEdit2 className="text-white w-6 h-6 opacity-0 group-hover:opacity-100 transition-opacity" />
                  )}
                </div>
              </div>
              
              {avatarPreview && (
                <button
                  onClick={removeImage}
                  className="absolute -top-2 -right-2 bg-white p-1.5 rounded-full shadow-md text-red-500 hover:text-red-700 transition-colors"
                  aria-label="Remove profile image"
                >
                  <FiTrash2 className="w-4 h-4" />
                </button>
              )}
              
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleAvatarChange}
                accept="image/*"
                className="hidden"
                aria-label="Profile image upload"
              />
            </motion.div>

            <div className="flex gap-4 mt-4">
              <button
                onClick={triggerFileInput}
                className="text-indigo-600 hover:text-indigo-800 text-sm font-medium flex items-center px-3 py-1.5 rounded-md hover:bg-indigo-50 transition-colors"
              >
                {avatarPreview ? (
                  <>
                    <FiEdit2 className="mr-2" /> Change Photo
                  </>
                ) : (
                  <>
                    <FiUpload className="mr-2" /> Upload Photo
                  </>
                )}
              </button>
            </div>
            <p className="text-xs text-gray-400 mt-2">Required: Square image, 500x500px, max 2MB</p>
            
            {errors.avatar && (
              <div className="mt-2 text-sm text-red-600 bg-red-50 px-3 py-1.5 rounded-md flex items-center">
                <FiX className="mr-1.5" /> {errors.avatar}
              </div>
            )}
          </div>

          {/* Name Input */}
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
              <span className="bg-indigo-100 text-indigo-800 w-5 h-5 rounded-full flex items-center justify-center mr-2 text-xs">2</span>
              Name *
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="Enter your name"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              required
            />
          </div>

          {/* Designation Input */}
          <div>
            <label htmlFor="designation" className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
              <span className="bg-indigo-100 text-indigo-800 w-5 h-5 rounded-full flex items-center justify-center mr-2 text-xs">3</span>
              Designation *
            </label>
            <input
              type="text"
              id="designation"
              name="designation"
              value={formData.designation}
              onChange={handleInputChange}
              placeholder="e.g., Software Engineer, Marketing Manager"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              required
            />
          </div>
        </div>
      </div>
    </OnboardingLayout>
  );
};

export default IdentityPage;
