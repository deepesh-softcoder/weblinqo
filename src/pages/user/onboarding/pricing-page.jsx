// PricingPage.js
import { useState } from 'react';
import { motion } from 'framer-motion';
import PricingPlans from '../../../components/onboarding/PricingPlans';
import OnboardingLayout from '../../../components/layouts/onboarding-layout';
import api from '../../../services/api';
import { useNavigate } from 'react-router-dom';

export default function PricingPage() {
  const [planId, setPlanId] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const navigate = useNavigate();

  // Handles clicking the "Continue" button to select a plan
  const handleContinue = async () => {
    if (!planId) return;
    
    setIsProcessing(true);
    try {
       // Send selected plan ID to backend
      const response = await api.post('/api/v1/subscription/select', { planId });
      const checkoutUrl = response.data.data.checkoutUrl;
      
      if (checkoutUrl) {
        window.location.href = checkoutUrl;
      } else {
        navigate('/onboarding/module-selection');
      }
    } catch (error) {
      console.error("Error saving selected plan:", error);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <OnboardingLayout
      title="Choose Your Plan"
      currentStep={4}
      totalSteps={7}
      showContinue={true}
      canProceed={!!planId && !isProcessing}
      onContinue={handleContinue}
      maxWidth="max-w-7xl"
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="w-full"
      >
        {/* Render pricing plan options */}
        <PricingPlans 
          planId={planId} 
          setPlanId={setPlanId}
          isProcessing={isProcessing}
        />
      </motion.div>
    </OnboardingLayout>
  );
}
