'use client';

import React, { useState } from 'react';
import { Button } from '../ui/button';
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from '../ui/dialog';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { toast } from 'react-hot-toast';

interface StartTestConfig {
	questionCount: number;
	duration: number;
}

interface StartTestDialogProps {
	trigger: React.ReactNode;
	maxQuestions?: number;
	onStartTest: (config: StartTestConfig) => Promise<void>;
	className?: string;
}

const DEFAULT_QUESTION_COUNT = 10;
const DEFAULT_DURATION = 30;
const MAX_DURATION = 120;

export default function StartTestDialog({
	trigger,
	maxQuestions = 30,
	onStartTest,
	className,
}: StartTestDialogProps) {
	const [isOpen, setIsOpen] = useState(false);
	const [questionCount, setQuestionCount] = useState(DEFAULT_QUESTION_COUNT);
	const [duration, setDuration] = useState(DEFAULT_DURATION);
	const [isLoading, setIsLoading] = useState<boolean>(false);

	const handleQuestionCountChange = (value: string) => {
		const numValue = parseInt(value) || 1;
		const clampedValue = Math.min(Math.max(numValue, 1), maxQuestions);
		setQuestionCount(clampedValue);
	};

	const handleDurationChange = (value: string) => {
		const numValue = parseInt(value) || 1;
		const clampedValue = Math.min(Math.max(numValue, 1), MAX_DURATION);
		setDuration(clampedValue);
	};

	const handleStartTest = async () => {
		setIsLoading(true);
		const config: StartTestConfig = {
			questionCount,
			duration,
		};
		try {
			await onStartTest(config);
			setIsOpen(false);
		} catch (error: any) {
			console.error('Error starting test:', error);
			toast.error('Failed to start test. Please try again.');
		} finally {
			setIsLoading(false);
		}
	};

	const isFormValid = 
		questionCount >= 1 && 
		questionCount <= maxQuestions && 
		duration >= 1 && 
		duration <= MAX_DURATION;

	const resetForm = () => {
		setQuestionCount(DEFAULT_QUESTION_COUNT);
		setDuration(DEFAULT_DURATION);
	};

	const handleOpenChange = (open: boolean) => {
		setIsOpen(open);
		if (!open) {
			resetForm();
		}
	};

	return (
		<Dialog open={isOpen} onOpenChange={handleOpenChange}>
			<DialogTrigger asChild className={className}>
				{trigger}
			</DialogTrigger>
			<DialogContent className="sm:max-w-[425px] bg-white">
				<DialogHeader>
					<DialogTitle>Configure Your Test</DialogTitle>
					<DialogDescription>
						Set the number of questions and duration for your test.
					</DialogDescription>
				</DialogHeader>
				
				<div className="grid gap-4 py-4">
					<div className="grid grid-cols-4 items-center gap-4">
						<Label htmlFor="questions" className="text-right">
							Questions
						</Label>
						<Input
							id="questions"
							type="number"
							min="1"
							max={maxQuestions}
							value={questionCount}
							onChange={(e) => handleQuestionCountChange(e.target.value)}
							className="col-span-3"
							placeholder={`1-${maxQuestions}`}
						/>
					</div>
					
					<div className="grid grid-cols-4 items-center gap-4">
						<Label htmlFor="duration" className="text-right">
							Duration (min)
						</Label>
						<Input
							id="duration"
							type="number"
							min="1"
							max={MAX_DURATION}
							value={duration}
							onChange={(e) => handleDurationChange(e.target.value)}
							className="col-span-3"
							placeholder={`1-${MAX_DURATION}`}
						/>
					</div>
					
					<div className="text-sm text-gray-500 text-center">
						Max questions: {maxQuestions} | Max duration: {MAX_DURATION} minutes
					</div>
				</div>
				
				<DialogFooter>
					<Button
						type="submit"
						onClick={handleStartTest}
						disabled={!isFormValid || isLoading}
						className="w-full sm:w-auto"
					>
						{isLoading ? 'Starting Test...' : 'Start Test'}
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
} 