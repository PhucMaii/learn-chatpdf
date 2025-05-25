'use client';
import React from 'react';
import FeatureCard from './FeatureCard';
import { IFeature } from '@/lib/type';
import MotionSection from '../MotionSection';
import { features } from '@/lib/constant';

export default function Features() {
  return (
    <MotionSection>
      <div className={`max-w-[1400px] mx-auto p-8`}>
        <div className="max-w-[2000px] mx-auto">
          <h1 className="text-center text-5xl font-semibold">How It Works</h1>

          <div className="w-full grid grid-cols-1 sm:grid-cols-3 gap-8 mt-8">
            {features.map((feature: IFeature, index: number) => (
              <FeatureCard key={index} card={feature} />
            ))}
          </div>
        </div>
      </div>
    </MotionSection>
  );
}
