'use client';
import React, { useState } from 'react';
import { m } from 'framer-motion';
import { Button } from '../ui/button';
import GuestFileUpload from './GuestFileUpload';
import { useRouter } from 'next/navigation';
import { useUser } from '@clerk/nextjs';
import Image from 'next/image';
import { 
	Zap, 
	Brain, 
	Target, 
	TrendingUp, 
	CheckCircle, 
	Star,
	Users,
	Clock,
	Gift,
	Sparkles
} from 'lucide-react';

export default function Introduction() {
  // const { isInitializing }: any = useContext(UserContext);
  const { user: clerkUser } = useUser();
  const router = useRouter();
  const [imageLoaded, setImageLoaded] = useState(false);

  const introVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: 'easeOut',
      },
    },
  };

  const featureVariants = {
    hidden: { opacity: 0, x: -10 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.4,
        ease: 'easeOut',
      },
    },
  };

  // if (isInitializing) {
  //   return <motion.div>
  //     <Skeleton />
  //   </motion.div>
  // }

  return (
    <m.div variants={introVariants} initial="hidden" animate="visible">
      <div className="w-full 2xl:mx-auto mx-2 md:mx-4 py-2 md:py-4 flex flex-col justify-center items-center h-full">
        {/* Hero Section */}
        <div className="w-full max-h-full flex items-start md:flex-row flex-col justify-center gap-4 md:gap-8">
          <div className="flex-1 flex flex-col w-full">
            {/* Simplified Badge Row for Mobile */}
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-1 md:gap-2 mb-3 md:mb-4">
              <div className="bg-blue-100 text-blue-800 px-2 md:px-3 py-1 rounded-full text-xs md:text-sm font-medium flex items-center gap-1">
                <Zap className="w-3 h-3" />
                <span className="hidden sm:inline">AI-Powered</span>
                <span className="sm:hidden">AI</span>
              </div>
              <div className="bg-green-100 text-green-800 px-2 md:px-3 py-1 rounded-full text-xs md:text-sm font-medium flex items-center gap-1">
                <Star className="w-3 h-3" />
                <span className="hidden sm:inline">Trusted by 199+</span>
                <span className="sm:hidden">199+</span>
              </div>
              <div className="bg-purple-100 text-purple-800 px-2 md:px-3 py-1 rounded-full text-xs md:text-sm font-medium flex items-center gap-1">
                <Gift className="w-3 h-3" />
                <span className="hidden sm:inline">Free Forever</span>
                <span className="sm:hidden">Free</span>
              </div>
            </div>

            {/* Optimized Mobile Headlines */}
            <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold text-center md:text-left leading-tight mb-2 md:mb-4">
              Transform Your Files Into
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                {' '}Interactive Learning
              </span>
            </h1>
            
            {/* Simplified Subheadline */}
            <h2 className="text-base md:text-xl font-medium text-center md:text-left text-gray-600 leading-relaxed mb-4 md:mb-6">
              Upload PDFs, Word docs, or YouTube videos and instantly generate flashcards, quizzes, and study guides with AI.
            </h2>

            {/* Mobile-First CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 md:gap-4 mb-4 md:mb-6 w-full">
              <Button
                name="sign-up"
                className="py-3 md:py-4 px-6 md:px-8 rounded-xl font-semibold text-base md:text-lg bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 w-full sm:w-auto"
                onClick={() => {
                  if (clerkUser) {
                    router.push('/projects');
                  } else {
                    router.push('/sign-up');
                  }
                }}
              >
                {clerkUser ? 'Go to Dashboard' : 'Start Learning Free'}
              </Button>
              
              {!clerkUser && (
                <Button
                  variant="outline"
                  className="py-3 md:py-4 px-6 md:px-8 rounded-xl font-semibold text-base md:text-lg border-2 hover:bg-gray-50 transition-all duration-300 w-full sm:w-auto"
                  onClick={() => router.push('/sign-in')}
                >
                  Sign In
                </Button>
              )}
            </div>

            {/* Simplified Free Features - Mobile Optimized */}
            <div className="bg-gradient-to-r from-green-50 to-blue-50 border border-green-200 rounded-xl p-3 md:p-4 mb-3 md:mb-4">
              <div className="flex items-center gap-2 mb-2 md:mb-3">
                <Sparkles className="w-4 md:w-5 h-4 md:h-5 text-green-600 flex-shrink-0" />
                <span className="font-semibold text-green-800 text-sm md:text-base">Free Features Include:</span>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-1 md:gap-2 text-xs md:text-sm">
                <div className="flex items-center gap-1 md:gap-2 text-gray-700">
                  <CheckCircle className="w-3 md:w-4 h-3 md:h-4 text-green-500 flex-shrink-0" />
                  <span>Auto-flashcards</span>
                </div>
                <div className="flex items-center gap-1 md:gap-2 text-gray-700">
                  <CheckCircle className="w-3 md:w-4 h-3 md:h-4 text-green-500 flex-shrink-0" />
                  <span>Unlimited quizzes</span>
                </div>
                <div className="flex items-center gap-1 md:gap-2 text-gray-700">
                  <CheckCircle className="w-3 md:w-4 h-3 md:h-4 text-green-500 flex-shrink-0" />
                  <span>Essay generation</span>
                </div>
                <div className="flex items-center gap-1 md:gap-2 text-gray-700">
                  <CheckCircle className="w-3 md:w-4 h-3 md:h-4 text-green-500 flex-shrink-0" />
                  <span>Progress tracking</span>
                </div>
                <div className="flex items-center gap-1 md:gap-2 text-gray-700">
                  <CheckCircle className="w-3 md:w-4 h-3 md:h-4 text-green-500 flex-shrink-0" />
                  <span>Study guides</span>
                </div>
                <div className="flex items-center gap-1 md:gap-2 text-gray-700">
                  <CheckCircle className="w-3 md:w-4 h-3 md:h-4 text-green-500 flex-shrink-0" />
                  <span>All file types</span>
                </div>
              </div>
            </div>

            {/* Simplified Key Benefits - Mobile First */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-2 md:gap-4 mb-4 md:mb-6">
              <m.div variants={featureVariants} className="flex items-center gap-2 text-xs md:text-sm text-gray-600">
                <CheckCircle className="w-3 md:w-4 h-3 md:h-4 text-green-500 flex-shrink-0" />
                Auto-generate study materials
              </m.div>
              <m.div variants={featureVariants} className="flex items-center gap-2 text-xs md:text-sm text-gray-600">
                <CheckCircle className="w-3 md:w-4 h-3 md:h-4 text-green-500 flex-shrink-0" />
                Track learning progress
              </m.div>
              <m.div variants={featureVariants} className="flex items-center gap-2 text-xs md:text-sm text-gray-600">
                <CheckCircle className="w-3 md:w-4 h-3 md:h-4 text-green-500 flex-shrink-0" />
                Boost retention by 300%
              </m.div>
            </div>

            {/* Guest Upload - Mobile Optimized */}
            {!clerkUser && (
              <div className="w-full max-w-md mx-auto md:mx-0 mb-4 md:mb-6">
                <div className="text-center text-xs md:text-sm text-gray-500 mb-2">
                  Or try instantly with any PDF
                </div>
                <GuestFileUpload className="w-full" projectId={1} />
              </div>
            )}

            {/* Compact Trust Indicators */}
            <div className="flex items-center justify-center md:justify-start gap-3 md:gap-6 text-xs text-gray-500">
              <div className="flex items-center gap-1">
                <Clock className="w-3 h-3 flex-shrink-0" />
                <span>30 sec setup</span>
              </div>
              <div className="flex items-center gap-1">
                <Users className="w-3 h-3 flex-shrink-0" />
                <span>No card needed</span>
              </div>
              <div className="flex items-center gap-1">
                <Target className="w-3 h-3 flex-shrink-0" />
                <span>Cancel anytime</span>
              </div>
            </div>
          </div>

          {/* Mobile-Optimized Hero Image */}
          <div className="flex-1 mt-4 md:mt-0">
            <div className="relative mx-auto max-w-sm md:max-w-none">
              <Image
                src={typeof window !== 'undefined' && window.matchMedia('(image/webp)').matches ? "/images/learning.webp" : "/images/learning.png"}
                alt="AI-powered learning platform showing flashcards, quizzes, and study materials"
                className="w-full h-auto rounded-xl md:rounded-2xl shadow-xl md:shadow-2xl"
                width={600}
                height={600}
                sizes="(max-width: 768px) 90vw, (max-width: 1200px) 50vw, 600px"
                priority
                placeholder="blur"
                blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=="
                style={{
                  maxWidth: '100%',
                  height: 'auto',
                }}
                onLoadingComplete={() => setImageLoaded(true)}
              />
              {/* Simplified Mobile Badges */}
              {imageLoaded && (
                <div className="hidden md:block">
                  <div className="absolute -top-4 -right-4 bg-white rounded-lg p-3 shadow-lg">
                    <div className="flex items-center gap-2">
                      <Brain className="w-4 h-4 text-blue-600" />
                      <span className="text-xs font-medium">AI Generated</span>
                    </div>
                  </div>
                  <div className="absolute -bottom-4 -left-4 bg-green-100 rounded-lg p-3 shadow-lg">
                    <div className="flex items-center gap-2">
                      <TrendingUp className="w-4 h-4 text-green-600" />
                      <span className="text-xs font-medium">+300% Retention</span>
                    </div>
                  </div>
                  <div className="absolute top-1/2 -left-4 bg-purple-100 rounded-lg p-3 shadow-lg">
                    <div className="flex items-center gap-2">
                      <Gift className="w-4 h-4 text-purple-600" />
                      <span className="text-xs font-medium">Free Forever</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </m.div>
  );
}
