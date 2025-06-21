'use client';

import React, { useContext } from 'react';
import { useParams } from 'next/navigation';
import QuizSummary from '@/components/Projects/QuizSummary';
import AccessDenied from '@/components/ui/AccessDenied';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import { useQuizAttempt } from '@/hooks/useQuizAttempt';
import { UserContext,    } from '../../../../../../context/UserProvider';
import Quizzes from '@/components/Projects/Quizzes';
import SectionContainer from '@/components/SectionContainer';


export default function QuizAttemptPage() {
	const params = useParams();
	const projectId = params.id as string;
	const attemptId = params.attemptId as string;
	
	const { user, isInitializing: authLoading } = useContext(UserContext) as any;
	// const { 
	// 	quizAttempt, 
	// 	loading: attemptLoading, 
	// 	error: attemptError 
	// } = useQuizAttempt(attemptId);

	// Show loading while checking authentication and fetching data
	if (authLoading) {
		return (
			<div className="flex items-center justify-center min-h-screen">
				<LoadingSpinner size="lg" />
			</div>
		);
	}

	// Check if user is authenticated
	if (!user) {
		return <AccessDenied message="Please log in to view this quiz attempt." />;
	}

	// // Check if quiz attempt exists
	// if (!quizAttempt) {
	// 	return <AccessDenied message="Quiz attempt not found." />;
	// }

	// // Check if user owns this quiz attempt
	// if (quizAttempt.userId !== user?.id) {
	// 	return <AccessDenied message="You don't have permission to view this quiz attempt." />;
	// }

	// // Check if project ID matches
	// if (quizAttempt.projectId !== projectId) {
	// 	return <AccessDenied message="Invalid project or attempt combination." />;
	// }

	return (
		<SectionContainer className='my-10'>
			<Quizzes 
				loading={false}
				// loading={false}
				// maxQuestions={quizAttempt.maxQuestions}
			/>
		</SectionContainer>
	);
} 