'use client';

import React, { useContext, useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import AccessDenied from '@/components/ui/AccessDenied';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import { useQuizAttempt } from '@/hooks/useQuizAttempt';
import { UserContext } from '../../../../../../../context/UserProvider';
import SectionContainer from '@/components/SectionContainer';
import { Button } from '@/components/ui/button';
import { CheckCircle, XCircle, Clock, Trophy, BarChart3 } from 'lucide-react';
import { QuizQuestion } from '@/types/quiz';
import { DrizzleQuiz } from '@/lib/db/drizzleType';

interface QuizResult {
	attempt: any;
	questions: QuizQuestion[];
	quiz: DrizzleQuiz;
	score: number;
	totalQuestions: number;
	correctAnswers: number;
	incorrectAnswers: number;
	skippedQuestions: number;
	percentage: number;
	passed: boolean;
	timeSpent: number;
}

export default function QuizResultPage() {
	const params = useParams();
	const router = useRouter();
	const attemptId = params.attemptId as string;
	const projectId = params.id as string;
	
	const { user, isInitializing: authLoading } = useContext(UserContext) as any;
	const { 
		quizAttempt, 
		loading: attemptLoading, 
	} = useQuizAttempt(attemptId);

	const [result, setResult] = useState<QuizResult | null>(null);

	// Calculate results when data is loaded
	useEffect(() => {
		if (quizAttempt?.attempt && quizAttempt?.questions) {
			const attempt = quizAttempt.attempt;
			const questions = quizAttempt.questions;
			const quiz = quizAttempt.quiz;

			// Calculate statistics
			const totalQuestions = questions.length;
			const correctAnswers = attempt.correctAnswers || 0;
			const incorrectAnswers = attempt.incorrectAnswers || 0;
			const skippedQuestions = totalQuestions - correctAnswers - incorrectAnswers;
			const percentage = attempt.score || 0;
			const passed = percentage >= 70;
			const timeSpent = attempt.totalTime || 0;

			setResult({
				attempt,
				questions,
				quiz,
				score: correctAnswers,
				totalQuestions,
				correctAnswers,
				incorrectAnswers,
				skippedQuestions,
				percentage,
				passed,
				timeSpent,
			});
		}
	}, [quizAttempt]);

	// Show loading while checking authentication and fetching data
	if (authLoading || attemptLoading) {
		return (
			<div className="flex items-center justify-center min-h-screen">
				<LoadingSpinner size="lg" />
			</div>
		);
	}

	// Check if user is authenticated
	if (!user) {
		return <AccessDenied message="Please log in to view this quiz result." />;
	}

	// Show loading while calculating results
	if (!result) {
		return (
			<div className="flex items-center justify-center min-h-screen">
				<LoadingSpinner size="lg" />
			</div>
		);
	}

	const formatTime = (seconds: number): string => {
		const hours = Math.floor(seconds / 3600);
		const minutes = Math.floor((seconds % 3600) / 60);
		const secs = seconds % 60;
		
		if (hours > 0) {
			return `${hours}h ${minutes}m ${secs}s`;
		}
		return `${minutes}m ${secs}s`;
	};

	const handleRetakeQuiz = () => {
		router.push(`/projects/${projectId}`);
	};

	const handleViewProject = () => {
		router.push(`/projects/${projectId}`);
	};

	return (
		<SectionContainer className="my-10">
			<div className="max-w-4xl mx-auto">
				{/* Header */}
				<div className="text-center mb-8">
					<h1 className="text-3xl font-bold text-gray-900 mb-2">
						Quiz Results
					</h1>
					<h2 className="text-xl text-gray-600">
						{result.quiz.title}
					</h2>
				</div>

				{/* Result Summary Card */}
				<div className="bg-white rounded-lg shadow-lg p-6 mb-8">
					<div className="flex items-center justify-center mb-6">
						{result.passed ? (
							<div className="flex items-center gap-3 text-green-600">
								<CheckCircle className="w-12 h-12" />
								<span className="text-2xl font-bold">Congratulations! You Passed!</span>
							</div>
						) : (
							<div className="flex items-center gap-3 text-red-600">
								<XCircle className="w-12 h-12" />
								<span className="text-2xl font-bold">Keep Trying! You&apos;ll Get It Next Time!</span>
							</div>
						)}
					</div>

					{/* Score Display */}
					<div className="text-center mb-6">
						<div className="text-6xl font-bold text-gray-900 mb-2">
							{result.percentage}%
						</div>
						<div className="text-lg text-gray-600">
							{result.score} out of {result.totalQuestions} questions correct
						</div>
					</div>

					{/* Statistics Grid */}
					<div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
						<div className="flex items-center gap-3 p-4 bg-green-50 rounded-lg">
							<CheckCircle className="w-8 h-8 text-green-600" />
							<div>
								<div className="text-2xl font-bold text-green-600">
									{result.correctAnswers}
								</div>
								<div className="text-sm text-green-700">Correct</div>
							</div>
						</div>

						<div className="flex items-center gap-3 p-4 bg-red-50 rounded-lg">
							<XCircle className="w-8 h-8 text-red-600" />
							<div>
								<div className="text-2xl font-bold text-red-600">
									{result.incorrectAnswers}
								</div>
								<div className="text-sm text-red-700">Incorrect</div>
							</div>
						</div>

						<div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
							<Clock className="w-8 h-8 text-gray-600" />
							<div>
								<div className="text-2xl font-bold text-gray-600">
									{formatTime(result.timeSpent)}
								</div>
								<div className="text-sm text-gray-700">Time Spent</div>
							</div>
						</div>
					</div>

					{/* Passing Score Info */}
					<div className="text-center p-4 bg-blue-50 rounded-lg">
						<div className="text-sm text-blue-700">
							Passing Score: 70%
						</div>
						<div className="text-sm text-blue-600">
							Your Score: {result.percentage}%
						</div>
					</div>
				</div>

				{/* Action Buttons */}
				<div className="flex flex-col sm:flex-row gap-4 justify-center">
					<Button
						onClick={handleRetakeQuiz}
						variant="outline"
						className="flex items-center gap-2"
					>
						<Trophy className="w-4 h-4" />
						Retake Quiz
					</Button>
					
					<Button
						onClick={handleViewProject}
						className="flex items-center gap-2"
					>
						<BarChart3 className="w-4 h-4" />
						Back to Project
					</Button>
				</div>
			</div>
		</SectionContainer>
	);
} 