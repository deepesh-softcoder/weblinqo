import { useState } from "react";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import useUserStore from '../../stores/userStore';
import loginWithProvider from '../../loginWithProvider';
import { FcGoogle } from "react-icons/fc";
import { FaXTwitter } from "react-icons/fa6"; 
import { RiLoader4Fill } from "react-icons/ri";
import logo from "../../assets/images/logos/logo-icon.png"
import Button from "../../components/shared/button";
import Input from "../../components/shared/input";
import Typography from "../../components/shared/typography";

const baseUrl = process.env.REACT_APP_API_BASE_URL;

const Login = () => {
  // form state and ui states
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [isTwitterLoading, setIsTwitterLoading] = useState(false);
  const navigate = useNavigate();

  // show / hide password toggle
  const togglePassword = () => setShowPassword((prev) => !prev);

  // display success message
  const showSuccess = (message, duration = 3000) => {
    setSuccess(message);
    setTimeout(() => setSuccess(null), duration);
  };

  // handle login by email-password
  const handleLogin = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setIsLoading(true);

    try {
      const res = await axios.post(
        `${baseUrl}/api/v1/auth/login`,
        {
          email: formData.email,
          password: formData.password
        },
        {
          headers: {
            "Content-Type": "application/json"
          }
        }
      );

      const { accessToken, refreshToken, profile } = res.data.data;

      // update user state
      useUserStore.getState().setAccessToken(accessToken);
      useUserStore.getState().setRefreshToken(refreshToken);
      useUserStore.getState().setUserProfile(profile);
      useUserStore.getState().setIsAuthenticated(true);
      useUserStore.getState().setRefreshTokenExpiry(Date.now()); // current timestamp
      useUserStore.getState().setAccessTokenExpiry(Date.now()); // current timestamp

      showSuccess("Login successful! Redirecting...");

      // check user's next onboarding screen
      const onboardingRes = await axios.get(`${baseUrl}/api/v1/user/onboarding-screen`, {
        headers: {
          "Authorization": `Bearer ${accessToken}`
        }
      });

      const nextScreen = onboardingRes.data.data.nextScreen;

      // redirect user based on onboarding progress
      switch (nextScreen) {
        case "EMAIL_VERIFICATION":
          navigate("/verify", { state: { email: formData.email } });
          break;
        case "SLUG_SELECTION":
          navigate("/onboarding/slug");
          break;
        case "GOAL_SELECTION":
          navigate("/onboarding/goal");
          break;
        case "CATEGORY_SELECTION":
          navigate("/onboarding/category");
          break;
        case "PLAN_SELECTION":
          navigate("/onboarding/pricing");
          break;
        case "MODULE_SELECTION":
          navigate("/onboarding/module-selection");
          break;
        case "CARD_IDENTITY":
          navigate("/onboarding/card-identity");
          break;
        case "CARD_CONTACT":
          navigate("/onboarding/card-contact");
          break;
        case "CARD_SOCIAL_WEB":
          navigate("/onboarding/card-social-web");
          break;
        case "CARD_TEMPLATE_SELECTION":
          navigate("/onboarding/card-template");
          break;
        case "PAYMENT":
          try {
            const checkoutRes = await axios.get(`${baseUrl}/api/v1/subscription/checkout-url`, {
              headers: {
                Authorization: `Bearer ${accessToken}`
              }
            });
            const checkoutUrl = checkoutRes.data.data.checkoutUrl;
            window.location.href = checkoutUrl;
          } catch (err) {
            setError("Unable to redirect to payment. Please try again.");
          }
          break;
        case "TEMPLATE_SELECTION":
          navigate("/onboarding/template");
          break;
        case "LINKS_SETUP":
          navigate("/onboarding/links");
          break;
        case "PROFILE_DETAILS":
          navigate("/onboarding/profile");
          break;
        case "COMPLETED":
        default:
          navigate("/dashboard");
          break;
      }

    } catch (err) {
      // handle api and network errors
      if (err.response) {
        if (err.response.status === 401) {
          setError("Invalid email or password. Please try again.");
        } else if (err.response.status === 400) {
          setError("Please provide both email and password.");
        } else {
          setError("An error occurred. Please try again later.");
        }
      } else if (err.request) {
        setError("Network error. Please check your connection.");
      } else {
        setError("An unexpected error occurred.");
      }
    } finally {
      setIsLoading(false);
    }
  };


 // handle login with google and twitter providers
 const handleProviderLogin = async (providerName) => {
  try {
    // Set loading state for the specific provider  
    if (providerName === "google") setIsGoogleLoading(true);
    if (providerName === "twitter") setIsTwitterLoading(true);
    
    setError(null);
    
    const response = await loginWithProvider(providerName);
    
    const { accessToken, refreshToken, profile } = response.data;

    // store user sesstion details
    useUserStore.getState().setAccessToken(accessToken);
    useUserStore.getState().setRefreshToken(refreshToken);
    useUserStore.getState().setUserProfile(profile);
    useUserStore.getState().setIsAuthenticated(true);
    useUserStore.getState().setRefreshTokenExpiry(Date.now()); // current timestamp
    useUserStore.getState().setAccessTokenExpiry(Date.now()); // current timestamp

    showSuccess(`${providerName.charAt(0).toUpperCase() + providerName.slice(1)} login successful!`);
    
    // Check onboarding status
    const onboardingRes = await axios.get(`${baseUrl}/api/v1/user/onboarding-screen`, {
      headers: {
        "Authorization": `Bearer ${accessToken}`
      }
    });

    const nextScreen = onboardingRes.data.data.nextScreen;

    switch (nextScreen) {
      case "SLUG_SELECTION":
        navigate("/onboarding/slug");
        break;
      case "MODULE_SELECTION":
        navigate("/onboarding/module-selection");
        break;
      case "CARD_IDENTITY":
        navigate("/onboarding/card-identity");
        break;
      case "CARD_CONTACT":
        navigate("/onboarding/card-contact");
        break;
      case "CARD_SOCIAL_WEB":
        navigate("/onboarding/card-social-web");
        break;
      case "CARD_TEMPLATE_SELECTION":
        navigate("/onboarding/card-template");
        break;
      case "GOAL_SELECTION":
        navigate("/onboarding/goal");
        break;
      case "CATEGORY_SELECTION":
        navigate("/onboarding/category");
        break;
      case "PLAN_SELECTION":
        navigate("/onboarding/pricing");
        break;
      case "PAYMENT":
        try {
          const checkoutRes = await axios.get(`${baseUrl}/api/v1/subscription/checkout-url`, {
            headers: {
              Authorization: `Bearer ${accessToken}`
            }
          });
          const checkoutUrl = checkoutRes.data.data.checkoutUrl;
          window.location.href = checkoutUrl;
        } catch (err) {
          setError("Unable to redirect to payment. Please try again.");
        }
        break;
      case "TEMPLATE_SELECTION":
        navigate("/onboarding/template");
        break;
      case "LINKS_SETUP":
        navigate("/onboarding/links");
        break;
      case "PROFILE_DETAILS":
        navigate("/onboarding/profile");
        break;
      case "COMPLETED":
      default:
        navigate("/dashboard");
        break;
    }
  } catch (err) {
    setError(err.message || `${providerName.charAt(0).toUpperCase() + providerName.slice(1)} login failed. Please try again.`);
  } finally {
    if (providerName === "google") setIsGoogleLoading(false);
    if (providerName === "twitter") setIsTwitterLoading(false);
  }
};

  return (
    <>
      <div className="flex items-center justify-center px-5 py-5 w-full">

        {/* Main Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="w-full bg-white max-w-[600px] shadow-md rounded-xl p-6 pt-4 bg-angular-gradient"
          >
            <div className="text-center flex justify-center items-center flex-col mb-4">
              <img src={logo} className="h-14 sm:h-20 mb-4" alt="logo" />
              <Typography variant="h2" className="text-3xl font-bold text-gray-900 mb-4">Sign In</Typography>
              <Typography variant="p" className="text-gray-600">Login to your weblinqo account</Typography>
            </div>

            {/* Message Container */}
            <div className={`${success || error ? 'mb-6' : 'mb-0'} space-y-3`}>
              {/* Success Message */}
              {success && (<AnimatePresence>
                
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden"
                  >
                    <div className="p-3 bg-[#e8f5d0] border border-primary text-[#2a5a00] rounded-lg flex items-start text-sm">
                      <svg
                        className="w-4 h-4 mt-0.5 mr-2 flex-shrink-0"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span>{success}</span>
                    </div>
                  </motion.div>
               
              </AnimatePresence> )}
              {/* Error Message */}
              {error && (<AnimatePresence>
                
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden"
                  >
                    <div className="p-3 bg-[#ffebee] border border-[#ff6b6b] text-[#c62828] rounded-lg flex items-start text-sm">
                      <svg
                        className="w-4 h-4 mt-0.5 mr-2 flex-shrink-0"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span>{error}</span>
                    </div>
                  </motion.div>
                </AnimatePresence> )}
              
            </div>
            

            {/* Login Form */}
            <div className="flex w-full items-center justify-center">
              <div className="max-w-lg w-full">

                <form className="space-y-4" onSubmit={handleLogin}>
                  <Input
                    id="email"
                    type="email"
                    label="Email"
                    name="email"
                    placeholder="your@email.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                    disabled={isLoading}
                  />

                  <div>
                    <Input
                      id="password"
                      label="Password"
                      type={showPassword ? "text" : "password"}
                      name="password"
                      placeholder="••••••••"
                      className={showPassword ? "font-pier" : "font-sans"}
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      required
                      disabled={isLoading}
                      rightIcon={
                        <button
                          type="button"
                          onClick={togglePassword}
                          className="text-gray-400 hover:text-gray-600 focus:outline-none"
                          disabled={isLoading}
                          aria-label={showPassword ? "Hide password" : "Show password"}
                        >
                          {showPassword ? <AiFillEyeInvisible size={20} /> : <AiFillEye size={20} />}
                        </button>
                      }
                    />
                    <div className="text-right">
                      <Link to="/forgot-password">
                        <Typography variant="span" className="text-gray-500 hover:underline font-medium">
                          Forgot password?
                        </Typography>
                      </Link>
                    </div>
                  </div>

                  <Button
                    type="submit"
                    size="full"
                    isLoading={isLoading}
                    disabled={isLoading}
                    className="hover:bg-[#fff] border border-primary hover:text-primary"
                  >
                    {isLoading ? "Logging in..." : "Login"}
                  </Button>
                </form>

                <div className="relative mb-6 mt-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200"></div>
                </div>
                <div className="relative flex justify-center">
                  <span className="px-2 bg-white text-gray-500 text-sm">or</span>
                </div>
              </div>

                {/* Icon-only Social Login Buttons */}
                <div className="flex justify-center gap-4 mb-6">
                  {/* Google Button */}
                  <button
                    onClick={() => handleProviderLogin("google")}
                    disabled={isGoogleLoading}
                    className="p-3 rounded-full bg-white border border-gray-200 hover:border-gray-300 transition-colors duration-200 relative"
                    aria-label="Continue with Google"
                  >
                    {isGoogleLoading ? (
                      <RiLoader4Fill className="animate-spin h-6 w-6 text-gray-500" />
                    ) : (
                      <FcGoogle className="h-6 w-6 text-[#4285F4]" />
                    )}
                  </button>

                  {/* Twitter/X Button */}
                  <button
                    onClick={() => handleProviderLogin("twitter")}
                    disabled={isTwitterLoading}
                    className="p-3 rounded-full bg-white border border-gray-200 hover:border-gray-300 transition-colors duration-200"
                    aria-label="Continue with X"
                  >
                    {isTwitterLoading ? (
                      <RiLoader4Fill className="animate-spin h-6 w-6 text-gray-500" />
                    ) : (
                      <FaXTwitter className="h-6 w-6 text-black" />
                    )}
                  </button>
                </div>

                <div className="mt-6 text-center">
                  <Typography variant="span" className="text-gray-500">
                    Don't have an account?{" "}
                    <Link to="/signup" className="text-primary hover:underline font-medium">
                      Sign up
                    </Link>
                  </Typography>
                </div>
              </div>
            </div>
          </motion.div>
      </div>
    </>
  );
};

export default Login;
