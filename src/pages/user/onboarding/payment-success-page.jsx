import OnboardingLayout from '../../../components/layouts/onboarding-layout';
import SuccessMessage from '../../../components/modals/SuccessMessage';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useEffect } from 'react';
import userApi from '../../../services/userApi';

export default function PaymentSuccessPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

 useEffect(() => {
    // Function to verify subscription status after successful payment
    const verifySubscription = async () => {
      try {
        // Fetch subscription status from API
        const subscriptionData = await userApi.getSubscriptionStatus();
        const isActive = subscriptionData?.status === 'ACTIVE';
        if (isActive) {
          // Check if payment came from change plan page
          const fromChangePlan = searchParams.get('from') === 'change-plan' || 
                                sessionStorage.getItem('paymentSource') === 'change-plan';
          
          // Clear the session storage after checking
          sessionStorage.removeItem('paymentSource');
          await userApi.fetchUserProfile();
          
          setTimeout(() => {
            if (fromChangePlan) {
              navigate('/dashboard');
            } else {
              navigate('/onboarding/module-selection');
            }
          }, 3000);
        } else {
          navigate('/onboarding/pricing'); 
        }
      } catch (err) {
        console.error('Subscription verification failed:', err);
        navigate('/onboarding/pricing');
      }
    };

    verifySubscription();
  }, [navigate, searchParams]);

  return (
    <OnboardingLayout
      title="Payment Successful"
      showContinue={false}
    >
      <SuccessMessage
        title="Payment Successful!"
        description="Thank you for your subscription. Your payment has been processed successfully."
        footnote="You'll be redirected to the next step in 5 seconds..."
      />
    </OnboardingLayout>
  );
}