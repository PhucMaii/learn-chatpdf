import React, { useContext, useEffect, useMemo, useState } from 'react';
import { checkSubscription } from '@/lib/subscription';
import SubscriptionBanner from './SubscriptionBanner';
import { COLOR_TYPE } from './StatusText';
import { UserContext } from '../../context/UserProvider';
import { AppSidebar } from './app-sidebar';
import useLocalStorage from '../../hooks/useLocalStorage';
import axios from 'axios';

type Props = {
  children: React.ReactNode;
};

const SidebarWrapper = ({ children }: Props) => {
  const [subscription, setSubscription] = useState<any>({});
  const { user, setUser }: any = useContext(UserContext);
  const [guestSession, setGuestSession, isInitialized] = useLocalStorage(
    'guest-session',
    {},
  );

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

  useEffect(() => {
    if (isInitialized) {
      fetchGuestSessionId();
    }
  }, [guestSession]);

  const fetchGuestSessionId = async () => {
    try {
      // Check if a guest session ID already exists in local storage
      if (Object.keys(guestSession).length > 0) {
        // If yes -> Check if this session id already been a guest in db
        const response = await axios.get(
          `/api/guest?guestSessionId=${guestSession.sessionId}`,
        );

        if (response.data.error) {
          throw new Error('Something went wrong. ', response.data.error);
        }

        if (response.data.data) {
          setUser(response.data.data);
        }

        return; // Exit if a session ID already exists
      }

      const response = await axios.post(`/api/guest/session`);

      if (response.data.error) {
        throw new Error('Something went wrong. ', response.data.error);
      }

      setGuestSession({
        sessionId: response.data.guestSessionId,
        signature: response.data.guestSessionSignature,
      });
    } catch (error: any) {
      console.error(
        'Something went wrong. Fail to fetch guest session id: ',
        error,
      );
    }
  };

  return (
    <div className="flex flex-col md:flex-row">
      <div className="w-full md:w-[300px] p-4 shrink-0">
        <AppSidebar />
      </div>
      <div className="flex-1 flex flex-col gap-4">
        {!subscription?.isPro && (
          <SubscriptionBanner text={subscriptionStatus.text} />
        )}
        <div className="flex flex-col p-1">{children}</div>
      </div>
    </div>
  );
};

export default SidebarWrapper;
