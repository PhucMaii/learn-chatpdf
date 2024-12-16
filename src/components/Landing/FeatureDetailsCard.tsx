import { IFeature } from '@/lib/type';
import Image from 'next/image';
import React from 'react';

type Props = {
    feature: IFeature;
    isReverse?: boolean
}

export default function FeatureDetailsCard({feature, isReverse}: Props) {
    if (isReverse) {
        return (
            <div className="flex flex-row items-center justify-between h-screen">
        <Image src={feature.image} alt={feature.title} width={300} height={100} className='flex flex-[1] rounded-3xl justify-center' />
        <div className="flex-[1] flex flex-col gap-2 p-8 justify-center">
            <h4 className="font-bold text-2xl">{feature.title}</h4>
            <h6 className="text-gray-500 font-bold text-lg w-3/4">{feature.description}</h6>
        </div>
    </div>
    )
    }

  return (
    <div className="flex flex-row items-center justify-between">
        <div className="flex flex-[1] flex-col gap-2 p-8 justify-center">
            <h4 className="font-bold text-2xl">{feature.title}</h4>
            <h6 className="text-gray-500 font-bold text-lg w-3/4">{feature.description}</h6>
        </div>
        <Image src={feature.image} alt={feature.title} width={300} height={100} className='flex flex-[1] rounded-3xl justify-center' />
    </div>
  )
}
