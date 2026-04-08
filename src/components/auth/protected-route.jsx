import { Navigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import useUserStore from '../../stores/userStore';
import { isTokenExpired, isValidToken } from '../../utils/tokenUtils';
import LoadingSpinner from '../common/ui/loading-spinner';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, accessToken, refreshToken, resetAll } = useUserStore();
  const [isValidating, setIsValidating] = useState(true);
  
  useEffect(() => {
    const validateTokens = () => {
      // Check if user is authenticated
      if (!isAuthenticated) {
        setIsValidating(false);
        return;
      }
      
      // Check if access token exists and is valid
      if (!accessToken || !isValidToken(accessToken)) {
        console.warn('Invalid access token');
        resetAll();
        setIsValidating(false);
        return;
      }
      
      // Check if access token is expired
      if (isTokenExpired(accessToken)) {
        console.warn('Access token expired');
        
        // If we have a refresh token, let the interceptor handle it
        if (refreshToken && isValidToken(refreshToken)) {
          console.log('Access token expired, but refresh token available');
          setIsValidating(false);
          return;
        } else {
          console.warn('No valid refresh token available');
          resetAll();
          setIsValidating(false);
          return;
        }
      }
      
      setIsValidating(false);
    };
    
    validateTokens();
  }, [isAuthenticated, accessToken, refreshToken, resetAll]);
  
  // Show loading while validating
  if (isValidating) {
    return <LoadingSpinner fullScreen text="Validating session..." />;
  }

  // if not authenticated navigate to login 
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  return children;
};

export default ProtectedRoute;
