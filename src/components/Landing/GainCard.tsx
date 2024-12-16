import { IGain } from '@/lib/type';
import { cn } from '@/lib/utils';
import React from 'react';

type Props = {
    gain: IGain;
    isPurple?: boolean
}

export default function GainCard({gain, isPurple}: Props) {
  return (
    <div className="p-4 flex flex-col gap-8 items-center justify-start pt-16 w-96 h-96 bg-gray-800 rounded-3xl">
        <div className={cn("w-16 h-16 flex items-center justify-center text-white rounded-full bg-emerald-500", {"bg-purple-500": isPurple})}>
            <gain.icon className="w-8 h-8"/>
        </div>
        <h6 className="text-2xl text-white font-bold text-center">
            {gain.title}
        </h6>
        <h6 className="text-gray-500 text-lg text-center">
            {gain.description}
        </h6>
    </div>
  )
}
