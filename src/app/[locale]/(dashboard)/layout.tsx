'use client';
import DisclaimerModal from '@/components/layout/disclaimer-modal/disclaimer-modal';
import { useRouter, usePathname } from '@/i18n/navigation';
import { EyeTrackingProvider } from '@/provider/EyeTrackingProvider';
import { withLazyLoad } from '@/provider/LazyLoad';
import { PiPProvider } from '@/provider/PiPContext';
import useAppStore from '@/store';
import { useEffect, useState } from 'react';
import styles from './layout.module.scss';
import { DeletionRequestDialog } from '@/components/auth/deletion-request-dialog/deletion-request-dialog';
import BottomTabBar from '@/components/layout/bottom-tab-bar/bottom-tab-bar';
import Footer from '@/components/layout/Footer/Footer';
import Navbar from '@/components/layout/Navbar/Navbar';
import Sidebar from '@/components/layout/Sidebar/Sidebar';
import PictureInMode from '@/components/layout/picture-in-mode/picturein-mode';
import AgeModal from '@/components/age-modal/age-modal';




export default function DashboardLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	const state = useAppStore();
	// console.log('App Store State:', { state });

	const [isSidebarOpen, setIsSidebarOpen] = useState(false);
	const [isMobile, setIsMobile] = useState(false);

	useEffect(() => {
		const checkIfMobile = () => {
			const isMobile = window.innerWidth <= 600;
			setIsMobile(isMobile);
			if (!isMobile) {
				setIsSidebarOpen(false);
			}
		};
		checkIfMobile();
		window.addEventListener('resize', checkIfMobile);
		return () => window.removeEventListener('resize', checkIfMobile);
	}, []);

	const toggleSidebar = () => {
		setIsSidebarOpen(!isSidebarOpen);
	};

	const closeSidebar = () => {
		setIsSidebarOpen(false);
	};

	const setLoading = useAppStore?.((state) => state?.camera?.setLoading);
	// const setLoading1 = useBoundStore?.((state) => state?.camera?.setLoading);
	// const setLoading2 = useBearStore?.((state) => state?.camera?.setLoading);

	// console.log('Camera setLoading function:', { setLoading, setLoading1, setLoading2 });

	// Safe destructuring with defaults
	const {
		startScreenTime = () => console.warn('startScreenTime not available'),
		checkAndResetScreenTime = () => console.warn('checkAndResetScreenTime not available'),
	} = useAppStore((state) => state?.screenTime) || {};

	const pathname = usePathname();

	const shouldShowBottomTabBar =
		pathname?.includes('/dashboard') ||
		pathname?.includes('/live') ||
		pathname?.includes('/icare');

	useEffect(() => {
		const mainContainer = document.querySelector('main');
		if (mainContainer) {
			mainContainer.scrollTop = 0;
		}
		window.scrollTo(0, 0);
	}, [pathname]);

	useEffect(() => {
		startScreenTime();
		checkAndResetScreenTime();

		return () => {
			if ((window as any).screenTimeInterval) {
				clearInterval((window as any).screenTimeInterval);
			}
		};
	}, [startScreenTime, checkAndResetScreenTime]);

	useEffect(() => {
		if ('serviceWorker' in navigator && process.env.NODE_ENV === 'production') {
			navigator.serviceWorker
				.register('/sw.js', { scope: '/' })
				.then((registration) => {
					console.log('SW registered: ', registration);
				})
				.catch((registrationError) => {
					console.log('SW registration failed: ', registrationError);
				});
		}

		const handleOnline = () => console.log('App is online');
		const handleOffline = () => console.log('App is offline');

		window.addEventListener('online', handleOnline);
		window.addEventListener('offline', handleOffline);

		return () => {
			window.removeEventListener('online', handleOnline);
			window.removeEventListener('offline', handleOffline);
		};
	}, []);
	return (
		<EyeTrackingProvider>
			<PiPProvider>
				<div className={styles.backgroundImage}>
					<div className={styles.container}>
						<Sidebar isOpen={isSidebarOpen} onClose={closeSidebar} />

						<div className={styles.content}>
							<Navbar onSidebarToggle={toggleSidebar} />
							<main className={styles.main}>
								{children}
								{/* Only lazy load Footer since it's at the bottom */}
								<Footer />
								</main>
								{shouldShowBottomTabBar && <BottomTabBar />}	
						</div>
				
						{/* Lazy load PictureInMode since it might not be used immediately */}
						<PictureInMode />
						<DisclaimerModal />
						<DeletionRequestDialog />
						<AgeModal />
					</div>
				</div>
			</PiPProvider>
		</EyeTrackingProvider>
	);
}
