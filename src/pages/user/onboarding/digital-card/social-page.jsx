import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import OnboardingLayout from '../../../../components/layouts/onboarding-layout';
import CustomDropdown from '../../../../components/shared/custom-dropdown';
import { 
  FaGlobe, 
  FaFacebook, 
  FaTwitter, 
  FaInstagram, 
  FaLinkedin, 
  FaYoutube, 
  FaTiktok, 
  FaGithub,
  FaPlus,
  FaTrash
} from 'react-icons/fa';
import { toast } from 'react-hot-toast';
import { dcOnboardingApi } from '../../../../services/dcOnboardingApi';
import useLoaderStore from '../../../../stores/loaderStore';

const SocialPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    website: '',
    socials: []
  });
  const { showLoader, hideLoader } = useLoaderStore();
  const [newSocial, setNewSocial] = useState({ platform: '', url: '' });

   // List of supported social media platforms with icons and colors
  const socialPlatforms = [
    { id: 'facebook', name: 'Facebook', icon: <FaFacebook className="w-5 h-5" />, color: 'text-blue-600' },
    { id: 'twitter', name: 'Twitter', icon: <FaTwitter className="w-5 h-5" />, color: 'text-blue-400' },
    { id: 'instagram', name: 'Instagram', icon: <FaInstagram className="w-5 h-5" />, color: 'text-pink-500' },
    { id: 'linkedin', name: 'LinkedIn', icon: <FaLinkedin className="w-5 h-5" />, color: 'text-blue-700' },
    { id: 'youtube', name: 'YouTube', icon: <FaYoutube className="w-5 h-5" />, color: 'text-red-600' },
    { id: 'tiktok', name: 'TikTok', icon: <FaTiktok className="w-5 h-5" />, color: 'text-black' },
    { id: 'github', name: 'GitHub', icon: <FaGithub className="w-5 h-5" />, color: 'text-gray-800' }
  ];

  // Transform socialPlatforms for CustomDropdown
  const dropdownOptions = socialPlatforms.map(platform => ({
    value: platform.id,
    label: platform.name,
    icon: platform.icon
  }));

  // Handle main website input change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle new social link input change
  const handleNewSocialChange = (e) => {
    const { name, value } = e.target;
    setNewSocial(prev => ({
      ...prev,
      [name]: value
    }));
  };

   // Handle platform selection from dropdown
  const handlePlatformChange = (value) => {
    setNewSocial(prev => ({
      ...prev,
      platform: value
    }));
  };

  // Validate that a URL is properly formatted
  const validateUrl = (url) => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  // Add new social link 
  const addSocial = () => {
    if (!newSocial.platform || !newSocial.url.trim()) {
      toast.error('Please select a platform and enter a URL');
      return;
    }

    if (!validateUrl(newSocial.url)) {
      toast.error('Please enter a valid URL');
      return;
    }

    // Check if platform already exists
    if (formData.socials.some(social => social.platform === newSocial.platform)) {
      toast.error('This platform is already added');
      return;
    }

    // Add to socials array
    setFormData(prev => ({
      ...prev,
      socials: [...prev.socials, { ...newSocial }]
    }));

    // Reset newSocial input fields
    setNewSocial({ platform: '', url: '' });
    toast.success('Social link added successfully');
  };

  // Remove a social link by platform
  const removeSocial = (platform) => {
    setFormData(prev => ({
      ...prev,
      socials: prev.socials.filter(social => social.platform !== platform)
    }));
    toast.success('Social link removed');
  };

  // Handle continue button click: save data via API and navigate
  const handleContinue = async () => {
    const socialArr = formData.socials.reduce((acc, social) => {
      acc[social.platform] = social.url;
      return acc;
    }, {})

    console.log("socialArr", socialArr);

    showLoader();
    
    try {
      // Prepare social data for API call
      const socialData = {
        website: formData.website.trim() || null,
        socials: socialArr
      };

      // Call the updateCardSocial API
      const result = await dcOnboardingApi.updateCardSocial(socialData);
      
      if (result) {
         navigate('/onboarding/card-template');
      } else {
        toast.error('Failed to save social links. Please try again.');
      }
    } catch (error) {
      console.error('Error saving social data:', error);
      toast.error('An error occurred. Please try again.');
    } finally {
      hideLoader();
    }
  };

   // Get icon for a platform
  const getPlatformIcon = (platformId) => {
    const platform = socialPlatforms.find(p => p.id === platformId);
    return platform ? platform.icon : null;
  };

  // Get name for a platform
  const getPlatformName = (platformId) => {
    const platform = socialPlatforms.find(p => p.id === platformId);
    return platform ? platform.name : platformId;
  };

  // Handle skip button click: call API with empty data
  const handleSkip = async () => {
    showLoader();
    
    try {
      // Call the updateCardSocial API with empty data
      const result = await dcOnboardingApi.updateCardSocial({
        website: null,
        socials: {}
      });

      if (result) {
        navigate('/onboarding/card-template');
      } else {
        toast.error('Failed to skip social links. Please try again.');
      }
    }catch (error) {
      console.error('Error skipping social data:', error);
      toast.error('An error occurred. Please try again.');
    } finally {
      hideLoader();
    }
  };

  return (
    <OnboardingLayout
      title="Card Social/Web"
      subtitle="Add your social media links and website"
      currentStep={8}
      totalSteps={9}
      showContinue={true}
      canProceed={!!formData.website.trim() || formData.socials.length > 0}
      onContinue={handleContinue}
      showSkip={true}
      onSkip={handleSkip}
      skipText="Skip for now"
      maxWidth="max-w-2xl"
    >
      <div className="max-w-2xl mx-auto">
        <div className="space-y-6">
          {/* Website Input */}
          <div>
            <label htmlFor="website" className="block text-sm font-medium text-gray-700 mb-2">
              Website
            </label>
            <div className="relative">
              <FaGlobe className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="url"
                id="website"
                name="website"
                value={formData.website}
                onChange={handleInputChange}
                placeholder="https://yourwebsite.com"
                className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
            </div>
            <p className="text-sm text-gray-500 mt-1">
              Optional - your personal or business website
            </p>
          </div>

          {/* Social Media Links */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Social Media Links
            </label>
            
            {/* Add New Social Link */}
            <div className="border border-gray-300 rounded-lg p-4 mb-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <CustomDropdown
                  options={dropdownOptions}
                  value={newSocial.platform}
                  onChange={handlePlatformChange}
                />
                
                <input
                  type="url"
                  name="url"
                  value={newSocial.url}
                  onChange={handleNewSocialChange}
                  placeholder="https://..."
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                
                <button
                  onClick={addSocial}
                  className="flex items-center justify-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <FaPlus className="w-4 h-4" />
                  <span>Add</span>
                </button>
              </div>
            </div>

            {/* Display Added Social Links */}
            {formData.socials.length > 0 && (
              <div className="space-y-2">
                {formData.socials.map((social, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="text-gray-600">
                        {getPlatformIcon(social.platform)}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">
                          {getPlatformName(social.platform)}
                        </p>
                        <p className="text-sm text-gray-600 truncate max-w-xs">
                          {social.url}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => removeSocial(social.platform)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <FaTrash className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
            
            <p className="text-sm text-gray-500 mt-2">
              Add your social media profiles to make it easy for people to connect with you
            </p>
          </div>
        </div>
      </div>
    </OnboardingLayout>
  );
};

export default SocialPage;
