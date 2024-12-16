import { features } from '@/lib/constant';
import React from 'react';
import FeatureCard from './FeatureCard';
import { IFeature } from '@/lib/type';

export default function Features() {
  return (
    <div className="w-full bg-white p-8">
        <h1 className="text-center text-5xl font-bold">Features</h1>
        
        <div className="w-full flex flex-row items-center justify-center gap-4 mt-8">
            {
              features.map((feature: IFeature, index: number) => (
                <FeatureCard key={index} card={feature} />
              ))
            }
        </div>
    </div>
  )
}
