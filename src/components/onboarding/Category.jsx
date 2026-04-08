import { useState } from "react";
import { motion } from "framer-motion";
import Typography from "../shared/typography";
import Input from "../shared/input";

const Category = ({ category, setCategory, saving }) => {
  const [otherText, setOtherText] = useState("");
  const [isOtherSelected, setIsOtherSelected] = useState(false);

  // Updates the "Other" input text and syncs it with the parent category state
  const handleOtherChange = (e) => {
    const value = e.target.value;
    setOtherText(value);
    setCategory(value);
  };

  // Handles selection of a category button
  const handleCategorySelect = (item) => {
    if (item === "Other") {
      setIsOtherSelected(true);
      setCategory(otherText || "");
    } else {
      setIsOtherSelected(false);
      setCategory(item);
    }
  };

  // categories options
  const categories = [
    "Creator & Influencer",
    "Ecommerce & Retail",
    "Beauty & Wellness",
    "Real Estate",
    "Other"
  ];

  return (
    <div className="space-y-6">
      <div className="space-y-1 text-center">
        <Typography variant="p" className="text-gray-600">
          This helps us customize your weblinqo experience
        </Typography>
      </div>

      {/* Category Buttons */}
      <div className="space-y-3">
        {categories.map((item) => (
          <motion.button
            key={item}
            whileTap={{ scale: 0.98 }}
            onClick={() => !saving && handleCategorySelect(item)}
            disabled={saving}
            className={`w-full p-4 border-2 rounded-xl text-left transition-all ${
              (item === "Other" && isOtherSelected) || category === item
                ? "border-primary bg-[#f8faf3]"
                : "border-gray-200 hover:border-primary/50 hover:bg-[#f8faf3]/50"
            } ${saving ? "opacity-70 cursor-not-allowed" : ""}`}
            type="button"
          >
            <Typography variant="h4" className="font-semibold text-gray-900">{item}</Typography>
          </motion.button>
        ))}

         {/* Input field for "Other" category */}    
        {(isOtherSelected || (!categories.includes(category) && category)) && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="mt-4">
              <Input
                label="Please specify"
                id="otherCategory"
                type="text"
                value={otherText}
                onChange={handleOtherChange}
                placeholder="Enter your business category"
                disabled={saving}
              />
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Category;
