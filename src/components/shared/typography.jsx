import React, { memo } from 'react';

const Typography = ({ 
  variant = 'p', 
  children, 
  className = '', 
  ...props 
}) => {
  const baseStyles = {
    h1: 'font-semibold text-size-40 md:text-size-72 leading-[60px] md:leading-[85px]',
    h2: 'font-semibold text-size-32 md:text-size-48 leading-tight',
    h3: 'font-semibold text-size-24 md:text-size-32 leading-tight',
    h4: 'font-semibold text-size-20 md:text-size-24',
    p: 'text-size-16 leading-relaxed',
    span: 'text-size-14',
    label: 'block text-size-14 font-medium text-gray-500 mb-2',
    error: 'text-red-500 text-size-12 mt-1',
    small: 'text-size-12 text-gray-500',
  };

  const Component = variant === 'error' ? 'p' : (baseStyles[variant] ? variant : 'p');
  const styles = `${baseStyles[variant] || ''} ${className}`;

  return (
    <Component className={styles} {...props}>
      {children}
    </Component>
  );
};

export default memo(Typography);
