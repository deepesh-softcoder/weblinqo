import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import SignupForm from "../../components/common/forms/SignupForm";
import loginWithProvider from "../../loginWithProvider";
import useUserStore from "../../stores/userStore";
import { FcGoogle } from "react-icons/fc";
import { FaXTwitter } from "react-icons/fa6"; // Twitter/X
import { RiLoader4Fill } from "react-icons/ri";
import logo from "../../assets/images/logos/logo-icon.png";
import Typography from "../../components/shared/typography";

const baseUrl = process.env.REACT_APP_API_BASE_URL;

const SignupPage = () => {
  // form states and ui states
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isNavigating, setIsNavigating] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [isTwitterLoading, setIsTwitterLoading] = useState(false);
  const navigate = useNavigate();

  // show/hide password togglers
  const togglePassword = () => setShowPassword((prev) => !prev);
  const toggleConfirmPassword = () => setShowConfirmPassword((prev) => !prev);

  // display success message
  const showSuccess = (message, duration = 3000) => {
    setSuccess(message);
    setTimeout(() => setSuccess(null), duration);
  };

  // handle manual signup
  const handleSignup = async (e) => {
    e.preventDefault();
    if (isNavigating) return;

    // Validate passwords match
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setError(null);
    setIsLoading(true);
    try {
      await axios.post(`${baseUrl}/api/v1/auth/signup`, {
        email: formData.email,
        password: formData.password,
      });
      showSuccess("Account created! Check your email for OTP");
      setIsNavigating(true);
      setTimeout(() => {
        navigate("/verify", { state: { email: formData.email } });
      }, 2000);
    } catch (err) {
      // handle api and network error
      setError(
        err.response?.data?.message || "Signup failed. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  // handle signup with google or twitter providers
  const handleProviderSignup = async (providerName) => {
    try {
      // Set loading state for the specific provider
      if (providerName === "google") setIsGoogleLoading(true);
      if (providerName === "twitter") setIsTwitterLoading(true);

      setError(null);

      // Oauth login request
      const response = await loginWithProvider(providerName);

      const { accessToken, refreshToken, profile } = response.data;

      // update user store
      useUserStore.getState().setAccessToken(accessToken);
      useUserStore.getState().setRefreshToken(refreshToken);
      useUserStore.getState().setUserProfile(profile);
      useUserStore.getState().setIsAuthenticated(true);
      showSuccess(
        `${
          providerName.charAt(0).toUpperCase() + providerName.slice(1)
        } signup successful!`
      );
      setIsNavigating(true);

      // fetch next onboarding step
      const onboardingRes = await axios.get(
        `${baseUrl}/api/v1/user/onboarding-screen`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      const nextScreen = onboardingRes.data.data.nextScreen;

      // Redirect based on onboarding step
      switch (nextScreen) {
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
            const checkoutRes = await axios.get(
              `${baseUrl}/api/v1/subscription/checkout-url`,
              {
                headers: {
                  Authorization: `Bearer ${accessToken}`,
                },
              }
            );
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
      setError(
        err.message ||
          `${
            providerName.charAt(0).toUpperCase() + providerName.slice(1)
          } signup failed. Please try again.`
      );
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
            <img src={logo} alt="logo" className="h-14 sm:h-20 mb-4" />
            <Typography variant="h2" className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
              Sign Up
            </Typography>
            <Typography variant="p" className="text-gray-600">SignUp to your weblinqo account</Typography>
          </div>

          {/* Message Container */}
          <div className={`${success || error ? 'mb-6' : 'mb-0'} space-y-3`}>
            {success && (
                  <AnimatePresence>
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
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                        <span>{success}</span>
                      </div>
                    </motion.div>
                  </AnimatePresence>
            )}
            {error && (
                  <AnimatePresence>
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
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                        <span>{error}</span>
                      </div>
                    </motion.div>
                  </AnimatePresence>
            )}
          </div>

          {/* Signup Form */}
          <div className="flex w-full items-center justify-center">
            <div className="max-w-lg w-full">
              <SignupForm
                formData={formData}
                setFormData={setFormData}
                showPassword={showPassword}
                togglePassword={togglePassword}
                showConfirmPassword={showConfirmPassword}
                toggleConfirmPassword={toggleConfirmPassword}
                isLoading={isLoading}
                isNavigating={isNavigating}
                handleSignup={handleSignup}
              />

              <div className="relative mb-5 mt-5">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200"></div>
                </div>
                <div className="relative flex justify-center">
                  <span className="px-2 bg-white text-gray-500 text-sm">
                    or
                  </span>
                </div>
              </div>

              {/* Icon-only Social Login Buttons */}
              <div className="flex justify-center gap-4 mb-5">
                {/* Google Button */}
                <button
                  onClick={() => handleProviderSignup("google")}
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
                  onClick={() => handleProviderSignup("twitter")}
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
                <Typography variant="span" className="text-sm text-gray-500">
                  Already have an account?{" "}
                  <Link
                    to="/login"
                    className="text-primary hover:underline font-medium transition-colors duration-150"
                  >
                    Sign in
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

export default SignupPage;
