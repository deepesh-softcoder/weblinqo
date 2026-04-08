// components/common/SuccessMessage.jsx
import { motion, AnimatePresence } from 'framer-motion';
import { FaCheckCircle, FaSpinner } from 'react-icons/fa';
import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import Typography from '../shared/typography';

const SuccessMessage = ({ 
  title = 'Payment Successful!',
  description = 'Thank you for your subscription. Your payment has been processed successfully.',
  footnote = 'You\'ll be redirected shortly...',
  icon: Icon = FaCheckCircle,
  iconBgColor = 'bg-primary/10',
  iconColor = 'text-primary',
  iconSize = 'h-8 w-8',
  containerClass = 'w-full text-center',
  showLoader = false,
  autoDismiss = false,
  dismissTimeout = 5000,
  onDismiss
}) => {
  const [isVisible, setIsVisible] = useState(true);

   // Handle auto-dismiss if enabled
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
          <div className={`mx-auto flex items-center justify-center h-12 w-12 rounded-full ${iconBgColor}`}>
            {/* Icon Container */}
            {showLoader ? (
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
              >
                <FaSpinner className={`${iconSize} ${iconColor}`} />
              </motion.div>
            ) : (
              <Icon className={`${iconSize} ${iconColor}`} aria-hidden="true" />
            )}
          </div>

          {/* Title */}    
          {title && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.1 }}
            >
              <Typography variant="h3" className="mt-3 text-2xl font-semibold text-gray-900">
                {title}
              </Typography>
            </motion.div>
          )}

          {/* Description */}  
          {description && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <Typography variant="p" className="mt-2 text-gray-600">
                {description}
              </Typography>
            </motion.div>
          )}

          {/* Footnote */}  
          {footnote && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <Typography variant="small" className="mt-2 text-sm text-gray-500">
                {footnote}
              </Typography>
            </motion.div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// Prop types for type checking and better developer experience
SuccessMessage.propTypes = {
  title: PropTypes.string,
  description: PropTypes.string,
  footnote: PropTypes.string,
  icon: PropTypes.elementType,
  iconBgColor: PropTypes.string,
  iconColor: PropTypes.string,
  iconSize: PropTypes.string,
  containerClass: PropTypes.string,
  showLoader: PropTypes.bool,
  autoDismiss: PropTypes.bool,
  dismissTimeout: PropTypes.number,
  onDismiss: PropTypes.func
};

export default SuccessMessage;
