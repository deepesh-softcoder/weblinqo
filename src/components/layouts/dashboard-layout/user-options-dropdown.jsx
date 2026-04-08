import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiUser, FiCreditCard } from "react-icons/fi";

const UserOptionsDropdown = ({
  userProfile,
  isUserOptionsOpen,
  setIsUserOptionsOpen,
  userOptionsRef,
  navigate,
  updatePaymentMethodApi,
}) => {

  // Toggles the visibility of the dropdown menu
  const handleToggleUserOptions = () => {
    setIsUserOptionsOpen(!isUserOptionsOpen);
  };

  return (
    <div className="relative" ref={userOptionsRef}>
      <div className="flex items-center gap-2">
        {/* User Profile Icon */}
        <div 
          onClick={handleToggleUserOptions} 
          className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center cursor-pointer hover:bg-gray-400 transition-colors"
        >
          <span className="text-sm font-medium text-gray-600">
            {userProfile?.slug?.charAt(0)?.toUpperCase()}
          </span>
        </div>
        {/* User Profile Name */}
        <span className="text-sm font-medium text-gray-900">
          {userProfile?.slug?.charAt(0)?.toUpperCase() +
            userProfile?.slug?.slice(1)}
        </span>
      </div>

      {/* User Options Popup */}
      <AnimatePresence>
        {isUserOptionsOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 top-full mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-50 overflow-hidden"
          >
            <div className="py-1">
              <button
                onClick={() => navigate('/account')}
                className="w-full flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
              >
                <FiUser size={16} className="text-gray-500" />
                <span>Account</span>
              </button>
              <button
                onClick={updatePaymentMethodApi}
                className="w-full flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
              >
                <FiCreditCard size={16} className="text-gray-500" />
                <span>Payment</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default UserOptionsDropdown;
