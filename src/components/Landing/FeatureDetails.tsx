import { featureDetails, greyBackground } from '@/lib/constant';
import React from 'react';
import FeatureDetailsCard from './FeatureDetailsCard';

export default function FeatureDetails() {
  return (
    <div className={`w-full ${greyBackground}`}>
      <div className="w-[2000px] mx-auto p-8 flex flex-col gap-16">
        {featureDetails.map((feature: any, index: number) => (
          <FeatureDetailsCard
            key={index}
            feature={feature}
            isReverse={index % 2 !== 0}
          />
        ))}
      </div>
    </div>
  );
}
