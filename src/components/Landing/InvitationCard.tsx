'use client';
import React from 'react';
import { Button } from '../ui/button';
import Image from 'next/image';
import MotionSection from '../MotionSection';

export default function InvitationCard() {
  return (
    <MotionSection>
      <div
        className={
          'flex bg-emerald-500 rounded-3xl md:flex-row flex-col max-w-6xl mx-auto'
        }
      >
        <div className="flex-2 p-4 md:p-8 flex flex-col items-center md:items-start">
          <h2 className="font-bold text-white text-3xl text-center md:text-left">
            Learn. Simplified. Succeed
          </h2>
          <h6 className="text-white text-lg text-center md:text-left">
            Transform the way you study with instant answers, smart flashcards,
            and effortless productivity.
          </h6>
          <Button className="bg-white text-emerald-500 rounded-xl font-bold text-xl mt-4 w-fit p-6 hover:bg-gray-200 focus:scale-98 transition-all duration-300">
            Join Us
          </Button>
        </div>
        <div className="flex-1">
          <Image
            src="/images/typingOnComputer.jpg"
            alt="invitation"
            width={500}
            height={500}
            className="rounded-r-3xl h-full md:min-w-80 w-full rounded-b-3xl md:rounded-r-3xl md:rounded-l-none"
          />
        </div>
      </div>
    </MotionSection>
  );
}
