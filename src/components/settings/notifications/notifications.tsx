// components/notifications/Notifications.tsx
'use client';
import { Button } from '@/components/base/buttons';
import useTranslationData from '@/hooks/use-translation-data';
import { useRouter } from '@/i18n/navigation';
import useAppStore from '@/store';
import { useEffect } from 'react';
import { toast } from 'sonner';
import styles from './notifications.module.css';

function Notifications() {
	const { settingsPageText } = useTranslationData();
	const router = useRouter();

	// Get notification state and actions from store
	const {
		settings: notificationSettings,
		permission,
		isInitialized,
		toggleSetting,
		requestPermission,
		initializeNotifications,
	} = useAppStore((state) => state.notification);

	// Initialize notifications on mount
	useEffect(() => {
		if (!isInitialized) {
			initializeNotifications();
		}
	}, [isInitialized, initializeNotifications]);

	// Handle permission request
	const handleRequestPermission = async () => {
		const granted = await requestPermission();
		if (granted) {
			toast.success('Notifications enabled successfully! 👁️');
		}
	};

	// Handle toggle with permission check
	const handleToggle = async (key: keyof typeof notificationSettings) => {
		await toggleSetting(key);
	};

	const handleSaveChanges = async () => {
		// Check if any alert is enabled
		const anyAlertEnabled = Object.values(notificationSettings).some((value) => value);

		// If any alert is enabled but permission not granted, request it
		if (anyAlertEnabled && permission !== 'granted') {
			const granted = await requestPermission();
			if (!granted) {
				toast.error('Please enable notifications to use alerts');
				return;
			}
		}

		toast.success(settingsPageText.notifications.settingsUpdated || 'Settings updated!');

		setTimeout(() => {
			router.push('/settings');
		}, 1000);
	};

	const notificationItems = [
		{
			key: 'screenDistanceAlert' as keyof typeof notificationSettings,
			title: settingsPageText.notifications.screenDistanceAlert,
			description: settingsPageText.notifications.screenDistanceAlertDesc,
		},
		{
			key: 'eyeStrainAlert' as keyof typeof notificationSettings,
			title: settingsPageText.notifications.eyeStrainAlert,
			description: settingsPageText.notifications.eyeStrainAlertDesc,
		},
		{
			key: 'batteryDrainingAlert' as keyof typeof notificationSettings,
			title: settingsPageText.notifications.batteryDrainingAlert,
			description: settingsPageText.notifications.batteryDrainingAlertDesc,
		},
		{
			key: 'lightingAlert' as keyof typeof notificationSettings,
			title: settingsPageText.notifications.lightingAlert,
			description: settingsPageText.notifications.lightingAlertDesc,
		},
		{
			key: 'screenTimeAlert' as keyof typeof notificationSettings,
			title: settingsPageText.notifications.screenTimeAlert,
			description: settingsPageText.notifications.screenTimeAlertDesc,
		},
	];

	return (
		<div className={styles.section}>
			{/* Permission Banner */}
			{permission === 'default' && (
				<div className={styles.permissionBanner}>
					<div className={styles.permissionContent}>
						<span className={styles.permissionIcon}>🔔</span>
						<div>
							<p className={styles.permissionTitle}>Enable Notifications</p>
							<p className={styles.permissionDescription}>
								Allow browser notifications to receive eye strain alerts
							</p>
						</div>
					</div>
				<Button variant="primary" size="medium" onClick={handleRequestPermission}>
					Enable Now
				</Button>			</div>
			)}
			{permission === 'denied' && (
				<div className={`${styles.permissionBanner} ${styles.permissionDenied}`}>
					<div className={styles.permissionContent}>
						<span className={styles.permissionIcon}>⚠️</span>
						<div>
							<p className={styles.permissionTitle}>Notifications Blocked</p>
							<p className={styles.permissionDescription}>
								Please enable notifications in your browser settings:
								<br />
								<strong>Settings → Site Settings → Notifications</strong>
							</p>
						</div>
					</div>
				</div>
			)}

			{permission === 'granted' && (
				<div className={`${styles.permissionBanner} ${styles.permissionGranted}`}>
					<div className={styles.permissionContent}>
						<span className={styles.permissionIcon}>✅</span>
						<div>
							<p className={styles.permissionTitle}>Notifications Enabled</p>
							<p className={styles.permissionDescription}>
								You will receive alerts to protect your eyes
							</p>
						</div>
					</div>
				</div>
			)}

			{/* Notification Settings */}
			{notificationItems.map((item) => (
				<div key={item.key} className={styles.subSection}>
					<div className={styles.notificationHeader}>
						<div>
							<p className={styles.notificationTitle}>{item.title}</p>
						</div>
						<div
							onClick={() => handleToggle(item.key)}
							className={`${styles.toggle} ${
								notificationSettings[item.key] ? styles.active : ''
							}`}
						>
							<span
								className={`${styles.thumb} ${
									notificationSettings[item.key] ? styles.thumbActive : ''
								}`}
							/>
						</div>
					</div>
					<p className={styles.notificationDescription}>{item.description}</p>
				</div>
			))}

			<div className={styles.saveButtonContainer}>
				<Button variant="primary" size="medium" onClick={handleSaveChanges} fullWidth>
					{settingsPageText.notifications.saveChanges}
				</Button>
			</div>
		</div>
	);
}

export default Notifications;
