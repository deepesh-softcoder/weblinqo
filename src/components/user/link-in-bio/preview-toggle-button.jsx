// PreviewToggleButton.js
import { FaChevronLeft } from "react-icons/fa";
import { FiEye, FiEyeOff } from "react-icons/fi";

const PreviewToggleButton = ({ showPreview, setShowPreview }) => {
  return (
    <button
      onClick={() => setShowPreview(!showPreview)}
      className={`
        fixed z-30 right-0 top-1/2 transform -translate-y-1/2
        bg-white p-3 rounded-l-lg shadow-lg
        border border-r-0 border-gray-200
        hover:bg-[#e8ffb7] transition-all duration-300 ease-in-out
        ${showPreview ? "-translate-x-[300px]" : "translate-x-0"}
      `}
      aria-label={showPreview ? "Hide preview" : "Show preview"}
    >
      <div className="relative w-5 h-5 flex items-center justify-center">
        <FaChevronLeft
          className={`
            text-gray-600 transition-transform duration-300
            ${showPreview ? "rotate-180 opacity-0" : "rotate-0 opacity-100"}
            group-hover:text-[#a5d64e]
          `}
        />
        {showPreview ? (
          <FiEyeOff className="absolute text-[#a5d64e]" />
        ) : (
          <FiEye className="absolute text-gray-600 group-hover:text-[#a5d64e]" />
        )}
      </div>
      <span className="sr-only">{showPreview ? "Hide preview" : "Show preview"}</span>
      
      {/* Tooltip */}
      <div className="
        absolute right-full top-1/2 transform -translate-y-1/2 mr-2
        px-2 py-1 bg-gray-800 text-white text-xs rounded
        opacity-0 group-hover:opacity-100 transition-opacity
        pointer-events-none whitespace-nowrap
      ">
        {showPreview ? "Hide Preview" : "Show Preview"}
      </div>
    </button>
  );
};

export default PreviewToggleButton;