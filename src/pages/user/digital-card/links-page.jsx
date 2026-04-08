import React from 'react';
import useUserStore from '../../../stores/userStore';
import DCLinksTab from '../../../components/user/digital-card/links';

const DCLinksPage = () => {
  const { userDcProfile, setUserDcProfile, subscription } = useUserStore();

  return (
    // Digital card tab in dashboard
    <DCLinksTab
      userDcProfile={userDcProfile}
      setUserDcProfile={setUserDcProfile}
      plan={subscription.planName?.toLowerCase() || ''}
    />
  );
};

export default DCLinksPage;

