import React, { useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

import Sidebar from "../../common/navigation/sidebar-user";
import DomainCard from "./domain-card";
import DashboardHeader from "./dashboard-header";
import PreviewPanel from "./preview-panel";

import { useDashboard } from "../../../hooks/useDashboard";
import { useDigitalCardExistence } from "../../../hooks/useDigitalCardExistence";
import { useLinkInBioExistence } from "../../../hooks/useLinkInBioExistence";
import useLoaderStore from "../../../stores/loaderStore";

const DashboardLayout = () => {
  const location = useLocation();
  const {
    isMobileMenuOpen,
    setIsMobileMenuOpen,
    showPreview,
    setShowPreview,
    isSidebarCollapsed,
    isUserOptionsOpen,
    setIsUserOptionsOpen,
    userOptionsRef,
    userProfile,
    subscription,
    getCurrentPageName,
    updatePaymentMethodApi,
    logout,
    togglePreview,
    toggleSidebar,
    navigate,
  } = useDashboard();

  const { digitalCardExists } = useDigitalCardExistence();
  const { linkInBioExists } = useLinkInBioExistence();

  const {showLoader,  hideLoader} = useLoaderStore();

  // show loader on initial load it is used for handling upgrade refresh
  useEffect(() => {
    const shouldShowLoader = sessionStorage.getItem("showDashboardLoader");
    if (shouldShowLoader) {
      showLoader();
    }
    setTimeout(() => {
      hideLoader();
      sessionStorage.removeItem("showDashboardLoader");
    }, 1200)
  }, [showLoader, hideLoader]);

  return (
    <div className="flex h-screen bg-offWhite text-gray-900 font-sans p-3 sm:p-5">
      {/* Left Sidebar */}
      <div
        className={`hidden md:flex bg-white border border-gray-200 rounded-xl flex-shrink-0 mr-5 transition-all duration-300 ${
          isSidebarCollapsed ? "w-24" : "w-64"
        }`}
      >
        <Sidebar
          plan={subscription.planName?.toLowerCase() || ''}
          onLogout={logout}
          isCollapsed={isSidebarCollapsed}
        />
      </div>

      {/* Mobile Sidebar (animated) */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            {/* Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-30 bg-black md:hidden"
              onClick={() => setIsMobileMenuOpen(false)}
            />

            {/* Sidebar */}
            <motion.div
              initial={{ x: -300 }}
              animate={{ x: 0 }}
              exit={{ x: -300 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="fixed z-40 w-64 h-[calc(100vh-2.5rem)] bg-white shadow-xl md:hidden rounded-xl overflow-y-auto"
            >
              <Sidebar
                plan={subscription.planName?.toLowerCase() || ''}
                onLogout={logout}
                isCollapsed={false}
                isMobileMenuOpen={isMobileMenuOpen}
                setIsMobileMenuOpen={setIsMobileMenuOpen}
              />
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col">
        <DashboardHeader
          getCurrentPageName={getCurrentPageName}
          toggleSidebar={toggleSidebar}
          isMobileMenuOpen={isMobileMenuOpen}
          setIsMobileMenuOpen={setIsMobileMenuOpen}
          subscription={subscription}
          userProfile={userProfile}
          isUserOptionsOpen={isUserOptionsOpen}
          setIsUserOptionsOpen={setIsUserOptionsOpen}
          userOptionsRef={userOptionsRef}
          navigate={navigate}
          updatePaymentMethodApi={updatePaymentMethodApi}
          showPreview={showPreview}
          togglePreview={togglePreview}
        />

        {/* Content and Preview Area */}
        <div className="flex-1 flex overflow-hidden gap-5">
          <div className="flex-1 overflow-auto scrollbar-hide rounded-xl ">
            {/* DomainCard - shown above main content */}
            <DomainCard userProfile={userProfile} />
            {/* Main Content - Scrollable */}
            <main className="flex-1 overflow-auto scrollbar-hide bg-white mt-4 border border-gray-200 rounded-xl p-6">
              <div className="max-w-4xl mx-auto">
                <Outlet />
              </div>
            </main>
          </div>

          {/* preview panel */}
          <PreviewPanel
            showPreview={showPreview}
            setShowPreview={setShowPreview}
            location={location}
            digitalCardExists={digitalCardExists}
            linkInBioExists={linkInBioExists}
            userProfile={userProfile}
            subscription={subscription}
          />
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;
