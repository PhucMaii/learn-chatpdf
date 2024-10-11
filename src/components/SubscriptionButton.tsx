'use client';

import React, { useState } from 'react'
import { Button } from './ui/button';
import axios from 'axios';

type Props = {isPro: boolean}

const SubscriptionButton = (props: Props) => {
    const [isLoading, setIsLoading] = useState(false);

    const handleSubscription = async () => {
        try {
          setIsLoading(true);
          const response = await axios.get('/api/stripe');
          window.location.href = response.data.url;
          setIsLoading(false);
        } catch (error) {
          console.log(error);
          setIsLoading(false);
        }
      }
  return (
    <Button disabled={isLoading} onClick={handleSubscription}>
        {props.isPro ? 'Manage Subscription' : 'Get Pro'}
    </Button>
  )
}

export default SubscriptionButton