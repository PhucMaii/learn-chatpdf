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
      <div className="w-full 2xl:mx-auto mx-4 py-4 flex flex-col justify-center items-center h-full mt-8 md:mt-0">
        {/* Hero Section */}
        <div className="w-full max-h-full flex items-start md:flex-row flex-col justify-center gap-8 mt-8">
          <div className="flex-1 flex flex-col w-full">
            {/* Badge */}
            <div className="flex items-center gap-2 mb-4 mx-auto md:mx-0">
              <div className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1">
                <Zap className="w-3 h-3" />
                AI-Powered Learning
              </div>
              <div className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1">
                <Star className="w-3 h-3" />
                Trusted by Hundreds of Students
              </div>
              <div className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1">
                <Gift className="w-3 h-3" />
                Free Forever Plan
              </div>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl md:text-5xl lg:text-6xl max-w-4xl font-bold text-center md:text-left leading-tight min-h-[120px] md:min-h-[140px] lg:min-h-[160px]">
              Transform Your Files Into
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                {' '}Interactive Learning
              </span>
            </h1>
            
            {/* Subheadline */}
            <h2 className="text-lg md:text-xl max-w-5xl font-medium mt-4 text-center md:text-left text-gray-600 leading-relaxed min-h-[80px] md:min-h-[60px] flex items-center">
              Upload PDFs, Word docs, PowerPoints, YouTube videos, or your notes and instantly generate flashcards, quizzes, essays, and study guides. 
              <br className="hidden md:block" />
              Track your progress, boost retention, and accelerate learning with AI-powered insights.
            </h2>

            {/* Free Features Highlight */}
            <div className="bg-gradient-to-r from-green-50 to-blue-50 border border-green-200 rounded-xl p-4 mt-6 min-h-[120px]">
              <div className="flex items-center gap-2 mb-3">
                <Sparkles className="w-5 h-5 text-green-600 flex-shrink-0" />
                <span className="font-semibold text-green-800">Free Features Include:</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                <div className="flex items-center gap-2 text-gray-700">
                  <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                  <span>Unlimited file uploads</span>
                </div>
                <div className="flex items-center gap-2 text-gray-700">
                  <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                  <span>Auto-generate flashcards</span>
                </div>
                <div className="flex items-center gap-2 text-gray-700">
                  <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                  <span>Create unlimited quizzes</span>
                </div>
                <div className="flex items-center gap-2 text-gray-700">
                  <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                  <span>Essay generation</span>
                </div>
                <div className="flex items-center gap-2 text-gray-700">
                  <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                  <span>Progress tracking</span>
                </div>
                <div className="flex items-center gap-2 text-gray-700">
                  <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                  <span>Study guides</span>
                </div>
              </div>
            </div>

            {/* File Format Support */}
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-xl p-4 mt-4 min-h-[120px]">
              <div className="flex items-center gap-2 mb-3">
                <Target className="w-5 h-5 text-blue-600 flex-shrink-0" />
                <span className="font-semibold text-blue-800">Supported File Formats:</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-sm">
                <div className="flex items-center gap-2 text-gray-700">
                  <CheckCircle className="w-4 h-4 text-blue-500 flex-shrink-0" />
                  <span>PDF Documents</span>
                </div>
                <div className="flex items-center gap-2 text-gray-700">
                  <CheckCircle className="w-4 h-4 text-blue-500 flex-shrink-0" />
                  <span>Word Documents</span>
                </div>
                <div className="flex items-center gap-2 text-gray-700">
                  <CheckCircle className="w-4 h-4 text-blue-500 flex-shrink-0" />
                  <span>PowerPoint Slides</span>
                </div>
                <div className="flex items-center gap-2 text-gray-700">
                  <CheckCircle className="w-4 h-4 text-blue-500 flex-shrink-0" />
                  <span>YouTube Videos</span>
                </div>
                <div className="flex items-center gap-2 text-gray-700">
                  <CheckCircle className="w-4 h-4 text-blue-500 flex-shrink-0" />
                  <span>Text Notes</span>
                </div>
                <div className="flex items-center gap-2 text-gray-700">
                  <CheckCircle className="w-4 h-4 text-blue-500 flex-shrink-0" />
                  <span>Images & Screenshots</span>
                </div>
              </div>
            </div>

            {/* Key Benefits */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
              <m.div variants={featureVariants} className="flex items-center gap-2 text-sm text-gray-600">
                <CheckCircle className="w-4 h-4 text-green-500" />
                Auto-generate study materials
              </m.div>
              <m.div variants={featureVariants} className="flex items-center gap-2 text-sm text-gray-600">
                <CheckCircle className="w-4 h-4 text-green-500" />
                Track learning progress
              </m.div>
              <m.div variants={featureVariants} className="flex items-center gap-2 text-sm text-gray-600">
                <CheckCircle className="w-4 h-4 text-green-500" />
                Boost retention by 300%
              </m.div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 mt-8 mx-auto md:mx-0 min-h-[60px] items-center">
              <Button
                name="sign-up"
                className="py-4 px-8 rounded-xl font-semibold text-lg bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-300"
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
                  className="py-4 px-8 rounded-xl font-semibold text-lg border-2 hover:bg-gray-50 transition-all duration-300"
                  onClick={() => router.push('/sign-in')}
                >
                  Sign In
                </Button>
              )}
            </div>

            {/* Social Proof */}
            {/* <div className="flex items-center gap-4 mt-6 mx-auto md:mx-0 min-h-[40px]">
              <div className="flex -space-x-2">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="w-8 h-8 rounded-full bg-gray-300 border-2 border-white"></div>
                ))}
              </div>
              <div className="text-sm text-gray-600">
                <span className="font-semibold">10,000+</span> students already learning
              </div>
            </div> */}

            {/* Guest Upload */}
            {!clerkUser && (
              <div className="w-full max-w-md mx-auto md:mx-0 mt-6 min-h-[80px]">
                <div className="text-center text-sm text-gray-500 mb-2">
                  Or try instantly with any PDF
                </div>
                <GuestFileUpload className="w-full" projectId={1} />
              </div>
            )}

            {/* Trust Indicators */}
            <div className="flex items-center justify-center md:justify-start gap-6 mt-8 text-xs text-gray-500 min-h-[20px]">
              <div className="flex items-center gap-1">
                <Clock className="w-3 h-3 flex-shrink-0" />
                <span>Setup in 30 seconds</span>
              </div>
              <div className="flex items-center gap-1">
                <Users className="w-3 h-3 flex-shrink-0" />
                <span>No credit card required</span>
              </div>
              <div className="flex items-center gap-1">
                <Target className="w-3 h-3 flex-shrink-0" />
                <span>Cancel anytime</span>
              </div>
            </div>
          </div>

          {/* Hero Image */}
          <div className="flex-1">
            <div className="relative">
              <Image
                src={typeof window !== 'undefined' && window.matchMedia('(image/webp)').matches ? "/images/learning.webp" : "/images/learning.png"}
                alt="AI-powered learning platform showing flashcards, quizzes, and study materials"
                className="w-full h-auto rounded-2xl shadow-2xl"
                width={600}
                height={600}
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 600px"
                priority
                placeholder="blur"
                blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=="
                style={{
                  maxWidth: '100%',
                  height: 'auto',
                }}
                onLoadingComplete={() => setImageLoaded(true)}
              />
              {imageLoaded && (
                <>
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
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </m.div>
  );
}
