'use client';
import { featureDetails, greyBackground } from '@/lib/constant';
import React, { useEffect, useState } from 'react';
import FeatureDetailsCard from './FeatureDetailsCard';
import MotionSection from '../MotionSection';

export default function FeatureDetails() {
  const [isSmDown, setIsSmDown] = useState(false);

  useEffect(() => {
    const checkScreenSize = () => setIsSmDown(window.innerWidth < 640);
    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);
    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  return (
    <MotionSection>
      <div className={`w-full ${greyBackground}`}>
        <div className="max-w-[2000px] mx-auto p-8 flex flex-col gap-16">
          {featureDetails.map((feature: any, index: number) => (
            <FeatureDetailsCard
              key={index}
              feature={feature}
              isReverse={index % 2 !== 0 && !isSmDown}
            />
          ))}
        </div>
      </div>
    </MotionSection>
  );
}
