import React from 'react';
import { useLocation } from 'react-router-dom';
import { useLinkInBioExistence } from '../../../hooks/useLinkInBioExistence';
import LinkInBioCreationFlow from './link-in-bio-creation-flow';
import LoadingSpinner from '../../common/ui/loading-spinner';
import DashboardLinksPage from '../../../pages/user/link-in-bio/links-page';
import AppearancePage from '../../../pages/user/link-in-bio/appearance-page';
import AnalyticsPage from '../../../pages/user/link-in-bio/analytics-page';

const LinkInBioWrapper = () => {
  const { linkInBioExists, isChecking } = useLinkInBioExistence();
  const location = useLocation();

  // Show loader while checking if link in bio exists
  if (isChecking) {
    return (
      <div className="flex items-center justify-center h-full">
        <LoadingSpinner />
      </div>
    );
  }

  // If link in bio doesn't exist, show creation flow within the dashboard layout
  if (!linkInBioExists) {
    return <LinkInBioCreationFlow />;
  }

  // If link in bio exists, show the appropriate page based on the route
  const path = location.pathname;
  if (path === '/dashboard/appearance') {
    return <AppearancePage />;
  } else if (path === '/dashboard/analytics') {
    return <AnalyticsPage />;
  } else {
    return <DashboardLinksPage />;
  }
};

export default LinkInBioWrapper;
