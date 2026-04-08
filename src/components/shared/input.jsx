import React from 'react';
import Typography from './typography';

const Input = React.forwardRef(({
  label,
  error,
  leftIcon,
  rightIcon,
  containerClassName = '',
  className = '',
  id,
  ...props
}, ref) => {
  return (
    <div className={`w-full ${containerClassName}`}>
      {label && (
        <Typography variant="label" htmlFor={id}>
          {label}
        </Typography>
      )}
      <div className="relative">
        {leftIcon && (
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
            {leftIcon}
          </div>
        )}
        <input
          id={id}
          ref={ref}
          className={`
            w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary transition bg-gray-50
            ${leftIcon ? 'pl-10' : ''}
            ${rightIcon ? 'pr-12' : ''}
            ${error ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : ''}
            ${props.disabled ? 'opacity-70 cursor-not-allowed' : ''}
            ${className}
          `}
          {...props}
        />
        {rightIcon && (
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
            {rightIcon}
          </div>
        )}
      </div>
      {error && (
        <Typography variant="error">
          {error}
        </Typography>
      )}
    </div>
  );
});

Input.displayName = 'Input';

export default Input;
