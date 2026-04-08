import React from 'react';
import SettingsTab from '../../components/user/settings-tab';
import useUserStore from '../../stores/userStore';


const SettingsPage = () => {
  const { subscription } = useUserStore();

  return (
    // setting tab in dashboard layout
    <SettingsTab plan={subscription.planName?.toLowerCase() || ''} />
  );
};

export default SettingsPage;

