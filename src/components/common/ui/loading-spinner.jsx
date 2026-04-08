import React from 'react';

const LoadingSpinner = ({ 
  size = 'medium',
  variant = 'ring',
  color = 'indigo',
  text = 'Loading...',
  fullScreen = false 
}) => {
  // Size configurations
  const sizes = {
    small: { width: 'w-6', height: 'h-6', text: 'text-sm' },
    medium: { width: 'w-8', height: 'h-8', text: 'text-base' },
    large: { width: 'w-12', height: 'h-12', text: 'text-lg' }
  };

  // Color configurations
  const colors = {
    indigo: 'border-indigo-500',
    blue: 'border-blue-500',
    emerald: 'border-emerald-500',
    rose: 'border-rose-500',
    amber: 'border-amber-500'
  };

  // Variant configurations
  const variants = {
    dots: (
      <div className={`${sizes[size].width} ${sizes[size].height} relative`}>
        {[...Array(3)].map((_, i) => (
          <div
            key={i}
            className={`absolute top-0 ${sizes[size].width} ${sizes[size].height} rounded-full ${colors[color]} opacity-0`}
            style={{
              animation: `pulse 1.4s infinite ${i * 0.2}s`,
              transform: `rotate(${i * 120}deg) translate(0, -150%)`
            }}
          />
        ))}
      </div>
    ),
    ring: (
      <div className={`${sizes[size].width} ${sizes[size].height} rounded-full border-4 ${colors[color]} border-t-transparent animate-spin`} />
    ),
    bars: (
      <div className={`${sizes[size].width} ${sizes[size].height} flex items-end justify-center gap-1`}>
        {[...Array(4)].map((_, i) => (
          <div
            key={i}
            className={`w-1 ${colors[color]} rounded-full`}
            style={{
              height: `${25 + i * 25}%`,
              animation: `grow 1s infinite ${i * 0.1}s alternate`
            }}
          />
        ))}
      </div>
    )
  };

  return (
    <div className={`flex flex-col items-center justify-center ${fullScreen ? 'min-h-screen' : ''}`}>
      <div className="relative">
        {variants[variant]}
      </div>
      {text && (
        <p className={`mt-4 ${sizes[size].text} font-medium text-gray-600`}>
          {text}
        </p>
      )}
      <style jsx global>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        @keyframes pulse {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 1; }
        }
        @keyframes grow {
          0% { height: 25%; }
          100% { height: 100%; }
        }
      `}</style>
    </div>
  );
};

export default LoadingSpinner;