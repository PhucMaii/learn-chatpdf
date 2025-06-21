import React from 'react';
import { Button } from './button';
import { useRouter } from 'next/navigation';
import { Shield, Home, ArrowLeft } from 'lucide-react';

interface AccessDeniedProps {
	message?: string;
	showHomeButton?: boolean;
	showBackButton?: boolean;
}

export default function AccessDenied({
	message = 'Access denied. You do not have permission to view this resource.',
	showHomeButton = true,
	showBackButton = true,
}: AccessDeniedProps) {
	const router = useRouter();

	const handleGoHome = () => {
		router.push('/');
	};

	const handleGoBack = () => {
		router.back();
	};

	return (
		<div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
			<div className="max-w-md w-full text-center">
				<div className="bg-white rounded-lg shadow-lg p-8">
					<div className="flex justify-center mb-6">
						<div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
							<Shield className="w-8 h-8 text-red-600" />
						</div>
					</div>
					
					<h1 className="text-2xl font-bold text-gray-900 mb-4">
						Access Denied
					</h1>
					
					<p className="text-gray-600 mb-8">
						{message}
					</p>
					
					<div className="flex flex-col sm:flex-row gap-3 justify-center">
						{showBackButton && (
							<Button
								variant="outline"
								onClick={handleGoBack}
								className="flex items-center gap-2"
							>
								<ArrowLeft className="w-4 h-4" />
								Go Back
							</Button>
						)}
						
						{showHomeButton && (
							<Button
								onClick={handleGoHome}
								className="flex items-center gap-2"
							>
								<Home className="w-4 h-4" />
								Go Home
							</Button>
						)}
					</div>
				</div>
			</div>
		</div>
	);
} 