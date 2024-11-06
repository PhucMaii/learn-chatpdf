import React, { useContext, useEffect, useMemo, useState } from 'react';
import Sidebar from './Sidebar';
import { checkSubscription } from '@/lib/subscription';
import SubscriptionBanner from './SubscriptionBanner';
import { COLOR_TYPE } from './StatusText';
import { UserContext } from '../../context/UserProvider';

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
    <div className="flex">
      <div className="flex-[2] p-4 border-r-4 border-1-slate-200">
        <Sidebar />
      </div>
      <div className="flex-[8] w-full">
        {!subscription?.isPro && (
          <SubscriptionBanner text={subscriptionStatus.text} />
        )}
        <div className="p-4">{children}</div>
      </div>
    </div>
  );
};

export default SidebarWrapper;
