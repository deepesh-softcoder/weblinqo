import React, { useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { MdDragIndicator } from "react-icons/md";
import { FaEdit, FaTrash, FaInstagram, FaFacebookF, FaLinkedin, FaYoutube, FaTiktok, FaCamera, FaTimes } from "react-icons/fa";
import { toast } from "react-hot-toast";
import { linkApi } from "../../../../services/linkApi";
import { userApi } from "../../../../services/userApi";
import { getIconForPlatform } from "../../../../utils/constant";
import { FaXTwitter } from "react-icons/fa6";
import Switch from "../../../common/ui/switch";
import useLoaderStore from "../../../../stores/loaderStore";

const LinkItem = ({ link, setLinks, onDeleteLink, isDraggable, features, onUpdateLink, onEditSocialLink, plan }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [form, setForm] = useState({
    title: link?.title,
    url: link?.url,
    startDate: link?.startDate ? new Date(link?.startDate).toISOString().slice(0, 10) : "",
    endDate: link?.endDate ? new Date(link?.endDate).toISOString().slice(0, 10) : "",
  });
  const fileInputRef = useRef(null);
  const [customIcon, setCustomIcon] = useState(null);
  const [customIconUrl, setCustomIconUrl] = useState(link?.iconUrl || "");
  const [isUploadingIcon, setIsUploadingIcon] = useState(false);
  const { showLoader, hideLoader } = useLoaderStore();

  // Upload Custom Icon
  const handleIconUpload = async (file) => {
    // console.log("file", file);
    if (!file) return;
    try {
      setIsUploadingIcon(true);
      const result = await linkApi.uploadLinkIcon(file);
      if (result && result.iconUrl) {
        setCustomIconUrl(result?.iconUrl);
      } else {
        setCustomIconUrl(result);
      }
    } catch (error) {
      console.error("Error uploading icon:", error);
    } finally {
      setIsUploadingIcon(false);
    }
  };

  // handle file selection from input
  const handleIconFileSelect = (e) => {
    console.log("e", e);
    const file = e.target.files[0];
    console.log("file", file);
    if (file) {
      setCustomIcon(file);
      handleIconUpload(file);
      if (fileInputRef.current) {
        fileInputRef.current.value = ""; // reset input
      }
    }
  };

  // toggle link visibility
  const handleToggleVisibility = async () => {
    showLoader();
    try {
      // Toggle link enabled/disabled
      const result = await linkApi?.toggleLink(link?.id, !link?.enabled);
      if (result) {
        // Fetch updated profile to refresh parent link list
        const updatedProfile = await userApi.fetchUserProfile();
        if (updatedProfile) {
          setLinks(updatedProfile.links);
        } else {
          throw new Error("Failed to fetch updated user profile");
        }
      }
    } catch (error) {
      console.error("Error toggling link visibility:", error);
      toast.error("Failed to toggle link visibility");
    } finally {
      hideLoader();
    }
  };

  // Save Edited Link 
  const saveChanges = () => {
    if (!form.title.trim() || !form.url.trim()) {
      toast.error("Title and URL are required");
      return;
    }
    // Check if scheduling feature is allowed
    if (!features?.linkScheduling && (form.startDate || form.endDate)) {
      toast.error("Link scheduling not allowed on your current plan");
      return;
    }

     // Call parent function to update link
    onUpdateLink(link?.id, {
      title: form.title,
      url: form.url,
      startDate: form.startDate ? new Date(form.startDate) : null,
      endDate: form.endDate ? new Date(form.endDate) : null,
      platform: link?.platform,
      isActive: link?.isActive,
      iconUrl: customIconUrl,
    });
    setIsEditing(false);
  };
  
  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }} 
      animate={{ opacity: 1, y: 0 }} 
      transition={{ duration: 0.2 }} 
      className="bg-offWhite rounded-lg border border-[#e0ddd9] px-4 py-3 transition-colors hover:shadow-sm"
    >
      {/* AnimatePresence allows smooth transitions between display and edit modes */}
      <AnimatePresence mode="wait">
        {isEditing ? (
          // edit mode
          <motion.div 
            key="edit-form"
            initial={{ opacity: 0, height: 0, marginTop: 0, marginBottom: 0 }} 
            animate={{ opacity: 1, height: "auto", marginTop: 16, marginBottom: 16 }} 
            exit={{ opacity: 0, height: 0, marginTop: 0, marginBottom: 0 }} 
            transition={{ duration: 0.3, ease: "easeInOut" }} 
            className="w-full space-y-2 overflow-hidden"
          >
             {/* Input fields for title and URL */}
            <input className="w-full px-2 py-1 border rounded text-sm" placeholder="Title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
            <input className="w-full px-2 py-1 border rounded text-sm" placeholder="URL" value={form.url} onChange={(e) => setForm({ ...form, url: e.target.value })} />
             {/* Input fields for title and URL */}
            {link?.platform === "CUSTOM_LINK" && (
              <div className="space-y-1">
                <label className="text-xs text-gray-500">Custom Icon (Optional)</label>
                <div className="flex items-center gap-2">
                  <label className="cursor-pointer">
                    <input type="file" accept="image/*" ref={fileInputRef} onChange={handleIconFileSelect} className="hidden" disabled={isUploadingIcon} />
                    <div className={`flex items-center gap-2 px-2 py-1 border border-gray-200 rounded text-xs hover:bg-gray-50 transition-colors ${isUploadingIcon ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}>
                      <FaCamera className="text-gray-400 text-xs" />
                      <span className="text-gray-600">{isUploadingIcon ? "Uploading..." : customIcon ? customIcon.name : "Upload Icon"}</span>
                      {isUploadingIcon && <div className="w-3 h-3 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>}
                    </div>
                  </label>
                   {/* Input fields for title and URL */}
                  <div className="flex items-center gap-1">
                    {[
                      { name: "Instagram", icon: <FaInstagram className="text-[#E1306C]" size={12} />, url: "https://cdn-icons-png.flaticon.com/512/174/174855.png" },
                      { name: "Facebook", icon: <FaFacebookF className="text-[#3b5998]" size={12} />, url: "https://cdn-icons-png.flaticon.com/512/124/124010.png" },
                      { name: "Twitter", icon: <FaXTwitter className="text-[#1DA1F2]" size={12} />, url: "https://cdn-icons-png.flaticon.com/512/124/124021.png" },
                      { name: "LinkedIn", icon: <FaLinkedin className="text-[#0077B5]" size={12} />, url: "https://cdn-icons-png.flaticon.com/512/174/174857.png" },
                      { name: "YouTube", icon: <FaYoutube className="text-[#FF0000]" size={12} />, url: "https://cdn-icons-png.flaticon.com/512/174/174883.png" },
                      { name: "TikTok", icon: <FaTiktok className="text-black" size={12} />, url: "https://cdn-icons-png.flaticon.com/512/3046/3046120.png" },
                    ].map((social, index) => (
                      <button key={index} onClick={() => { if (!isUploadingIcon) { setCustomIconUrl(social.url); } }} disabled={isUploadingIcon} className={`p-1 rounded border border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-colors ${isUploadingIcon ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`} title={`Use ${social.name} icon`}>
                        {social.icon}
                      </button>
                    ))}
                  </div>
                  {/* Show preview of selected icon with remove button */}
                  {customIconUrl && (
                    <div className="flex items-center gap-1">
                      <img src={customIconUrl} alt="Custom Icon" className="w-4 h-4 rounded object-cover" />
                      <button onClick={() => { setCustomIcon(null); setCustomIconUrl(""); }} className="text-red-500 hover:text-red-600 transition-colors" title="Remove icon">
                        <FaTimes size={10} />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}
            {/* Date scheduling inputs */}
            <div className="flex gap-2">
              <input type="date" className="w-full px-2 py-1 border rounded text-sm" value={form.startDate} onChange={(e) => setForm({ ...form, startDate: e.target.value })} disabled={!features?.linkScheduling} />
              <input type="date" className="w-full px-2 py-1 border rounded text-sm" value={form.endDate} onChange={(e) => setForm({ ...form, endDate: e.target.value })} disabled={!features?.linkScheduling} />
            </div>
            {/* Save and Cancel buttons */}
            <div className="flex gap-2">
              <button className="text-sm text-white bg-black px-3 py-1 rounded hover:bg-primary" onClick={saveChanges}>Save</button>
              <button className="text-sm text-gray-600 border px-3 py-1 rounded hover:bg-gray-100" onClick={() => { setIsEditing(false); setCustomIcon(null); setCustomIconUrl(link.iconUrl || ""); }}>Cancel</button>
            </div>
          </motion.div>
        ) : (
          // display mode
          <motion.div 
            key="link-display"
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }} 
            transition={{ duration: 0.2 }}
            className="flex items-center justify-between gap-2"
          >
            {/* Drag indicator */}
            <div className={`text-black ${isDraggable ? "cursor-grab" : "opacity-40 cursor-not-allowed"}`} title={isDraggable ? "Drag to reorder" : "Reordering not allowed on current plan"}>
              <MdDragIndicator size={20} />
            </div>
            {/* Link icon (custom icon or platform icon) */}
            <div className="flex-shrink-0">{link?.iconUrl ? <img src={link?.iconUrl} alt="Custom Icon" className="w-4 h-4 rounded object-cover" /> : getIconForPlatform(link?.platform)}</div>
            {/* Link title */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <p className="font-medium text-sm text-blue-600 truncate lg:max-w-[30rem] md:max-w-[20rem] max-w-[6rem]">{link?.title}</p>
              </div>
            </div>
            {/* Visibility toggle */}
              <div className="flex-shrink-0">
                <Switch
                  checked={link?.enabled !== false}
                  onChange={handleToggleVisibility}
                  ariaLabel={`${link?.enabled !== false ? "Hide" : "Show"} ${link?.title}`}
                />
              </div>
            {/* Edit button */}
            <motion.button whileTap={{ scale: 0.97 }} onClick={() => { const isSocialLink = ["INSTAGRAM", "FACEBOOK", "TWITTER", "LINKEDIN", "YOUTUBE", "TIKTOK", "THREADS"].includes(link?.platform); if (isSocialLink && onEditSocialLink) { onEditSocialLink(link); } else { setIsEditing(true); } }} className="p-1 text-black hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-primary hover:bg-gray-100 active:scale-95 rounded-full transition-all duration-150" aria-label={`Edit ${link?.title}`} tabIndex={0}>
              <FaEdit size={16} />
            </motion.button>
            
             {/* Delete button */}
              <button onClick={() => onDeleteLink(link.id)} className="p-1 text-red-500 hover:text-red-600 focus:outline-none focus:ring-2 focus:ring-red-200 hover:bg-gray-100 active:scale-95 rounded-full transition-all duration-150" aria-label={`Delete ${link?.title}`} tabIndex={0}>
                <FaTrash size={16} />
              </button>
            
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default LinkItem;


