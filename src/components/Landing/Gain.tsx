'use client';
import { gainList } from '@/lib/constant';
import React from 'react';
import GainCard from './GainCard';
import { IGain } from '@/lib/type';
import MotionSection from '../MotionSection';

export default function Gain() {
  return (
    <MotionSection>
      <div className="w-full p-8">
        <h1 className="text-5xl font-bold text-center text-white">
          What You Will Gain?
        </h1>

        <div className="flex flex-row items-center justify-center flex-wrap gap-16 mt-16">
          {gainList.map((gain: IGain, index: number) => (
            <GainCard key={index} gain={gain} isPurple={index % 2 !== 0} />
          ))}
        </div>
      </div>
    </MotionSection>
  );
}
