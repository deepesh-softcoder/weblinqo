import React from "react";
import { FaLink, FaInstagram, FaFacebookF, FaTiktok, FaLock, FaYoutube, FaLinkedin } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import { RiThreadsLine } from "react-icons/ri";

// Returns the corresponding React icon component for a given platform.
// If platform is not recognized, defaults to a generic link icon.
export const getIconForPlatform = (platform) => {
  const map = {
    CUSTOM_LINK: <FaLink className="text-black" size={14} />,
    INSTAGRAM: <FaInstagram className="text-[#E1306C]" size={14} />,
    FACEBOOK: <FaFacebookF className="text-[#3b5998]" size={14} />,
    THREADS: <RiThreadsLine className="text-gray-800" size={14} />,
    TIKTOK: <FaTiktok className="text-black" size={14} />,
    YOUTUBE: <FaYoutube className="text-black" size={14} />,
    TWITTER: <FaXTwitter className="text-black" size={14} />,
    LINKEDIN: <FaLinkedin className="text-black" size={14} />,
  };

  // Use optional chaining to safely handle null/undefined platforms and convert to uppercase
  return map[platform?.toUpperCase()] || map.CUSTOM_LINK;
};

//  A small badge component used to indicate plan restrictions or special features.
export const PlanLimitBadge = ({ message, icon = <FaLock size={12} /> }) => (
  <span className="inline-flex items-center gap-1 bg-offWhite text-gray-700 text-xs px-2 py-1 rounded-full border border-[#e0ddd9]">
    {icon} {message}
  </span>
);


