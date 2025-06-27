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
			<div className="w-full p-8">
				{/* Hero Section */}
				<div className="text-center mb-16">
					<div className="flex items-center justify-center gap-2 mb-4">
						<div className="bg-gradient-to-r from-green-100 to-blue-100 text-green-800 px-4 py-2 rounded-full text-sm font-medium flex items-center gap-2">
							<Flame className="w-4 h-4" />
							Join Hundreds of Students Already Learning
						</div>
					</div>
					<h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
						Transform Your Learning
						<span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
							{' '}Forever
						</span>
					</h1>
					<p className="text-xl text-gray-600 max-w-4xl mx-auto mb-8">
						Discover why students are switching to AI-powered learning. 
						Experience the future of education with tools that adapt to your learning style.
					</p>
					
					{/* FOMO Stats */}
					<div className="grid grid-cols-1 md:grid-cols-4 gap-6 max-w-4xl mx-auto mb-12">
						<div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-lg">
							<div className="flex items-center gap-3 mb-2">
								<TrendingUp className="w-6 h-6 text-green-600" />
								<span className="text-2xl font-bold text-gray-900">300%</span>
							</div>
							<p className="text-sm text-gray-600">Better Retention</p>
						</div>
						<div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-lg">
							<div className="flex items-center gap-3 mb-2">
								<Clock className="w-6 h-6 text-blue-600" />
								<span className="text-2xl font-bold text-gray-900">80%</span>
							</div>
							<p className="text-sm text-gray-600">Time Saved</p>
						</div>
						<div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-lg">
							<div className="flex items-center gap-3 mb-2">
								<Users className="w-6 h-6 text-purple-600" />
								<span className="text-2xl font-bold text-gray-900">199+</span>
							</div>
							<p className="text-sm text-gray-600">Active Students</p>
						</div>
						<div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-lg">
							<div className="flex items-center gap-3 mb-2">
								<Star className="w-6 h-6 text-yellow-600" />
								<span className="text-2xl font-bold text-gray-900">4.9/5</span>
							</div>
							<p className="text-sm text-gray-600">Student Rating</p>
						</div>
					</div>
				</div>

				{/* Main Benefits Grid */}
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
					{gainList.map((gain: IGain, index: number) => (
						<GainCard key={index} gain={gain} isPurple={index % 2 !== 0} />
					))}
				</div>

				{/* FOMO Section */}
				<div className="bg-gradient-to-r from-red-50 to-orange-50 border border-red-200 rounded-3xl p-8 mb-16">
					<div className="text-center">
						<div className="flex items-center justify-center gap-2 mb-4">
							<Timer className="w-6 h-6 text-red-600" />
							<span className="text-red-800 font-semibold">Limited Time Offer</span>
						</div>
						<h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
							🎉 Free Forever Plan - No Credit Card Required
						</h2>
						<p className="text-lg text-gray-600 mb-6 max-w-2xl mx-auto">
							Join thousands of students who are already transforming their grades. 
							This offer won&apos;t last forever - start your learning journey today!
						</p>
						<div className="flex items-center justify-center gap-6 mb-8">
							<div className="flex items-center gap-2 text-sm text-gray-600">
								<CheckCircle className="w-4 h-4 text-green-500" />
								<span>Unlimited PDF uploads</span>
							</div>
							<div className="flex items-center gap-2 text-sm text-gray-600">
								<CheckCircle className="w-4 h-4 text-green-500" />
								<span>AI-powered tools</span>
							</div>
							<div className="flex items-center gap-2 text-sm text-gray-600">
								<CheckCircle className="w-4 h-4 text-green-500" />
								<span>Progress tracking</span>
							</div>
						</div>
						<Button
							onClick={handleSignUp}
							className="py-4 px-8 rounded-xl font-semibold text-lg bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 text-white shadow-lg hover:shadow-xl transition-all duration-300"
						>
							{clerkUser ? 'Go to Dashboard' : 'Start Learning Free Now'}
							<ArrowRight className="w-5 h-5 ml-2" />
						</Button>
					</div>
				</div>

				{/* Social Proof Section */}
				<div className="bg-white rounded-3xl p-8 border border-gray-200 shadow-lg mb-16">
					<div className="text-center mb-8">
						<h2 className="text-3xl font-bold text-gray-900 mb-4">
							What Students Are Saying
						</h2>
						<p className="text-gray-600">
							Join the community of successful learners
						</p>
					</div>
					<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
						<div className="bg-gray-50 rounded-2xl p-6">
							<div className="flex items-center gap-1 mb-3">
								{[1, 2, 3, 4, 5].map((star) => (
									<Star key={star} className="w-4 h-4 text-yellow-500 fill-current" />
								))}
							</div>
							<p className="text-gray-700 mb-4">
								&ldquo;This app literally saved my semester! I went from C&apos;s to A&apos;s in just 2 weeks. The flashcards are magic!&rdquo;
							</p>
							<div className="flex items-center gap-3">
								<div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-semibold text-sm">
									S
								</div>
								<div>
									<p className="font-semibold text-sm">Sarah M.</p>
									<p className="text-xs text-gray-500">Medical Student</p>
								</div>
							</div>
						</div>
						<div className="bg-gray-50 rounded-2xl p-6">
							<div className="flex items-center gap-1 mb-3">
								{[1, 2, 3, 4, 5].map((star) => (
									<Star key={star} className="w-4 h-4 text-yellow-500 fill-current" />
								))}
							</div>
							<p className="text-gray-700 mb-4">
								&ldquo;Finally, a tool that actually understands what I&apos;m studying. The AI chat feature is incredible!&rdquo;
							</p>
							<div className="flex items-center gap-3">
								<div className="w-10 h-10 bg-purple-500 rounded-full flex items-center justify-center text-white font-semibold text-sm">
									A
								</div>
								<div>
									<p className="font-semibold text-sm">Alex K.</p>
									<p className="text-xs text-gray-500">Engineering Student</p>
								</div>
							</div>
						</div>
						<div className="bg-gray-50 rounded-2xl p-6">
							<div className="flex items-center gap-1 mb-3">
								{[1, 2, 3, 4, 5].map((star) => (
									<Star key={star} className="w-4 h-4 text-yellow-500 fill-current" />
								))}
							</div>
							<p className="text-gray-700 mb-4">
								&ldquo;I was struggling with essay writing until I found this. Now I can focus on understanding, not formatting!&rdquo;
							</p>
							<div className="flex items-center gap-3">
								<div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center text-white font-semibold text-sm">
									M
								</div>
								<div>
									<p className="font-semibold text-sm">Mike R.</p>
									<p className="text-xs text-gray-500">Business Student</p>
								</div>
							</div>
						</div>
					</div>
				</div>

				{/* Final CTA */}
				<div className="text-center">
					<div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl p-12 text-white">
						<div className="flex items-center justify-center gap-2 mb-4">
							<Rocket className="w-8 h-8" />
							<h2 className="text-3xl md:text-4xl font-bold">
								Ready to Transform Your Learning?
							</h2>
						</div>
						<p className="text-xl mb-8 max-w-2xl mx-auto opacity-90">
							Join thousands of students who are already achieving better grades, 
							saving time, and enjoying their studies more than ever before.
						</p>
						<div className="flex flex-col sm:flex-row gap-4 justify-center">
							<Button
								onClick={handleSignUp}
								className="py-4 px-8 rounded-xl font-semibold text-lg bg-white text-blue-600 hover:bg-gray-100 shadow-lg hover:shadow-xl transition-all duration-300"
							>
								{clerkUser ? 'Go to Dashboard' : 'Start Learning Free'}
								<ArrowRight className="w-5 h-5 ml-2" />
							</Button>
							{!clerkUser && (
								<Button
									variant="outline"
									className="py-4 px-8 rounded-xl font-semibold text-lg border-2 border-white text-white hover:bg-white hover:text-blue-600 transition-all duration-300"
									onClick={() => router.push('/sign-in')}
								>
									Sign In
								</Button>
							)}
						</div>
						<div className="flex items-center justify-center gap-6 mt-8 text-sm opacity-80">
							<div className="flex items-center gap-2">
								<CheckCircle className="w-4 h-4" />
								<span>No credit card required</span>
							</div>
							<div className="flex items-center gap-2">
								<CheckCircle className="w-4 h-4" />
								<span>Setup in 30 seconds</span>
							</div>
							<div className="flex items-center gap-2">
								<CheckCircle className="w-4 h-4" />
								<span>Cancel anytime</span>
							</div>
						</div>
					</div>
				</div>
			</div>
		</MotionSection>
	);
}
