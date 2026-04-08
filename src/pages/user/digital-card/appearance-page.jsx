import React from 'react';
import useUserStore from '../../../stores/userStore';
import DCAppearanceTab from '../../../components/user/digital-card/appearance';

const AppearancePage = () => {
  const { subscription } = useUserStore();

  return (
    // digital card appearance tab in dashboard
    <DCAppearanceTab plan={subscription.planName?.toLowerCase() || ''} />
  );
};

export default AppearancePage;

