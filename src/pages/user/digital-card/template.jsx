
import { FaFacebookF, FaLinkedinIn, FaYoutube, FaHome, FaEnvelope, FaPhone, FaGlobe, FaCrown, FaCheck, FaLock } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import logo from '../../../assets/images/logos/logo-icon.png'
import Avatar from "../../../assets/avatar.jpg";
import { motion } from "framer-motion";

// Badge component to display template access level
const PlanBadge = ({ level }) => {
  const getBadgeStyle = () => {
    switch (level) {
      case "FREE":
        return "bg-green-100 text-green-800";
      case "PRO":
        return "bg-primary/30 text-gray-200";
      case "PREMIUM":
        return "bg-primary text-white";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <span
      className={`inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-full ${getBadgeStyle()}`}
    >
      {level === "FREE" ? null : <FaCrown size={10} />}
      {level}
    </span>
  );
};

const DgTemplate = ({ template, plan, selectedTemplate, handleSelect }) => {
  // Determine if template is locked based on user's plan
  const isLocked =
  (plan === "free" && template.accessLevel !== "FREE") ||
  (plan === "pro" && template.accessLevel === "PREMIUM");
  
  return (
          <motion.div
          key={template.id}
                whileHover={{ scale: !isLocked ? 1.02 : 1 }}
                whileTap={{ scale: !isLocked ? 0.98 : 1 }}
                // onClick={() => !isLocked && handleSelect(template)}
                className={`relative rounded-xl overflow-hidden shadow-lg transition-all duration-300 ${
                  isLocked
                    ? "cursor-not-allowed"
                    : "cursor-pointer hover:shadow-xl"
                } ${
                  selectedTemplate === template.id
                    ? "ring-2 ring-primary shadow-md"
                    : "border border-gray-200"
                }`}
                style={{
                  backgroundColor:
                    template.backgroundColor ??
                    template.background ??
                    "#ffffff",
                  backgroundImage: template.backgroundImageUrl
                    ? `url(${template.backgroundImageUrl})`
                    : undefined,
                  background:
                    template.background ?? template.backgroundColor,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                  fontFamily: template.font || "inherit",
                  color: template.textColor || "#333333",
                  aspectRatio: "9/16",
                  minHeight: "320px",
                }}
            >
               {/* Clickable area for selecting template */}
            <div onClick={() => !isLocked && handleSelect(template)} style={{aspectRatio: "9/16",
              minHeight: "320px", backgroundColor: `${template?.bottomBgColor}`}} className="cursor-pointer relative rounded-xl shadow-lg overflow-hidden flex flex-col">
               {/* Lock Overlay for restricted templates */}
              {isLocked && (
                <div className="absolute inset-0 bg-black/50 backdrop-blur-sm flex flex-col items-center justify-center p-4 z-10 cursor-not-allowed">
                  <div className="bg-white/10 p-3 rounded-full mb-3">
                    <FaLock className="text-white" size={20} />
                  </div>
                  <span className="text-white font-medium text-center">
                    {template.accessLevel} template
                  </span>
                  <span className="text-white/80 text-sm text-center mt-1">
                    Upgrade to unlock
                  </span>
                  <button className="mt-3 bg-primary hover:bg-primary text-black px-4 py-1.5 rounded-full text-sm font-medium">
                    Upgrade Now
                  </button>
                </div>
              )}  
              {/* Top Section */}
              <div style={{background: `${template?.upperBgColor}`}} className='text-center flex flex-col items-center p-6 py-8 rounded-t-xl relative'>
                <div className="absolute top-3 left-3">
                  <PlanBadge level={template.accessLevel} />
                </div>

                <div
                  className={`absolute top-3 right-3 w-6 h-6 rounded-full flex items-center justify-center ${
                    selectedTemplate === template.id
                      ? "bg-primary text-black"
                      : "bg-white/80 text-gray-600"
                  }`}
                >
                  {selectedTemplate === template.id && <FaCheck size={12} />}
                </div>

                <img
                  src={Avatar}
                  alt="Profile"
                  className="w-20 h-20 rounded-full object-cover mx-auto border-2 border-white hover:scale-105 transition-transform"
                />
                <h2 style={{color: `${template?.textColor}`}} className="font-bold text-size-14 mt-3">
                  Livia Schleifer
                </h2>
      
                {/* Social Links */}
                <div className="absolute flex justify-center gap-4 bottom-[-10px]">
                  <a
                    href="/#"
                    className="bg-white p-1 rounded-full shadow hover:scale-105 transition"
                  >
                    <FaFacebookF className="text-blue-600 text-size-12" />
                  </a>
                  <a
                    href="/#"
                    className="bg-white p-1 rounded-full shadow hover:scale-105 transition"
                  >
                    <FaLinkedinIn className="text-blue-700 text-size-12" />
                  </a>
                  <a
                    href="/#"
                    className="bg-white p-1 rounded-full shadow hover:scale-105 transition"
                  >
                    <FaXTwitter className="text-black text-size-12" />
                  </a>
                  <a
                    href="/#"
                    className="bg-white p-1 rounded-full shadow hover:scale-105 transition"
                  >
                    <FaYoutube className="text-red-600 text-size-12" />
                  </a>
                </div>
              </div>
      
              {/* Contact Info */}
              <div style={{background: `${template?.bottomBgColor}`}} className='flex-1 flex flex-col'>
                <div className="pb-1 pt-8 px-4 space-y-3 flex-1">
                  <div className="flex items-start gap-3 bg-white p-2 rounded-lg shadow">
                    <span className="flex items-center justify-center w-4 h-4"><FaHome className="text-blue-600 text-size-14" /></span>
                    <span className="text-size-12 text-gray-700">
                      Address
                    </span>
                  </div>
                  <div className="flex items-start gap-3 bg-white p-2 rounded-lg shadow">
                    <span className="flex items-center justify-center w-4 h-4 mt-0.5"><FaEnvelope className="text-blue-600 text-size-14" /></span>
                    <span className="text-size-12 text-gray-700 text-wrap break-words flex-1 min-w-0">
                      Email
                    </span>
                  </div>
                </div>
      
                {/* Footer */}
                <div className="py-3 px-4 justify-center items-center flex">
                  <img src={logo} className="h-8"/>
                </div>
              </div>
            </div>
          </motion.div>
  )
}

export default DgTemplate