import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import OnboardingLayout from '../../../../components/layouts/onboarding-layout';
import { FaPhone, FaEnvelope, FaMapMarkerAlt } from 'react-icons/fa';
import { toast } from 'react-hot-toast';
import { dcOnboardingApi } from '../../../../services/dcOnboardingApi';
import useLoaderStore from '../../../../stores/loaderStore';

const ContactPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    phone: '',
    email: '',
    address: ''
  });
  const { showLoader, hideLoader } = useLoaderStore();

  useEffect(() => {
    // Load previous data from session storage
    const savedData = sessionStorage.getItem('dcOnboardingData');
    if (savedData) {
      const parsed = JSON.parse(savedData);
      setFormData(prev => ({
        ...prev,
        email: parsed.email || '',
        phone: parsed.phone || '',
        address: parsed.address || ''
      }));
    }
  }, []);

  // Update state on input change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

   // Simple email validation using regex
  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Simple phone number validation (allows optional + and digits)
  const validatePhone = (phone) => {
    const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
    return phoneRegex.test(phone.replace(/[\s\-\(\)]/g, ''));
  };

  const handleContinue = async () => {
    // Only validate email if it's provided
    if (formData.email.trim() && !validateEmail(formData.email)) {
      toast.error('Please enter a valid email address');
      return;
    }

    // Only validate phone if it's provided
    if (formData.phone.trim() && !validatePhone(formData.phone)) {
      toast.error('Please enter a valid phone number');
      return;
    }

    showLoader();
    
    try {
      // Prepare contact data for API call
      const contactData = {
        email: formData.email.trim() || null,
        phone: formData.phone.trim() || null,
        address: formData.address.trim() || null
      };

      // Call the updateCardContact API
      const result = await dcOnboardingApi.updateCardContact(contactData);
      
      if (result) {
        navigate('/onboarding/card-social-web');
      } else {
        toast.error('Failed to save contact information. Please try again.');
      }
    } catch (error) {
      console.error('Error saving contact data:', error);
      toast.error('An error occurred. Please try again.');
    } finally {
      hideLoader();
    }
  };

   // Handle skip button click
  const handleSkip = async () => {
    showLoader();
    
    try {
      // Call the updateCardContact API with empty data
      const result = await dcOnboardingApi.updateCardContact({
        email: null,
        phone: null,
        address: null
      });
      
      if (result) {
        navigate('/onboarding/card-social-web');
      } else {
        toast.error('Failed to skip contact information. Please try again.');
      }
    } catch (error) {
      console.error('Error skipping contact data:', error);
      toast.error('An error occurred. Please try again.');
    } finally {
      hideLoader();
    }
  };

  return (
    <OnboardingLayout
      title="Card Contact"
      subtitle="Add your contact information"
      currentStep={7}
      totalSteps={9}
      showContinue={true}
      canProceed={true}
      onContinue={handleContinue}
      showSkip={true}
      skipText="Skip for now"
      onSkip={handleSkip}
    >
      <div className="max-w-2xl mx-auto">
        <div className="space-y-6">
          {/* Email Input */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
              Email Address
            </label>
            <div className="relative">
              <FaEnvelope className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="your.email@example.com"
                className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
            </div>
          </div>

          {/* Phone Input */}
          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
              Phone Number
            </label>
            <div className="relative">
              <FaPhone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="number"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={(e) => {
                  let value = e.target.value.replace(/\D/g, "");
                  if (value.length > 12) value = value.slice(0, 12);
                  setFormData((prev) => ({...prev, phone: value}))
                }}
                placeholder="+1 (555) 123-4567"
                className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
              />
            </div>
            <p className="text-sm text-gray-500 mt-1">
              Optional - include country code for international numbers
            </p>
          </div>

          {/* Address Input */}
          <div>
            <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-2">
              Address
            </label>
            <div className="relative">
              <FaMapMarkerAlt className="absolute left-3 top-4 text-gray-400 w-5 h-5" />
              <textarea
                id="address"
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                placeholder="Your business address or location"
                rows={3}
                className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
              />
            </div>
            <p className="text-sm text-gray-500 mt-1">
              Optional - your business or office address
            </p>
          </div>
        </div>
      </div>
    </OnboardingLayout>
  );
};

export default ContactPage;
