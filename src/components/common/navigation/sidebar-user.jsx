import { Link, useNavigate, useLocation } from "react-router-dom";
import { FaLink, FaPalette, FaChartBar, FaCog, FaCrown, FaChevronDown, FaChevronRight } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import { FiLogOut, FiX } from "react-icons/fi";
import { useState, useEffect } from "react";
import logoIcon from '../../../assets/images/logos/logo-icon.png';
import logo from '../../../assets/images/logos/gradientLogo.svg';


// Displays a small badge
const PlanBadge = ({ planRequired }) => (
  <span className="inline-flex absolute right-5 items-center gap-1 bg-primary/75 text-white text-xs px-2 py-1.5 rounded-full ml-auto">
    <FaCrown size={10} color="white" /> {planRequired}
  </span>
);

const Sidebar = ({ plan, onLogout, isCollapsed = false, isMobileMenuOpen, setIsMobileMenuOpen }) => {
  const navigate = useNavigate();
  const location = useLocation();

  // Track which dropdown sections are expanded
  const [openDropdowns, setOpenDropdowns] = useState({
    linkInBio: true, // Default to open
    digitalCard: false
  });
  
  // Sidebar sections and tab configurations
  const linkInBioTabs = [
    {
      tab: "Links",
      path: "/dashboard",
      icon: <FaLink />,
      availableForAll: true,
      description: "Manage your links and bio"
    },
    {
      tab: "Appearance",
      path: "/dashboard/appearance",
      icon: <FaPalette />,
      availableForAll: true,
      description: "Customize your profile look"
    },
    {
      tab: "Analytics",
      path: "/dashboard/analytics",
      icon: <FaChartBar />,
      premiumOnly: true,
      description: "Track link performance"
    },
  ];

  const digitalCardTabs = [
    {
      tab: "Links",
      path: "/dashboard/digital-card/links",
      icon: <FaLink />,
      availableForAll: true,
      description: "Manage your digital card links"
    },
    {
      tab: "Appearance",
      path: "/dashboard/digital-card/appearance",
      icon: <FaPalette />,
      availableForAll: true,
      description: "Customize your digital card look"
    },
    {
      tab: "Analytics",
      path: "/dashboard/digital-card/analytics",
      icon: <FaChartBar />,
      premiumOnly: true,
      description: "Track digital card performance"
    },
  ];

  const settingsTab = {
    tab: "Settings",
    path: "/dashboard/settings",
    icon: <FaCog />,
    availableForAll: true,
    description: "Account and preferences"
  };

  // Check if user can access a specific tab, Premium-only tabs are hidden for free/pro users

  const canAccessTab = (tab) => {
    if (tab.availableForAll) return true;
    if (tab.premiumOnly) return plan === "premium";
    return true;
  };

  // Toggle dropdown (expand/collapse section)

  const toggleDropdown = (dropdownName) => {
    setOpenDropdowns(prev => ({
      ...prev,
      [dropdownName]: !prev[dropdownName]
    }));
  };

  // Automatically open the dropdown that matches the current route

  useEffect(() => {
    if (digitalCardTabs.some(tab => tab.path === location.pathname)) {
      setOpenDropdowns(prev => ({ ...prev, digitalCard: true, linkInBio: false }));
    }
    if (linkInBioTabs.some(tab => tab.path === location.pathname)) {
      setOpenDropdowns(prev => ({ ...prev, linkInBio: true, digitalCard: false }));
    }
  }, [location.pathname]);

    // Renders a single tab item (Link or Locked)
    const renderTabItem = (item, isSelected) => {
      const accessible = canAccessTab(item);

     // Handles click for navigation and mobile close  
    const handleTabClick = (path, accessible) => {
      if (!accessible) return; // don't navigate if locked
      navigate(path);
      if (isMobileMenuOpen) setIsMobileMenuOpen(false);
    };
    
    return (
      <motion.div
        key={item.tab}
        // whileHover={{ scale: accessible ? 1.05 : 1 }}
        // whileTap={{ scale: accessible ? 0.95 : 1 }}
      >
        {accessible ? (
          // Accessible tab link
          <Link
            to={item.path}
            onClick={() => handleTabClick(item.path, accessible)}
            className={`w-full transition-all duration-200 ${isCollapsed
              ? 'flex justify-center items-center p-3 rounded-lg'
              : 'flex items-center gap-3 px-4 py-3 rounded-xl text-left'
              }
              ${isSelected
                ? isCollapsed
                  ? "bg-primary text-white "
                  : "bg-primary text-white border-l-4 border-primary"
                : isCollapsed
                  ? "text-gray-600  hover:bg-gray-100 border-gray-300 border-1 border"
                  : "text-gray-700 border-gray-300 border-1 border hover:bg-gray-100"
              }`}
            title={isCollapsed ? item.tab : ''}
          >
            <span className={`text-size-14 transition-all duration-300 ${isSelected
              ? 'text-white'
              : 'text-gray-600'
              }`}>
              {item.icon}
            </span>
            {!isCollapsed && (
              <span className="text-size-14">{item.tab}</span>
            )}
          </Link>
        ) : (
          // Locked (premium-only) tab
          <div
            className={`w-full transition-all relative duration-200 ${isCollapsed
              ? 'flex justify-center items-center p-3 rounded-lg'
              : 'flex items-center gap-3 px-4 py-3 rounded-xl text-left'
              } text-gray-400 cursor-not-allowed border-gray-300 border-1 border`}
            title={isCollapsed ? item.tab : ''}
          >
            <span className="text-lg transition-all duration-300 text-gray-300">
              {item.icon}
            </span>
            {!isCollapsed && (
              <div className="">
                <span className="opacity-60">{item.tab}</span>
                <PlanBadge planRequired="" />
              </div>
            )}
          </div>
        )}
      </motion.div>
    );
  };

  // Renders a collapsible dropdown section (e.g., Link in Bio / Digital Card)
  
  const renderDropdown = (title, tabs, dropdownKey) => {
    const isOpen = openDropdowns[dropdownKey];
    const hasActiveTab = tabs.some(tab => location.pathname === tab.path);
    
    return (
      <div className="space-y-3">
        {/* Dropdown Header */}
        <motion.button
          onClick={() => {
            if(isCollapsed) {
              const defaultTab = tabs[0];
              if (defaultTab) {
                navigate(defaultTab.path);
                if (isMobileMenuOpen) setIsMobileMenuOpen(!isMobileMenuOpen);
              }
            } else {
              toggleDropdown(dropdownKey)
            }
          }}
          className={`w-full transition-all duration-200 ${isCollapsed
            ? 'flex justify-center items-center p-3 rounded-lg'
            : 'flex items-center gap-3 px-4 py-3 rounded-xl text-left'
            }
            ${hasActiveTab
              ? isCollapsed
                ? "bg-primary/10 text-primary"
                : "bg-primary/10 text-primary border-l-4 border-primary"
              : isCollapsed
                ? "text-gray-600 hover:bg-gray-100 border-gray-300 border-1 border"
                : "text-gray-700 border-gray-300 border-1 border hover:bg-gray-100"
            }`}
          title={isCollapsed ? title : ''}
          // disabled={isCollapsed}
        >
          <span className={`text-size-14 transition-all duration-300 ${hasActiveTab
            ? 'text-primary'
            : 'text-gray-600'
            }`}>
            {dropdownKey === 'linkInBio' ? <FaLink /> : <FaPalette />}
          </span>
          {!isCollapsed && (
            <>
              <span className="flex-1 text-size-14">{title}</span>
              <span className={`text-size-14 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}>
                <FaChevronDown />
              </span>
            </>
          )}
        </motion.button>

        {/* Dropdown Content */}
        {!isCollapsed && (
          <AnimatePresence>
            {isOpen && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden"
              >
                <div className="ml-4 space-y-3 border-l-2 border-gray-200 pl-4">
                  {tabs.map((item) => {
                    const isSelected = location.pathname === item.path;
                    return renderTabItem(item, isSelected);
                  })}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        )}
      </div>
    );
  };

  return (
    <aside className={`h-[calc(100vh-4rem)] bg-white p-6 border-r border-gray-200 h-full flex flex-col rounded-xl transition-all duration-300 ${isCollapsed ? 'w-24' : 'w-64'
      }`}>
      {/* Logo Section */}
      <div className="mb-8 sticky top-0">
        <Link
          to="/"
          className={`flex items-center justify-center gap-2 text-2xl font-bold text-gray-900 hover:opacity-90 transition-opacity ${isCollapsed ? 'justify-center' : ''
            }`}
        >
          
          {isCollapsed && <img
            src={logoIcon}
            alt="weblinqo Logo"
            className="w-12 h-12"
          />}
          {!isCollapsed && (
            // <img
            // src={logo}
            // alt="weblinqo Logo"
            // className="h-6"
          // />
          <h1 className="text-2xl font-bold text-gray-900">Weblinqo</h1>
          )}
        </Link>

        {/* Close button for mobile sidebar */}
        {isMobileMenuOpen && <button
          type="button"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="md:hidden absolute lg:top-3 lg:right-3 md:top-3 md:right-3 right-[-0.9rem] top-[-0.9rem] z-50 bg-white p-3 rounded-full shadow-lg hover:bg-primary transition-all"
        >
          {<FiX size={20} />}
        </button>}
      </div>

      <div className="relative overflow-y-auto scrollbar-hide flex-1 flex flex-col">
        {/* Navigation */}
        <nav className="flex-1 space-y-3">
          {/* Link in Bio Dropdown */}
          {renderDropdown("Link in Bio", linkInBioTabs, "linkInBio")}
          
          {/* Digital Card Dropdown */}
          {renderDropdown("Digital Card", digitalCardTabs, "digitalCard")}
          
          {/* Settings Tab (unchanged) */}
          <div className="space-y-1">
            {renderTabItem(settingsTab, location.pathname === settingsTab.path)}
          </div>
        </nav>

        {/* Plan Status & Upgrade Section */}
        <div className=" space-y-4 mt-4">

          {
            <>
              {plan !== "premium" ? (

                isCollapsed ? <div onClick={() => navigate('/change-plan')} className="p-4 cursor-pointer bg-primary/15 rounded-xl border justify-center flex items-center border-[#e0ddd9]">
                  <FaCrown className="text-primary mt-0.5 mb-[-1px] flex-shrink-0" />
                </div> :
                  <div onClick={() => navigate('/change-plan')} className="p-4 cursor-pointer bg-primary/15 rounded-xl border border-[#e0ddd9]">
                    <div className="flex items-center gap-2 flex-col">
                      <div className="flex items-center flex-col">
                        <FaCrown className="text-primary mt-0.5 mb-[-1px] flex-shrink-0" />
                        <button
                          className=" text-xs font-medium bg-primary hover:bg-primary text-white px-3 py-1.5 rounded-full transition-colors"
                        >
                          Upgrade Now
                        </button>
                      </div>

                      <h4 className="text-size-12 font-normal text-center text-gray-900">
                        {plan === "free" ? "Upgrade to Pro or Premium" : "Upgrade to Premium"}
                      </h4>

                    </div>
                  </div>


              ) : (

                isCollapsed ? <div onClick={() => navigate('/change-plan')} className="p-4 cursor-pointer bg-primary/15 rounded-xl border justify-center flex items-center border-[#e0ddd9]">
                  <FaCrown className="text-primary mt-0.5 mb-[-1px] flex-shrink-0" />
                </div> :
                  <div onClick={() => navigate('/change-plan')} className="p-4 cursor-pointer bg-primary/15 rounded-xl border border-[#e0ddd9]">
                    <div className="flex items-center gap-2 flex-col">
                      <FaCrown className="text-primary" />

                      <h4 className="text-size-14 font-medium text-gray-900">Premium Plan Active</h4>
                      <p className="text-size-12 text-gray-600 text-center">
                        You have access to all features
                      </p>

                    </div>
                  </div>

              )}

              {/* Plan Indicator */}
              {/* <div className="pt-3 border-t border-gray-200">
                <div className={`text-xs font-medium px-2 py-1 rounded-full inline-flex items-center gap-1 ${plan === "free"
                    ? "bg-gray-100 text-gray-600"
                    : plan === "pro"
                      ? "bg-primary/20 text-gray-900"
                      : "bg-primary/30 text-gray-900"
                  }`}>
                  {plan !== "free" && <FaCrown size={10} className="text-black" />}
                  <span className="capitalize">{plan}</span>
                </div>
              </div> */}
            </>
          }
          {/* Logout Button */}
          <button
            onClick={onLogout}
            className={`w-full transition-all duration-200 ${isCollapsed
              ? 'flex justify-center items-center p-3 rounded-lg text-gray-600 hover:bg-gray-100'
              : 'flex items-center gap-2 justify-center mt-4 px-4 py-2.5 rounded-xl bg-white border border-gray-200 hover:bg-gray-50 text-gray-700'
              }`}
            title={isCollapsed ? 'Logout' : ''}
          >
            <FiLogOut className="text-lg" />
            {!isCollapsed && 'Sign Out'}
          </button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;