import { FiX, FiAlertTriangle } from "react-icons/fi";
import Button from "../shared/button";
import Typography from "../shared/typography";

const ConfirmationModal = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  title, 
  message, 
  confirmText = "Confirm", 
  cancelText = "Cancel",
  type = "warning", // warning, danger, info
  isLoading = false 
}) => {
  // If modal is not open, render nothing
  if (!isOpen) return null;

  // Helper function to get styles based on modal type
  const getTypeStyles = () => {
    switch (type) {
      case "danger":
        return {
          iconColor: "text-red-500",
          buttonVariant: "danger",
          icon: <FiAlertTriangle className="w-6 h-6" />
        };
      case "info":
        return {
          iconColor: "text-blue-500",
          buttonVariant: "primary",
          icon: <FiAlertTriangle className="w-6 h-6" />
        };
      default: // warning
        return {
          iconColor: "text-yellow-500",
          buttonVariant: "primary", // Or custom yellow if added to Button
          icon: <FiAlertTriangle className="w-6 h-6" />
        };
    }
  };

  const typeStyles = getTypeStyles();

  // Close modal when clicking outside the modal content
  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 overflow-y-auto"
      onClick={handleBackdropClick}
    >
      <div className="flex min-h-screen items-center justify-center p-4">
        {/* Backdrop */}
        <div className="fixed inset-0 bg-black bg-opacity-50 transition-opacity" />
        
        {/* Modal */}
        <div className="relative bg-white rounded-2xl shadow-xl max-w-md w-full mx-4 transform transition-all overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-100">
            <div className="flex items-center space-x-3">
              <div className={typeStyles.iconColor}>
                {typeStyles.icon}
              </div>
              <Typography variant="h4" className="text-lg font-semibold text-gray-900">
                {title}
              </Typography>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
              disabled={isLoading}
            >
              <FiX className="w-5 h-5" />
            </button>
          </div>

          {/* Body */}
          <div className="p-6">
            <Typography variant="p" className="text-gray-600 leading-relaxed">
              {message}
            </Typography>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end space-x-3 p-6 border-t border-gray-100 bg-gray-50">
            <Button
              variant="secondary"
              size="sm"
              onClick={onClose}
              disabled={isLoading}
              className="px-6"
            >
              {cancelText}
            </Button>
            <Button
              variant={typeStyles.buttonVariant}
              size="sm"
              onClick={onConfirm}
              isLoading={isLoading}
              disabled={isLoading}
              className="px-6"
            >
              {confirmText}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;
