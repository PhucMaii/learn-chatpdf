'use client';
import { cn } from '@/lib/utils';
import { BadgeCheck,} from 'lucide-react'
import React from 'react'
import { Button } from './ui/button';
import { handleSubscription } from '@/utils/subscription';

type Props = {
    price: number;
    title: string;
    isPopular?: boolean;
    plan: string;
}

const PricingCard = ({price, title, isPopular, plan}: Props) => {

  return (
    <div className="relative w-96 border-2 border-gray-300 p-8 rounded-3xl">
        <div className="absolute w-full flex items-center justify-between top-2 left-2 px-4 p-2 text-blue-500 w-full rounded-full">
            <h1 className={cn("text-3xl font-bold text-emerald-600", {"text-blue-500": isPopular})}>{title}</h1>
            {isPopular && <div className="w-auto bg-blue-500 px-4 py-1 rounded-full">
                <h1 className="text-sm font-bold text-white">Popular</h1>
            </div>}
        </div>

        <div className="flex items-end justify-start mt-12">
            <h1 className="text-5xl font-bold">${price}</h1>
            <h6 className="text-xl font-semibold text-gray-400">/{plan}</h6>
        </div>

        <div className="border-2 border-gray-500 my-4"></div>

        <div className="flex flex-col gap-4 mt-4">
            <div className="flex items-center gap-2">
                <BadgeCheck className="w-6 h-6 text-emerald-500 font-bold"/>
                <h6 className="text-xl font-semibold">
                    Unlimited chats
                </h6>
            </div>

            <div className="flex items-center gap-2">
                <BadgeCheck className="w-6 h-6 text-emerald-500 font-bold"/>
                <h6 className="text-xl font-semibold">
                    Unlimited PDF Documents
                </h6>
            </div>

            <div className="flex items-center gap-2">
                <BadgeCheck className="w-6 h-6 text-emerald-500 font-bold"/>
                <h6 className="text-xl font-semibold">
                    Flash cards generation
                </h6>
            </div>

            <div className="flex items-center gap-2">
                <BadgeCheck className="w-6 h-6 text-emerald-500 font-bold"/>
                <h6 className="text-xl font-semibold">
                    Email Support
                </h6>
            </div>
            
        </div>

        <Button onClick={() => handleSubscription(price, plan)} className="w-full mt-8 text-xl font-bold border-2 text-emerald-500 border-emerald-500 bg-white rounded-full hover:bg-emerald-500 hover:text-white">
            Select
        </Button>
    </div>
  )
}

export default PricingCard