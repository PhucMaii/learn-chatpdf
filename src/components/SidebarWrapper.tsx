import React, { useContext, useEffect, useMemo, useState } from 'react';
import { checkSubscription } from '@/lib/subscription';
import SubscriptionBanner from './SubscriptionBanner';
import { COLOR_TYPE } from './StatusText';
import { UserContext } from '../../context/UserProvider';
import { AppSidebar } from './app-sidebar';

type Props = {
  children: React.ReactNode;
};

const SidebarWrapper = ({ children }: Props) => {
  const [subscription, setSubscription] = useState<any>({});
  const { user }: any = useContext(UserContext);

  useEffect(() => {
    const checkIsPro = async () => {
      const fetchedSubscription = await checkSubscription();

      setSubscription(fetchedSubscription);
    };

    checkIsPro();
  }, []);

  const subscriptionStatus = useMemo(() => {
    if (subscription?.isPro) {
      return { text: 'Pro', type: COLOR_TYPE.SUCCESS };
    }

    if (subscription?.isTrial) {
      return {
        text: `Your trial is ending on ${new Date(user?.trialEnd).toDateString()}`,
        type: COLOR_TYPE.WARNING,
      };
    }

    return {
      text: `Your trial ended on ${user?.trialEnd}`,
      type: COLOR_TYPE.WARNING,
    };
  }, [subscription]);

  return (
    <div className="flex flex-col md:flex-row">
      <div className="flex-1 max-w-[300px] p-4">
        <AppSidebar />
      </div>
      <div className="flex-8 w-full flex flex-col gap-4">
        {!subscription?.isPro && (
          <SubscriptionBanner text={subscriptionStatus.text} />
        )}
        <div className="p-1">{children}</div>
      </div>
    </div>
  );
};

export default SidebarWrapper;
