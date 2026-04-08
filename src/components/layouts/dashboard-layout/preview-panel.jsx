import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiX } from "react-icons/fi";
import ProfilePreview from "../../user/link-in-bio/profile-preview";
import DcProfilePreview from "../../user/digital-card/profile-preview";

const PreviewPanel = ({
  showPreview,
  setShowPreview,
  location,
  digitalCardExists,
  linkInBioExists,
  userProfile,
  subscription,
}) => {

  // Determine if the current section is Digital Card
  const isDigitalCard = location.pathname.includes("/digital-card") && digitalCardExists;

  // Show Digital Card if user is in that section or doesn't have a Link-in-Bio
  const shouldShowDigitalCard = isDigitalCard || !linkInBioExists;

  // Dynamically pick the preview component based on the condition above
  const PreviewComponent = shouldShowDigitalCard ? DcProfilePreview : ProfilePreview;

  return (
    <>
      {/* Desktop Preview Panel */}
      {showPreview && (
        <div className="hidden xl:flex w-[22rem] flex-shrink-0 bg-white border border-gray-200 rounded-xl p-4 items-center justify-center transition-all duration-300">
          <PreviewComponent
            showPreview={showPreview}
            userProfile={userProfile}
            plan={subscription.planName?.toLowerCase() || ''}
          />
        </div>
      )}

      {/* Mobile Preview Panel (animated) */}
      <AnimatePresence>
        {showPreview && (
          <>
            {/* Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-30 bg-black xl:hidden"
              onClick={() => setShowPreview(false)}
            />

            {/* Preview Panel */}
            <motion.div
              initial={{ x: 400 }}
              animate={{ x: 0 }}
              exit={{ x: 400 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="fixed z-40 right-5 top-5 w-[calc(100vw-2.5rem)] lg:w-[calc(50vw-10.5rem)] h-auto lg:h-[calc(100vh-2.5rem)] bg-white shadow-xl xl:hidden rounded-xl overflow-y-auto"
            >
              <button
                onClick={() => setShowPreview(false)}
                className="absolute top-2 left-2 z-50 p-2 bg-white rounded-full shadow-lg hover:bg-gray-100 transition-colors"
              >
                <FiX size={20} className="text-gray-600" />
              </button>

              {/* Actual Preview Content (Digital Card or Link-in-Bio) */}
              <PreviewComponent
                showPreview={showPreview}
                userProfile={userProfile}
                isPreview={true}
                plan={subscription.planName?.toLowerCase() || ''}
              />
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default PreviewPanel;
