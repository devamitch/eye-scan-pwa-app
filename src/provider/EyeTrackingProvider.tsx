'use client';

import { useEyeTracking } from '@/hooks/useEyeTracking';
import { useMetricsPosting } from '@/hooks/useMetricsPosting';
import React, { createContext, ReactNode, useContext } from 'react';

type EyeTrackingContextType = ReturnType<typeof useEyeTracking>;

const EyeTrackingContext = createContext<EyeTrackingContextType | undefined>(undefined);

export const useEyeTrackingContext = () => {
	const context = useContext(EyeTrackingContext);
	if (context === undefined) {
		throw new Error('useEyeTrackingContext must be used within an EyeTrackingProvider');
	}
	return context;
};

interface EyeTrackingProviderProps {
	children: ReactNode;
}

export const EyeTrackingProvider: React.FC<EyeTrackingProviderProps> = ({ children }) => {
	const eyeTracking = useEyeTracking();
	useMetricsPosting();
	return (
		<EyeTrackingContext.Provider value={eyeTracking}>{children}</EyeTrackingContext.Provider>
	);
};
