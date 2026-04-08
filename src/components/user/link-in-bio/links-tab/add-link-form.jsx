import React, { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaExclamationTriangle, FaInstagram, FaFacebookF, FaLinkedin, FaYoutube, FaTiktok, FaCamera, FaTimes } from "react-icons/fa";
import { toast } from "react-hot-toast";
import { linkApi } from "../../../../services/linkApi";
import { PlanLimitBadge } from "../../../../utils/constant";
import { FaXTwitter } from "react-icons/fa6";

const AddLinkForm = ({ onAddLink, features, linksCount, plan }) => {
  const [newLinkName, setNewLinkName] = useState("");
  const [newLinkUrl, setNewLinkUrl] = useState("");
  const fileInputRef = useRef(null);
  // const [selectedPlatform, setSelectedPlatform] = useState("CUSTOM_LINK");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [isMaxLinksReached, setIsMaxLinksReached] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [customIcon, setCustomIcon] = useState(null);
  const [customIconUrl, setCustomIconUrl] = useState("");
  const [isUploadingIcon, setIsUploadingIcon] = useState(false);


  // Effect to check if the maximum number of links for the plan is reached
  useEffect(() => {
    if (plan) {
      let maxLinks;
      const planType = plan.toLowerCase();
      
      if (planType === 'free') {
        maxLinks = 5;
      } else if (planType === 'pro' || planType === 'premium') {
        maxLinks = Infinity; // Unlimited
      } else {
        // Fallback to features.maxLinks if plan type is not recognized
        const isUnlimited = features?.maxLinks?.toLowerCase() === "unlimited";
        maxLinks = isUnlimited ? Infinity : parseInt(features?.maxLinks) || 5;
      }
      
      setIsMaxLinksReached(linksCount >= maxLinks);
    }
  }, [plan, features, linksCount]);

  // Upload custom icon to server
  const handleIconUpload = async (file) => {
    if (!file) return;
    try {
      setIsUploadingIcon(true);
      const result = await linkApi.uploadLinkIcon(file);
      if (result && result?.iconUrl) {
        setCustomIconUrl(result?.iconUrl);
      }
    } catch (error) {
      console.error("Error uploading icon:", error);
      toast.error(error?.response?.data?.message);
    } finally {
      setIsUploadingIcon(false);
    }
  };

  // Handle file selection from input
  const handleIconFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      setCustomIcon(file);
      handleIconUpload(file);
      if (fileInputRef.current) {
        fileInputRef.current.value = ""; // reset input
      }
    }
  };

  // Add new link and reset form
  const handleAddLink = () => {
    if (!newLinkName.trim() || !newLinkUrl.trim()) return;
    if (isMaxLinksReached) return;
    onAddLink({
      title: newLinkName,
      url: newLinkUrl,
      platform: "CUSTOM_LINK",
      startDate: startDate ? new Date(startDate) : null,
      endDate: endDate ? new Date(endDate) : null,
      iconUrl: customIconUrl,
    });

     // Reset form state
    setNewLinkName("");
    setNewLinkUrl("");
    setStartDate("");
    setEndDate("");
    setCustomIcon(null);
    setCustomIconUrl("");
    setIsFormOpen(false);
  };

  // Open form if max links not reached
  const handleOpenForm = () => {
    if (isMaxLinksReached) return;
    setIsFormOpen(true);
  };

  //  Close form and reset state
  const handleCloseForm = () => {
    setIsFormOpen(false);
    setNewLinkName("");
    setNewLinkUrl("");
    setStartDate("");
    setEndDate("");
    setCustomIcon(null);
    setCustomIconUrl("");
    if (fileInputRef.current) {
      fileInputRef.current.value = ""; // reset input
    }
    };

  return (
    <div className="max-w-3xl mx-auto space-y-4">
       {/* Button to open Add Link form */}
      <motion.button whileTap={{ scale: 0.97 }} onClick={handleOpenForm} disabled={isMaxLinksReached} className={`w-full bg-primary text-white font-bold py-4 px-6 rounded-lg hover:bg-blue-700 transition-colors ${isMaxLinksReached ? "opacity-50 cursor-not-allowed" : ""}`}>
        Add New Links
      </motion.button>
      <AnimatePresence>
        {/* Animated form */}
        {isFormOpen && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.3 }} className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
            <div className="lg:p-6 md:p-6 p-3 space-y-4">
              {/* Max links warning */}
              {isMaxLinksReached && (
                <div className="p-3 bg-offWhite text-gray-700 rounded-lg flex items-start gap-2 border border-[#e0ddd9]">
                  <FaExclamationTriangle className="mt-0.5 flex-shrink-0" />
                  <p className="text-sm">
                    You've reached the maximum number of links ({plan?.toLowerCase() === 'free' ? '5' : features?.maxLinks}) allowed on your plan.
                    <a href="/pricing" className="ml-1 font-medium underline hover:text-black">Upgrade to add more</a>
                  </p>
                </div>
              )}
              {/* Link Name and URL Inputs */}
              <div className="grid lg:grid-cols-2 md:grid-cols-2 grid-cols-1 gap-3">
                <input type="text" placeholder="Links Name" value={newLinkName} onChange={(e) => setNewLinkName(e.target.value)} className="w-full border border-gray-200 rounded-lg px-3 py-3 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500" disabled={isMaxLinksReached} />
              <input type="url" placeholder="URL (http:" value={newLinkUrl} onChange={(e) => setNewLinkUrl(e.target.value)} className="w-full border border-gray-200 rounded-lg px-3 py-3 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500" disabled={isMaxLinksReached} />

              </div>
              {/* {selectedPlatform === "CUSTOM_LINK" && ( */}
              {/* Custom Icon Upload / Social Icon Selection */}
                <div className="space-y-2">
                  <label className="text-sm font-normal text-gray-400">Custom Icon (Optional)</label>
                  <div className="flex lg:flex-row md:flex-row flex-col items-center gap-3">
                   {/* File Upload */}
                    <label className="cursor-pointer">
                      <input type="file" accept="image/*" ref={fileInputRef} onChange={handleIconFileSelect} className="hidden" disabled={isMaxLinksReached || isUploadingIcon} />
                      <div className={`flex items-center gap-2 px-3 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors ${isMaxLinksReached || isUploadingIcon ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}>
                        <FaCamera className="text-gray-400 text-sm" />
                        <span className="text-sm text-gray-600">{isUploadingIcon ? "Uploading..." : customIcon ? customIcon.name : "Upload Icon"}</span>
                        {isUploadingIcon && <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>}
                      </div>
                    </label>
                    <span className="lg:hidden md:hidden block text-xs text-gray-500">or choose:</span>
                    <div className="flex items-center gap-2">
                      <span className="lg:block md:block hidden text-xs text-gray-500">or choose:</span>
                      {/* Social Icon Presets */}
                      <div className="flex items-center gap-1">
                        {[
                          { name: "Instagram", icon: <FaInstagram className="text-[#E1306C]" size={16} />, url: "https://cdn-icons-png.flaticon.com/512/174/174855.png" },
                          { name: "Facebook", icon: <FaFacebookF className="text-[#3b5998]" size={16} />, url: "https://cdn-icons-png.flaticon.com/512/124/124010.png" },
                          { name: "Twitter", icon: <FaXTwitter className="text-[#1DA1F2]" size={16} />, url: "https://cdn-icons-png.flaticon.com/512/124/124021.png" },
                          { name: "LinkedIn", icon: <FaLinkedin className="text-[#0077B5]" size={16} />, url: "https://cdn-icons-png.flaticon.com/512/174/174857.png" },
                          { name: "YouTube", icon: <FaYoutube className="text-[#FF0000]" size={16} />, url: "https://cdn-icons-png.flaticon.com/512/174/174883.png" },
                          { name: "TikTok", icon: <FaTiktok className="text-black" size={16} />, url: "https://cdn-icons-png.flaticon.com/512/3046/3046120.png" },
                        ].map((social, index) => (
                          <button key={index} onClick={() => { if (!isMaxLinksReached && !isUploadingIcon) { setCustomIconUrl(social.url); } }} disabled={isMaxLinksReached || isUploadingIcon} className={`p-2 rounded-lg border border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-colors ${isMaxLinksReached || isUploadingIcon ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`} title={`Use ${social.name} icon`}>
                            {social.icon}
                          </button>
                        ))}
                      </div>
                    </div>
                    {/* Preview / Remove Custom Icon */}
                    {customIconUrl && (
                      <div className="flex items-center gap-2">
                        <img src={customIconUrl} alt="Custom Icon" className="w-6 h-6 rounded object-cover" />
                        <button onClick={() => { setCustomIcon(null); setCustomIconUrl(""); }} className="text-red-500 hover:text-red-600 transition-colors" title="Remove icon">
                          <FaTimes size={12} />
                        </button>
                      </div>
                    )}
                  </div>
                  <p className="text-xs text-gray-500">Upload a custom icon for your link (Max 2MB, PNG, JPG, SVG) or choose from popular social icons</p>
                </div>
               {/* )} */}
               {/* Optional Link Scheduling */}
              <div className="grid lg:grid-cols-2 md:grid-cols-2 grid-cols-1 gap-3">
                <div className="relative">
                  <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} disabled={!features?.linkScheduling || isMaxLinksReached} className="w-full border border-gray-200 rounded-lg px-3 py-3 text-sm disabled:opacity-50 focus:ring-2 focus:ring-blue-500 focus:border-blue-500" placeholder="DD-MM-YY" />
                  {!features?.linkScheduling && (
                    <div className="absolute -top-2 -right-2">
                      <PlanLimitBadge message="Premium" />
                    </div>
                  )}
                </div>
                <div className="relative">
                  <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} disabled={!features?.linkScheduling || isMaxLinksReached} className="w-full border border-gray-200 rounded-lg px-3 py-3 text-sm disabled:opacity-50 focus:ring-2 focus:ring-blue-500 focus:border-blue-500" placeholder="DD-MM-YY" />
                  {!features?.linkScheduling && (
                    <div className="absolute -top-2 -right-2">
                      <PlanLimitBadge message="Premium" />
                    </div>
                  )}
                </div>
              </div>
              {/* Form Actions */}
              <div className="flex gap-3">
                <motion.button whileTap={{ scale: 0.97 }} onClick={handleCloseForm} className="flex-1 bg-gray-200 text-gray-700 font-bold py-4 px-6 rounded-lg hover:bg-gray-300 transition-colors">Cancel</motion.button>
                <motion.button whileTap={{ scale: 0.97 }} onClick={handleAddLink} disabled={!newLinkName || !newLinkUrl || isMaxLinksReached} className={`flex-1 bg-primary text-white font-bold py-4 px-6 rounded-lg hover:bg-blue-700 transition-colors ${!newLinkName || !newLinkUrl || isMaxLinksReached ? "opacity-50 cursor-not-allowed" : ""}`}>Save</motion.button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default React.memo(AddLinkForm);


