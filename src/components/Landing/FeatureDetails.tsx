'use client';
import React from 'react';
import FeatureDetailsCard from './FeatureDetailsCard';
import MotionSection from '../MotionSection';
import { featureDetails } from '@/lib/constant';

export default function FeatureDetails() {

  return (
    <MotionSection>
      <div className={`w-full`}>
        <div className="max-w-[2000px] mx-auto p-8 flex flex-col gap-16">
          {featureDetails.map((feature: any, index: number) => (
            <FeatureDetailsCard
              key={index}
              feature={feature}
            />
          ))}
        </div>
      </div>
    </MotionSection>
  );
}
