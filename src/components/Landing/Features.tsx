'use client';
import React from 'react';
import { IFeature } from '@/lib/type';
import MotionSection from '../MotionSection';
import { features } from '@/lib/constant';
import { 
	Zap, 
	Target, 
	Sparkles,
	ArrowRight,
	CheckCircle,
	FolderPlus,
	Upload,
	Brain
} from 'lucide-react';

// Define icons for each feature step
const featureIcons = [
	<FolderPlus key="folder" className="w-6 md:w-8 h-6 md:h-8 text-blue-600" />,
	<Upload key="upload" className="w-6 md:w-8 h-6 md:h-8 text-purple-600" />,
	<Brain key="brain" className="w-6 md:w-8 h-6 md:h-8 text-green-600" />
];

// Define benefits for each feature step
const featureBenefits = [
	[
		"Organize study materials",
		"Create multiple projects",
		"Set learning goals"
	],
	[
		"Upload any PDF format",
		"AI processes content",
		"Instant material analysis"
	],
	[
		"Generate flashcards",
		"Create quizzes",
		"Write essays with AI"
	]
];

export default function Features() {
  return (
    <MotionSection>
      <div className="max-w-[1400px] mx-auto p-4 md:p-8">
        <div className="max-w-[2000px] mx-auto">
          {/* Header Section */}
          <div className="text-center mb-8 md:mb-12">
            <div className="flex items-center justify-center gap-2 mb-3 md:mb-4">
              <div className="bg-blue-100 text-blue-800 px-2 md:px-3 py-1 rounded-full text-xs md:text-sm font-medium flex items-center gap-1">
                <Zap className="w-3 h-3" />
                <span className="hidden sm:inline">Simple 3-Step Process</span>
                <span className="sm:hidden">3 Steps</span>
              </div>
            </div>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-3 md:mb-4">
              How It Works
            </h1>
            <p className="text-base md:text-xl text-gray-600 max-w-3xl mx-auto px-2">
              Transform any PDF into interactive learning materials in just three simple steps. 
              Our AI does the heavy lifting while you focus on learning.
            </p>
          </div>

          {/* Features Grid */}
          <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-8 mt-8 md:mt-12">
            {features.map((feature: IFeature, index: number) => (
              <div key={index} className="relative">
                {/* Step Number */}
                <div className="absolute -top-2 md:-top-4 -left-2 md:-left-4 w-6 md:w-8 h-6 md:h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-xs md:text-sm z-10">
                  {index + 1}
                </div>
                
                {/* Feature Card */}
                <div className="bg-white rounded-xl md:rounded-2xl p-4 md:p-8 border border-gray-200 shadow-lg hover:shadow-xl transition-all duration-300 h-full relative overflow-hidden">
                  {/* Background Pattern */}
                  <div className="absolute top-0 right-0 w-16 md:w-32 h-16 md:h-32 bg-gradient-to-br from-blue-50 to-purple-50 rounded-full -translate-y-8 md:-translate-y-16 translate-x-8 md:translate-x-16 opacity-50"></div>
                  
                  {/* Icon */}
                  <div className="relative z-10 mb-4 md:mb-6">
                    <div className="w-12 md:w-16 h-12 md:h-16 bg-gradient-to-r from-blue-100 to-purple-100 rounded-xl md:rounded-2xl flex items-center justify-center mb-3 md:mb-4">
                      {featureIcons[index]}
                    </div>
                  </div>

                  {/* Content */}
                  <div className="relative z-10">
                    <h3 className="text-lg md:text-2xl font-bold text-gray-900 mb-2 md:mb-3">
                      {feature.title}
                    </h3>
                    <p className="text-sm md:text-base text-gray-600 leading-relaxed mb-3 md:mb-4">
                      {feature.description}
                    </p>
                    
                    {/* Free Badge */}
                    <div className="inline-flex items-center gap-1 md:gap-2 bg-green-100 text-green-800 px-2 md:px-3 py-1 rounded-full text-xs md:text-sm font-medium mb-3 md:mb-4">
                      <Sparkles className="w-3 h-3" />
                      Free Feature
                    </div>

                    {/* Key Points */}
                    <div className="space-y-1 md:space-y-2">
                      {featureBenefits[index]?.map((benefit: string, idx: number) => (
                        <div key={idx} className="flex items-center gap-2 text-xs md:text-sm text-gray-700">
                          <CheckCircle className="w-3 md:w-4 h-3 md:h-4 text-green-500 flex-shrink-0" />
                          <span>{benefit}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Arrow Connector - Hidden on Mobile */}
                {index < features.length - 1 && (
                  <div className="hidden md:block absolute top-1/2 -right-4 transform -translate-y-1/2 z-20">
                    <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
                      <ArrowRight className="w-4 h-4 text-white" />
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Bottom CTA - Mobile Optimized */}
          <div className="text-center mt-8 md:mt-16">
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl md:rounded-2xl p-4 md:p-8 border border-blue-200">
              <div className="flex items-center justify-center gap-2 mb-3 md:mb-4">
                <Target className="w-5 md:w-6 h-5 md:h-6 text-blue-600" />
                <h3 className="text-lg md:text-2xl font-bold text-gray-900">
                  Ready to Start Learning?
                </h3>
              </div>
              <p className="text-sm md:text-base text-gray-600 mb-4 md:mb-6 max-w-2xl mx-auto px-2">
                Join thousands of students who are already transforming their study habits with AI-powered learning tools.
              </p>
              <div className="flex flex-col md:flex-row items-center justify-center gap-2 md:gap-4 text-xs md:text-sm">
                <div className="flex items-center gap-2 text-gray-600">
                  <CheckCircle className="w-3 md:w-4 h-3 md:h-4 text-green-500" />
                  <span>No credit card required</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <CheckCircle className="w-3 md:w-4 h-3 md:h-4 text-green-500" />
                  <span>Setup in 30 seconds</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <CheckCircle className="w-3 md:w-4 h-3 md:h-4 text-green-500" />
                  <span>Free forever plan</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </MotionSection>
  );
}
