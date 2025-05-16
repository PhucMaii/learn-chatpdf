import { getAICheckColor } from "@/utils/color"
import React from "react"

interface CircularProgressProps {
	percentage: number
}

export default function CircularProgress({ percentage }: CircularProgressProps) {
	// Ensure percentage is between 0 and 100
	const normalizedPercentage = Math.min(Math.max(percentage, 0), 100)
	
	// Calculate the rotation angle based on percentage
	const rotation = (normalizedPercentage / 100) * 360

	// Determine color based on percentage

	const progressColor = getAICheckColor(normalizedPercentage)

	return (
		<div className="relative w-20 h-20">
			{/* Background circle */}
			<div className="absolute inset-0 rounded-full border-8 border-gray-200" />
			
			{/* Progress circle */}
			<div 
				className="absolute inset-0 rounded-full"
				style={{
					background: `conic-gradient(${progressColor} 0deg ${rotation}deg, transparent ${rotation}deg 360deg)`,
					mask: "radial-gradient(transparent 60%, black 61%)",
					WebkitMask: "radial-gradient(transparent 60%, black 61%)"
				}}
			/>
			
			{/* Inner circle with percentage */}
			<div className="absolute inset-2 rounded-full bg-white flex items-center justify-center">
				<h1 className="text-sm font-bold" style={{ color: progressColor }}>{normalizedPercentage}%</h1>
			</div>
		</div>
	)
}
