import React, { useState, useEffect, useCallback } from 'react';
import { Button } from '../ui/button';
import { AlertTriangle, Clock } from 'lucide-react';

interface CountdownTimerProps {
	timeLimit: number; // in seconds
	startedAt: string; // ISO string of when quiz started
	onTimeUp: () => void;
	onSubmit: () => void;
	isSubmitting: boolean;
}

export default function CountdownTimer({
	timeLimit,
	startedAt,
	onTimeUp,
	onSubmit,
	isSubmitting,
}: CountdownTimerProps) {
	const [timeLeft, setTimeLeft] = useState<number>(timeLimit);
	const [isWarning, setIsWarning] = useState<boolean>(false);
	const [isCritical, setIsCritical] = useState<boolean>(false);

	// Calculate initial time left based on startedAt
	useEffect(() => {
		const calculateTimeLeft = () => {
			try {
				// Parse the UTC timestamp - startedAt should be an ISO string from the API
				const startTime = new Date(startedAt).getTime();
				const currentTime = new Date().getTime();
				
				// Validate that we have valid dates
				if (isNaN(startTime)) {
					console.error('Invalid startedAt timestamp:', startedAt);
					return timeLimit; // Fallback to full time limit
				}
				
				const elapsedSeconds = Math.floor((currentTime - startTime) / 1000);
				const remainingTime = Math.max(0, timeLimit - elapsedSeconds);
				
				console.log('Time calculation:', {
					startedAt,
					startTime: new Date(startTime).toISOString(),
					currentTime: new Date(currentTime).toISOString(),
					elapsedSeconds,
					timeLimit,
					remainingTime
				});
				
				return remainingTime;
			} catch (error) {
				console.error('Error calculating time left:', error);
				return timeLimit; // Fallback to full time limit
			}
		};

		// Set initial time left
		const initialTimeLeft = calculateTimeLeft();
		console.log('initialTimeLeft', initialTimeLeft);
		setTimeLeft(initialTimeLeft);

		// Check if time is already up
		if (initialTimeLeft <= 0) {
			console.log('Time is already up, triggering onTimeUp');
			// onTimeUp();
			return;
		}
	}, [startedAt, timeLimit, onTimeUp]);

	// Calculate time display
	const hours = Math.floor(timeLeft / 3600);
	const minutes = Math.floor((timeLeft % 3600) / 60);
	const seconds = timeLeft % 60;

	const formatTime = (value: number): string => {
		return value.toString().padStart(2, '0');
	};

	// Handle countdown logic
	useEffect(() => {
		if (timeLeft <= 0) {
			onTimeUp();
			return;
		}

		const timer = setInterval(() => {
			setTimeLeft((prev) => {
				const newTime = prev - 1;
				
				// Set warning states
				if (newTime <= 300) { // 5 minutes
					setIsCritical(true);
					setIsWarning(false);
				} else if (newTime <= 600) { // 10 minutes
					setIsWarning(true);
					setIsCritical(false);
				} else {
					setIsWarning(false);
					setIsCritical(false);
				}
				
				return newTime;
			});
		}, 1000);

		return () => clearInterval(timer);
	}, [timeLeft, onTimeUp]);

	// Handle manual submit
	const handleSubmit = useCallback(() => {
		onSubmit();
	}, [onSubmit]);

	// Determine timer color based on time remaining
	const getTimerColor = (): string => {
		if (isCritical) return 'text-red-600';
		if (isWarning) return 'text-yellow-600';
		return 'text-gray-700';
	};

	return (
		<div className="flex flex-col gap-3 p-4 rounded-lg border border-gray-200 bg-white shadow-sm">
			<div className="flex items-center justify-between">
				<div className="flex items-center gap-2">
					<Clock className={`w-4 h-4 ${getTimerColor()}`} />
					<span className="text-sm font-medium text-gray-600">
						Time Remaining
					</span>
				</div>
				{isCritical && (
					<div className="flex items-center gap-1 text-red-600">
						<AlertTriangle className="w-3 h-3" />
						<span className="text-xs font-medium">Time&apos;s up!</span>
					</div>
				)}
			</div>
			
			<div className={`text-xl font-bold text-center ${getTimerColor()}`}>
				{hours > 0 && `${formatTime(hours)}:`}
				{formatTime(minutes)}:{formatTime(seconds)}
			</div>

			<Button
				onClick={handleSubmit}
				disabled={isSubmitting}
				variant={"default"}
				className="w-full font-semibold"
				size="sm"
			>
				{isSubmitting ? 'Submitting...' : 'Submit Quiz'}
			</Button>
		</div>
	);
} 