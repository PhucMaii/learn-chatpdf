'use client';
import { cn } from '@/lib/utils';
import { CircleCheckIcon } from 'lucide-react';
import React, { useContext, useMemo } from 'react';
import { Button } from './ui/button';
// import { handleSubscription } from '@/utils/subscription';
// import { DrizzleDiscountCode } from '@/lib/db/drizzleType';
// import { useUser } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { UserContext } from '../../context/UserProvider';
import { handleSubscription } from '@/utils/subscription';
import { useUser } from '@clerk/nextjs';

type Props = {
  plan: any;
  isYearly: boolean;
};

const PricingCard = ({ plan, isYearly }: Props) => {
  // const { user } = useUser();
  const { user }: any = useContext(UserContext);
  const { user: clerkUser } = useUser();
  const router = useRouter();

  const isSelected = useMemo(() => {
    if (plan.title === 'Starter') {
      return (
        user?.status === 'Free' || user?.status === 'Trial' || !user?.status
      );
    }

    if (plan.title === 'Pro') {
      return user?.status === 'Pro';
    }

    if (plan.title === 'Elite') {
      return user?.status === 'Elite';
    }
  }, [user, plan]);

  const isUserNotHasPlan = useMemo(() => {
    return user?.status === 'Free' || user?.status === 'Trial' || !user?.status;
  }, [user, plan]);

  console.log(user);

  // const finalPrice = useMemo(() => {
  //   if (!discount) {
  //     return displayPrice;
  //   }

  //   if (discount.type === 'percent') {
  //     return (displayPrice - displayPrice * (discount.value / 100))?.toFixed(2);
  //   }

  //   return (displayPrice - discount.value)?.toFixed(2);
  // }, [displayPrice, discount]);

  return (
    <div className="relative w-[350px] h-[650px] border-2 border-gray-300 p-4 sm:p-6 md:p-8 rounded-3xl flex flex-col">
      {plan.isPopular && (
        <div className="absolute top-2 right-2 bg-red-500 rounded-full px-4 py-2">
          <h6 className="text-xs sm:text-sm font-medium text-white">
            Popular 🔥
          </h6>
        </div>
      )}
      <div className="flex flex-col gap-2">
        <div className="flex w-8 h-8 sm:w-10 sm:h-10 items-center justify-center bg-emerald-500 rounded-full">
          <plan.icon className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
        </div>
        <h1 className="text-xl sm:text-2xl font-bold">{plan.title}</h1>
        <h6 className="text-xs sm:text-sm font-medium text-gray-400">
          {plan.forWho}
        </h6>
      </div>

      <div className="flex flex-col items-center justify-center gap-2">
        <div className="flex items-center justify-center mt-4">
          <h1 className="text-4xl sm:text-5xl font-medium">
            {isYearly ? plan.displayYearlyPrice : plan.displayMonthlyPrice}
          </h1>
          <h6 className="text-xs sm:text-sm font-medium text-gray-400">
            /month
          </h6>
        </div>
        {isYearly && plan.yearlyPrice && (
          <p className="text-xs sm:text-sm font-medium text-gray-400">
            Billed annually: ${plan.yearlyPrice}
          </p>
        )}
      </div>

      <Button
        variant="outline"
        className={cn(
          'w-full mt-4 border-2 border-emerald-500 text-emerald-500 font-bold text-sm sm:text-md hover:bg-emerald-500 hover:text-white',
          isSelected && 'bg-emerald-500 text-white opacity-50',
        )}
        onClick={() => {
          if (clerkUser) {
            handleSubscription(
              plan.title,
              isYearly ? plan.yearlyPrice : plan.monthlyPrice,
              isYearly ? 'year' : 'month',
            );
          } else {
            router.push('/sign-in');
          }
        }}
      >
        {isSelected
          ? 'Current Plan'
          : isUserNotHasPlan
            ? 'Select'
            : 'Manage Subscription'}
      </Button>

      <div className="flex-1 flex flex-col mt-4">
        <h6 className="text-xs sm:text-sm font-medium">Free Features</h6>

        <div className="flex flex-col gap-2 mt-4 overflow-y-auto">
          {plan.features.map((feature: string, index: number) => (
            <div key={index} className="flex items-center gap-2">
              <CircleCheckIcon className="w-5 h-5 sm:w-6 sm:h-6 text-emerald-500 font-bold flex-shrink-0" />
              <h6 className="text-xs sm:text-sm">{feature}</h6>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PricingCard;
