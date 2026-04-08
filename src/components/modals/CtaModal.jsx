import React, { useState, useEffect } from 'react';
import { FaTimes, FaPhone, FaEnvelope } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-hot-toast';
import linkApi from '../../services/linkApi';
import { MdRefresh } from 'react-icons/md';
import useLoaderStore from '../../stores/loaderStore';

const CtaModal = ({ isOpen, onClose, onCreateCta, isLoading, existingCta }) => {
  const [ctaType, setCtaType] = useState('NONE');
  const { showLoader, hideLoader } = useLoaderStore();
  const [ctaValues, setCtaValues] = useState({
    CALL: '',
    EMAIL: ''
  });

  // Load existing CTA data when modal opens
  useEffect(() => {
    if (isOpen && existingCta) {
      setCtaType(existingCta.ctaType || 'NONE');
      // Set the value for the existing CTA type
      if (existingCta.ctaType && existingCta.ctaValue) {
        setCtaValues(prev => ({
          ...prev,
          [existingCta.ctaType]: existingCta.ctaValue
        }));
      }
    } else if (isOpen && !existingCta) {
      // Reset form when opening without existing data
      setCtaType('NONE');
      setCtaValues({
        CALL: '',
        EMAIL: ''
      });
    }
  }, [isOpen, existingCta]);

  // CTA type options with labels and icons
  const ctaOptions = [
    { value: 'CALL', label: 'Call', icon: <FaPhone /> },
    { value: 'EMAIL', label: 'Email', icon: <FaEnvelope /> },
  ];

  // Handle CTA type change
  const handleCtaTypeChange = (newType) => {
    setCtaType(newType);
  };

  //  Handle input value change for the selected CTA type
  const handleCtaValueChange = (value) => {
    setCtaValues(prev => ({
      ...prev,
      [ctaType]: value
    }));
  };

  // Handle form submission
  const handleSubmit = () => {
    if (ctaType === 'NONE') {
      toast.error("Please select a CTA type");
      return;
    }
    
    const currentValue = ctaValues[ctaType];
    if (!currentValue.trim()) {
      toast.error("Please enter a value for the CTA");
      return;
    }

    onCreateCta(ctaType, currentValue.trim());
  };

  // Reset form to initial state
  const resetForm = () => {
    setCtaType('NONE');
    setCtaValues({
      CALL: '',
      EMAIL: ''
    });
  };

  // Close modal and reset form
  const handleClose = () => {
    resetForm();
    onClose();
  };

  // Delete existing CTA using API
  const handleDeleteCta = async () => {
    showLoader();
    try {
    const result = await linkApi.deleteCta()
    if (result) {
      handleClose();
    }
    } catch (error) {
      console.error("Error deleting CTA:", error);
    }finally {
      hideLoader();
    }
  };

  // Return placeholder text based on CTA type
  const getPlaceholder = () => {
    switch (ctaType) {
      case 'CALL':
        return 'Enter phone number (e.g., +1234567890)';
      case 'EMAIL':
        return 'Enter email address (e.g., contact@example.com)';
      default:
        return 'Enter value';
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        // Modal overlay
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-40 p-4"
          onClick={handleClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-white rounded-xl shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <div className='flex items-center gap-3'>
                <h2 className="text-xl font-semibold text-gray-800">
                  {existingCta ? 'Edit Call-to-Action' : 'Add Call-to-Action'}
                </h2>
                <button onClick={()=>handleDeleteCta()} className="bg-red-600 py-1 px-1.5 rounded-lg"><MdRefresh className="text-size-16 text-white"/></button>
              </div>
              <button
                onClick={handleClose}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <FaTimes size={20} />
              </button>
            </div>

            {/* Content */}
            <div className="p-6 space-y-6">
              {/* CTA Type Selection */}
              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-3">Select CTA Type:</h3>
                <div className="grid grid-cols-2 gap-3">
                  {ctaOptions.map((option) => (
                    <label
                      key={option.value}
                      className={`flex items-center gap-2 p-3 border rounded-lg cursor-pointer transition-colors ${
                        ctaType === option.value
                          ? 'border-primary bg-primary/5 text-primary'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <input
                        type="radio"
                        name="ctaType"
                        value={option.value}
                        checked={ctaType === option.value}
                        onChange={(e) => handleCtaTypeChange(e.target.value)}
                        className="sr-only"
                      />
                      <span className="text-gray-600">{option.icon}</span>
                      <span className="text-sm font-medium">{option.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* CTA Value Input */}
              {ctaType !== 'NONE' && (
                <div>
                  <h3 className="text-sm font-medium text-gray-700 mb-2">Enter Value:</h3>
                  <input
                    type={ctaType === 'CALL' ? 'number' : ctaType === 'EMAIL' ? 'email' : 'text'}
                    value={ctaValues[ctaType]}
                    onChange={(e) => {
                      let value = e.target.value;
                      if (ctaType === 'CALL') {
                        value = value.replace(/\D/g, ''); //Remove non digit characters
                        if (value.length > 12) value = value.slice(0, 12)
                      }
                      handleCtaValueChange(value)}
                    }
                    placeholder={getPlaceholder()}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent if (value.length > 12) value = value.slice(0, 12);"
                    maxLength={ctaType === 'CALL' ? 12 : undefined}
                  />
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-3">
                <button
                  onClick={handleClose}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  disabled={isLoading}
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={
                    isLoading || 
                    ctaType === 'NONE' ||
                    !ctaValues[ctaType]?.trim()
                  }
                  className="flex-1 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <div className="flex items-center justify-center">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                      {existingCta ? 'Updating...' : 'Creating...'}
                    </div>
                  ) : (
                    existingCta ? 'Update CTA' : 'Create CTA'
                  )}
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default CtaModal;
