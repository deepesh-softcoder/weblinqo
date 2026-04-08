import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import OnboardingLayout from '../../../../components/layouts/onboarding-layout';
import { FaPalette } from 'react-icons/fa';
import { toast } from 'react-hot-toast';
import { dcLinkApi } from '../../../../services/dcLinkApi';
import useUserStore from '../../../../stores/userStore';
import api from '../../../../services/api';
import userApi from '../../../../services/userApi';
import DgTemplate from '../../digital-card/template';
import useLoaderStore from '../../../../stores/loaderStore';

const TemplatePage = () => {
  const navigate = useNavigate();
  const { setUserDcProfile, setDigitalCardExists } = useUserStore();
  const { showLoader, hideLoader } = useLoaderStore();
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [templates, setTemplates] = useState([]);
  const { subscription } = useUserStore();

  // Get user plan from userProfile
  const plan = subscription?.planName?.toLowerCase() || 'free';

  // Fetch latest subscription plan on mount
  useEffect(() => {
    const fetchPlan = async () => {
      try {
        await userApi.getSubscriptionStatus();
      } catch (err) {
        console.error('Failed to fetch plan:', err);
        toast.error('Could not load your subscription plan');
      }
    };
    fetchPlan();
  }, []);

  useEffect(() => {
    // Fetch templates from API
    const fetchTemplates = async () => {
      try {
        const res = await api.get("/api/v1/template/card");
        setTemplates(res.data.data);
      } catch (err) {
        console.error("Error fetching templates", err?.response?.data?.message);
        toast.error("Failed to load templates");
      }
    };

    fetchTemplates();
  }, []);

  // Handle user clicking 'Continue'
  const handleContinue = async () => {
    if (!selectedTemplate?.id) {
      toast.error('Please select a template');
      return;
    }
    showLoader();
    try {
      const res = await api.post(`/api/v1/template/card/${selectedTemplate.id}/select`, {});
      if(res.status === 200 || res.status === 201) {
        setUserDcProfile({ selectedTemplate });
        setDigitalCardExists(true); // Mark digital card as created
        
        // Fetch updated user profile and digital card data
        try {
          await Promise.all([
            userApi.fetchUserProfile(),
            dcLinkApi.fetchDcData()
          ]);
        } catch (profileError) {
          console.error('Error fetching profile data:', profileError);
        }
        
        navigate('/dashboard/digital-card/links');
        toast.success(`Template applied successfully`);
      } else {
        toast.error(res.data.message || 'Failed to select template');
      }
    } catch (error) {
      console.error("Failed to select template:", error);
      toast.error(error.response.data.message || "Failed to apply template");
    } finally {
      hideLoader();
    }
  };

  // Handle selecting a template card
  const handleSelect = async (template) => {
    const allowed = {
      free: ["FREE"],
      pro: ["FREE", "PRO"],
      premium: ["FREE", "PRO", "PREMIUM"],
    };
  
    // Check if user plan allows access to this template
    if (!allowed[plan]?.includes(template.accessLevel)) {
      toast.error(
        `Upgrade to ${template.accessLevel} plan to use this template`
      );
      return;
    }

    setSelectedTemplate(template);
    
  };

  return (
    <OnboardingLayout
      title="Card Template Selection"
      subtitle="Choose a template for your digital card"
      currentStep={9}
      totalSteps={9}
      showContinue={true}
      canProceed={!!selectedTemplate?.id}
      onContinue={handleContinue}
      showSkip={false}
      skipText="Skip for now"
      maxWidth="max-w-4xl"
    >
      {/* Header with number of templates */}
      <div className="max-w-4xl mx-auto">
        <div className="space-y-6">
          <div className="flex justify-between items-center mb-6">
            <div className="text-sm text-gray-500">
              {templates.length} available
            </div>
          </div>

          {/* Show placeholder if no templates are available */}
          {templates.length === 0 ? (
            <div className="text-center py-12">
              <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <FaPalette className="text-gray-400 text-xl" />
              </div>
              <h4 className="text-gray-600 font-medium mb-1">
                No templates available
              </h4>
              <p className="text-gray-500 text-sm">
                Check back later for new templates
              </p>
            </div>
          ) : (
            // Display template cards in grid
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {templates.map((template) => (
                <DgTemplate 
                  key={template.id} 
                  template={template} 
                  plan={plan} 
                  selectedTemplate={selectedTemplate?.id} 
                  handleSelect={handleSelect}  
                />
              ))}
            </div>
          )}
        </div>

        {/* Help text */}
        <div className="text-center mt-6">
          <p className="text-sm text-gray-500">
            You can always change your template later in the appearance settings.
          </p>
        </div>
      </div>
    </OnboardingLayout>
  );
};

export default TemplatePage;
