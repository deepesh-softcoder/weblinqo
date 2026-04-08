import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import Category from '../../../components/onboarding/Category';
import OnboardingLayout from '../../../components/layouts/onboarding-layout';
import api from '../../../services/api';
import useUserStore from '../../../stores/userStore'; 

export default function CategoryPage() {
  const [category, setCategory] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { selectedPlanId, setSelectedPlanId } = useUserStore();

  // SAVE CATEGORY & HANDLE NAVIGATION
  const submitCategoryAndContinue = async (categoryValue) => {
    setSaving(true);
    setError('');

    try {
      // Save the selected category to backend
      await api.post('/api/v1/user/category', { category: categoryValue });

      // If user has selected a plan during onboarding, proceed to checkout
      if (selectedPlanId) {
        try {
          const res = await api.post('/api/v1/subscription/select', { planId: selectedPlanId });
          const checkoutUrl = res.data.data.checkoutUrl;
          setSelectedPlanId(''); 
          if (checkoutUrl) {
            window.location.href = checkoutUrl;
            return;
          }
        } catch (err) {
          console.error("Error selecting plan:", err);
        }
      }
      // Navigate to pricing page if no checkout or plan selection fails
      navigate('/onboarding/pricing');
    } catch (err) {
      setError('Failed to save your category. Please try again.');
      console.error('Error saving category:', err);
    } finally {
      setSaving(false);
    }
  };

  // Continue button handler
  const onCategorySubmit = async () => {
    if (!category || saving) return;
    await submitCategoryAndContinue(category);
  };

  // Skip button handler
  const onSkip = async () => {
    if (saving) return;
    await submitCategoryAndContinue("SKIP");
  };

  return (
    <OnboardingLayout
      title="What best describes you?"
      currentStep={3}
      totalSteps={7}
      canProceed={!!category && !saving}
      onContinue={onCategorySubmit}
      onSkip={onSkip}
      showSkip={true}
      skipText="Skip category selection"
      errorMessage={error}
      isSubmitting={saving}
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="w-full"
      >
        {/* Category component renders selectable options */}
        <Category 
          category={category} 
          setCategory={setCategory} 
          saving={saving}
        />
      </motion.div>
    </OnboardingLayout>
  );
}