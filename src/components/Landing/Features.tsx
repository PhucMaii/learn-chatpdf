import { features, greyBackground } from '@/lib/constant';
import React from 'react';
import FeatureCard from './FeatureCard';
import { IFeature } from '@/lib/type';

export default function Features() {
  return (
    <div className={`w-full ${greyBackground} p-8`}>
      <div className="max-w-[2000px] mx-auto">
        <h1 className="text-center text-5xl font-bold">Features</h1>
        
        <div className="w-full flex sm:flex-row flex-col items-center justify-center gap-4 mt-8">
            {
              features.map((feature: IFeature, index: number) => (
                <FeatureCard key={index} card={feature} />
              ))
            }
        </div>

      </div>
    </div>
  )
}
