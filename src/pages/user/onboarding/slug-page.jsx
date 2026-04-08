import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import OnboardingLayout from '../../../components/layouts/onboarding-layout';
import Slug from '../../../components/onboarding/Slug';
import api from '../../../services/api';
import userApi from '../../../services/userApi';
import { useNavigate } from 'react-router-dom';
import useUserStore from '../../../stores/userStore';

export default function SlugPage() {
  const [slug, setSlug] = useState("");
  const [slugAvailable, setSlugAvailable] = useState(false);
  const [checkingSlug, setCheckingSlug] = useState(false);
  const [slugError, setSlugError] = useState("");
  const [saving, setSaving] = useState(false);
  const [isNavigating, setIsNavigating] = useState(false);
  const { setUserProfile } = useUserStore();
  const navigate = useNavigate();

  // check slug availability
  const checkSlugAvailability = async (slug) => {
    if (!slug) {
      setSlugAvailable(false);
      setSlugError("");
      return;
    }

    setCheckingSlug(true);
    setSlugError("");
    
    try {
       // Call API to check if slug is available
      const available = await userApi.checkSlugAvailability(slug);
      setSlugAvailable(available);
      if (!available) {
        setSlugError("This username is already taken");
      }
    } catch (error) {
      setSlugError("Error checking username availability");
      setSlugAvailable(false);
    } finally {
      setCheckingSlug(false);
    }
  };

  useEffect(() => {
    // Wait 500ms after user stops typing to check availability
    const timer = setTimeout(() => {
      if (slug) {
        checkSlugAvailability(slug);
      }
    }, 500);

    // Clear timeout if slug changes before 500ms
    return () => clearTimeout(timer);
  }, [slug]);

  // Prevent continue if slug is not ready or another operation is in progress
  const handleContinue = async () => {
    if (!slugAvailable || checkingSlug || saving || isNavigating) return;

    setSaving(true);
    try {
      // Save the slug to backend
      const res = await api.post("/api/v1/user/slug", { slug });
      setIsNavigating(true); 
      setUserProfile({ slug }); 

      // Navigate to next onboarding step after short delay
      setTimeout(() => {
        navigate("/onboarding/goal");
      }, 1500);
    } catch (err) {
      setSlugError("Failed to save username. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <OnboardingLayout
      title="Choose Your weblinqo Username"
      currentStep={1}
      totalSteps={7}
      canProceed={slugAvailable && !checkingSlug && !isNavigating}
      onContinue={handleContinue}
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full"
      >
        {/* Slug input component */}
        <Slug 
          slug={slug}
          setSlug={setSlug}
          slugAvailable={slugAvailable}
          checkingSlug={checkingSlug}
          slugError={slugError}
          saving={saving}
          isNavigating={isNavigating}
        />
      </motion.div>
    </OnboardingLayout>
  );
}