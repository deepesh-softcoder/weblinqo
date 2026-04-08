import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../../../utils/api";
import {
  FaInstagram,
  FaFacebookF,
  FaLinkedin,
  FaYoutube,
  FaTiktok,
  FaPhone,
  FaEnvelope,
  FaPollH,
} from "react-icons/fa";
import { RiThreadsLine } from "react-icons/ri";
import toast from "react-hot-toast";
import PolesSurveyModal from "../../../components/modals/PolesSurveyModal";
import AgeConfirmationModal from "../../../components/modals/AgeConfirmationModal";
import logo from "../../../assets/images/logos/logo-icon.png";
import { FaXTwitter } from "react-icons/fa6";
import { motion } from "framer-motion";

const UserProfile = () => {
  const { slug } = useParams();
  const [userProfile, setUserProfile] = useState(null);
  const [isSurveyModalOpen, setIsSurveyModalOpen] = useState(false);
  const [isAgeConfirmationOpen, setIsAgeConfirmationOpen] = useState(false);
  const [pendingLink, setPendingLink] = useState(null);

  // fetch user profile
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        // ✅ Skip auth token for public profile
        const res = await api.get(`/api/v1/user/public-profile/${slug}`, {
          skipAuth: true,
        });
        setUserProfile(res.data.data);

        // ✅ Skip auth token for view tracking
        await api.post(`/api/v1/user/track/${slug}`, null, {
          skipAuth: true,
        });
      } catch (err) {
        console.error("Failed to load or track profile:", err);
        toast.error("Failed to load profile.");
      }
    };

    if (slug) {
      fetchProfile();
    }
  }, [slug]);

  // loading state
  if (!userProfile) {
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

  const template = userProfile.template || {};
  const links = userProfile.links || [];

  // Define social media platforms
  const socialLinks = [
    "INSTAGRAM",
    "FACEBOOK",
    "TWITTER",
    "LINKEDIN",
    "YOUTUBE",
    "TIKTOK",
    "THREADS",
  ];

  // Filter social media links and regular links
  const socialMediaLinks = links.filter(
    (link) => socialLinks.includes(link.platform) && link.enabled
  );
  const regularLinks = links.filter(
    (link) => !socialLinks.includes(link.platform)
  );

  // age confirmation handler 
  const handleAgeConfirmation = async () => {
    if (pendingLink) {
      try {
        // Track the link click after age confirmation
        await api.post(`/api/v1/link/track/${pendingLink.id}`, null, {
          skipAuth: true,
        });
      } catch (err) {
        console.error("Click tracking failed:", err);
      } finally {
        // Open the link in a new tab after confirmation
        window.open(pendingLink.url, "_blank", "noopener,noreferrer");
        setPendingLink(null);
      }
    }
  };

  // background style
  const backgroundStyle =
    template.background &&
    (template?.background?.startsWith("http") ||
      template?.background?.startsWith("data:"))
      ? {
          backgroundImage: `url(${template.background})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }
      : {
          backgroundColor: template.background || "#f8f9fa",
          background: template.background || "#f8f9fa",
        };

  console.log("userProfile.profileVideo", userProfile.profileVideo);

  return (
    <div className="min-h-screen bg-offWhite flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md p-4"
      >
      {/* main profile card */}  
      <div
        className=" flex flex-1 mx-auto justify-center aspect-[9/16] h-full relative p-1 rounded-xl shadow-lg overflow-auto scrollbar-hide"
        style={{...backgroundStyle, maxHeight: "90vh"}}
      >
        {/* poll floating button */}
        {userProfile?.poll?.enabled && (
        <div className="absolute bottom-4 right-4 z-10">
            <button onClick={() => setIsSurveyModalOpen(true)} className="bg-green-500 text-white px-4 py-2 rounded-full">
            <FaPollH />
            </button>
          </div>
        )}
        <div
          className="w-full max-w-md p-2 rounded-xl backdrop-blur-sm bg-opacity-90 flex flex-col justify-between"
          style={{
            fontFamily: template.font || "inherit",
            color: template.textColor || "#333333",
          }}
        >

          <div className="h-full p-8 flex flex-col overflow-y-auto scrollbar-hide">
            {/* Avatar */}
            {userProfile.profileImage && (
              <img
                src={userProfile.profileImage}
                alt="avatar"
                className="w-24 h-24 rounded-full mx-auto mb-4 border-4 border-white shadow-md object-cover"
              />
            )}

            {/* Title */}
            <h2 className="text-2xl font-bold text-center mb-2">
              {userProfile.title || "No title provided"}
            </h2>

            {/* Bio */}
            <p className="text-sm text-center mb-4">
              {userProfile.bio || "No bio provided."}
            </p>

            {/* Profile Video */}
            {(() => {
              // Handle different video data structures
              const videoUrl =
                typeof userProfile?.profileVideo === "string"
                  ? userProfile.profileVideo
                  : userProfile?.profileVideo?.url ||
                    userProfile?.profileVideo?.embedUrl;

              const isEnabled =
                typeof userProfile?.profileVideo === "string"
                  ? true // If it's a string, assume it's enabled
                  : userProfile?.profileVideo?.enabled;

              // Function to convert video URLs to embeddable formats
              const getEmbedUrl = (url) => {
                if (!url) return null;

                // YouTube URL conversion
                if (
                  url.includes("youtube.com/watch") ||
                  url.includes("youtu.be/")
                ) {
                  const videoId = url.includes("youtube.com/watch")
                    ? url.split("v=")[1]?.split("&")[0]
                    : url.split("youtu.be/")[1]?.split("?")[0];
                  return videoId
                    ? `https://www.youtube.com/embed/${videoId}`
                    : null;
                }

                // Loom URL conversion
                if (url.includes("loom.com/share/")) {
                  const videoId = url.split("loom.com/share/")[1]?.split("?")[0];
                  return videoId ? `https://www.loom.com/embed/${videoId}` : null;
                }

                // Vimeo URL conversion
                if (url.includes("vimeo.com/")) {
                  const videoId = url.split("vimeo.com/")[1]?.split("?")[0];
                  return videoId
                    ? `https://player.vimeo.com/video/${videoId}`
                    : null;
                }

                // Direct video URL (MP4, WebM, etc.)
                if (url.match(/\.(mp4|webm|ogg|mov|avi)$/i)) {
                  return url;
                }

                // If it's already an embed URL, return as is
                if (url.includes("/embed/")) {
                  return url;
                }

                return null;
              };

              const embedUrl = getEmbedUrl(videoUrl);

              const isDirectFile = videoUrl?.match(/\.(mp4|webm|ogg|mov|avi)$/i);

              const isIframeVideo = embedUrl && !isDirectFile;

              //  Render iframe or video tag
              return videoUrl && isEnabled ? (
                <div className="mb-8 flex-shrink-0">
                  {isIframeVideo ? (
                    // Use iframe for YouTube, Loom, Vimeo, etc.
                    <iframe
                      src={embedUrl}
                      title="Profile Video"
                      className="w-full max-w-md mx-auto rounded-lg shadow-lg"
                      style={{
                        maxHeight: "300px",
                        aspectRatio: "16/9",
                      }}
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      onLoad={() => {
                        console.log("Iframe loaded:", embedUrl);
                      }}
                      onError={() => {
                        console.error("Iframe error:", embedUrl);
                      }}
                    />
                  ) : (
                    // Use video element for direct video files
                    <video
                      src={videoUrl}
                      controls
                      autoPlay
                      muted
                      loop
                      playsInline
                      preload="metadata"
                      className="w-full max-w-md mx-auto rounded-lg shadow-lg"
                      style={{
                        maxHeight: "300px",
                        objectFit: "cover",
                      }}
                      onError={(e) => {
                        console.error("Video error:", e);
                        console.log("Video URL:", videoUrl);
                      }}
                      onLoadStart={() => {
                        console.log("Video loading started:", videoUrl);
                      }}
                      onCanPlay={() => {
                        console.log("Video can play:", videoUrl);
                      }}
                    >
                      <source src={videoUrl} type="video/mp4" />
                      <source src={videoUrl} type="video/webm" />
                      <source src={videoUrl} type="video/ogg" />
                      Your browser does not support the video tag.
                    </video>
                  )}
                </div>
              ) : null;
            })()}

            {/* CTA (Call-to-Action) */}
            {userProfile?.cta?.enabled && (
              <div className="flex justify-center mb-6 gap-8">
                {userProfile.cta.ctaType === "CALL" && (
                  <a
                    href={`tel:${userProfile.cta?.ctaValue}`}
                    className="cursor-pointer"
                    onClick={async () => {
                      try {
                        // Track CTA click if tracking is available
                        if (userProfile.cta?.id) {
                          await api.post(
                            `/api/v1/cta/track/${userProfile.cta.id}`,
                            null,
                            {
                              skipAuth: true,
                            }
                          );
                        }
                      } catch (err) {
                        console.error("CTA tracking failed:", err);
                      }
                    }}
                  >
                    <FaPhone
                      className={`text-xl hover:scale-110 transition-transform ${
                        template.textColor || ""
                      }`}
                    />
                  </a>
                )}
                {userProfile.cta.ctaType === "EMAIL" && (
                  <a
                    href={`mailto:${userProfile.cta?.ctaValue}`}
                    className="cursor-pointer"
                    onClick={async () => {
                      try {
                        // Track CTA click if tracking is available
                        if (userProfile.cta?.id) {
                          await api.post(
                            `/api/v1/cta/track/${userProfile.cta.id}`,
                            null,
                            {
                              skipAuth: true,
                            }
                          );
                        }
                      } catch (err) {
                        console.error("CTA tracking failed:", err);
                      }
                    }}
                  >
                    <FaEnvelope
                      className={`text-xl hover:scale-110 transition-transform ${
                        template.textColor || ""
                      }`}
                    />
                  </a>
                )}
              </div>
            )}

            {/* Social Media Icons */}
            {socialMediaLinks.length > 0 && (
              <div className="flex justify-center gap-4 text-xl mb-6">
                {socialMediaLinks.map((link) => (
                  <a
                    key={link.id || link.platform}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="cursor-pointer"
                    onClick={async (e) => {
                      // Check if the link is sensitive first
                      if (link.sensitive === true) {
                        e.preventDefault();
                        setPendingLink(link);
                        setIsAgeConfirmationOpen(true);
                        return;
                      }

                      try {
                        // ✅ Skip auth token for public link tracking
                        await api.post(`/api/v1/link/track/${link.id}`, null, {
                          skipAuth: true,
                        });
                      } catch (err) {
                        console.error("Click tracking failed:", err);
                      }
                    }}
                  >
                    {link.platform === "INSTAGRAM" && (
                      <FaInstagram className="hover:text-[#E1306C]" />
                    )}
                    {link.platform === "FACEBOOK" && (
                      <FaFacebookF className="hover:text-[#3b5998]" />
                    )}
                    {link.platform === "TWITTER" && (
                      <FaXTwitter className="hover:text-[#1DA1F2]" />
                    )}
                    {link.platform === "LINKEDIN" && (
                      <FaLinkedin className="hover:text-[#0077b5]" />
                    )}
                    {link.platform === "YOUTUBE" && (
                      <FaYoutube className="hover:text-[#FF0000]" />
                    )}
                    {link.platform === "TIKTOK" && (
                      <FaTiktok className="hover:text-[#000000]" />
                    )}
                    {link.platform === "THREADS" && (
                      <RiThreadsLine className="hover:text-[#000000]" />
                    )}
                  </a>
                ))}
              </div>
            )}

            {/* Links */}
            {regularLinks.length > 0 && (
              <div className="flex flex-col gap-3 w-full mb-10">
                {regularLinks.map((link, idx) => {
                  // Only render enabled links
                  if (!link.enabled) {
                    return null;
                  }

                  // Check if this is a Poles link
                  const isPolesLink = link.title === "Poles";

                  const buttonClasses = `font-medium text-center rounded-full h-9 flex items-center justify-center transition-all duration-200 hover:scale-105 ${
                    template.buttonStyle === "outlined" ? "border-2" : ""
                  }`;

                  const buttonStyles =
                    template?.buttonStyle === "outlined"
                      ? {
                          color: template?.buttonTextColor || "#000000",
                          backgroundColor: "transparent",
                          borderColor: template?.buttonColor || "#000000",
                          borderWidth: "2px",
                        }
                      : {
                          color: template?.buttonTextColor || "#ffffff",
                          backgroundColor: template?.buttonColor || "#000000",
                          borderColor: template?.buttonColor || "#000000",
                        };

                  return (
                    <button
                      key={idx}
                      onClick={async (e) => {
                        if (isPolesLink) {
                          // Open Poles survey modal
                          setIsSurveyModalOpen(true);
                          return;
                        }

                        // Check if the link is sensitive
                        if (link.sensitive === true) {
                          setPendingLink(link);
                          setIsAgeConfirmationOpen(true);
                          return;
                        }

                        try {
                          // ✅ Skip auth token for public link tracking
                          await api.post(`/api/v1/link/track/${link.id}`, null, {
                            skipAuth: true,
                          });
                        } catch (err) {
                          console.error("Click tracking failed:", err);
                          toast.error("Failed to track link click");
                        } finally {
                          window.open(link.url, "_blank");
                        }
                      }}
                      className={`${buttonClasses} ${
                        link.iconUrl ? "justify-between" : "justify-center"
                      } px-3`}
                      style={buttonStyles}
                    >
                      {link.iconUrl && (
                        <img
                          src={link.iconUrl}
                          alt="link icon"
                          className="h-5 w-5 object-contain"
                        />
                      )}
                      {link.title}
                      <span />
                    </button>
                  );
                })}
              </div>
            )}
          </div>
          {/* Logo - Only show if branding is not removed */}
        {userProfile?.branding?.brandingEnabled && (
          <div
            className={`flex justify-center ${
              regularLinks.length > 0 ? "mt-0" : "mt-auto"
            } flex-shrink-0`}
          >
            <img
              src={logo}
              alt="weblinqo logo"
              className="h-14 object-contain opacity-80 bg-white rounded-full p-1"
            />
          </div>
        )}
        </div>
        

        {/* Poles & Survey Modal */}
        {isSurveyModalOpen && (
          <PolesSurveyModal
            isOpen={isSurveyModalOpen}
            onClose={() => setIsSurveyModalOpen(false)}
            userProfile={userProfile}
          />
        )}

        {/* Age Confirmation Modal */}
        {isAgeConfirmationOpen && (
          <AgeConfirmationModal
            isOpen={isAgeConfirmationOpen}
            onClose={() => setIsAgeConfirmationOpen(false)}
            onConfirm={handleAgeConfirmation}
            linkTitle={pendingLink?.title || "Unknown Link"}
            linkUrl={pendingLink?.url || ""}
          />
        )}
      </div>
      </motion.div>
    </div>
  );
};

export default UserProfile;
