import React from "react";
import { FiMenu, FiEye, FiEyeOff } from "react-icons/fi";
import UserOptionsDropdown from "./user-options-dropdown";

const DashboardHeader = ({
  getCurrentPageName,
  toggleSidebar,
  isMobileMenuOpen,
  setIsMobileMenuOpen,
  subscription,
  userProfile,
  isUserOptionsOpen,
  setIsUserOptionsOpen,
  userOptionsRef,
  navigate,
  updatePaymentMethodApi,
  showPreview,
  togglePreview,
}) => {
  return (
    <header className="bg-white border border-gray-200 rounded-xl px-6 py-4 flex lg:flex-row md:flex-row flex-col-reverse items-center justify-between w-full flex-shrink-0 mb-5 gap-3">
      {/* Page name (visible only on mobile screens) */}
      <div className="lg:hidden md:hidden block">
        <h1 className="text-size-14 font-semibold text-gray-900">
          {getCurrentPageName()}
        </h1>
      </div>
      
      <div className="flex justify-between items-center w-full">
        <div className="flex items-center gap-3">
          {/* Desktop Sidebar Toggle */}
          <button
            onClick={toggleSidebar}
            className="hidden md:flex p-2 rounded-lg hover:bg-gray-100"
          >
            <FiMenu size={20} />
          </button>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-gray-100"
          >
            <FiMenu size={20} />
          </button>

          {/* Page Title (visible on desktop screens) */}  
          <div className="lg:flex md:flex hidden items-center gap-3">
            <h1 className="text-size-14 font-semibold text-gray-900">
              {getCurrentPageName()}
            </h1>
          </div>
        </div>

        <div className="flex items-center lg:gap-6 md:gap-4 gap-3">
          {/* Current Plan Badge */}
          {subscription?.planName && (
            <div className="flex items-center">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary border border-primary/20">
                {subscription.planName}
              </span>
            </div>
          )}
          
          {/* User Options Dropdown (Profile, Settings, Logout, etc.) */}
          <UserOptionsDropdown
            userProfile={userProfile}
            isUserOptionsOpen={isUserOptionsOpen}
            setIsUserOptionsOpen={setIsUserOptionsOpen}
            userOptionsRef={userOptionsRef}
            navigate={navigate}
            updatePaymentMethodApi={updatePaymentMethodApi}
          />
          
          {/* Preview Mode Toggle (eye icon) */}
          <button
            onClick={togglePreview}
            className="p-2 rounded-lg hover:bg-gray-100"
          >
            {showPreview ? (
              <FiEyeOff size={18} className="text-gray-600" />
            ) : (
              <FiEye size={18} className="text-gray-600" />
            )}
          </button>
        </div>
      </div>
    </header>
  );
};

export default DashboardHeader;
