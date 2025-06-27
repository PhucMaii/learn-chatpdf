import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { 
	Eye, 
	TrendingUp, 
	Clock, 
	Calendar,
	Target,
	CheckCircle,
	XCircle,
	AlertCircle
} from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';

interface QuizAttempt {
	id: number;
	score: number;
	startedAt: string;
	endedAt: string;
	totalQuestions: number;
	correctAnswers: number;
	incorrectAnswers: number;
	skippedQuestions: number;
	totalTime: number;
}

interface QuizzesTableProps {
	quizAttempts?: QuizAttempt[];
}

export default function QuizzesTable({ quizAttempts = [] }: QuizzesTableProps) {
	const router = useRouter();
	const { id: projectId }: any = useParams();

	const formatTime = (seconds: number): string => {
		const hours = Math.floor(seconds / 3600);
		const minutes = Math.floor((seconds % 3600) / 60);
		const secs = seconds % 60;
		
		if (hours > 0) {
			return `${hours}h ${minutes}m`;
		}
		return `${minutes}m ${secs}s`;
	};

	const formatDate = (dateString: string): string => {
		return new Date(dateString).toLocaleDateString('en-US', {
			month: 'short',
			day: 'numeric',
			hour: '2-digit',
			minute: '2-digit'
		});
	};

	const getStatusBadge = (score: number) => {
		if (score >= 90) {
			return (
				<Badge className="bg-green-100 text-green-800 border-green-200">
					<CheckCircle className="w-3 h-3 mr-1" />
					Excellent
				</Badge>
			);
		} else if (score >= 70) {
			return (
				<Badge className="bg-blue-100 text-blue-800 border-blue-200">
					<Target className="w-3 h-3 mr-1" />
					Passed
				</Badge>
			);
		} else if (score >= 50) {
			return (
				<Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">
					<AlertCircle className="w-3 h-3 mr-1" />
					Needs Work
				</Badge>
			);
		} else {
			return (
				<Badge className="bg-red-100 text-red-800 border-red-200">
					<XCircle className="w-3 h-3 mr-1" />
					Failed
				</Badge>
			);
		}
	};

	const handleViewResult = (attemptId: number) => {
		router.push(`/projects/${projectId}/quiz-attempt/${attemptId}/result`);
	};

	if (quizAttempts.length === 0) {
		return (
			<div className="text-center py-12">
				<div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
					<Target className="w-8 h-8 text-gray-400" />
				</div>
				<h3 className="text-lg font-medium text-gray-900 mb-2">No Quiz Attempts Yet</h3>
				<p className="text-gray-500 mb-4">Start your first quiz to see your results here!</p>
			</div>
		);
	}

	return (
		<div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
			<div className="px-6 py-4 border-b border-gray-200">
				<h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
					<TrendingUp className="w-5 h-5 text-blue-600" />
					Quiz History
				</h3>
				<p className="text-sm text-gray-600 mt-1">
					Track your learning progress across all attempts
				</p>
			</div>
			
			<div className="overflow-x-auto">
				<Table>
					<TableHeader>
						<TableRow className="bg-gray-50">
							<TableHead className="font-semibold text-gray-700">Attempt #</TableHead>
							<TableHead className="font-semibold text-gray-700">Score</TableHead>
							<TableHead className="font-semibold text-gray-700">Status</TableHead>
							<TableHead className="font-semibold text-gray-700">Performance</TableHead>
							<TableHead className="font-semibold text-gray-700">Time</TableHead>
							<TableHead className="font-semibold text-gray-700">Date</TableHead>
							<TableHead className="font-semibold text-gray-700">Actions</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{quizAttempts.map((attempt, index) => (
							<TableRow key={attempt.id} className="hover:bg-gray-50 transition-colors">
								<TableCell className="font-medium text-gray-900">
									#{quizAttempts.length - index}
								</TableCell>
								<TableCell>
									<div className="flex items-center gap-2">
										<span className="text-lg font-bold text-gray-900">
											{attempt.score}%
										</span>
									</div>
								</TableCell>
								<TableCell>
									{getStatusBadge(attempt.score)}
								</TableCell>
								<TableCell>
									<div className="flex flex-col gap-1">
										<div className="flex items-center gap-2 text-sm">
											<CheckCircle className="w-3 h-3 text-green-600" />
											<span className="text-green-700">{attempt.correctAnswers} correct</span>
										</div>
										<div className="flex items-center gap-2 text-sm">
											<XCircle className="w-3 h-3 text-red-600" />
											<span className="text-red-700">{attempt.incorrectAnswers} incorrect</span>
										</div>
										{attempt.skippedQuestions > 0 && (
											<div className="flex items-center gap-2 text-sm">
												<AlertCircle className="w-3 h-3 text-yellow-600" />
												<span className="text-yellow-700">{attempt.skippedQuestions} skipped</span>
											</div>
										)}
									</div>
								</TableCell>
								<TableCell>
									<div className="flex items-center gap-1 text-sm text-gray-600">
										<Clock className="w-3 h-3" />
										{formatTime(attempt.totalTime)}
									</div>
								</TableCell>
								<TableCell>
									<div className="flex items-center gap-1 text-sm text-gray-600">
										<Calendar className="w-3 h-3" />
										{formatDate(attempt.startedAt)}
									</div>
								</TableCell>
								<TableCell>
									<Button
										variant="outline"
										size="sm"
										onClick={() => handleViewResult(attempt.id)}
										className="flex items-center gap-1"
									>
										<Eye className="w-3 h-3" />
										View
									</Button>
								</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			</div>
		</div>
	);
}
