import React, { useState, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-hot-toast";
import api from "../../../../services/api";
import useUserStore from "../../../../stores/userStore";
import { linkApi } from "../../../../services/linkApi";
import { userApi } from "../../../../services/userApi";
import { togglePollStatus } from "../../../../services/polesAPI";
import VideoUploadModal from "../../../modals/VideoUploadModal";
import CtaModal from "../../../modals/CtaModal";
import AppointmentModal from "../../../modals/AppointmentModal";
import SocialLinksModal from "../../../modals/SocialLinksModal";
import ProfileCardExt from "./profile-card";
import AddLinkFormExt from "./add-link-form";
import PublishedLinksExt from "./published-links";
import useLoaderStore from "../../../../stores/loaderStore";
import { dcLinkApi } from "../../../../services/dcLinkApi";
import Switch from "../../../common/ui/switch";
import PlanBadge from "../../../common/ui/plan-badge";

const LinksTab = ({ userProfile, setUserProfile, setUserDcProfile, plan }) => {
  const [links, setLinks] = useState(userProfile.links || []);
  const [isEditingName, setIsEditingName] = useState(false);
  const [isEditingTagline, setIsEditingTagline] = useState(false);
  const [editedProfile, setEditedProfile] = useState({ ...userProfile });
  const [features, setFeatures] = useState(null);
  const [removeBranding, setRemoveBranding] = useState(false);
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);
  const [isCtaModalOpen, setIsCtaModalOpen] = useState(false);
  const [isAppointmentModalOpen, setIsAppointmentModalOpen] = useState(false);
  const [isSocialLinksModalOpen, setIsSocialLinksModalOpen] = useState(false);
  const [editingSocialLink, setEditingSocialLink] = useState(null);
  const { updateNested } = useUserStore();
  const { showLoader, hideLoader, loading } = useLoaderStore();


  // Fetch digital card data from API and set to user profile
  const fetchDcData = async () => {
    const res = await dcLinkApi.fetchDcData();
    if (res?.status === 200 || res?.status === 201) {
      console.log("dc data",res?.data?.data);
      setUserDcProfile(res.data.data);
    }
  };

  // Fetch plan features and digital card data
  useEffect(() => {
    const fetchFeatures = async () => {
      try {
        const res = await api.get("/api/v1/subscription/features");
        if (res.status === 200 || res.status === 201) {
          setFeatures(res.data.data);
        } else {
          console.log(res?.response?.data?.message);
        }
      } catch (error) {
        // toast.error("Failed to load plan features.");
        console.log(error?.response?.data?.message);
      }
    };
    fetchDcData();
    fetchFeatures();
  }, []);

  // Initialize remove branding state
  useEffect(() => {
    if (userProfile?.template) {
      if (userProfile?.branding?.brandingEnabled !== undefined) {
        setRemoveBranding(userProfile?.branding?.brandingEnabled);
      }
    }
  }, [userProfile]);

  // Update a link by ID
  const updateLink = async (id, linkData) => {
    if (!features) return toast.error("Plan features not loaded yet");

    try {
      showLoader();
      // Determine the link type based on platform
      const isAppointmentLink = ['CALENDLY', 'GOOGLE_CALENDAR', 'MICROSOFT_BOOKINGS', 'HUBSPOT_MEETINGS'].includes(linkData.platform);
      const isSocialLink = ['INSTAGRAM', 'FACEBOOK', 'THREADS', 'TIKTOK', 'YOUTUBE', 'TWITTER', 'LINKEDIN'].includes(linkData.platform);
      
      let payload = {};

      if (isAppointmentLink) {
        // Appointment link data structure
        payload = {
          title: linkData.name || linkData.title,
          url: linkData.url,
          platform: linkData.platform,
          startDate: null,
          endDate: null,
          iconUrl: null,
        };
      } else if (isSocialLink) {
        // Social link data structure (for future social links modal)
        payload = {
          title: linkData.title,
          url: linkData.url,
          platform: linkData.platform,
          startDate: null,
          endDate: null,
          iconUrl: linkData.iconUrl || null,
        };
      } else {
        // Regular link data structure (current implementation)
        const { title, url, platform, startDate, endDate, iconUrl } = linkData;
        
        // Validate scheduling only for regular links
        if (!features.linkScheduling && (startDate || endDate)) {
          return toast.error("Link scheduling is not allowed on your current plan.");
        }
        
        payload = {
          title,
          url,
          platform,
          startDate,
          endDate,
          iconUrl,
        };
      }

      const response = await api.put(`/api/v1/link/${id}`, payload);

      const updatedLink = response.data.data;
      const updatedLinks = links.map(link => link.id === id ? updatedLink : link);
      setLinks(updatedLinks);
      await userApi.fetchUserProfile();
      setIsAppointmentModalOpen(false);
      setIsSocialLinksModalOpen(false);
      const updated = { ...editedProfile, links: updatedLinks };
      setEditedProfile(updated);
      setUserProfile(updated);
      
      // Show appropriate success message based on link type
      // if (isAppointmentLink) {
      //   toast.success("Appointment link updated successfully");
      // } else if (isSocialLink) {
      //   toast.success("Social link updated successfully");
      // } else {
      //   toast.success("Link updated successfully");
      // }
    } catch (error) {
      // Show appropriate error message based on link type
      const isAppointmentLink = ['CALENDLY', 'GOOGLE_CALENDAR', 'MICROSOFT_BOOKINGS', 'HUBSPOT_MEETINGS'].includes(linkData.platform);
      const isSocialLink = ['INSTAGRAM', 'FACEBOOK', 'THREADS', 'TIKTOK', 'YOUTUBE', 'TWITTER', 'LINKEDIN'].includes(linkData.platform);
      
      if (isAppointmentLink) {
        toast.error(error?.response?.data?.message);
      } else if (isSocialLink) {
        toast.error(error?.response?.data?.message);
      } else {
        toast.error(error?.response?.data?.message);
      }
    } finally {
      hideLoader();
    }
  };

  // update user profile with provided data
  const updateProfile = async (data) => {
    showLoader();
    try {
      const res = await api.put("/api/v1/user/profile", data);
      return res.data;
    } finally {
      hideLoader();
    }
  };

  // upload a new profile image and update profile
  const uploadProfileImage = async (file) => {
    showLoader();
    try {
      const res = await api.post("/api/v1/user/profile-image", file, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      const profileImageUrl = res.data.data.profileImageUrl;

      // Save new image URL to user profile
      await updateProfile({
        title: editedProfile.title,
        bio: editedProfile.bio,
        profileImage: profileImageUrl,
      });

      return profileImageUrl;
    } finally {
      hideLoader();
    }
  };

  // upload video file and update user profile
  const uploadVideo = async (file) => {
    showLoader();
    try {
      // Use the linkApi service to upload video
      const result = await linkApi.uploadVideoFormData(file);
      
      let videoUrl = null;
      if (result && result.videoUrl) {
        videoUrl = result.videoUrl;
      } else if (result && result.url) {
        videoUrl = result.url;
      } else if (result) {
        // Fallback: if the API doesn't return a specific video URL field,
        // assume the result itself is the URL or contains the URL
        videoUrl = result;
      }

      if (videoUrl) {
        // After successful upload, update the user profile with the video URL
        const updateResult = await linkApi.updateUserVideo(videoUrl);
        if (updateResult) {
          // Fetch the updated user profile to get the latest data
          const updatedProfile = await userApi.fetchUserProfile();
          if (updatedProfile) {
            return videoUrl;
          } else {
            throw new Error("Failed to fetch updated user profile");
          }
        } else {
          throw new Error("Failed to update user profile with video URL");
        }
      }
      
      return null;
    } catch (error) {
      console.error("Error in uploadVideo:", error);
      throw error;
    } finally {
      hideLoader();
    }
  };

  // Create new links
  const createLinks = async (linksData) => {
    showLoader();
    try {
      const res = await api.post("/api/v1/link/", linksData);
      return res.data.data;
    } finally {
      hideLoader();
    }
  };

  // Delete a link by ID
  const deleteLink = async (linkId) => {
    showLoader();
    try {
      await api.delete(`/api/v1/link/${linkId}`);
      const updatedLinks = links.filter((link) => link.id !== linkId);
      setLinks(updatedLinks);
      await userApi.fetchUserProfile();
      const updated = { ...editedProfile, links: updatedLinks };
      setEditedProfile(updated);
      setUserProfile(updated);
    } finally {
      hideLoader();
    }
  };

  // Save tagline edits
  const handleTaglineSave = useCallback(async () => {
    const { title, bio, profileImage } = editedProfile;
    await updateProfile({ title, bio, profileImage });
    setIsEditingTagline(false);
  }, [editedProfile]);

  // Save name edits
  const handleNameSave = useCallback(async () => {
    const { title, bio, profileImage } = editedProfile;
    await updateProfile({ title, bio, profileImage });
    setIsEditingName(false);
  }, [editedProfile]);

  // Update local profile state when a field changes
  const handleProfileChange = useCallback(
    (field, value) => {
      const updated = { ...editedProfile, [field]: value };
      setEditedProfile(updated);
      setUserProfile(updated);
    },
    [editedProfile, setUserProfile]
  );

  // Update profile image in state
  const handleProfileImageChange = useCallback(
    (url) => {
      const updated = { ...editedProfile, profileImage: url };
      setEditedProfile(updated);
      setUserProfile(updated);
    },
    [editedProfile, setUserProfile]
  );

  // Handle video file upload from modal
  const handleVideoUpload = useCallback(
    async (file) => {
      if (file) {
        try {
          showLoader();
          const newVideoUrl = await uploadVideo(file);
          
          if (newVideoUrl) {
            await linkApi.updateVideoStatus(true);
            const updatedProfile = await userApi.fetchUserProfile();
            if (updatedProfile) {
              setIsVideoModalOpen(false);
              const updateProfile = {
                ...updatedProfile,
                profileVideo: {...(updatedProfile.profileVideo || {}), enabled: true},
              }
              setUserProfile(updateProfile);
              setEditedProfile(updatedProfile);
            } else {
              throw new Error("Failed to fetch updated user profile")
            }
            // Success message is already handled in the linkApi service
          } else {
            toast.error("Failed to get video URL from upload response");
          }
        } catch (error) {
          console.error("Error uploading video:", error);
          // Error message is already handled in the linkApi service
        } finally {
          hideLoader();
        }
      }
    },
    [editedProfile, setUserProfile, uploadVideo]
  );

  // Handle video URL submission from modal
  const handleVideoUrlSubmit = useCallback(
    async (videoUrl) => {
      if (videoUrl) {
        try {
          showLoader();
          // Since uploadVideoUrl now uses PUT /api/v1/user/video, it directly updates the profile
          const result = await linkApi.updateUserVideo(videoUrl);
          
          if (result) {
            await linkApi.updateVideoStatus(true);
            // Fetch the updated user profile to get the latest data
            const updatedProfile = await userApi.fetchUserProfile();
            if (updatedProfile) {
              setIsVideoModalOpen(false);
              const updateProfile = {
                ...updatedProfile,
                profileVideo: {...(updatedProfile.profileVideo || {}), enabled: true},
              }
              setUserProfile(updateProfile);
              setEditedProfile(updatedProfile);
              // Success message is already handled in the linkApi service
            } else {
              throw new Error("Failed to fetch updated user profile");
            }
          } else {
            toast.error("Failed to upload video URL");
          }
        } catch (error) {
          console.error("Error uploading video URL:", error);
          // Error message is already handled in the linkApi service
        } finally {
          hideLoader();
        }
      }
    },
    []
  );

  // Handle creation or update of CTA
  const handleCreateCta = useCallback(
    async (ctaType, ctaValue) => {
      showLoader();
      try {
        
        // Check if CTA already exists to determine if we're creating or updating
        const isUpdating = userProfile.cta?.ctaType && userProfile.cta?.ctaValue;
        
        const result = await linkApi.createCta(ctaType, ctaValue);
        
        if (result) {

          // Automatically enable CTA after creation
          if (!isUpdating) {
            await linkApi.updateCtaStatus(true);
          }
          // Fetch updated profile to get the latest data
          const updatedProfile = await userApi.fetchUserProfile();
          if (updatedProfile) {
            setIsCtaModalOpen(false);
            // Success message is already handled in the linkApi service
          } else {
            throw new Error("Failed to fetch updated user profile");
          }
        } else {
          toast.error(isUpdating ? "Failed to update CTA" : "Failed to create CTA");
        }
      } catch (error) {
        console.error("Error handling CTA:", error);
        // Error message is already handled in the linkApi service
      } finally {
        hideLoader();
      }
    },
    [userProfile.cta]
  );

  // Create appointment link
  const handleCreateAppointment = useCallback(
    async (platform, url, name) => {
      if (!features) return toast.error("Plan features not loaded yet");

      const isUnlimited = features.maxLinks.toLowerCase() === "unlimited";
      if (!isUnlimited && links.length >= parseInt(features.maxLinks)) {
        return toast.error(
          `You can only add ${features.maxLinks} links on your current plan.`
        );
      }

      try {
        showLoader();
        
        // Create appointment as a link using the existing createLinks API
        const response = await createLinks([
          {
            title: name,
            url: url,
            platform: platform,
            startDate: null,
            endDate: null,
            iconUrl: null,
          },
        ]);
        
        const newLink = response[0];
        const updatedLinks = [...links, newLink];
        
        // Fetch updated profile to get the latest data
        const updatedProfile = await userApi.fetchUserProfile();
        if (updatedProfile) {
          setLinks(updatedLinks);
          const updated = { ...editedProfile, links: updatedLinks };
          setEditedProfile(updated);
          setUserProfile(updated);
          setIsAppointmentModalOpen(false);
          // toast.success("Appointment link added successfully!");
        } else {
          throw new Error("Failed to fetch updated user profile");
        }
      } catch (error) {
        console.error("Error creating appointment:", error);
        // toast.error("Failed to create appointment");
      } finally {
        hideLoader();
      }
    },
    [features, links, editedProfile, setUserProfile]
  );

  // Create social link
  const handleCreateSocialLink = useCallback(
    async (platform, url) => {
      if (!features) return toast.error("Plan features not loaded yet");

      const isUnlimited = features.maxLinks.toLowerCase() === "unlimited";
      if (!isUnlimited && links.length >= parseInt(features.maxLinks)) {
        return toast.error(
          `You can only add ${features.maxLinks} links on your current plan.`
        );
      }

      try {
        showLoader();
        
        // Create social link using the existing createLinks API
        const response = await createLinks([
          {
            title: platform.charAt(0).toUpperCase() + platform.slice(1).toLowerCase(),
            url: url,
            platform: platform,
            startDate: null,
            endDate: null,
            iconUrl: null,
          },
        ]);
        
        const newLink = response[0];
        const updatedLinks = [...links, newLink];
        
        
        // Fetch updated profile to get the latest data
        const updatedProfile = await userApi.fetchUserProfile();
        if (updatedProfile) {
          setLinks(updatedLinks);
          const updated = { ...editedProfile, links: updatedLinks };
          setEditedProfile(updated);
          setUserProfile(updated);
          setIsSocialLinksModalOpen(false);
          // toast.success("Social link added successfully!");
        } else {
          throw new Error("Failed to fetch updated user profile");
        }
      } catch (error) {
        console.error("Error creating social link:", error);
        toast.error(error?.response?.data?.message);
      } finally {
        hideLoader();
      }
    },
    [features, links, editedProfile, setUserProfile]
  );

  // Open social link modal for editing
  const handleEditSocialLink = useCallback((link) => {
    // Check if the link is a social link
    const isSocialLink = ['INSTAGRAM', 'FACEBOOK', 'TWITTER', 'LINKEDIN', 'YOUTUBE', 'TIKTOK', 'THREADS'].includes(link.platform);
    
    if (isSocialLink) {
      setEditingSocialLink(link);
      setIsSocialLinksModalOpen(true);
    }
  }, []);

  // Toggle main branding
  const handleBrandingToggle = useCallback(
    async () => {
      const newStatus = !removeBranding;
      
      try {
        showLoader();
        const result = await linkApi.updateBrandingStatus(newStatus);
        
        if (result) {
          // Update local state for immediate UI feedback
          setRemoveBranding(newStatus);
          // updateNested("template.removeBranding", newStatus);
          
          // Fetch updated profile to get the latest data
          const updatedProfile = await userApi.fetchUserProfile();
          if (updatedProfile) {
            // Success message is already handled in the linkApi service
          } else {
            throw new Error("Failed to fetch updated user profile");
          }
        } else {
          throw new Error("Failed to update branding status");
        }
      } catch (error) {
        console.error("Error toggling branding:", error);
        // Error message is already handled in the linkApi service
      } finally {
        hideLoader();
      }
    },
    [removeBranding, setRemoveBranding, updateNested]
  );

  // Toggle video branding
  const handleVideoBrandingToggle = useCallback(
    async () => {
      if (!userProfile.profileVideo) return;
      
      const currentStatus = userProfile.profileVideo.enabled;
      const newStatus = !currentStatus;
      
      try {
        showLoader();
        const updatedProfile = {...userProfile, profileVideo: {...userProfile?.profileVideo, enabled: newStatus}};
        setUserProfile(updatedProfile);
        setEditedProfile(updatedProfile);
        const result = await linkApi.updateVideoStatus(newStatus);
        
        if (result) {
          
          // Fetch updated profile to get the latest data
          const updatedProfile = await userApi.fetchUserProfile();
          if (updatedProfile) {
            // Success message is already handled in the linkApi service
          } else {
            throw new Error("Failed to fetch updated user profile");
          }
        } else {
          throw new Error("Failed to update video branding status");
        }
      } catch (error) {
        console.error("Error toggling video branding:", error);
        // Error message is already handled in the linkApi service
      } finally {
        hideLoader();
      }
    },
    [userProfile.profileVideo, updateNested]
  );

  // Toggle CTA enable/disable
  const handleCTAToggle = useCallback(
    async () => {
      try {
        showLoader();
        const newStatus = !userProfile.cta?.enabled;
        await linkApi.updateCtaStatus(newStatus);
        const updatedProfile = await userApi.fetchUserProfile();
        if (updatedProfile) {
          // Success message is already handled in the linkApi service
        } else {
          throw new Error("Failed to fetch updated user profile");
        }
      } catch (error) {
        console.error("Error toggling CTA:", error);
        // Error message is already handled in the linkApi service
      } finally {
        hideLoader();
      }
    },
    [userProfile.cta]
  );

  // Add a new link
  const handleAddLink = useCallback(
    async ({ title, url, iconUrl, platform, startDate, endDate }) => {
      if (!features) return toast.error("Plan features not loaded yet");

      const isUnlimited = features.maxLinks.toLowerCase() === "unlimited";
      if (!isUnlimited && links.length >= parseInt(features.maxLinks)) {
        return toast.error(
          `You can only add ${features.maxLinks} links on your current plan.`
        );
      }

      if (!features.linkScheduling && (startDate || endDate)) {
        return toast.error(
          "Link scheduling is not allowed on your current plan."
        );
      }

      try {
        const response = await createLinks([
          {
            title,
            url,
            platform,
            startDate: startDate ? new Date(startDate) : null,
            endDate: endDate ? new Date(endDate) : null,
            iconUrl: iconUrl,
          },
        ]);
        const newLink = response[0];
        const updatedLinks = [...links, newLink];
        const updatedProfile = await userApi.fetchUserProfile();
          if (updatedProfile) {
            // Success message is already handled in the linkApi service
          } else {
            throw new Error("Failed to fetch updated user profile");
          }
        setLinks(updatedLinks);
        const updated = { ...editedProfile, links: updatedLinks };
        setEditedProfile(updated);
        setUserProfile(updated);
        // toast.success("Link added");
      } catch (error) {
        toast.error(error?.response?.data?.message);
      }
    },
    [features, links, editedProfile, setUserProfile]
  );

  // Reorder links after drag/drop
  const reorderLinks = async (reorderedData) => {
    showLoader();
    try {
      await api.put("/api/v1/link/reorder", reorderedData);
      const updatedLinks = reorderedData.map((req) =>
        links.find((link) => link.id === req.id)
      );
      setLinks(updatedLinks);
      await userApi.fetchUserProfile();
      // const updated = { ...editedProfile, links: updatedLinks };
      // setEditedProfile(updated);
      // setUserProfile(updated);
    } finally {
      hideLoader();
    }
  };

  return (
    <section className="space-y-6 pb-6">

      {/* Profile card for editing name, tagline, profile image, video, CTA, and social links */}
      <ProfileCardExt
        userProfile={editedProfile}
        isEditingName={isEditingName}
        isEditingTagline={isEditingTagline}
        setIsEditingName={setIsEditingName}
        setIsEditingTagline={setIsEditingTagline}
        handleNameSave={handleNameSave}
        handleTaglineSave={handleTaglineSave}
        onProfileChange={handleProfileChange}
        onProfileImageChange={handleProfileImageChange}
        uploadProfileImage={uploadProfileImage}
        handleVideoUpload={handleVideoUpload}
        handleVideoBrandingToggle={handleVideoBrandingToggle}
        setEditedProfile={setEditedProfile}
        setUserProfile={setUserProfile}
        setIsVideoModalOpen={setIsVideoModalOpen}
        setIsCtaModalOpen={setIsCtaModalOpen}
        setIsSocialLinksModalOpen={setIsSocialLinksModalOpen}
        onDeleteLink={deleteLink}
        handleEditSocialLink={handleEditSocialLink}
      />

      {/* Toggles for branding, video branding, CTA, and polls */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-3xl mx-auto">
        {/* Remove Branding */}
        <div className="w-full">
          <div className="flex items-center justify-between px-4 py-2 bg-offWhite rounded-lg border border-[#e0ddd9]">
            <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-gray-700">
              Remove Branding
            </span>
            {plan?.toLowerCase() === 'free' && <PlanBadge/>}
            </div>
            <Switch
              disabled={plan?.toLowerCase() === 'free' ? true : false}
              checked={!removeBranding}
              onChange={handleBrandingToggle}
              ariaLabel="Remove Branding toggle"
            />
          </div>
        </div>

        {/* Video Branding */}
        {userProfile?.profileVideo?.embedUrl ? <div className="w-full">
          <div className="flex items-center justify-between px-4 py-2 bg-offWhite rounded-lg border border-[#e0ddd9]">
            <span className="text-sm font-medium text-gray-700">
              Video Branding
            </span>
            
            <Switch
              checked={userProfile.profileVideo?.enabled}
              onChange={handleVideoBrandingToggle}
              disabled={!userProfile?.profileVideo?.embedUrl}
              ariaLabel="Video Branding toggle"
            />
          </div>
        </div> : null}
        {/* CTA */}
        {userProfile.cta?.ctaValue ? <div className="w-full">
          <div className="flex items-center justify-between px-4 py-2 bg-offWhite rounded-lg border border-[#e0ddd9]">
            <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-gray-700">
              Call to Action
            </span>
            {userProfile.cta?.ctaValue && plan?.toLowerCase() !== 'premium' && <PlanBadge/>}
            </div>
            <Switch
              disabled={userProfile.cta?.ctaValue && plan?.toLowerCase() === 'premium' ? false : true}
              checked={userProfile.cta?.enabled}
              onChange={handleCTAToggle}
              ariaLabel="Call to Action toggle"
            />
          </div>
        </div> : null}

        {/* Poles */}
        {userProfile?.poll ? <div className="w-full">
          <div className="flex items-center justify-between px-4 py-2 bg-offWhite rounded-lg border border-[#e0ddd9]">
            <span className="text-sm font-medium text-gray-700">Poll</span>
            <Switch
              checked={userProfile?.poll?.enabled}
              onChange={() => { togglePollStatus(userProfile?.poll?.id, !userProfile?.poll?.enabled, showLoader, hideLoader)}}
              ariaLabel="Poll toggle"
            />
          </div>
        </div> : null}
      </div>

      {/* Add new link form */}
      <AddLinkFormExt
        features={features}
        onAddLink={handleAddLink}
        linksCount={links.length}
        plan={plan}
      />

      {/* Published links list */}
      <PublishedLinksExt
        features={features}
        links={links}
        setLinks={setLinks}
        onDeleteLink={deleteLink}
        onReorderLinks={reorderLinks}
        updateLink={updateLink}
        onEditSocialLink={handleEditSocialLink}
        plan={plan}
      />

      {/* Video Upload Modal */}
      <VideoUploadModal
        isOpen={isVideoModalOpen}
        onClose={() => setIsVideoModalOpen(false)}
        onVideoUpload={handleVideoUpload}
        onVideoUrlSubmit={handleVideoUrlSubmit}
        isLoading={loading}
      />

      {/* CTA Modal */}
      <CtaModal
        isOpen={isCtaModalOpen}
        onClose={() => setIsCtaModalOpen(false)}
        onCreateCta={handleCreateCta}
        isLoading={loading}
        existingCta={userProfile.cta}
      />

      {/* Appointment Modal */}
      <AppointmentModal
        isOpen={isAppointmentModalOpen}
        onClose={() => {
          setIsAppointmentModalOpen(false);
        }}
        onCreateAppointment={handleCreateAppointment}
        onUpdateAppointment={updateLink}
        isLoading={loading}
        appointmentObj={links?.find(link => link?.isAppointment === true)}
      />

      {/* Social Links Modal */}
      <SocialLinksModal
        isOpen={isSocialLinksModalOpen}
        onClose={() => {
          setIsSocialLinksModalOpen(false);
          setEditingSocialLink(null);
        }}
        onCreateSocialLink={handleCreateSocialLink}
        onUpdateSocialLink={updateLink}
        onDeleteSocialLink={deleteLink}
        isLoading={loading}
        socialLinkObj={editingSocialLink || links?.find(link => link?.isSocialLink === true)}
        allLinks={links}
        isEditMode={!!editingSocialLink}
      />
    </section>
  );
};

export default LinksTab;
