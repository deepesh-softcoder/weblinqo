import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import TemplateComponent from '../../../../components/onboarding/TemplateComponent';
import OnboardingLayout from '../../../../components/layouts/onboarding-layout';
import api from '../../../../services/api';
import userApi from '../../../../services/userApi';
import { useNavigate } from 'react-router-dom';
import useUserStore from '../../../../stores/userStore';
import toast from 'react-hot-toast';

export default function TemplatePage() {
  const [template, setTemplate] = useState('');
  const navigate = useNavigate();
  const { setUserProfile, subscription } = useUserStore();

  // Fetch the current subscription plan for the user
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

  // handle template continue
  const handleContinue = async () => {
    if (!template) return;

    try {
      // Send selected template to backend API
      await api.post(`/api/v1/template/${template}/select`);

      // Navigate to next onboarding step after success
      navigate('/onboarding/links');
    } catch (error) {
      console.error('Error saving template:', error);
      toast.error('Template selection failed');
    }
  };

  return (
    <OnboardingLayout
      title="Choose Your Template"
      currentStep={6}
      totalSteps={8}
      showContinue={true}
      canProceed={!!template}
      onContinue={handleContinue}
      maxWidth="max-w-7xl"
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full"
      >
         {/* Render TemplateComponent only if subscription plan exists */}
        {subscription.planName && (
          <TemplateComponent
            template={template}
            setTemplate={setTemplate}
            setUserProfile={setUserProfile}
            currentPlan={subscription.planName.toLowerCase()}
          />
        )}
      </motion.div>
    </OnboardingLayout>
  );
}