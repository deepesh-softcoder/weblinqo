import { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-hot-toast";
import useUserStore from "../stores/userStore";
import userApi from "../services/userApi";
import api from "../services/api";
import useLoaderStore from "../stores/loaderStore";

export const useDashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const isMobile = window.innerWidth <= 768;
  
  // State
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showPreview, setShowPreview] = useState(() => isMobile ? false : true);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isUserOptionsOpen, setIsUserOptionsOpen] = useState(false);
  
  // Refs
  const userOptionsRef = useRef(null);
  
  // Store
  const { userProfile, resetAll, subscription } = useUserStore();
  const { showLoader, hideLoader } = useLoaderStore();

  // Get current page name from location
  const getCurrentPageName = () => {
    const path = location.pathname;
    if (path === '/dashboard') return 'Links';
    if (path === '/dashboard/appearance') return 'Appearance';
    if (path === '/dashboard/analytics') return 'Analytics';
    if (path === '/dashboard/settings') return 'Settings';
    if (path === '/dashboard/digital-card' || path === '/dashboard/digital-card/links') return 'Cards';
    if (path === '/dashboard/digital-card/appearance') return 'Appearance';
    if (path === '/dashboard/digital-card/analytics') return 'Analytics';
    return 'Link in Bio - Links';
  };

  // Effects
  useEffect(() => {
    const fetchData = async () => {
      try {
        await Promise.all([
          userApi.getSubscriptionStatus(),
          userApi.fetchUserProfile()
        ]);
      } catch (err) {
        console.error("Failed to fetch subscription status", err);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (!userProfile) {
      navigate("/login");
    }
  }, [userProfile, navigate]);

  // Close user options popup when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userOptionsRef.current && !userOptionsRef.current.contains(event.target)) {
        setIsUserOptionsOpen(false);
      }
    };

    if (isUserOptionsOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isUserOptionsOpen]);

  // Functions
  const updatePaymentMethodApi = async () => {
    try {
      showLoader();
      const response = await api.post('/api/v1/subscription/update-payment-method');
      if (response.status === 200) {
        const url = response.data?.data?.url;
        window.location.href = url;
      }
      return null;
    } catch (error) {
      console.error("Error", error);
      toast.error(error.response.data?.message)
    }
    hideLoader();
  };

  // logout function
  const logout = () => {
    resetAll();
    navigate("/login");
    toast.success("Logged out successfully");
  };

  // toggle preview
  const togglePreview = () => {
    setShowPreview(!showPreview);
  };

  // toggle sidebar
  const toggleSidebar = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };

  return {
    // State
    isMobileMenuOpen,
    setIsMobileMenuOpen,
    showPreview,
    setShowPreview,
    isSidebarCollapsed,
    isUserOptionsOpen,
    setIsUserOptionsOpen,
    userOptionsRef,
    
    // Data
    userProfile,
    subscription,
    
    // Functions
    getCurrentPageName,
    updatePaymentMethodApi,
    logout,
    togglePreview,
    toggleSidebar,
    navigate,
  };
};
