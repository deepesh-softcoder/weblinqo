import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import Goal from '../../../components/onboarding/Goal';
import OnboardingLayout from '../../../components/layouts/onboarding-layout';
import api from '../../../services/api';

export default function GoalPage() {
  const [goal, setGoal] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // Handles goal submission (Continue button)
  const onGoalSubmit = async () => {
    if (!goal || saving) return;
    await saveGoal(goal);
  };

  // Handles skipping the goal selection
  const onSkip = async () => {
    if (saving) return;
    await saveGoal("SKIP");
  };

  // Saves the goal to the server
  const saveGoal = async (goalValue) => {
    setSaving(true);
    setError('');

    try {
      // API call to save goal
      await api.post('/api/v1/user/goal', { goal: goalValue });
      // Navigate to the next onboarding step
      navigate('/onboarding/category');
    } catch (err) {
      setError('Failed to save your goal. Please try again.');
      console.error('Error saving goal:', err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <OnboardingLayout
      title="What's your main goal?"
      currentStep={2}
      totalSteps={7}
      canProceed={!!goal && !saving}
      onContinue={onGoalSubmit}
      onSkip={onSkip}
      showSkip={true}
      skipText="Skip goal selection"
      errorMessage={error}
      isSubmitting={saving}
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="w-full"
      >
        {/* Goal input component */}
        <Goal goal={goal} setGoal={setGoal} saving={saving} />
      </motion.div>
    </OnboardingLayout>
  );
}
