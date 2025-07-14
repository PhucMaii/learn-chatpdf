'use client';
import { gainList } from '@/lib/constant';
import React from 'react';
import GainCard from './GainCard';
import { IGain } from '@/lib/type';
import MotionSection from '../MotionSection';
import { Button } from '../ui/button';
import { useRouter } from 'next/navigation';
import { useUser } from '@clerk/nextjs';
import { 
	TrendingUp, 
	Users, 
	Clock, 
	Star, 
	CheckCircle, 
	ArrowRight,
	Rocket,
	Flame,
	Timer
} from 'lucide-react';

export default function Gain() {
	const { user: clerkUser } = useUser();
	const router = useRouter();

	const handleSignUp = () => {
		if (clerkUser) {
			router.push('/projects');
		} else {
			router.push('/sign-up');
		}
	};

	return (
		<MotionSection>
			<div className="w-full p-4 md:p-8">
				{/* Hero Section */}
				<div className="text-center mb-8 md:mb-16">
					<div className="flex items-center justify-center gap-2 mb-3 md:mb-4">
						<div className="bg-gradient-to-r from-green-100 to-blue-100 text-green-800 px-2 md:px-4 py-1 md:py-2 rounded-full text-xs md:text-sm font-medium flex items-center gap-1 md:gap-2">
							<Flame className="w-3 md:w-4 h-3 md:h-4" />
							<span className="hidden sm:inline">Join Hundreds of Students Already Learning</span>
							<span className="sm:hidden">Join 199+ Students</span>
						</div>
					</div>
					<h1 className="text-3xl md:text-4xl lg:text-6xl font-bold text-gray-900 mb-4 md:mb-6">
						Transform Your Learning
						<span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
							{' '}Forever
						</span>
					</h1>
					<p className="text-base md:text-xl text-gray-600 max-w-4xl mx-auto mb-6 md:mb-8 px-2">
						Discover why students are switching to AI-powered learning. 
						Experience the future of education with tools that adapt to your learning style.
					</p>
					
					{/* Mobile-Optimized Stats */}
					<div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-6 max-w-4xl mx-auto mb-8 md:mb-12">
						<div className="bg-white rounded-xl md:rounded-2xl p-3 md:p-6 border border-gray-200 shadow-lg">
							<div className="flex flex-col md:flex-row items-center gap-2 md:gap-3 mb-1 md:mb-2">
								<TrendingUp className="w-4 md:w-6 h-4 md:h-6 text-green-600" />
								<span className="text-lg md:text-2xl font-bold text-gray-900">300%</span>
							</div>
							<p className="text-xs md:text-sm text-gray-600">Better Retention</p>
						</div>
						<div className="bg-white rounded-xl md:rounded-2xl p-3 md:p-6 border border-gray-200 shadow-lg">
							<div className="flex flex-col md:flex-row items-center gap-2 md:gap-3 mb-1 md:mb-2">
								<Clock className="w-4 md:w-6 h-4 md:h-6 text-blue-600" />
								<span className="text-lg md:text-2xl font-bold text-gray-900">80%</span>
							</div>
							<p className="text-xs md:text-sm text-gray-600">Time Saved</p>
						</div>
						<div className="bg-white rounded-xl md:rounded-2xl p-3 md:p-6 border border-gray-200 shadow-lg">
							<div className="flex flex-col md:flex-row items-center gap-2 md:gap-3 mb-1 md:mb-2">
								<Users className="w-4 md:w-6 h-4 md:h-6 text-purple-600" />
								<span className="text-lg md:text-2xl font-bold text-gray-900">199+</span>
							</div>
							<p className="text-xs md:text-sm text-gray-600">Active Students</p>
						</div>
						<div className="bg-white rounded-xl md:rounded-2xl p-3 md:p-6 border border-gray-200 shadow-lg">
							<div className="flex flex-col md:flex-row items-center gap-2 md:gap-3 mb-1 md:mb-2">
								<Star className="w-4 md:w-6 h-4 md:h-6 text-yellow-600" />
								<span className="text-lg md:text-2xl font-bold text-gray-900">4.9/5</span>
							</div>
							<p className="text-xs md:text-sm text-gray-600">Student Rating</p>
						</div>
					</div>
				</div>

				{/* Main Benefits Grid */}
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8 mb-8 md:mb-16">
					{gainList.map((gain: IGain, index: number) => (
						<GainCard key={index} gain={gain} isPurple={index % 2 !== 0} />
					))}
				</div>

				{/* FOMO Section - Mobile Optimized */}
				<div className="bg-gradient-to-r from-red-50 to-orange-50 border border-red-200 rounded-2xl md:rounded-3xl p-4 md:p-8 mb-8 md:mb-16">
					<div className="text-center">
						<div className="flex items-center justify-center gap-2 mb-3 md:mb-4">
							<Timer className="w-4 md:w-6 h-4 md:h-6 text-red-600" />
							<span className="text-red-800 font-semibold text-sm md:text-base">Limited Time Offer</span>
						</div>
						<h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 mb-3 md:mb-4">
							🎉 Free Forever Plan - No Credit Card Required
						</h2>
						<p className="text-sm md:text-lg text-gray-600 mb-4 md:mb-6 max-w-2xl mx-auto px-2">
							Join thousands of students who are already transforming their grades. 
							This offer won&apos;t last forever - start your learning journey today!
						</p>
						<div className="flex flex-col md:flex-row items-center justify-center gap-2 md:gap-6 mb-4 md:mb-8 text-xs md:text-sm">
							<div className="flex items-center gap-2 text-gray-600">
								<CheckCircle className="w-3 md:w-4 h-3 md:h-4 text-green-500" />
								<span>Unlimited PDF uploads</span>
							</div>
							<div className="flex items-center gap-2 text-gray-600">
								<CheckCircle className="w-3 md:w-4 h-3 md:h-4 text-green-500" />
								<span>AI-powered tools</span>
							</div>
							<div className="flex items-center gap-2 text-gray-600">
								<CheckCircle className="w-3 md:w-4 h-3 md:h-4 text-green-500" />
								<span>Progress tracking</span>
							</div>
						</div>
						<Button
							onClick={handleSignUp}
							className="py-3 md:py-4 px-6 md:px-8 rounded-xl font-semibold text-base md:text-lg bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 w-full sm:w-auto"
						>
							{clerkUser ? 'Go to Dashboard' : 'Start Learning Free Now'}
							<ArrowRight className="w-4 md:w-5 h-4 md:h-5 ml-2" />
						</Button>
					</div>
				</div>

				{/* Final CTA Section - Mobile Optimized */}
				<div className="text-center">
					<div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl md:rounded-3xl p-6 md:p-12 text-white">
						<div className="flex items-center justify-center gap-2 mb-3 md:mb-4">
							<Rocket className="w-6 md:w-8 h-6 md:h-8" />
							<h2 className="text-2xl md:text-3xl lg:text-4xl font-bold">
								Ready to Transform Your Learning?
							</h2>
						</div>
						<p className="text-base md:text-xl mb-6 md:mb-8 max-w-2xl mx-auto opacity-90 px-2">
							Join thousands of students who are already achieving better grades, 
							saving time, and enjoying their studies more than ever before.
						</p>
						<div className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center mb-6 md:mb-8">
							<Button
								onClick={handleSignUp}
								className="py-3 md:py-4 px-6 md:px-8 rounded-xl font-semibold text-base md:text-lg bg-white text-blue-600 hover:bg-gray-100 shadow-lg hover:shadow-xl transition-all duration-300 w-full sm:w-auto"
							>
								{clerkUser ? 'Go to Dashboard' : 'Start Learning Free'}
								<ArrowRight className="w-4 md:w-5 h-4 md:h-5 ml-2" />
							</Button>
							{!clerkUser && (
								<Button
									variant="outline"
									className="py-3 md:py-4 px-6 md:px-8 rounded-xl font-semibold text-base md:text-lg border-2 border-white text-white hover:bg-white hover:text-blue-600 transition-all duration-300 w-full sm:w-auto"
									onClick={() => router.push('/sign-in')}
								>
									Sign In
								</Button>
							)}
						</div>
						<div className="flex flex-col md:flex-row items-center justify-center gap-2 md:gap-6 text-xs md:text-sm opacity-80">
							<div className="flex items-center gap-2">
								<CheckCircle className="w-3 md:w-4 h-3 md:h-4" />
								<span>No credit card required</span>
							</div>
							<div className="flex items-center gap-2">
								<CheckCircle className="w-3 md:w-4 h-3 md:h-4" />
								<span>Setup in 30 seconds</span>
							</div>
							<div className="flex items-center gap-2">
								<CheckCircle className="w-3 md:w-4 h-3 md:h-4" />
								<span>Cancel anytime</span>
							</div>
						</div>
					</div>
				</div>
			</div>
		</MotionSection>
	);
}
