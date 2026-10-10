'use client';
import { DummyProfileImg } from '@/assets/images';
import DropdownMenu from '@/components/base/dropdown';
import useTranslationData from '@/hooks/use-translation-data';
import { useAuth } from '@/provider/AuthUserContext';
import useAppStore from '@/store';
import {
	ChevronDown,
	ChevronLeft,
	LogOut,
	Menu,
	Settings as SettingsIcon,
	User as UserIcon,
} from 'lucide-react';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import LanguageSwitcher from '../language-switcher/language-switcher';
import { usePiP } from '@/provider/PiPContext';
import styles from './Navbar.module.css';
import CameraPreview from './CameraPreview';

interface NavbarProps {
	onSidebarToggle?: () => void;
}

export default function Navbar({ onSidebarToggle }: NavbarProps) {
	const { user } = useAuth();
	const authUser = user;
	const pathname = usePathname();
	const router = useRouter();
	const { navbarText } = useTranslationData();
	const [isMobile, setIsMobile] = useState(false);
	const { sidebarText } = useTranslationData();
	const logout = useAppStore((state) => state.auth.logout);
	const t = useTranslations();
	const { setIsPiPExpanded } = usePiP();

	// Mobile detection
	useEffect(() => {
		const checkIfMobile = () => {
			setIsMobile(window.innerWidth <= 600);
		};
		checkIfMobile();
		window.addEventListener('resize', checkIfMobile);
		return () => window.removeEventListener('resize', checkIfMobile);
	}, []);

	const handleLogout = async () => {
		try {
			await logout();
			router.push('/signin');
		} catch (e) {
			console.error('Logout failed', e);
		}
	};



	const handleCameraClick = () => {
		setIsPiPExpanded(true);
	};

	const currentPage = useMemo(() => {
		return pathname.split('/')[2] + pathname.split('/')[3];
	}, [pathname]);

	const pagePath = useMemo(() => {
		const pageNameMap: Record<string, string> = {
			dashboard: t('navigation.pages.dashboard'),
			live: t('navigation.pages.live'),
			icare: t('navigation.pages.icare'),
			profile: t('navigation.pages.profile'),
			settings: t('navigation.pages.settings'),
			settingsupdateprofile :'Update Profile',
			history: t('navigation.pages.history'),
			offline: t('navigation.pages.offline'),
			settingsnotifications: t('navigation.pages.notifications'),
			icareproducts: t('navigation.pages.products'),
			icareexercises: t('navigation.pages.exercises'),
			icarehospitals: t('navigation.pages.hospitals'),
			icarespecialists: t('navigation.pages.specialists'),
			icareproductscosmetic : t('navigation.pages.cosmetic'),
			icareproductsotc : t('navigation.pages.otc'),
		};

		return pageNameMap[currentPage] || currentPage;
	}, [currentPage, t]);

	const handleBackClick = () => {
		router.back();
	};

	return (
		<nav className={styles.navbar}>
			{isMobile &&
				(currentPage === 'settings' ||
					currentPage === 'profile' ||
					currentPage === 'icareproducts' ||
					currentPage === 'icareexercises' ||
					currentPage === 'icarehospitals' ||
					currentPage === 'icarespecialists') && (
					<ChevronLeft
						size={36}
						color="var(--metricValue)"
						className={styles.backButton}
						onClick={handleBackClick}
					/>
				)}

			<div className={styles.header}>
				{isMobile &&
					currentPage !== 'settings' &&
					currentPage !== 'profile' &&
					currentPage !== 'icareproducts' &&
					currentPage !== 'icareexercises' &&
					currentPage !== 'icarehospitals' &&
					currentPage !== 'icarespecialists' && (
						<button className={styles.menuButton} onClick={onSidebarToggle}>
							<Menu size={24} color="var(--metricValue)" />
						</button>
					)}

				{isMobile && currentPage === 'dashboard' ? (
					<span className={styles.logo}>{sidebarText.logoText}</span>
				) : (
					pagePath
				)}
			</div>
			<div className={styles.navItems}>
				{isMobile ? (
					currentPage === 'profile' ? (
						<SettingsIcon
							size={36}
							color="var(--metricValue)"
							onClick={() => router.push('/settings')}
							className={styles.backButton}
						/>
					) : (
						<CameraPreview onClick={handleCameraClick} />
					)
				) : (
					<>
						<LanguageSwitcher />
						<DropdownMenu
							trigger={
								<button className={styles.userSection}>
									<Image
										src={DummyProfileImg}
										alt="Profile"
										width={36}
										height={36}
										className={styles.avatar}
									/>
									<span>
										<p className={styles.userName}>{authUser?.name}</p>
										<p className={styles.userEmail}>{authUser?.email}</p>
									</span>
									<ChevronDown size={18} color="var(--metricValue)" />
								</button>
							}
							items={[
								// {
								// 	label: navbarText.userMenuItems.profile,
								// 	icon: <UserIcon size={16} />,
								// 	href: '/profile',
								// },
								{
									label: navbarText.userMenuItems.settings,
									icon: <SettingsIcon size={16} />,
									href: '/settings',
								},
								{
									label: navbarText.userMenuItems.logout,
									icon: <LogOut size={16} />,
									onSelect: handleLogout,
									danger: true,
								},
							]}
							align="center"
						/>
					</>
				)}
			</div>
		</nav>
	);
}
