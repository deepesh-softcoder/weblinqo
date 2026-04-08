// ChangePlan.jsx
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import PricingPlans from '../../components/onboarding/PricingPlans';
import api from '../../services/api';
import userApi from '../../services/userApi';
import useUserStore from '../../stores/userStore';
import useLoaderStore from '../../stores/loaderStore';

export default function ChangePlan() {
  const [planId, setPlanId] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { subscription } = useUserStore();

  const { showLoader, hideLoader } = useLoaderStore(); 

  // Function to determine action based on plan comparison
  const getAction = (currentPlanName, selectedPlanId) => {
    const planHierarchy = { 'Free': 0, 'Pro': 1, 'Premium': 2 };
    const currentLevel = planHierarchy[currentPlanName] || 0;
    const selectedLevel = planHierarchy[selectedPlanId] || 0;
    
    // Return whether the user is upgrading or downgrading
    return selectedLevel > currentLevel ? 'upgrade' : 'downgrade';
  };

  // handle plan change
  const handleContinue = async () => {
    if (!planId) return;
    
    setIsProcessing(true);
    try {
      // Determine action based on current plan
      const action = getAction(subscription?.planName, planId);
      const response = await userApi.updateSubscription(action, planId);
      console.log("response", response);
      const checkoutUrl = response.data.checkoutUrl;
      
      if (checkoutUrl) {
        // Set flag to indicate payment is from change plan page
        sessionStorage.setItem('paymentSource', 'change-plan');
        window.location.href = checkoutUrl;
      } else {
        // Redirect back to dashboard after successful plan change
        showLoader();
        sessionStorage.setItem("showDashboardLoader", "true");
        navigate('/dashboard');
      }
    } catch (error) {
      console.error("Error changing plan:", error);
    } finally {
      setIsProcessing(false);
    }
  };

  // handle back navigation
  const handleBack = () => {
    navigate('/dashboard');
  };

  // Fetch current subscription status
  useEffect(() => {
    const fetchCurrentPlan = async () => {
      try {
        setLoading(true);
        const planData = await userApi.getSubscriptionStatus();
        if (planData && planData.planName) {
          // Pre-select the current plan
          setPlanId(planData.planName);
        }
      } catch (error) {
        console.error("Error fetching current plan:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCurrentPlan();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={handleBack}
            className="flex items-center text-gray-600 hover:text-gray-900 mb-4 transition-colors"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Dashboard
          </button>
          
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Change Your Plan</h1>
            <p className="text-gray-600 max-w-2xl mx-auto mb-4">
              Choose a new plan that better fits your needs. You can upgrade or downgrade at any time.
            </p>
            {subscription.planName && (
              <div className="inline-flex items-center px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-medium">
                <span className="mr-2">Current Plan:</span>
                <span className="font-semibold">{subscription.planName}</span>
                {subscription.status === 'ACTIVE' && (
                  <span className="ml-2 px-2 py-0.5 bg-green-100 text-green-800 rounded-full text-xs">
                    Active
                  </span>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Pricing Plans */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="w-full"
        >
          <PricingPlans 
            planId={planId} 
            setPlanId={setPlanId}
            isProcessing={isProcessing}
            currentPlanId={subscription?.planName}
          />
        </motion.div>

        {/* Continue Button */}
        {planId && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex justify-center mt-8"
          >
            <button
              onClick={handleContinue}
              disabled={isProcessing || subscription?.planName === planId}
              className={`px-8 py-3 rounded-xl font-semibold text-white transition-all ${
                isProcessing || subscription?.planName === planId
                  ? "bg-gray-400 cursor-not-allowed" 
                  : "bg-primary hover:bg-primary/90"
              }`}
            >
              {isProcessing ? "Processing..." : "Continue with Plan Change"}
            </button>
          </motion.div>
        )}
      </div>
    </div>
  );
}
