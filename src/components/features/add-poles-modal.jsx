import { useState, useEffect } from "react";
import { FiX, FiTrash2, FiPlus } from "react-icons/fi";
import { createPoll, deletePoll } from "../../services/polesAPI";
import { MdRefresh } from "react-icons/md";
import useLoaderStore from "../../stores/loaderStore";

const AddPolesModal = ({ isOpen, onClose, onSubmit, pollsData = null }) => {
  const [question, setQuestion] = useState("");
  const [options, setOptions] = useState([
    { id: 1, text: "" },
    { id: 2, text: "" }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const { showLoader, hideLoader } = useLoaderStore();

  // Initialize form with existing poll data when editing
  useEffect(() => {
    if (pollsData && isOpen) {
      setIsEditing(true);
      setQuestion(pollsData.question || "");
      
      // Map existing options to the form format
      if (pollsData.options && pollsData.options.length > 0) {
        const mappedOptions = pollsData.options.map((opt, index) => ({
          id: opt.id || index + 1, // Use the actual option ID if available
          text: opt.text || ""
        }));
        setOptions(mappedOptions);
      } else {
        // Fallback to default options if no existing options
        setOptions([
          { id: 1, text: "" },
          { id: 2, text: "" }
        ]);
      }
    } else {
      setIsEditing(false);
      setQuestion("");
      setOptions([
        { id: 1, text: "" },
        { id: 2, text: "" }
      ]);
    }
  }, [pollsData, isOpen]);


  // Validation function to check if form is valid
  const isFormValid = () => {
    const hasQuestion = question.trim() !== "";
    const hasEnoughOptions = options.length >= 2;
    const allOptionsFilled = options.every(opt => opt.text.trim() !== "");
    
    return hasQuestion && hasEnoughOptions && allOptionsFilled;
  };

  // Add a new option to the poll
  const handleAddOption = () => {
    const newId = Math.max(...options.map(opt => opt.id)) + 1;
    setOptions([...options, { id: newId, text: "" }]);
  };

  // Update option text
  const handleOptionChange = (id, value) => {
    setOptions(options.map(opt => 
      opt.id === id ? { ...opt, text: value } : opt
    ));
  };

  // Remove an option (minimum 2 options)
  const handleRemoveOption = (id) => {
    if (options.length > 2) {
      setOptions(options.filter(opt => opt.id !== id));
    }
  };

  // / Submit poll data (create or update)
  const handleSubmit = async () => {
    if (!isFormValid()) return;
    
    setIsLoading(true);
    setError("");
    
    try {
      const poleData = {
        question,
        options: options.map(opt => ({ ...opt, text: opt.text.trim() }))
      };

        // Create new poll
       const  result = await createPoll(poleData);
      
      if (result) {
        // Call the onSubmit callback with the API result
        onSubmit(result);
        handleClose();
      }
    } catch (error) {
      setError(isEditing ? "Failed to update poll. Please try again." : "Failed to create poll. Please try again.");
      console.error("Error submitting poll:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Reset form and close modal
  const handleClose = () => {
    setQuestion("");
    setOptions([
      { id: 1, text: "" },
      { id: 2, text: "" }
    ]);
    setError("");
    setIsLoading(false);
    setIsEditing(false);
    onClose();
  };

  // Delete the existing poll
  const handleDeletePoll = async () => {
    try {
      showLoader();
    const result = await deletePoll();
    if (result) {
      onSubmit(result);
      handleClose();
    }
    } catch (error) {
      console.error("Error deleting poll:", error);
    } finally {
      hideLoader();
    }
  };

  // Render nothing if modal is closed
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center">
      {/* Overlay */}
      <div 
        className="absolute inset-0 bg-black bg-opacity-50"
        onClick={handleClose}
      />
      
      {/* Modal */}
      <div className="relative bg-offWhite rounded-xl p-6 w-full max-w-xl mx-4 h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-3">
            <h2 className="text-xl font-bold text-gray-900">
              {isEditing ? "Edit Poll" : "Add Poll"}
            </h2>
            <button disabled={isLoading || !pollsData} onClick={()=>handleDeletePoll()} className=" disabled:opacity-50 disabled:cursor-not-allowed bg-red-600 py-1 px-1.5 rounded-lg"><MdRefresh className="text-size-16 text-white"/></button>
          </div>
          <button
            onClick={handleClose}
            disabled={isLoading}
            className="w-8 h-8 bg-white-500 text-grey-400 rounded-full flex items-center justify-center hover:bg-white-600 shadow-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <FiX size={16} />
          </button>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-700 text-sm">{error}</p>
          </div>
        )}

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto scrollbar-hide" style={{ scrollBehavior: 'smooth' }}>
          {/* Question Section */}
          <div className="mb-6 p-1.5">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Question <span className="text-red-500">*</span>
            </label>
            <textarea
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="Add your question"
              disabled={isLoading}
              className="w-full h-24 px-3 py-2 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
            />
          </div>

          {/* Options Section */}
          <div className="mb-6 p-1.5">
            {options.map((option, index) => (
              <div key={option.id} className="mb-3">
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Option {index + 1} <span className="text-red-500">*</span>
                  </label>
                  {options.length > 2 && (
                    <button
                      onClick={() => handleRemoveOption(option.id)}
                      disabled={isLoading}
                      className="p-1 text-red-500 hover:text-red-700 hover:bg-red-50 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      title="Remove option"
                    >
                      <FiTrash2 size={14} />
                    </button>
                  )}
                </div>
                <input
                  type="text"
                  value={option.text}
                  onChange={(e) => handleOptionChange(option.id, e.target.value)}
                  disabled={isLoading}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
                  placeholder={`Option ${index + 1}`}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Action Buttons - Fixed at bottom */}
        <div className="flex justify-between pt-4 border-t border-gray-200">
          <button
            onClick={handleAddOption}
            disabled={isLoading}
            className="px-4 py-2 text-sm font-medium text-gray-700 flex items-center justify-center bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <FiPlus className="mr-1 font-bold" size={16} /> <span className="text-sm">Add more</span>
          </button>

          <button
            onClick={handleSubmit}
            disabled={!isFormValid() || isLoading}
            className={`px-6 py-2 text-sm font-medium rounded-lg transition-colors flex items-center justify-center ${
              isFormValid() && !isLoading
                ? "text-white bg-blue-500 hover:bg-blue-600" 
                : "text-gray-400 bg-gray-300 cursor-not-allowed"
            }`}
          >
            {isLoading ? (
                              <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  {isEditing ? "Updating..." : "Creating..."}
                </>
              ) : (
                isEditing ? "Update" : "Submit"
              )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddPolesModal;
