import OnboardingLayout from '../../../components/layouts/onboarding-layout';
import CancelMessage from '../../../components/modals/CancelMessage';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

export default function PaymentCancelPage() {
  const navigate = useNavigate();

  useEffect(() => {
    // Set a timer to automatically redirect the user to pricing page after 5 seconds
    const timer = setTimeout(() => {
      navigate('/onboarding/pricing');
    }, 5000);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    // Use onboarding layout with custom title and hide the default continue button
    <OnboardingLayout title="Payment Cancelled" showContinue={false}>
      <CancelMessage
        autoDismiss={false}
        footnote="You'll be redirected back to pricing in 5 seconds to try again."
      />
    </OnboardingLayout>
  );
}
