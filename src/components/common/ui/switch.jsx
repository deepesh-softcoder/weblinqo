import React from 'react';

// reusable component use for toggle
const Switch = ({ 
  checked = false, 
  onChange, 
  disabled = false, 
  size = 'default', // 'default' or 'small'
  className = '',
  ariaLabel = 'Toggle switch'
}) => {
  const sizeClasses = {
    default: 'h-6 w-11',
    small: 'h-5 w-9'
  };

  const thumbSizeClasses = {
    default: 'h-4 w-4',
    small: 'h-3 w-3'
  };

  const translateClasses = {
    default: {
      checked: 'translate-x-6',
      unchecked: 'translate-x-1'
    },
    small: {
      checked: 'translate-x-4',
      unchecked: 'translate-x-1'
    }
  };

  return (
    <button
      onClick={onChange}
      disabled={disabled}
      className={`
        relative inline-flex items-center rounded-full transition-colors
        ${sizeClasses[size]}
        ${checked ? 'bg-primary' : 'bg-gray-300'}
        ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:bg-opacity-80'}
        ${className}
      `}
      aria-label={ariaLabel}
      role="switch"
      aria-checked={checked}
    >
      <span
        className={`
          inline-block transform rounded-full bg-white transition-transform
          ${thumbSizeClasses[size]}
          ${checked ? translateClasses[size].checked : translateClasses[size].unchecked}
        `}
      />
    </button>
  );
};

export default Switch;
