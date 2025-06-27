'use client';

import React, { useContext, useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import AccessDenied from '@/components/ui/AccessDenied';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import { useQuizAttempt } from '@/hooks/useQuizAttempt';
import { UserContext } from '../../../../../../../context/UserProvider';
import SectionContainer from '@/components/SectionContainer';
import { Button } from '@/components/ui/button';
import { 
	CheckCircle, 
	XCircle, 
	Clock, 
	Trophy, 
	BarChart3, 
	Target, 
	TrendingUp, 
	Award,
	Star,
	Zap,
	BookOpen,
	Calendar
} from 'lucide-react';
import { QuizQuestion } from '@/types/quiz';
import { DrizzleQuiz } from '@/lib/db/drizzleType';
import ReactApexChart from 'react-apexcharts';
import { ApexOptions } from 'apexcharts';

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
		router.push(`/projects/${projectId}?tab=quizzes`);
	};

	const handleViewProject = () => {
		router.push(`/projects/${projectId}?tab=medias`);
	};

	// Chart configurations
	const donutChartOptions: ApexOptions = {
		chart: {
			type: 'donut',
			background: 'transparent',
		},
		colors: ['#10B981', '#EF4444', '#F59E0B'],
		labels: ['Correct', 'Incorrect', 'Skipped'],
		plotOptions: {
			pie: {
				donut: {
					size: '65%',
					labels: {
						show: true,
						total: {
							show: true,
							label: 'Total',
							fontSize: '16px',
							fontWeight: 600,
							color: '#374151'
						}
					}
				}
			}
		},
		legend: {
			position: 'bottom',
			labels: {
				colors: '#6B7280'
			}
		},
		dataLabels: {
			enabled: true,
			style: {
				fontSize: '14px',
				fontWeight: '600',
				colors: ['#FFFFFF']
			}
		}
	};

	const donutChartSeries = [result.correctAnswers, result.incorrectAnswers, result.skippedQuestions];

	const progressChartOptions: ApexOptions = {
		chart: {
			type: 'radialBar',
			background: 'transparent',
		},
		plotOptions: {
			radialBar: {
				startAngle: -135,
				endAngle: 135,
				hollow: {
					margin: 15,
					size: '70%',
				},
				track: {
					background: '#E5E7EB',
					strokeWidth: '97%',
					margin: 5,
				},
				dataLabels: {
					name: {
						show: true,
						fontSize: '16px',
						fontWeight: 600,
						color: '#374151',
						offsetY: -10
					},
					value: {
						show: true,
						fontSize: '30px',
						fontWeight: 700,
						color: result.passed ? '#10B981' : '#EF4444',
						offsetY: 5,
						formatter: function(val: number) {
							return val.toFixed(0) + '%';
						}
					}
				}
			}
		},
		fill: {
			colors: [result.passed ? '#10B981' : '#EF4444']
		},
		stroke: {
			lineCap: 'round'
		}
	};

	const progressChartSeries = [result.percentage];

	return (
		<SectionContainer className="my-10">
			<div className="max-w-7xl mx-auto">
				{/* Hero Section */}
				<div className="text-center mb-8">
					<div className="mb-4">
						{result.passed ? (
							<div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-4">
								<Trophy className="w-10 h-10 text-green-600" />
							</div>
						) : (
							<div className="inline-flex items-center justify-center w-20 h-20 bg-red-100 rounded-full mb-4">
								<Target className="w-10 h-10 text-red-600" />
							</div>
						)}
					</div>
					<h1 className="text-4xl font-bold text-gray-900 mb-2">
						{result.passed ? '🎉 Congratulations!' : '💪 Keep Learning!'}
					</h1>
					<h2 className="text-xl text-gray-600 mb-4">
						{result.quiz.title}
					</h2>
					<div className="flex items-center justify-center gap-2 text-sm text-gray-500">
						<Calendar className="w-4 h-4" />
						<span>Completed on {new Date(result.attempt.startedAt).toLocaleDateString()}</span>
					</div>
				</div>

				{/* Score Overview Cards */}
				<div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
					<div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6 border border-blue-200">
						<div className="flex items-center gap-3 mb-3">
							<div className="p-2 bg-blue-500 rounded-lg">
								<TrendingUp className="w-5 h-5 text-white" />
							</div>
							<span className="text-sm font-medium text-blue-700">Score</span>
						</div>
						<div className="text-3xl font-bold text-blue-900">{result.percentage}%</div>
						<div className="text-sm text-blue-600">{result.score}/{result.totalQuestions} correct</div>
					</div>

					<div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-6 border border-green-200">
						<div className="flex items-center gap-3 mb-3">
							<div className="p-2 bg-green-500 rounded-lg">
								<CheckCircle className="w-5 h-5 text-white" />
							</div>
							<span className="text-sm font-medium text-green-700">Correct</span>
						</div>
						<div className="text-3xl font-bold text-green-900">{result.correctAnswers}</div>
						<div className="text-sm text-green-600">Great job!</div>
					</div>

					<div className="bg-gradient-to-br from-red-50 to-red-100 rounded-xl p-6 border border-red-200">
						<div className="flex items-center gap-3 mb-3">
							<div className="p-2 bg-red-500 rounded-lg">
								<XCircle className="w-5 h-5 text-white" />
							</div>
							<span className="text-sm font-medium text-red-700">Incorrect</span>
						</div>
						<div className="text-3xl font-bold text-red-900">{result.incorrectAnswers}</div>
						<div className="text-sm text-red-600">Review needed</div>
					</div>

					<div className="bg-gradient-to-br from-amber-50 to-amber-100 rounded-xl p-6 border border-amber-200">
						<div className="flex items-center gap-3 mb-3">
							<div className="p-2 bg-amber-500 rounded-lg">
								<Clock className="w-5 h-5 text-white" />
							</div>
							<span className="text-sm font-medium text-amber-700">Time</span>
						</div>
						<div className="text-3xl font-bold text-amber-900">{formatTime(result.timeSpent)}</div>
						<div className="text-sm text-amber-600">Time spent</div>
					</div>
				</div>

				{/* Charts Section */}
				<div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
					{/* Progress Chart */}
					<div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
						<h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
							<Award className="w-5 h-5 text-blue-600" />
							Performance Score
						</h3>
						<div className="flex justify-center">
							<ReactApexChart
								options={progressChartOptions}
								series={progressChartSeries}
								type="radialBar"
								height={300}
							/>
						</div>
						<div className="text-center mt-4">
							<div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium ${
								result.passed 
									? 'bg-green-100 text-green-800' 
									: 'bg-red-100 text-red-800'
							}`}>
								{result.passed ? <CheckCircle className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
								{result.passed ? 'Passed' : 'Not Passed'} (70% required)
							</div>
						</div>
					</div>

					{/* Question Distribution Chart */}
					<div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
						<h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
							<BarChart3 className="w-5 h-5 text-blue-600" />
							Question Distribution
						</h3>
						<ReactApexChart
							options={donutChartOptions}
							series={donutChartSeries}
							type="donut"
							height={300}
						/>
					</div>
				</div>

				{/* Performance Insights */}
				<div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-200 mb-8">
					<h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
						<Zap className="w-5 h-5 text-blue-600" />
						Performance Insights
					</h3>
					<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
						<div className="flex items-center gap-3">
							<Star className="w-5 h-5 text-yellow-500" />
							<div>
								<div className="font-medium text-gray-900">Accuracy Rate</div>
								<div className="text-sm text-gray-600">
									{result.totalQuestions > 0 ? Math.round((result.correctAnswers / result.totalQuestions) * 100) : 0}%
								</div>
							</div>
						</div>
						<div className="flex items-center gap-3">
							<BookOpen className="w-5 h-5 text-blue-500" />
							<div>
								<div className="font-medium text-gray-900">Completion Rate</div>
								<div className="text-sm text-gray-600">
									{result.totalQuestions > 0 ? Math.round(((result.correctAnswers + result.incorrectAnswers) / result.totalQuestions) * 100) : 0}%
								</div>
							</div>
						</div>
						<div className="flex items-center gap-3">
							<TrendingUp className="w-5 h-5 text-green-500" />
							<div>
								<div className="font-medium text-gray-900">Efficiency</div>
								<div className="text-sm text-gray-600">
									{result.timeSpent > 0 ? Math.round(result.correctAnswers / (result.timeSpent / 60)) : 0} correct/min
								</div>
							</div>
						</div>
					</div>
				</div>

				{/* Action Buttons */}
				<div className="flex flex-col sm:flex-row gap-4 justify-center">
					<Button
						onClick={handleRetakeQuiz}
						variant="outline"
						className="flex items-center gap-2 px-8 py-3 text-lg"
					>
						<Trophy className="w-5 h-5" />
						Retake Quiz
					</Button>
					
					<Button
						onClick={handleViewProject}
						className="flex items-center gap-2 px-8 py-3 text-lg bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
					>
						<BarChart3 className="w-5 h-5" />
						Back to Project
					</Button>
				</div>
			</div>
		</SectionContainer>
	);
} 