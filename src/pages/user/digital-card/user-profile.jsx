import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import DcProfilePreview from "../../../components/user/digital-card/profile-preview";
import { trackCardView } from "../../../services/dcAnalyticsApi";
import { userApi } from "../../../services/userApi";

const DCUserProfile = () => {
  const { slug } = useParams();
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  // fetch digital card profile
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);

        // Fetch digital card data using the new API
        const profileData = await userApi.fetchDigitalCardBySlug(slug);

        if (profileData) {
          setUserProfile(profileData);

          // Track the card view using the new analytics API
          try {
            await trackCardView(slug);
          } catch (trackError) {
            console.error("Failed to track card view:", trackError);
            // Don't show error to user as this is just tracking
          }

        } else {
          console.error("No profile data received");
          toast.error("Failed to load profile.");
        }
      } catch (err) {
        console.error("Failed to load or track digital card profile:", err);
        toast.error("Failed to load profile.");
      } finally {
        setLoading(false);
      }
    };

    if (slug) {
      fetchProfile();
    }
  }, [slug]);

  // loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center"
        >
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          {/* <p className="text-gray-600">Loading digital card...</p> */}
        </motion.div>
      </div>
    );
  }

  // profile not found state
  if (!userProfile) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <div className="text-6xl mb-4">📱</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Profile Not Found
          </h2>
          <p className="text-gray-600">
            This digital card profile doesn't exist or has been removed.
          </p>
        </motion.div>
      </div>
    );
  }

  // Prepare template data for the digital card
  const templateData = userProfile.template;

  // Prepare user data for the digital card
 
  const digitalCardData = {
    id: userProfile.id,
    avatar:
      userProfile.avatar,
    name: userProfile.name,
    designation: userProfile.designation,
    phone: userProfile.phone,
    phoneVisible: userProfile.phoneVisible,
    email: userProfile.email,
    emailVisible: userProfile.emailVisible,
    website: userProfile.website,
    websiteVisible: userProfile.websiteVisible,
    address: userProfile.address,
    addressVisible: userProfile.addressVisible,
    brandingEnabled: userProfile.brandingEnabled,
    qrId: userProfile.qrId,
    socials: userProfile.socials,
  };

  return (
    // render digital card
    <div className="min-h-screen bg-offWhite flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md p-4"
      >
        {/* Digital Card Preview */}
        <DcProfilePreview
          template={templateData}
          userData={digitalCardData}
          isPreview={false}
          className=""
          showLogo={userProfile?.brandingEnabled !== false}
          cardSlug={slug}
        />
      </motion.div>
    </div>
  );
};

export default DCUserProfile;
