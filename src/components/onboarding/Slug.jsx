import React from 'react';
import Input from "../shared/input";
import Typography from "../shared/typography";

const Slug = ({ 
  slug, 
  setSlug, 
  slugAvailable, 
  checkingSlug, 
  slugError,
  saving,
  isNavigating
}) => {
  // Ensures only valid characters (lowercase letters, numbers, '-', '_') are allowed
  const handleSlugChange = (e) => {
    const value = e.target.value.toLowerCase().replace(/[^a-z0-9_-]/g, '');
    setSlug(value);
  };

  const getStatusMessage = () => {
    if (checkingSlug && slug) {
      return (
        <Typography variant="span" className="text-gray-500">
          Checking availability...
        </Typography>
      );
    }
    if (slugError) {
      return (
        <p className="text-sm text-[#c62828] flex items-center justify-center">
          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          {slugError}
        </p>
      );
    }
    if (slugAvailable && slug && !checkingSlug) {
      return (
        <p className="text-sm text-[#2a5a00] flex items-center justify-center">
          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          Available!
        </p>
      );
    }
    if (!slug) {
      return (
        <Typography variant="span" className="text-gray-500">
          3-20 characters (letters, numbers, -, _)
        </Typography>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Typography variant="p" className="text-gray-600 text-center">
          Enter username for your weblinqo URL:
        </Typography>
        
        <Input
          placeholder="username"
          value={slug}
          onChange={handleSlugChange}
          disabled={saving || isNavigating}
          error={slugError ? true : false} // Just to show error border if error exists
        />
        
        <div className="h-6 text-center">
          {getStatusMessage()}
        </div>
      </div>
    </div>
  );
};

export default Slug;
