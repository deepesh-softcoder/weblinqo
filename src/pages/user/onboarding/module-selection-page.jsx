import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import OnboardingLayout from '../../../components/layouts/onboarding-layout';
import { FaLink, FaIdCard } from 'react-icons/fa';
import { toast } from 'react-hot-toast';
import { dcOnboardingApi } from '../../../services/dcOnboardingApi';
import useLoaderStore from '../../../stores/loaderStore';

const ModuleSelectionPage = () => {
  const navigate = useNavigate();
  const [selectedModule, setSelectedModule] = useState(null);
  const { showLoader, hideLoader } = useLoaderStore();

  // Define available modules with properties like title, description, icon, colors, etc.
  const modules = [
    {
      id: 'link-in-bio',
      title: 'Link-in-Bio',
      description: 'Create a beautiful landing page with multiple links to showcase your content, products, and social media.',
      icon: <FaLink className="w-8 h-8" />,
      features: [
        // 'Multiple link management',
        // 'Custom themes & templates',
        // 'Analytics & insights',
        // 'Social media integration'
      ],
      color: 'from-blue-500 to-purple-600',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200'
    },
    {
      id: 'digital-card',
      title: 'Digital Card',
      description: 'Create a professional digital business card with contact details, social links, and more.',
      icon: <FaIdCard className="w-8 h-8" />,
      features: [
        // 'Contact information',
        // 'Social media links',
        // 'Professional templates',
        // 'Easy sharing & networking'
      ],
      color: 'from-green-500 to-teal-600',
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200'
    }
  ];

  // Handle module selection when a card is clicked
  const handleModuleSelect = (moduleId) => {
    setSelectedModule(moduleId);
  };

  // Handle continue button click
  const handleContinue = async () => {
    if (!selectedModule) return;

    showLoader();
    
    try {
      // Map module IDs to API module names
      const moduleMapping = {
        'digital-card': 'DIGITAL_CARD',
        'link-in-bio': 'LINK_IN_BIO'
      };

      const moduleName = moduleMapping[selectedModule];
      
      if (moduleName) {
        // Call the createUserModule API
        const result = await dcOnboardingApi.createUserModule(moduleName);
        
        if (result) {
          // Store module selection in session storage
          sessionStorage.setItem('selectedModule', selectedModule);
          sessionStorage.setItem('moduleData', JSON.stringify(result));
          
          // Navigate based on selected module
          if (selectedModule === 'digital-card') {
            navigate('/onboarding/card-identity');
          } else {
            navigate('/onboarding/template');
          }
        } else {
          toast.error('Failed to create module. Please try again.');
        }
      } else {
        toast.error('Invalid module selection.');
      }
    } catch (error) {
      console.error('Error creating user module:', error);
      toast.error('An error occurred. Please try again.');
    } finally {
      hideLoader();
    }
  };

  return (
    <OnboardingLayout
      title="Choose Your Module"
      subtitle="Select the type of page you want to create"
      currentStep={5}
      totalSteps={8}
      showContinue={true}
      canProceed={!!selectedModule}
      onContinue={handleContinue}
      showSkip={false}
      skipText="Skip for now"
      maxWidth="max-w-4xl"
    >
      <div className="max-w-4xl mx-auto">
        {/* Module cards grid */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {modules.map((module) => (
            <div
              key={module.id}
              onClick={() => handleModuleSelect(module.id)}
              className={`
                relative p-6 rounded-xl border-2 cursor-pointer transition-all duration-300
                ${selectedModule === module.id 
                  ? `${module.borderColor} border-opacity-100` 
                  : 'border-gray-200 hover:border-gray-300 hover:shadow-md'
                }
                ${module.bgColor}
              `}
            >
              {/* Selection indicator */}
              {selectedModule === module.id && (
                <div className="absolute top-4 right-4 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                  <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
              )}

              {/* Module icon */}
              <div className={`inline-flex p-3 rounded-lg bg-gradient-to-r ${module.color} text-white mb-4`}>
                {module.icon}
              </div>

              {/* Module title */}
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {module.title}
              </h3>

              {/* Module description */}
              <p className="text-gray-600">
                {module.description}
              </p>

              {/* Features list */}
              {/* <ul className="space-y-2">
                {module.features.map((feature, index) => (
                  <li key={index} className="flex items-center text-sm text-gray-700">
                    <svg className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    {feature}
                  </li>
                ))}
              </ul> */}
            </div>
          ))}
        </div>
        {/* Help text */}
        <div className="text-center mt-6">
          <p className="text-sm text-gray-500">
            Don't worry, you can always switch between modules later in your dashboard.
          </p>
        </div>
      </div>
    </OnboardingLayout>
  );
};

export default ModuleSelectionPage;
