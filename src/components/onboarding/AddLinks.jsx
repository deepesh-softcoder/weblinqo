import { useEffect, useRef, useState } from 'react';
import { FiTrash2, FiPlus, FiExternalLink, FiLock } from 'react-icons/fi';
import { toast } from 'react-hot-toast';
import { 
  FaInstagram, 
  FaFacebookF, 
  FaTiktok,
  FaYoutube,
  FaLinkedin,
  FaCamera,
  FaTimes
} from 'react-icons/fa';
import linkApi from '../../services/linkApi';
import { FaXTwitter } from 'react-icons/fa6';


const AddLinks = ({ links = [], setLinks, setUserProfile, features }) => {
  const [isMaxLinksReached, setIsMaxLinksReached] = useState(false);
  const [isUploadingIcon, setIsUploadingIcon] = useState(false);
  const [customIcon, setCustomIcon] = useState(null);
  const fileInputRef = useRef(null);
  // console.log("links", links);

  // Uploads the selected icon file to server and updates the corresponding link
  const handleIconUpload = async (file, index) => {
    if (!file) return;
    try {
      setIsUploadingIcon(true);
      const result = await linkApi.uploadLinkIcon(file);
      if (result && result?.iconUrl) {
        // update the link at given index
        const newLinks = [...links];
        newLinks[index].iconUrl = result.iconUrl;
        setLinks(newLinks);
  
      }
    } catch (error) {
      console.error("Error uploading icon:", error);
      toast.error(error?.response?.data?.message);
    } finally {
      setIsUploadingIcon(false);
    }
  };
  
  // Triggered when a file is selected from input
  const handleIconFileSelect = (e, index) => {
    const file = e.target.files[0];
    if (file) {
      setCustomIcon(file);
      handleIconUpload(file, index); 
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  // Updates whether the user has reached the max allowed links
  useEffect(() => {
    if (features) {
      const isUnlimited = features.maxLinks.toLowerCase() === "unlimited";
      const maxLinks = parseInt(features.maxLinks);
      setIsMaxLinksReached(!isUnlimited && links.length >= maxLinks);
    }
  }, [features, links.length]);

  // Filters out future-dated links if scheduling is used, then updates user profile
  useEffect(() => {
    const today = new Date();
    const filteredLinks = links.filter(link => {
      return !link.startDate || new Date(link.startDate) <= today;
    });
    setUserProfile({ links: filteredLinks });
  }, [links, setUserProfile]);

  // Handles change to any field of a link
  const handleLinkChange = (index, field, value) => {
    if (!features?.linkScheduling && (field === 'startDate' || field === 'endDate')) {
      toast.error("Link scheduling is a premium feature. Upgrade to access this.");
      return;
    }

    const newLinks = [...links];
    newLinks[index][field] = value;
    setLinks(newLinks);
  };

  // Add a new empty link
  const addNewLink = () => {
    const max = features?.maxLinks?.toLowerCase() === 'unlimited'
      ? Infinity
      : parseInt(features?.maxLinks || '5');

    if (links.length >= max) {
      toast.error(`Maximum ${features?.maxLinks} links allowed on your current plan.`);
      return;
    }

    setLinks([
      ...links,
      {
        title: '',
        url: '',
        platform: 'CUSTOM_LINK',
        startDate: '',
        endDate: '',
        iconUrl: '',
      }
    ]);
  };

  // Remove a link by index
  const removeLink = (index) => {
    const newLinks = links.filter((_, i) => i !== index);
    setLinks(newLinks);
  };

  // Returns true if max links reached
  const isMaxReached = () => {
    if (!features) return false;
    return features.maxLinks.toLowerCase() !== 'unlimited' &&
      links.length >= parseInt(features.maxLinks);
  };

  return (
    <div className="space-y-6">
      {/* Header showing number of links used */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Your Links</h2>
        <span className="text-sm text-gray-600">
          {links.length}/{features?.maxLinks || '0'} links used
        </span>
      </div>

      {/* Show empty state if no links */}
      {links.length === 0 ? (
        <div className="bg-offWhite rounded-xl p-8 text-center border-2 border-dashed border-gray-200">
          <FiExternalLink className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-lg font-medium text-gray-800">No links added yet</h3>
          <p className="mt-1 text-sm text-gray-600">Add your first link to get started</p>
          <button
            onClick={addNewLink}
            className="mt-4 inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-full shadow-sm text-white bg-primary hover:bg-primary focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-all hover:scale-[1.02]"
          >
            <FiPlus className="mr-2" /> Add Link
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {/* Map through links */}
          {links.map((link, index) => (
            <div key={index} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                  <input
                    type="text"
                    value={link.title}
                    onChange={(e) => handleLinkChange(index, 'title', e.target.value)}
                    className="w-full px-3 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                    placeholder="e.g. My Portfolio"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">URL</label>
                  <input
                    type="url"
                    value={link.url}
                    onChange={(e) => handleLinkChange(index, 'url', e.target.value)}
                    className="w-full px-3 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                    placeholder="https://example.com"
                  />
                </div>
              </div>
              {/* Icon upload section */}
              <div className="space-y-2 my-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Custom Icon (Optional)</label>
                  <div className="flex items-start flex-col gap-3">
                    <div className="flex items-center gap-3">
                    <label className="cursor-pointer">
                      <input type="file" accept="image/*" ref={fileInputRef} onChange={(e) => handleIconFileSelect(e, index)} className="hidden" disabled={isMaxLinksReached || isUploadingIcon} />
                      <div className={`flex items-center gap-2 px-3 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors ${isMaxLinksReached || isUploadingIcon ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}>
                        <FaCamera className="text-gray-400 text-sm" />
                        <span className="text-sm text-gray-600">{isUploadingIcon ? "Uploading..." : customIcon ? customIcon.name : "Upload Icon"}</span>
                        {isUploadingIcon && <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>}
                      </div>
                    </label>
                    {link.iconUrl && (
                      <div className="flex items-center gap-2">
                        <img src={link.iconUrl} alt="Custom Icon" className="w-5 h-5 rounded object-cover" />
                        <button
                          onClick={() => {
                            const newLinks = [...links];
                            newLinks[index].iconUrl = "";
                            setLinks(newLinks);
                          }}
                          className="text-red-500 hover:text-red-600 transition-colors"
                          title="Remove icon"
                        >
                          <FaTimes size={12} />
                        </button>
                      </div>
                    )}
                    </div>
                    {/* Popular social icons */}
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-gray-500">or choose:</span>
                      <div className="flex items-center gap-1">
                        {[
                          { name: "Instagram", icon: <FaInstagram className="text-[#E1306C]" size={16} />, url: "https://cdn-icons-png.flaticon.com/512/174/174855.png" },
                          { name: "Facebook", icon: <FaFacebookF className="text-[#3b5998]" size={16} />, url: "https://cdn-icons-png.flaticon.com/512/124/124010.png" },
                          { name: "Twitter", icon: <FaXTwitter className="text-[#1DA1F2]" size={16} />, url: "https://cdn-icons-png.flaticon.com/512/124/124021.png" },
                          { name: "LinkedIn", icon: <FaLinkedin className="text-[#0077B5]" size={16} />, url: "https://cdn-icons-png.flaticon.com/512/174/174857.png" },
                          { name: "YouTube", icon: <FaYoutube className="text-[#FF0000]" size={16} />, url: "https://cdn-icons-png.flaticon.com/512/174/174883.png" },
                          { name: "TikTok", icon: <FaTiktok className="text-black" size={16} />, url: "https://cdn-icons-png.flaticon.com/512/3046/3046120.png" },
                        ].map((social, socialIndex) => (   // 👈 renamed here
                          <button
                            key={socialIndex}
                            onClick={() => {
                              if (!isMaxLinksReached && !isUploadingIcon) {
                                const newLinks = [...links];
                                newLinks[index].iconUrl = social.url;   // ✅ index = link index
                                setLinks(newLinks);
                              }
                            }}
                            className={`p-2 rounded-lg border border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-colors ${isMaxLinksReached || isUploadingIcon ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`} title={`Use ${social.name} icon`}
                          >
                            {social.icon}
                          </button>
                        ))}
                      </div>
                    </div>
                    
                  </div>
                  <p className="text-xs text-gray-500">Upload a custom icon for your link (Max 2MB, PNG, JPG, SVG) or choose from popular social icons</p>
                </div>

               {/* Start & End Date inputs */}              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div className="relative">
                  {/* Start Date */}
                  <label className="text-sm font-medium text-gray-700 mb-1 flex items-center">
                    Start Date
                    {!features?.linkScheduling && (
                      <FiLock className="ml-1 h-3 w-3 text-yellow-500" />
                    )}
                  </label>
                  <div className="relative">
                    <input
                      type="date"
                      value={link.startDate || ''}
                      onChange={(e) => handleLinkChange(index, 'startDate', e.target.value)}
                      className={`w-full px-3 py-2.5 border ${
                        !features?.linkScheduling ? 'bg-gray-50 text-gray-400' : ''
                      } border-gray-200 rounded-xl`}
                      disabled={!features?.linkScheduling}
                    />
                    {!features?.linkScheduling && (
                      <div className="absolute inset-0 flex items-center justify-end pr-3 pointer-events-none">
                        <span className="bg-yellow-50 text-yellow-700 text-xs px-2 py-0.5 rounded-md">Premium</span>
                      </div>
                    )}
                  </div>
                </div>
                <div className="relative">
                  {/* End Date */}
                  <label className="text-sm font-medium text-gray-700 mb-1 flex items-center">
                    End Date
                    {!features?.linkScheduling && (
                      <FiLock className="ml-1 h-3 w-3 text-yellow-500" />
                    )}
                  </label>
                  <div className="relative">
                    <input
                      type="date"
                      value={link.endDate || ''}
                      onChange={(e) => handleLinkChange(index, 'endDate', e.target.value)}
                      className={`w-full px-3 py-2.5 border ${
                        !features?.linkScheduling ? 'bg-gray-50 text-gray-400' : ''
                      } border-gray-200 rounded-xl`}
                      disabled={!features?.linkScheduling}
                    />
                    {!features?.linkScheduling && (
                      <div className="absolute inset-0 flex items-center justify-end pr-3 pointer-events-none">
                        <span className="bg-yellow-50 text-yellow-700 text-xs px-2 py-0.5 rounded-md">Premium</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

               {/* Remove link button */}        
              <div className="flex justify-end">
                <button
                  onClick={() => removeLink(index)}
                  className="text-red-600 hover:text-red-800 flex items-center text-sm font-medium px-4 py-2 rounded-lg hover:bg-red-50 transition-colors"
                >
                  <FiTrash2 className="mr-1.5" /> Remove
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add new link button */}                
      <button
        onClick={addNewLink}
        disabled={isMaxReached()}
        className={`w-full flex items-center justify-center px-6 py-3.5 border ${
          isMaxReached() 
            ? 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed rounded-xl' 
            : 'bg-primary text-white border-primary hover:bg-primary rounded-full font-medium transition-all hover:scale-[1.02] shadow-sm'
        }`}
      >
        <FiPlus className="mr-2" /> Add New Link
      </button>

      {/* Max links reached info */}
      {isMaxReached() && (
        <div className="bg-primary/20 border border-primary rounded-xl p-4 text-center text-sm text-gray-800">
          You've reached your link limit. <span className="font-semibold">Upgrade your plan</span> to add more links.
        </div>
      )}
    </div>
  );
};

export default AddLinks;