'use client';
import { cn } from '@/lib/utils';
import { BadgeCheck } from 'lucide-react';
import React, { useMemo } from 'react';
import { Button } from './ui/button';
import { handleSubscription } from '@/utils/subscription';
import { DrizzleDiscountCode } from '@/lib/db/drizzleType';

type Props = {
  price: number;
  title: string;
  isPopular?: boolean;
  plan: string;
  save?: string[];
  discount?: DrizzleDiscountCode;
  helperText?: string;
};

const PricingCard = ({ price, title, isPopular, plan, save, discount, helperText }: Props) => {
  const finalPrice = useMemo(() => {
    if (!discount) {
      return price;
    }

    if (discount.type === 'percent') {
      return (price - (price * (discount.value / 100)))?.toFixed(2);
    }

    return (price - discount.value)?.toFixed(2);
  }, [price, discount]);


  return (
    <div className="relative w-96 border-2 border-gray-300 p-8 rounded-3xl">
      <div className="absolute w-full flex items-center justify-between top-2 left-2 px-4 p-2 text-blue-500 w-full rounded-full">
        <h1
          className={cn('text-3xl font-bold text-emerald-600', {
            'text-blue-500': isPopular,
          })}
        >
          {title}
        </h1>
        {
          finalPrice !== price && (
            <div className="bg-red-600 px-4 py-1 rounded-full">
              <h1 className="text-xl font-bold text-white">🔥 90% OFF 💰</h1>
            </div>
          )
        }
        {isPopular && finalPrice === price && (
          <div className="w-auto bg-blue-500 px-4 py-1 rounded-full">
            <h1 className="text-sm font-bold text-white">Popular</h1>
          </div>
        )}
      </div>

        
      <div className="flex items-end justify-start mt-12">
        {finalPrice !== price && <h1 className="text-2xl text-gray-300 line-through">${price}</h1>}
        <h1 className="text-5xl font-bold">${finalPrice}</h1>
        <h6 className="text-xl font-semibold text-gray-400">/{plan}</h6>
      </div>

      {
        helperText && (
          <h6 className="text-lg font-semibold text-gray-400 mt-4">{helperText}</h6>
        )
      }

      <div className="border-2 border-gray-500 my-4"></div>

      <div className="flex flex-col gap-4 mt-4">
        {save &&
          save.map((saveText: string, index: number) => (
            <div className="flex items-center gap-2" key={index}>
              <BadgeCheck className="w-6 h-6 text-emerald-500 font-bold" />
              <h6 className="text-xl font-semibold">{saveText}</h6>
            </div>
          ))}
        <div className="flex items-center gap-2">
          <BadgeCheck className="w-6 h-6 text-emerald-500 font-bold" />
          <h6 className="text-xl font-semibold">Unlimited chats</h6>
        </div>

        <div className="flex items-center gap-2">
          <BadgeCheck className="w-6 h-6 text-emerald-500 font-bold" />
          <h6 className="text-xl font-semibold">Unlimited PDF Documents</h6>
        </div>

        <div className="flex items-center gap-2">
          <BadgeCheck className="w-6 h-6 text-emerald-500 font-bold" />
          <h6 className="text-xl font-semibold">Flash cards generation</h6>
        </div>

        <div className="flex items-center gap-2">
          <BadgeCheck className="w-6 h-6 text-emerald-500 font-bold" />
          <h6 className="text-xl font-semibold">Email Support</h6>
        </div>
      </div>

      <Button
        onClick={() => handleSubscription(price, plan, discount?.id)}
        className="w-full mt-8 text-xl font-bold border-2 text-emerald-500 border-emerald-500 bg-white rounded-full hover:bg-emerald-500 hover:text-white"
      >
        Select
      </Button>
    </div>
  );
};

export default PricingCard;
