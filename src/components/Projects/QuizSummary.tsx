'use client';
import React from 'react';
import SectionContainer from '../SectionContainer';
import GeneratingDisplay from '../GeneratingDisplay';
import { Button } from '../ui/button';
import GradientDiv from '../GradientDiv';
import LineChart from '../Chart/LineChart';
import QuizzesTable from '../Tables/QuizzesTable';
import StartTestDialog from '../Dialogs/StartTestDialog';

interface StartTestConfig {
	questionCount: number;
	duration: number;
}

interface IProps {
	loading: boolean;
	maxQuestions?: number;
}

export default function QuizSummary({ loading, maxQuestions = 30 }: IProps) {
	const handleStartTest = (config: StartTestConfig) => {
		// Handle starting the test with the provided configuration
		console.log('Starting test with:', config);
		// Add your test start logic here
		// Example: navigate to test page, start timer, etc.
	};

	if (loading) {
		return (
			<GeneratingDisplay text="Quiz is being initialized, please give us a moment. Good things are coming..." />
		);
	}

	return (
		<SectionContainer>
			{/* Gradient Section */}
			<GradientDiv
				from="blue-200"
				to="emerald-400"
				via="emerald-300"
				className="p-4"
			>
				<div className="flex flex-col gap-4">
					<h5 className="text-2xl font-bold">
						Start a test today to see how much you have learned 📚{' '}
					</h5>
					<StartTestDialog
						trigger={
							<Button className="w-fit p-4 font-medium text-lg">
								Start Test
							</Button>
						}
						maxQuestions={maxQuestions}
						onStartTest={handleStartTest}
					/>
				</div>
			</GradientDiv>

			{/* Overview Section */}
			<div className="mt-4">
				<div className="flex flex-col gap-4">
					<h5 className="text-lg font-medium">Overview</h5>
				</div>

				<div className="flex gap-4 items-center">
					<div className="flex-[1] flex-col gap-4 border border-gray-200 rounded-lg p-4">
						<h6 className="text-sm font-medium">Quizzes Taken</h6>
						<h1 className="text-6xl font-medium">10</h1>
					</div>

					<div className="flex-[1] flex-col gap-4 border border-gray-200 rounded-lg p-4">
						<h6 className="text-sm font-medium">Average Score</h6>
						<h1 className="text-6xl font-medium">80</h1>
					</div>
				</div>

				<div className="mt-4">
					<LineChart />
				</div>
			</div>

			<div className="mt-4">
				<QuizzesTable />
			</div>
		</SectionContainer>
	);
}
