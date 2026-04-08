// PricingPlans.js
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FaCheckCircle, FaTimesCircle } from "react-icons/fa";
import api from "../../services/api";

// Map of feature keys from API to display names
const featureDisplayMap = {
  publicProfile: "Public Profile",
  profileImage: "Profile Image",
  customSlug: "Custom URL",
  lightDarkMode: "Dark Mode",
  bioSocialLinks: "Bio + Social Links",
  maxLinks: "Max Links",
  linkReordering: "Link Reordering",
  clickTracking: "Click Analytics",
  linkScheduling: "Link Scheduling",
  basicAnalytics: "Basic Analytics",
  advancedAnalytics: "Advanced Analytics",
  customDomain: "Custom Domain",
  removeBranding: "Remove Branding",
  prioritySupport: "Priority Support"
};

const PricingPlans = ({ planId, setPlanId, isProcessing, currentPlanId }) => {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch subscription plans
    const fetchPlans = async () => {
      try {
        setLoading(true);
        const response = await api.get("/api/v1/subscription/plans");
        setPlans(response.data.data);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load plans. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchPlans();
  }, []);

  if (loading) {
    // Show a spinner while plans are being loaded
    return (
      <div className="flex justify-center py-12">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error) {
    // Show an error message and retry button if fetching fails
    return (
      <div className="text-center py-12">
        <p className="text-[#c62828] mb-4">{error}</p>
        <button 
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-[#f8faf3] text-[#2a5a00] rounded-xl hover:bg-[#e8f5d0]"
        >
          Try Again
        </button>
      </div>
    );
  }

  // Sort plans by price ascending
  const sortedPlans = [...plans].sort((a, b) => a.price - b.price);

  return (
    <div className="py-6 px-4">
      {/* Page Header */}
      <div className="text-center mb-10">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Simple, Transparent Pricing</h2>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Choose the plan that fits your needs.
        </p>
      </div>

       {/* Plans Grid */}
      <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {sortedPlans.map((plan) => {
          const isPopular = plan.name.toLowerCase() === "pro";
          const isSelected = planId === plan.name;
          const isCurrentPlan = currentPlanId && currentPlanId.toLowerCase() === plan.name.toLowerCase();
          const featureKeys = Object.keys(plan.features || {});

          return (
            <motion.div
              key={plan.id}
              whileHover={{ y: -5 }}
              className={`relative rounded-2xl overflow-hidden border-2 ${
                isSelected 
                  ? "border-primary shadow-lg" 
                  : isCurrentPlan
                  ? "border-blue-500 shadow-lg"
                  : "border-gray-200 hover:border-primary/50"
              } ${isPopular ? "bg-[#f8faf3]" : "bg-white"}`}
            >
              {/* Popular badge */}
              {isPopular && (
                <div className="absolute top-0 right-0 bg-primary text-gray-900 text-xs text-white font-bold px-3 py-1 rounded-bl-lg">
                  POPULAR
                </div>
              )}

              {/* Current plan badge */}
              {isCurrentPlan && !isSelected && (
                <div className="absolute top-0 left-0 bg-blue-500 text-white text-xs font-bold px-3 py-1 rounded-br-lg">
                  CURRENT
                </div>
              )}

              {/* Plan content */}  
              <div 
                className="p-8 cursor-pointer"
                onClick={() => !isProcessing && setPlanId(plan.name)}
              >
                {/* Plan name & price */}
                <div className="mb-6">
                  <h3 className="text-xl font-bold text-gray-900 capitalize mb-2">
                    {plan.name}
                  </h3>
                  <div className="flex items-end">
                    <span className="text-4xl font-bold text-gray-900">
                      ${plan.price}
                    </span>
                    <span className="text-gray-500 ml-1 mb-1">/month</span>
                  </div>
                </div>

                {/* Feature list */}
                <ul className="space-y-3 mb-8">
                  {featureKeys.map((featureKey) => {
                    const featureValue = plan.features[featureKey];
                    const displayName = featureDisplayMap[featureKey] || featureKey;
                    
                    return (
                      <li key={featureKey} className="flex items-start">
                        {featureValue === true || (featureKey === 'maxLinks' && featureValue !== '0') ? (
                          <FaCheckCircle className="text-primary mt-0.5 mr-2 flex-shrink-0" />
                        ) : (
                          <FaTimesCircle className="text-[#c62828]/70 mt-0.5 mr-2 flex-shrink-0" />
                        )}
                        <span className={`text-gray-700 ${!featureValue && "opacity-70"}`}>
                          {displayName}
                          {featureKey === 'maxLinks' && featureValue !== '0' && featureValue !== true && (
                            ` (${featureValue})`
                          )}
                        </span>
                      </li>
                    );
                  })}
                </ul>

                {/* Plan action button */} 
                <button
                  className={`w-full py-3 rounded-xl font-semibold transition-all ${
                    isCurrentPlan
                      ? "bg-blue-500 text-white" : isSelected
                      ? "bg-primary text-white"
                      
                      : isPopular
                      ? "bg-primary text-white hover:bg-primary"
                      : "border-2 border-primary text-primary hover:bg-[#f8faf3]"
                  } ${isProcessing ? "opacity-70 cursor-not-allowed" : ""}`}
                >
                  {isCurrentPlan ? "Active Plan" : isSelected ? "Selected Plan" : plan.name === "Free" ? "Get Started" : "Choose Plan"}
                </button>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default PricingPlans;