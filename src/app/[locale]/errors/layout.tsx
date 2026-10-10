
import MainLayout from '@/components/landing-page/layout/main-layout';
import React from 'react';

const ErrorLayout = ({ children }: { children?: React.ReactNode }) => {
	return <MainLayout>{children}</MainLayout>;
};

export default ErrorLayout;
