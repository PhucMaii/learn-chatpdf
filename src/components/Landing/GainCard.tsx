import { IGain } from '@/lib/type';
import { cn } from '@/lib/utils';
import React from 'react';
import { CheckCircle, Sparkles } from 'lucide-react';

type Props = {
  gain: IGain;
  isPurple?: boolean;
};

export default function GainCard({ gain, isPurple }: Props) {
  return (
    <div className="group relative p-6 flex flex-col gap-4 items-center justify-start w-full h-full rounded-3xl border border-gray-200 hover:border-blue-300 hover:scale-[1.02] transition-all duration-300 bg-white shadow-lg hover:shadow-xl">
      {/* Background Pattern */}
      <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-blue-50 to-purple-50 rounded-full -translate-y-12 translate-x-12 opacity-50 group-hover:opacity-75 transition-opacity duration-300"></div>
      
      {/* Free Badge */}
      <div className="absolute -top-3 -right-3 bg-gradient-to-r from-green-500 to-blue-500 text-white px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1 shadow-lg">
        <Sparkles className="w-3 h-3" />
        Free
      </div>

      {/* Icon */}
      <div className="relative z-10 mt-8">
        <div
          className={cn(
            'w-20 h-20 flex items-center justify-center text-white rounded-2xl shadow-lg group-hover:scale-105 transition-transform duration-300',
            isPurple 
              ? 'bg-gradient-to-r from-purple-500 to-blue-500' 
              : 'bg-gradient-to-r from-blue-500 to-green-500'
          )}
        >
          <gain.icon className="w-10 h-10" />
        </div>
      </div>

      {/* Content */}
      <div className="relative z-10 text-center flex-1 flex flex-col justify-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-4 group-hover:text-blue-600 transition-colors duration-300">
          {gain.title}
        </h2>
        <p className="text-gray-600 leading-relaxed mb-6">
          {gain.description}
        </p>
        
        {/* Key Benefits */}
        <div className="space-y-2">
          {gain.title === 'Auto-Generate Flashcards' && (
            <>
              <div className="flex items-center gap-2 text-sm text-gray-700">
                <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                <span>Instant generation</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-700">
                <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                <span>Multiple file types</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-700">
                <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                <span>AI-optimized content</span>
              </div>
            </>
          )}
          {gain.title === 'Create Interactive Quizzes' && (
            <>
              <div className="flex items-center gap-2 text-sm text-gray-700">
                <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                <span>Multiple question types</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-700">
                <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                <span>Detailed explanations</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-700">
                <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                <span>Auto-graded results</span>
              </div>
            </>
          )}
          {gain.title === 'AI Essay Generator' && (
            <>
              <div className="flex items-center gap-2 text-sm text-gray-700">
                <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                <span>Structured outlines</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-700">
                <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                <span>Content suggestions</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-700">
                <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                <span>Academic writing</span>
              </div>
            </>
          )}
          {gain.title === 'Humanize Your Content' && (
            <>
              <div className="flex items-center gap-2 text-sm text-gray-700">
                <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                <span>Natural writing style</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-700">
                <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                <span>Personal touch</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-700">
                <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                <span>Plagiarism-free</span>
              </div>
            </>
          )}
          {gain.title === 'Track Learning Progress' && (
            <>
              <div className="flex items-center gap-2 text-sm text-gray-700">
                <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                <span>Performance analytics</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-700">
                <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                <span>Progress trends</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-700">
                <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                <span>Weak area identification</span>
              </div>
            </>
          )}
          {gain.title === 'Multi-Format Support' && (
            <>
              <div className="flex items-center gap-2 text-sm text-gray-700">
                <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                <span>PDF, Word, PowerPoint</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-700">
                <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                <span>Image processing</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-700">
                <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                <span>Universal compatibility</span>
              </div>
            </>
          )}
          {gain.title === 'Smart Study Organization' && (
            <>
              <div className="flex items-center gap-2 text-sm text-gray-700">
                <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                <span>Project organization</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-700">
                <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                <span>Cloud sync</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-700">
                <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                <span>Access anywhere</span>
              </div>
            </>
          )}
          {gain.title === 'Save 80% Study Time' && (
            <>
              <div className="flex items-center gap-2 text-sm text-gray-700">
                <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                <span>4 hours → 1 hour</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-700">
                <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                <span>Instant generation</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-700">
                <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                <span>Focus on learning</span>
              </div>
            </>
          )}
          {gain.title === 'Reduce Stress & Anxiety' && (
            <>
              <div className="flex items-center gap-2 text-sm text-gray-700">
                <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                <span>Manageable chunks</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-700">
                <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                <span>Clear structure</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-700">
                <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                <span>Confidence boost</span>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Hover Effect Border */}
      <div className="absolute inset-0 rounded-3xl border-2 border-transparent group-hover:border-blue-300 transition-all duration-300"></div>
    </div>
  );
}
