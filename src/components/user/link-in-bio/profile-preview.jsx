import {
  FaInstagram,
  FaFacebookF,
  FaLinkedin,
  FaPhone,
  FaEnvelope,
  FaYoutube,
  FaTiktok,
  FaPollH,
} from "react-icons/fa";
import { useState } from "react";
import logo from "../../../assets/images/logos/logo-icon.png";
import PolesSurveyModal from "../../modals/PolesSurveyModal";
import AgeConfirmationModal from "../../modals/AgeConfirmationModal";
import { RiThreadsLine } from "react-icons/ri";
import { FaXTwitter } from "react-icons/fa6";
import useUserStore from "../../../stores/userStore";

const ProfilePreview = ({ showPreview, userProfile, onClose }) => {
  const template = userProfile?.template || {};
  const links = userProfile?.links || [];
  const [isSurveyModalOpen, setIsSurveyModalOpen] = useState(false);
  const [isAgeConfirmationOpen, setIsAgeConfirmationOpen] = useState(false);
  const [pendingLink, setPendingLink] = useState(null);
  const { subscription } = useUserStore();

  // Container CSS classes with conditional background
  const containerClasses = [
    "w-full rounded-xl",
    "backdrop-blur-sm bg-opacity-90",
    template.background ? "" : "bg-gradient-to-b from-[#f8f9fa] to-[#e9ecef]",
  ].join(" ");
  
  // List of supported social platforms
  const socialLinks = ['INSTAGRAM', 'FACEBOOK', 'TWITTER', 'LINKEDIN', 'YOUTUBE', 'TIKTOK', 'THREADS'];

  // Determine background style: image or color
  const backgroundStyle =
    template?.background?.startsWith("http") ||
    template?.background?.startsWith("data:")
      ? {
          backgroundImage: `url(${template?.background})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          // backgroundAttachment: 'fixed',
        }
      : {
          backgroundColor: template?.background || "transparent",
          background: template?.background,
        };

  const handleLinkClick = (link, event) => {
    // Check if the link is sensitive
    if (link.sensitive === true) {
      event.preventDefault();
      setPendingLink(link);
      setIsAgeConfirmationOpen(true);
    }
    // If not sensitive, let the normal link behavior happen
  };

  const handleAgeConfirmation = () => {
    if (pendingLink) {
      // Open the link in a new tab after confirmation
      window.open(pendingLink.url, '_blank', 'noopener,noreferrer');
      setPendingLink(null);
    }
  };

  // Filter out social links from the main links section
  const nonSocialLinks = links.filter(link => 
    !socialLinks.includes(link.platform)
  );

  return (
    <div
      className={`${containerClasses} ${
        window.innerWidth > 768 ? "aspect-[9/16]" : "h-full"
      } w-full mx-auto`}
      style={backgroundStyle}
    >
      {/* poll floating button */}
      {userProfile?.poll?.enabled && (
        <div className="fixed bottom-4 right-4">
          <button onClick={() => setIsSurveyModalOpen(true)} className="bg-green-500 text-white px-4 py-2 rounded-full">
          <FaPollH />
          </button>
        </div>
      )}
      <div
        className={`h-full p-5 flex flex-col overflow-y-auto scrollbar-hide ${
          template?.titlePlacement || ""
        }`}
        style={{
          fontFamily: template.font || "inherit",
          color: template.textColor || "#333333",
        }}
      >
        {/* Profile Image */}
        {userProfile?.profileImage && (
          <div className="relative group mx-auto mb-4 flex-shrink-0">
            <img
              src={userProfile.profileImage}
              alt="Profile"
              className="w-24 h-24 rounded-full border-[3px] border-white shadow-lg object-cover mx-auto transition-transform group-hover:scale-105"
            />
            <div className="absolute inset-0 rounded-full border-2 border-transparent group-hover:border-primary opacity-0 group-hover:opacity-100 transition-all"></div>
          </div>
        )}

        {/* Title */}
        <h2
          className={`font-bold text-2xl text-center mb-2 flex-shrink-0 break-words ${
            template.textColor
          } ${template.titlePlacement === "top" ? "order-first" : ""}`}
        >
          {userProfile?.title || "No title provided"}
        </h2>

        {/* Bio */}
        <p
          className={`text-sm text-center mb-6 px-4 leading-relaxed flex-shrink-0 break-words ${
            template?.textColor
          } ${template.bioPlacement === "top" ? "order-first mb-4" : ""}`}
        >
          {userProfile?.bio || "No bio provided."}
        </p>

        {/* Profile Video */}
        {(() => {
          
          // Handle different video data structures
          const videoUrl = typeof userProfile?.profileVideo === 'string' 
            ? userProfile.profileVideo 
            : userProfile?.profileVideo?.url || userProfile?.profileVideo?.embedUrl;
          
          const isEnabled = typeof userProfile?.profileVideo === 'string' 
            ? true // If it's a string, assume it's enabled
            : userProfile?.profileVideo?.enabled;
          
          // Function to convert video URLs to embeddable formats
          const getEmbedUrl = (url) => {
            if (!url) return null;
            
            // YouTube URL conversion
            if (url.includes('youtube.com/watch') || url.includes('youtu.be/')) {
              const videoId = url.includes('youtube.com/watch') 
                ? url.split('v=')[1]?.split('&')[0]
                : url.split('youtu.be/')[1]?.split('?')[0];
              return videoId ? `https://www.youtube.com/embed/${videoId}` : null;
            }
            
            // Loom URL conversion
            if (url.includes('loom.com/share/')) {
              const videoId = url.split('loom.com/share/')[1]?.split('?')[0];
              return videoId ? `https://www.loom.com/embed/${videoId}` : null;
            }
            
            // Vimeo URL conversion
            if (url.includes('vimeo.com/')) {
              const videoId = url.split('vimeo.com/')[1]?.split('?')[0];
              return videoId ? `https://player.vimeo.com/video/${videoId}` : null;
            }
            
            // Direct video URL (MP4, WebM, etc.)
            if (url.match(/\.(mp4|webm|ogg|mov|avi)$/i)) {
              return url;
            }
            
            // If it's already an embed URL, return as is
            if (url.includes('/embed/')) {
              return url;
            }
            
            return null;
          };
          
          const embedUrl = getEmbedUrl(videoUrl);
          
          const isDirectFile = videoUrl?.match(/\.(mp4|webm|ogg|mov|avi)$/i);
          
          const isIframeVideo = embedUrl && !isDirectFile; 

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

        {/* Action to call button */}
        {userProfile.cta?.enabled && subscription?.planName?.toLowerCase() === 'premium' ? <div className="flex justify-center mb-6 gap-8 flex-shrink-0">
          {userProfile.cta.ctaType === 'CALL' && <a href={`tel:${userProfile.cta?.ctaValue}`}>
            <FaPhone className={`${template.textColor} cursor-pointer`} />
          </a>}
          {userProfile.cta.ctaType === 'EMAIL' && <a href={`mailto:${userProfile.cta?.ctaValue}`}>
            <FaEnvelope className={`${template.textColor} cursor-pointer`} />
          </a>}
        </div> : null}

        {/* Social Icons */}
        {subscription?.planName?.toLowerCase() !== 'free' ? <div className="flex gap-x-5 gap-y-3 max-w-sm flex-wrap text-xl mb-8 justify-center flex-shrink-0">
          {links.filter(link => socialLinks.includes(link.platform)).map((link) => (
            <a
              key={link.id || link.platform}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => handleLinkClick(link, e)}
              className="p-2 rounded-full bg-opacity-70 hover:bg-opacity-100 shadow-sm transition-all hover:-translate-y-0.5"
            >
              {link.platform === 'INSTAGRAM' && <FaInstagram
                className={`hover:text-[#E1306C] ${template.textColor}`}
              />}
              {link.platform === 'FACEBOOK' && <FaFacebookF
                className={`hover:text-[#3b5998] ${template.textColor}`}
              />}
              {link.platform === 'TWITTER' && <FaXTwitter
                className={`hover:text-[#1DA1F2] ${template.textColor}`}
              />}
              {link.platform === 'LINKEDIN' && <FaLinkedin
                className={`hover:text-[#0077b5] ${template.textColor}`}
              />}
              {link.platform === 'YOUTUBE' && <FaYoutube
                className={`hover:text-[#FF0000] ${template.textColor}`}
              />}
              {link.platform === 'TIKTOK' && <FaTiktok
                className={`hover:text-[#000000] ${template.textColor}`}
              />}
              {link.platform === 'THREADS' && <RiThreadsLine
                className={`hover:text-[#000000] ${template.textColor}`}
              />}
            </a>
          ))}
        </div> : null}

        {/* Links*/}
        {(() => {
          
          return nonSocialLinks.length > 0 && (
            <div className="flex flex-col gap-4 w-full flex-1 mt-auto">
              {nonSocialLinks.map((link, idx) => {
                // For all other links, render as normal anchor tags
                return (
                  link.enabled && <a
                    key={idx}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => handleLinkClick(link, e)}
                    className={`font-medium py-2 text-center flex-shrink-0 rounded-full min-h-9 max-h-auto flex items-center ${link.iconUrl ? "justify-between" : "justify-center"} px-3 transition-all duration-200 ${
                      template.buttonStyle === "outlined" ? "border-2" : ""
                    }`}
                    style={
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
                          }
                    }
                  >
                    {link.iconUrl && (
                      <img
                        src={link.iconUrl}
                        alt="link icon"
                        className="h-5 w-5 object-cover rounded"
                      />
                    )} 
                    <span className="text-left break-words line-clamp-2 px-5">{link.title}</span>
                    <span />
                  </a>
                );
              })}
            </div>
          );
        })()}

        {/* Logo - Only show if branding is not removed */}
        {userProfile?.branding?.brandingEnabled && (
          <div className={`flex justify-center ${nonSocialLinks.length > 0 ? "mt-4" : "mt-auto"} flex-shrink-0`}>
            <img
              src={logo}
              alt="weblinqo logo"
              className="h-14 object-contain opacity-80 bg-white rounded-full p-1 shadow-lg"
            />
          </div>
        )}
      </div>
      {/* </div> */}

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
           linkTitle={pendingLink?.title || 'Unknown Link'}
           linkUrl={pendingLink?.url || ''}
         />
       )}
    </div>
  );
};

export default ProfilePreview;
