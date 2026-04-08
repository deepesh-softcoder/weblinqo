import React from 'react';
import LinksTab from '../../../components/user/link-in-bio/links-tab';
import useUserStore from '../../../stores/userStore';

const LinksPage = () => {
  const { userProfile, setUserProfile, setUserDcProfile, subscription } = useUserStore();

  return (
    // Main link page in link in bio tab
    <LinksTab
      userProfile={userProfile}
      setUserProfile={setUserProfile}
      setUserDcProfile={setUserDcProfile}
      plan={subscription.planName?.toLowerCase() || ''}
    />
  );
};

export default LinksPage;

