'use client';

import React, { useContext } from 'react';
import { useParams } from 'next/navigation';
import AccessDenied from '@/components/ui/AccessDenied';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import { useQuizAttempt } from '@/hooks/useQuizAttempt';
import { UserContext,    } from '../../../../../../context/UserProvider';
import Quizzes from '@/components/Projects/Quizzes';
import SectionContainer from '@/components/SectionContainer';
import { DrizzleQuiz } from '@/lib/db/drizzleType';


export default function QuizAttemptPage() {
	const params = useParams();
	const attemptId = params.attemptId as string;
	
	const { user, isInitializing: authLoading } = useContext(UserContext) as any;
	const { 
		quizAttempt, 
		loading: attemptLoading, 
	} = useQuizAttempt(attemptId);

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

	return (
		<SectionContainer className='my-10'>
			<Quizzes 
				loading={attemptLoading}
				quizAttempt={quizAttempt?.attempt || null}
				questions={quizAttempt?.questions || []}
				quiz={quizAttempt?.quiz as DrizzleQuiz}
			/>
		</SectionContainer>
	);
} 