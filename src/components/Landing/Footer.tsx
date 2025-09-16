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
        <div className="max-w-6xl mx-auto">
          {/* Main Footer Content */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            {/* Company Info */}
            <div className="md:col-span-2">
              <div className="flex flex-row gap-2 items-center mb-4">
                <Logo />
                <h6 className="text-lg md:text-xl font-bold">LearnPDF</h6>
              </div>
              <p className="text-gray-600 text-sm leading-relaxed mb-4">
                Transform your PDFs into interactive learning materials with AI. 
                Auto-generate flashcards, quizzes, essays, and study guides to accelerate your learning.
              </p>
              <div className="flex flex-row gap-4">
                {contactList.map((contact: any, index: number) => (
                  <Link
                    href={contact.link}
                    className="flex flex-row gap-2 items-center text-gray-600 hover:text-emerald-600 transition-colors"
                    key={index}
                  >
                    <contact.icon className="w-4 h-4" />
                    <span className="text-xs font-medium">
                      {contact.title}
                    </span>
                  </Link>
                ))}
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h6 className="text-sm font-semibold text-gray-900 mb-4">Quick Links</h6>
              <div className="space-y-2">
                <Link href="/about" className="block text-sm text-gray-600 hover:text-emerald-600 transition-colors">
                  About Us
                </Link>
                <Link href="/pricing" className="block text-sm text-gray-600 hover:text-emerald-600 transition-colors">
                  Pricing
                </Link>
                <Link href="/sign-up" className="block text-sm text-gray-600 hover:text-emerald-600 transition-colors">
                  Get Started
                </Link>
              </div>
            </div>

            {/* Legal */}
            <div>
              <h6 className="text-sm font-semibold text-gray-900 mb-4">Legal</h6>
              <div className="space-y-2">
                <Link href="/privacy" className="block text-sm text-gray-600 hover:text-emerald-600 transition-colors">
                  Privacy Policy
                </Link>
                <Link href="/terms" className="block text-sm text-gray-600 hover:text-emerald-600 transition-colors">
                  Terms of Service
                </Link>
              </div>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="border-t border-gray-200 pt-6">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <p className="text-xs text-gray-500">
                © {new Date().getFullYear()} LearnPDF. All rights reserved.
              </p>
              <p className="text-xs text-gray-500">
                Made with ❤️ for students worldwide
              </p>
            </div>
          </div>
        </div>
      </div>
    </MotionSection>
  );
}
