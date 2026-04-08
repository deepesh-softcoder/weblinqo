import React from 'react';
import AppearanceTab from '../../../components/user/link-in-bio/appearance-tab/appearance-tab';
import useUserStore from '../../../stores/userStore';

const AppearancePage = () => {
  const { subscription } = useUserStore();

  return (
    // Appearance tab of link in bio
    <AppearanceTab plan={subscription.planName?.toLowerCase() || ''} />
  );
};

export default AppearancePage;

