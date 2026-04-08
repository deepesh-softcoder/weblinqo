// SettingsTab.js
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FiLock, FiTrash2, FiMic, FiToggleRight, FiPlus } from "react-icons/fi";
import AddPolesModal from "../features/add-poles-modal";
import Appointment from "../features/appointment";
import ConfirmationModal from "../modals/ConfirmationModal";
import useUserStore from "../../stores/userStore";
import { userApi } from "../../services/userApi";
import toast from "react-hot-toast";
import useLoaderStore from "../../stores/loaderStore";
import Switch from "../common/ui/switch";


const SettingsTab = () => {
  const [activeTab, setActiveTab] = useState("General");
  const [isPolesModalOpen, setIsPolesModalOpen] = useState(false);
  const [confirmationModal, setConfirmationModal] = useState({
    isOpen: false,
    title: "",
    message: "",
    type: "warning",
    confirmText: "Confirm",
    onConfirm: null,
    isLoading: false
  });
  const { userProfile } = useUserStore();
  const navigate = useNavigate();
  const { showLoader, hideLoader } = useLoaderStore();

  // Fetch current subscription plan
  useEffect(() => {
    const fetchPlan = async () => {
      try {
        await userApi.getSubscriptionStatus();
      } catch (err) {
        console.error("Failed to fetch subscription status", err);
      }
    };

    fetchPlan();
  }, []);

  // Helper functions for confirmation modal
  const openConfirmationModal = (config) => {
    setConfirmationModal({
      isOpen: true,
      ...config
    });
  };

  // Helper function Close the confirmation modal and reset loading state
  const closeConfirmationModal = () => {
    setConfirmationModal(prev => ({
      ...prev,
      isOpen: false,
      isLoading: false
    }));
  };

  // Helper function Update loading state for confirmation modal
  const setModalLoading = (isLoading) => {
    setConfirmationModal(prev => ({
      ...prev,
      isLoading
    }));
  };

  // const handleCancelSubscription = () => {
  //   openConfirmationModal({
  //     title: "Cancel Subscription",
  //     message: "Are you sure you want to cancel your subscription? This action cannot be undone.",
  //     type: "warning",
  //     confirmText: "Cancel Subscription",
  //     onConfirm: async () => {
  //       setModalLoading(true);
  //       const success = await userApi.updateSubscription("downgrade", "Free");
  //       if (success) {
  //         closeConfirmationModal();
  //         window.location.reload();
  //       } else {
  //         setModalLoading(false);
  //       }
  //     }
  //   });
  // };

  // Handler for deleting the user account
  const handleDeleteAccount = () => {
    openConfirmationModal({
      title: "Delete Account",
      message: "Are you sure you want to delete your account? You can restore your account anytime within 2 weeks by logging in again",
      type: "danger",
      confirmText: "Delete Account",
      onConfirm: async () => {
        setModalLoading(true);
        const success = await userApi.deleteUser();
        if (success) {
          // The userApi.deleteUser() function already handles redirecting to login
          // and clearing user data, so no additional action needed here
          closeConfirmationModal();
        } else {
          setModalLoading(false);
        }
      }
    });
  };

   // Handler for deactivating the user account
  const handleDeactivateAccount = () => {
    openConfirmationModal({
      title: "Deactivate Account",
      message: "Are you sure you want to deactivate your account? You can restore anytime within 3 months by logging in again.",
      type: "warning",
      confirmText: "Deactivate Account",
      onConfirm: async () => {
        setModalLoading(true);
        const success = await userApi.deactivateUser();
        if (success) {
          // The userApi.deactivateUser() function already handles redirecting to login
          // and clearing user data, so no additional action needed here
          closeConfirmationModal();
        } else {
          setModalLoading(false);
        }
      }
    });
  };

   // Handler for account verification
  const handleVerifyAccount = async () => {
    showLoader();
    // Prevent verification if account is already verified
    // if (userProfile?.accountVerified) {
    //   toast.success("Your account is already verified!");
    //   hideLoader();
    //   return;
    // }
    
    if (!userProfile?.email) {
      toast.error("User email not found");
      hideLoader();
      return;
    }

    try {
      // Call resend OTP API
      const success = await userApi.resendOtp(userProfile.email, "ACCOUNT_VERIFICATION");
      if (success) { 
        // Navigate to verify OTP page with email and purpose
        navigate("/verify", {
          state: {
            email: userProfile.email,
            purpose: "ACCOUNT_VERIFICATION",
            fromSettings: true
          }
        });
      }
    } catch (error) {
      console.error("Error initiating account verification:", error);
    } finally {
      hideLoader();
    }
  };

  // Define tabs
  const tabs = [
    { id: "General", label: "General" },
    // { id: "Appointment", label: "Appointment" }
  ];

  // Define settings options displayed under "General" tab
  const settingsOptions = [
    {
      id: 0,
      title: "Upgrade and Downgrade",
      icon: <FiLock className="w-5 h-5" />,
      button: { text: "Switch Plan", color: "bg-primary text-white", onClick: () => navigate('/change-plan') }
    },
    // subscription.planName?.toLowerCase() !== "free" && {
    //   id: 1,
    //   title: "Cancel Subscription",
    //   icon: <FiX className="w-5 h-5" />,
    //   button: { text: "Cancel", color: "bg-red-500 text-white", onClick: handleCancelSubscription }
    // },
    {
      id: 2,
      title: "Delete Account",
      icon: <FiTrash2 className="w-5 h-5" />,
      button: { text: "Delete", color: "bg-red-500 text-white", onClick: handleDeleteAccount }
    },
    {
      id: 3,
      title: "Deactivate Account",
      icon: <FiMic className="w-5 h-5" />,
      button: { text: "Deactivate", color: "bg-primary text-white", onClick: handleDeactivateAccount }
    },
    {
      id: 4,
      title: "Verify your Account",
      icon: <FiToggleRight className="w-5 h-5" />,
      toggle: true,
      value: userProfile.accountVerified,
      onChange: handleVerifyAccount
    },
    {
      id: 5,
      title: "Poles",
      icon: <FiPlus className="w-5 h-5" />,
      button: { text: userProfile.poll ? "Edit Poles" : "Add Poles", color: "bg-primary text-white", onClick: () => setIsPolesModalOpen(true) }
    }
  ].filter(Boolean); 

  return (
    <div className="bg-white rounded-xl">

      {/* Tabs */}
      <div className="px-6 pb-0 py-4 border-b border-gray-200">
        <div className="flex space-x-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`pb-2 px-1 border-b-2 font-medium text-sm transition-colors ${activeTab === tab.id
                ? "border-primary text-primary"
                : "border-transparent text-gray-500 hover:text-gray-700"
                }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="py-6">
        {activeTab === "General" && (
          <div className="space-y-6">

            {/* Settings Options */}
            <div className="space-y-4">
              {settingsOptions?.map((option, index) => (
                <div
                  key={index}
                  className={`${option?.toggle ? 'flex-row items-center' : 'flex-col sm:flex-row items-start md:items-center'} gap-4 flex justify-between p-4 bg-gray-50 rounded-lg border border-gray-20`}
                >
                  <div className="flex items-center space-x-3 text-start">
                    <div className="text-gray-600">{option?.icon}</div>
                    <span className="font-medium text-gray-900">{option?.title}</span>
                  </div>

                    <div className={`flex items-center ${option?.toggle ? "" : "w-full sm:w-auto"}`}>
                     {option?.toggle ? (
                        <Switch
                          checked={option.value}
                          onChange={option?.onChange}
                          disabled={option.value}
                          ariaLabel={`${option?.title} toggle`}
                        />
                    ) : (
                      <button
                        onClick={option?.button?.onClick}
                        className={`${option?.toggle ? "w-11" : "w-full"} px-4 py-2 rounded-lg text-sm font-medium transition-colors ${option?.button?.color}`}
                      >
                        {option?.button?.text}
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === "Appointment" && (
          <Appointment />
        )}
      </div>

      {/* Add Poles Modal */}
      <AddPolesModal
        isOpen={isPolesModalOpen}
        onClose={() => setIsPolesModalOpen(false)}
        pollsData={userProfile.poll}
        onSubmit={(poleData) => {
          console.log("Pole data submitted:", poleData);
          // Handle pole submission here
        }}
      />

      {/* Confirmation Modal */}
      <ConfirmationModal
        isOpen={confirmationModal.isOpen}
        onClose={closeConfirmationModal}
        onConfirm={confirmationModal.onConfirm}
        title={confirmationModal.title}
        message={confirmationModal.message}
        type={confirmationModal.type}
        confirmText={confirmationModal.confirmText}
        isLoading={confirmationModal.isLoading}
      />
    </div>
  );
};

export default SettingsTab;