import React from 'react';
import AnalyticsTab from '../../../components/user/link-in-bio/analytics-tab';
import useUserStore from '../../../stores/userStore';

const AnalyticsPage = () => {
  const { subscription } = useUserStore();

  return (
    // Analytics tab for link in bio
    <AnalyticsTab plan={subscription.planName?.toLowerCase() || ''} />
  );
};

export default AnalyticsPage;

