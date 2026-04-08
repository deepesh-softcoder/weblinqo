// components/common/CancelMessage.jsx
import { motion, AnimatePresence } from 'framer-motion';
import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';

const CancelMessage = ({ 
  title = 'Payment Cancelled',
  description = 'Your payment was cancelled or was not completed.',
  footnote = "You'll be redirected shortly...",
  iconBgColor = 'bg-red-100',
  iconColor = 'text-red-600',
  iconSize = 'h-8 w-8',
  containerClass = 'w-full text-center',
  autoDismiss = false,
  dismissTimeout = 5000,
  onDismiss
}) => {
  const [isVisible, setIsVisible] = useState(true);

   // Effect to handle auto-dismiss
  useEffect(() => {
    if (autoDismiss) {
      const timer = setTimeout(() => {
        setIsVisible(false);
        onDismiss?.();
      }, dismissTimeout);

      return () => clearTimeout(timer);
    }
  }, [autoDismiss, dismissTimeout, onDismiss]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
          className={containerClass}
        >
          {/* Icon container */}
          <div className={`mx-auto flex items-center justify-center h-12 w-12 rounded-full ${iconBgColor}`}>
            <svg
              className={`${iconSize} ${iconColor}`}
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>

        {/* Title */}
          {title && (
            <motion.h2 
              className="mt-3 text-2xl font-semibold text-gray-900"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.1 }}
            >
              {title}
            </motion.h2>
          )}

          {/* Description */}  
          {description && (
            <motion.p 
              className="mt-2 text-gray-600"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              {description}
            </motion.p>
          )}

          {/* Footnote */}  
          {footnote && (
            <motion.p 
              className="mt-2 text-sm text-gray-500"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              {footnote}
            </motion.p>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// Define prop types for better validation
CancelMessage.propTypes = {
  title: PropTypes.string,
  description: PropTypes.string,
  footnote: PropTypes.string,
  iconBgColor: PropTypes.string,
  iconColor: PropTypes.string,
  iconSize: PropTypes.string,
  containerClass: PropTypes.string,
  autoDismiss: PropTypes.bool,
  dismissTimeout: PropTypes.number,
  onDismiss: PropTypes.func
};

export default CancelMessage;
