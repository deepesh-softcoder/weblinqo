import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import AddLinks from '../../../../components/onboarding/AddLinks';
import OnboardingLayout from '../../../../components/layouts/onboarding-layout';
import api from '../../../../services/api';
import { useNavigate } from 'react-router-dom';
import useUserStore from '../../../../stores/userStore';
import toast from 'react-hot-toast';

export default function LinksPage() {
  const [links, setLinks] = useState([]);
  const [features, setFeatures] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const { setUserProfile } = useUserStore();

  // fetch subscriptions features
  useEffect(() => {
    const fetchFeatures = async () => {
      try {
        const res = await api.get('/api/v1/subscription/features');
        if (res.status === 200 || res.status === 201) {
        setFeatures(res.data.data);
        } else {
          console.log(res?.response?.data?.message);
        }
      } catch (err) {
        // toast.error("Failed to fetch plan features");
        console.log(err?.response?.data?.message);
      }
    };
    fetchFeatures();
  }, []);

  // Continue button handler
  const handleContinue = async () => {
    await saveLinksAndContinue(links);
  };

  // Skip button handler
  const handleSkip = async () => {
    // Manual skip - just navigate to next step without API call
    navigate('/onboarding/profile');
  };

   // Function to save links and then continue
  const saveLinksAndContinue = async (linksToSave) => {
    setIsSubmitting(true);
    
    try {
      if (linksToSave.length > 0) {
        await api.post('/api/v1/link/', linksToSave);
      }
      // If no links, just continue without API call
      navigate('/onboarding/profile');
    } catch (error) {
      console.error("Error saving links:", error);
      toast.error("Failed to save links");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Check if there's at least one valid link
  const hasValidLinks = links.length > 0 && links.some(link => 
    link.title && link.title.trim() && link.url && link.url.trim()
  );

  return (
    <OnboardingLayout
      title="Add Links"
      currentStep={7}
      totalSteps={8}
      canProceed={hasValidLinks && !isSubmitting}
      onContinue={handleContinue}
      onSkip={handleSkip}
      showSkip={true}
      skipText="Skip adding links"
      isSubmitting={isSubmitting}
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
         {/* AddLinks component: handles UI for adding/editing/removing links */}
        <AddLinks 
          links={links} 
          setLinks={setLinks} 
          setUserProfile={setUserProfile}
          features={features}
        />
      </motion.div>
    </OnboardingLayout>
  );
}
