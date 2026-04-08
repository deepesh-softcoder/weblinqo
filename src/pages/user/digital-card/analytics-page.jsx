import React from 'react';
import DCAnalyticsTab from '../../../components/user/digital-card/analytics';
import useUserStore from '../../../stores/userStore';

const AnalyticsPage = () => {
  const { subscription, userProfile } = useUserStore();

  return (
    // analaytics tab of digital card in dashboard
    <DCAnalyticsTab plan={subscription.planName?.toLowerCase() || ''} cardSlug={userProfile.slug} />
  );
};

export default AnalyticsPage;

