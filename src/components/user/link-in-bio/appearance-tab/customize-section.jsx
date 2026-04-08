import { useState, useEffect, useRef } from "react";
import { FaUpload } from "react-icons/fa";
import useUserStore from "../../../../stores/userStore";
import customizationApi from "../../../../services/customizationApi";
import userApi from "../../../../services/userApi";

const ColorPicker = ({ color, onChange, label }) => {
  // const [isOpen, setIsOpen] = useState(false);
  const [localColor, setLocalColor] = useState(color); // Local color state
  const pickerRef = useRef(null);

  // Update local color when parent prop changes
  useEffect(() => {
    setLocalColor(color);
  }, [color]);

  
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (pickerRef.current && !pickerRef.current.contains(event.target)) {
        // setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Update local color and notify parent
  const handleColorChange = (newColor) => {
    setLocalColor(newColor);
    onChange(newColor);
  };

  return (
    <div className="space-y-3">
      <label className="text-sm font-medium text-gray-700">{label}</label>
      <div className="flex items-center gap-3">
        <div className="relative" ref={pickerRef}>
          <div className="relative flex items-center justify-center">
            {/* Button showing current color */}
            <button
              className="relative flex items-center gap-2 px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
            >
              <div
                className="w-5 h-5 rounded-full border border-gray-300"
                style={{ backgroundColor: localColor }}
              />
              <span className="text-sm font-medium">{localColor}</span>
            </button>
            <input
              type="color"
              value={localColor}
              onChange={(e) => handleColorChange(e.target.value)}
              className="w-full h-10 border border-gray-300 rounded-lg cursor-pointer absolute opacity-0"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

const CustomizeSection = ({ plan }) => {
  // State variables for customization
  const [backgroundType, setBackgroundType] = useState('color');  // 'color' or 'image'
  const [backgroundColor, setBackgroundColor] = useState(''); // Hex code for background
  const [backgroundImage, setBackgroundImage] = useState(null); // URL for background imag
  const [textColor, setTextColor] = useState(); // Profile text color
  const [buttonColor, setButtonColor] = useState(''); // Button text color
  const [buttonBgColor, setButtonBgColor] = useState(''); // Button background color
  const [buttonStyle, setButtonStyle] = useState("solid"); // 'solid' or 'outlined'
  const [isSaving, setIsSaving] = useState(false); // Loading state for API calls
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);  // Track unsaved changes

  const { userProfile, updateNested } = useUserStore(); // Access user store


  // Function to fetch user profile from API
  const fetchUserProfile = async () => {
    try {
      const profileData = await userApi.fetchUserProfile();
      if (profileData) {
        // toast.success("Profile data refreshed successfully!");
      }
      return profileData;
    } catch (error) {
      console.error('Error fetching user profile:', error);
    }
    return null;
  };

  // Fetch user profile on component mount
  useEffect(() => {
    fetchUserProfile();
  }, []);

  // Initialize with current user profile values
  useEffect(() => {
    if (userProfile?.template) {
      const template = userProfile.template;
      
      // Handle background - check if it's an image URL or hex code
      if (template.background) {
        const isImageUrl = template?.background?.startsWith('http') || template?.background?.startsWith('data:');
        if (isImageUrl) {
          setBackgroundImage(template?.background);
          setBackgroundType("image");
        } else {
          setBackgroundColor(template.background);
          setBackgroundType("color");
        }
      }
      
      if (template.textColor) setTextColor(template.textColor);
      if (template.buttonTextColor) setButtonColor(template.buttonTextColor);
      if (template.buttonColor) setButtonBgColor(template.buttonColor);
      if (template.buttonStyle) setButtonStyle(template.buttonStyle);
    }
  }, [userProfile]);



  // Function to save customization to API
  const saveCustomizationToAPI = async (customizationData) => {
    try {
      setIsSaving(true);
      const payload = {
        background: customizationData.background || backgroundColor,
        textColor: customizationData.textColor || textColor,
        buttonColor: customizationData.buttonBgColor || buttonBgColor,
        buttonTextColor: customizationData.buttonTextColor || buttonColor,
        buttonStyle: customizationData.buttonStyle || buttonStyle
      };

      const success = await customizationApi.saveCustomization(payload);
      fetchUserProfile();  // Refresh user profile after saving
      if (success) {
        setHasUnsavedChanges(false); // Reset unsaved changes flag
      }
    } catch (error) {
      console.error('Error saving customization:', error);
    } finally {
      setIsSaving(false);
    }
  };

  // Function to save all current customization settings
  const saveAllCustomizations = async () => {
    await saveCustomizationToAPI({
      background: backgroundType === "image" ? backgroundImage : backgroundColor,
      textColor,
      buttonBgColor,
      buttonTextColor: buttonColor,
      buttonStyle
    });
  };

  //  Handle color changes for different customization types
  //  Updates both local state and global user store
  const handleColorChange = async (type, color) => {
    switch (type) {
      case "background":
        setBackgroundColor(color);
        updateNested("template.background", color);
        setHasUnsavedChanges(true);
        break;
      case "text":
        setTextColor(color);
        updateNested("template.textColor", color);
        setHasUnsavedChanges(true);
        break;
      case "button":
        setButtonColor(color);
        updateNested("template.buttonTextColor", color);
        setHasUnsavedChanges(true);
        break;
      case "buttonBg":
        setButtonBgColor(color);
        updateNested("template.buttonColor", color);
        setHasUnsavedChanges(true);
        break;
      default:
        break;
    }
  };

  // Handle button style change
  const handleButtonStyleChange = (style) => {
    setButtonStyle(style);
    updateNested("template.buttonStyle", style);
    setHasUnsavedChanges(true);
  };

  // Handle image upload for background
  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (file) {
      try {
        setIsSaving(true);
        
        // Upload image using common API function
        const imageUrl = await customizationApi.uploadBackgroundImage(file);
        
        if (imageUrl) {
          setBackgroundImage(imageUrl);
          setBackgroundType("image");
          updateNested("template.background", imageUrl);
          setHasUnsavedChanges(true);
        }
      } catch (error) {
        console.error('Error uploading background image:', error);
      } finally {
        setIsSaving(false);
      }
    }
  };

  // Background customization section
  const BackgroundSection = () => (
    <div className="space-y-6">
      {/* Radio buttons in same row */}
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-3">
          <input
            type="radio"
            id="bg-color"
            name="background-type"
            checked={backgroundType === "color"}
            onChange={() => {
              setBackgroundType("color");
              // Clear background image when switching to color
              // setBackgroundImage(null);
            }}
            className="w-4 h-4 text-primary"
          />
          <label htmlFor="bg-color" className="text-sm font-medium text-gray-700">
            Background Color
          </label>
        </div>

        <div className="flex items-center gap-3">
          <input
            type="radio"
            id="bg-image"
            name="background-type"
            checked={backgroundType === "image"}
            onChange={() => {
              setBackgroundType("image");
              // setBackgroundColor('');
            }}
            className="w-4 h-4 text-primary"
          />
          <label htmlFor="bg-image" className="text-sm font-medium text-gray-700">
            Background Image
          </label>
        </div>
      </div>

      {/* Content based on selected option */}
      {backgroundType === "color" && (
        <ColorPicker
          color={backgroundColor}
          onChange={(color) => handleColorChange("background", color)}
          label=""
        />
      )}

      {/* Render image upload section if background type is image */}  
      {backgroundType === "image" && (
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <button
              className={`flex items-center gap-2 px-3 py-2 border border-gray-300 rounded-lg transition-colors ${
                isSaving 
                  ? 'bg-gray-100 cursor-not-allowed opacity-50' 
                  : 'hover:bg-gray-50'
              }`}
              onClick={() => !isSaving && document.getElementById('background-image-upload').click()}
              disabled={isSaving}
            >
              {isSaving ? (
                <>
                  <div className="w-4 h-4 border-2 border-gray-400 border-t-blue-600 rounded-full animate-spin"></div>
                  Uploading...
                </>
              ) : (
                <>
                  <FaUpload className="w-4 h-4" />
                  Image
                </>
              )}
            </button>
            
            {/* Hidden file input */}
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
              id="background-image-upload"
            />

            {/* Image preview */}
            <div className="flex-1">
              <div className="w-fit h-28 border-2 p-3 border-dashed border-gray-300 rounded-lg flex items-center justify-center">
                {backgroundImage ? (
                  <img
                    src={backgroundImage}
                    alt="Background preview"
                    className="h-full rounded-sm object-contain"
                  />
                ) : (
                  <span className="text-gray-500">Upload Image</span>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div className="space-y-8">

      {/* Background Customization */}
      <div className="space-y-6 p-4 bg-offWhite rounded-lg">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">Background</h3>
        </div>
        <BackgroundSection />
      </div>

      {/* Text Color */}
      <div className="space-y-6 p-4 bg-offWhite rounded-lg">
        <h3 className="text-lg font-semibold text-gray-900">Profile Text Color</h3>
        <ColorPicker
          color={textColor}
          onChange={(color) => handleColorChange("text", color)}
          label=""
        />
      </div>

      {/* Button Colors */}
      <div className="space-y-6 p-4 bg-offWhite rounded-lg">
        <h3 className="text-lg font-semibold text-gray-900">Link Colors</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <ColorPicker
            color={buttonColor}
            onChange={(color) => handleColorChange("button", color)}
            label="Link Text Color"
          />
          <ColorPicker
            color={buttonBgColor}
            onChange={(color) => handleColorChange("buttonBg", color)}
            label="Link Background Color"
          />
        </div>
      </div>

      {/* Button Style */}
      <div className="space-y-6 p-4 bg-offWhite rounded-lg">
        <h3 className="text-lg font-semibold text-gray-900">Link Style</h3>
        <div className="flex gap-4">
          <button
            onClick={() => handleButtonStyleChange("solid")}
            className={`flex-1 py-3 px-4 rounded-full border-2 transition-all duration-200 ${
              buttonStyle === "solid"
                ? "border-blue-600 bg-blue-600 text-white shadow-md"
                : "border-gray-300 bg-white text-gray-700 hover:border-gray-400"
            }`}
          >
            <div className="flex items-center justify-center gap-2">
              <span className="font-medium">Solid</span>
            </div>
          </button>
          
          <button
            onClick={() => handleButtonStyleChange("outlined")}
            className={`flex-1 py-3 px-4 rounded-full border-2 transition-all duration-200 ${
              buttonStyle === "outlined"
                ? "border-blue-600 bg-blue-50 text-blue-600 shadow-md"
                : "border-gray-300 bg-white text-gray-700 hover:border-gray-400"
            }`}
          >
            <div className="flex items-center justify-center gap-2">
              <span className="font-medium">Outlined</span>
            </div>
          </button>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-center items-center">

        {/* Save Button */}
        {hasUnsavedChanges && (
          <button
            onClick={saveAllCustomizations}
            disabled={isSaving}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isSaving ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Saving...
              </>
            ) : (
              'Save Changes'
            )}
          </button>
        )}
      </div>
    </div>
  );
};

export default CustomizeSection;
