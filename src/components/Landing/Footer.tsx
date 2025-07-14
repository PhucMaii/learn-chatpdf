'use client';
import React from 'react';
import Logo from './Logo';
import { contactList } from '@/lib/constant';
import Link from 'next/link';
import MotionSection from '../MotionSection';

export default function Footer() {
  return (
    <MotionSection>
      <div className="px-2 md:px-32 py-8 md:py-16 border-t border-gray-300">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 md:gap-0 max-w-4xl mx-auto">
          <div className="flex flex-row gap-2 items-center">
            <Logo />
            <h6 className="text-lg md:text-xl font-bold">LearnPDF</h6>
          </div>
          <div className="flex flex-row md:flex-col gap-4 md:gap-4">
            {contactList.map((contact: any, index: number) => (
              <Link
                href={contact.link}
                className="flex flex-row gap-2 md:gap-4 items-center text-center md:text-left"
                key={index}
              >
                <contact.icon className="w-4 h-4 md:w-5 md:h-5" />
                <h6 className="text-xs md:text-sm font-bold">
                  {contact.title}
                </h6>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </MotionSection>
  );
}
