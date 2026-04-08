import { Navigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import useUserStore from '../../stores/userStore';
import { isTokenExpired, isValidToken } from '../../utils/tokenUtils';
import axios from 'axios';
import LoadingSpinner from '../common/ui/loading-spinner';

const PublicRoute = ({ children }) => {
  const { isAuthenticated, accessToken, refreshToken } = useUserStore();
  const [isValidating, setIsValidating] = useState(true);
  const [isOnboardingCompleted, setIsOnboardingCompleted] = useState(false);
  
  useEffect(() => {
    const validateTokens = async () => {
      // If user is not authenticated, allow access
      if (!isAuthenticated) {
        setIsValidating(false);
        return;
      }
      
      // Check if access token exists and is valid
      if (!accessToken || !isValidToken(accessToken)) {
        setIsValidating(false);
        return;
      }
      
      // Check if access token is expired
      if (isTokenExpired(accessToken)) {
        // If we have a refresh token, let the interceptor handle it
        if (refreshToken && isValidToken(refreshToken)) {
          // User is authenticated, check onboarding status
          await checkOnboardingStatus();
          return;
        } else {
          setIsValidating(false);
          return;
        }
      }
      
      // User is authenticated, check onboarding status
      await checkOnboardingStatus();
    };

    const checkOnboardingStatus = async () => {
      try {
        const baseUrl = process.env.REACT_APP_API_BASE_URL;
        const onboardingRes = await axios.get(`${baseUrl}/api/v1/user/onboarding-screen`, {
          headers: {
            "Authorization": `Bearer ${accessToken}`
          }
        });

        const nextScreen = onboardingRes.data.data.nextScreen;
        // Check if onboarding is completed
        setIsOnboardingCompleted(nextScreen === "COMPLETED");
      } catch (err) {
        console.error("Error checking onboarding status:", err);
        setIsOnboardingCompleted(false);
      } finally {
        setIsValidating(false);
      }
    };
    
    validateTokens();
  }, [isAuthenticated, accessToken, refreshToken]);
  
  // Show loading while validating
  if (isValidating) {
    return <LoadingSpinner fullScreen text="Checking session..." />;
  }
  
  // If user is authenticated AND has completed onboarding, redirect to dashboard
  if (isAuthenticated && accessToken && isValidToken(accessToken) && !isTokenExpired(accessToken) && isOnboardingCompleted) {
    return <Navigate to="/dashboard" replace />;
  }
  
  return children;
};

export default PublicRoute;
