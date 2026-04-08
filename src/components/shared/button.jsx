import React, { memo } from 'react';
import { RiLoader4Fill } from "react-icons/ri";

const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  leftIcon,
  rightIcon,
  className = '',
  disabled,
  ...props
}) => {
  const baseStyles = 'inline-flex items-center justify-center font-semibold transition-all duration-200 focus:outline-none disabled:opacity-70 disabled:cursor-not-allowed';
  
  const variants = {
    primary: 'bg-primary text-white hover:bg-blue-600 shadow-sm',
    secondary: 'bg-gray-100 text-gray-900 hover:bg-gray-200',
    outline: 'border-2 border-primary text-primary hover:bg-primary hover:text-white',
    ghost: 'text-primary hover:bg-blue-50',
    danger: 'bg-red-500 text-white hover:bg-red-600',
    gradient: 'bg-gradient-to-r from-primary to-purple-500 text-white hover:from-blue-600 hover:to-purple-600 shadow-md',
    disabled: 'bg-gray-300 text-gray-500 cursor-not-allowed'
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-sm rounded-lg',
    md: 'px-4 py-2.5 text-base rounded-xl',
    lg: 'px-6 py-3.5 text-lg rounded-xl',
    full: 'w-full py-3.5 px-4 text-base rounded-xl'
  };

  const currentVariant = (disabled || isLoading) && variant === 'primary' ? 'disabled' : variant;
  
  const styles = `${baseStyles} ${variants[currentVariant] || variants.primary} ${sizes[size]} ${className}`;

  return (
    <button
      className={styles}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading && <RiLoader4Fill className="animate-spin mr-2" size={20} />}
      {!isLoading && leftIcon && <span className="mr-2">{leftIcon}</span>}
      {children}
      {!isLoading && rightIcon && <span className="ml-2">{rightIcon}</span>}
    </button>
  );
};

export default memo(Button);
