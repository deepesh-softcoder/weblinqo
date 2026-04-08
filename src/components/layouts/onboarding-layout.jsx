import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import logo from "../../assets/images/logos/logo-icon.png";

// Provides a consistent layout for onboarding steps

export default function OnboardingLayout({
  children,
  title,
  currentStep,
  totalSteps,
  showContinue = true,
  canProceed = true,
  onContinue,
  onSkip,
  showSkip = false,
  skipText = "Skip for now",
  maxWidth = "max-w-md",
  errorMessage,
  isSubmitting,
  error
}) {
  return (
    <div className="min-h-screen bg-offWhite font-sans flex items-center justify-center px-4 py-8">
      <div className={`w-full mx-auto ${maxWidth}`}>
        {/* Brand Header */}
        <div className="flex justify-center items-center gap-3 mb-6">
          <img 
            src={logo}
            alt="weblinqo Logo" 
            className="h-14 object-contain"
          />
          {/* <span className="text-2xl font-bold text-gray-900">weblinqo</span> */}
        </div>

        {/* Progress Bar */}
        {currentStep && totalSteps && (
          <div className="mb-6">
            <div className="flex justify-between text-sm text-gray-600 mb-2">
              <span>Step {currentStep} of {totalSteps}</span>
              <span>{Math.round((currentStep / totalSteps) * 100)}% complete</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <motion.div 
                className="bg-primary h-2 rounded-full" 
                initial={{ width: 0 }}
                animate={{ width: `${(currentStep / totalSteps) * 100}%` }}
                transition={{ duration: 0.5 }}
              ></motion.div>
            </div>
          </div>
        )}

        {/* Content Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8"
        >
          {title && <h2 className="text-xl font-bold text-gray-900 mb-6 text-center">{title}</h2>}
          
          {/* Error Message */}
          {(errorMessage || error) && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-700 text-sm">{errorMessage || error}</p>
            </div>
          )}
          
          {children}
        </motion.div>

        {/* Action Buttons */}
        <motion.div 
          className="mt-6 space-y-3"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          {/* Continue Button */}
          {showContinue && (
            <div className="flex justify-center">
              <button
                onClick={onContinue}
                disabled={!canProceed || isSubmitting}
                className={`w-full max-w-sm mx-auto py-3.5 px-4 rounded-xl font-semibold transition-all duration-200 ${
                  canProceed && !isSubmitting
                    ? 'bg-primary text-white hover:bg-primary hover:scale-[1.02] active:scale-95 shadow-md'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                {isSubmitting ? 'Saving...' : 'Continue'}
              </button>
            </div>
          )}

          {/* Skip Button */}
          {showSkip && onSkip && (
            <div className="flex justify-center">
              <button
                onClick={onSkip}
                disabled={isSubmitting}
                className="w-full max-w-sm mx-auto py-3 px-4 rounded-xl font-medium text-gray-600 hover:text-gray-800 hover:bg-gray-50 border border-gray-200 transition-all duration-200"
              >
                {skipText}
              </button>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
