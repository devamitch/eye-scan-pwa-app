// store/slices/notification.slice.ts
import { toast } from 'sonner';
import type { StateCreator } from 'zustand';
import { AppStoreState } from '..';

// Notification settings interface
export interface NotificationSettings {
	screenDistanceAlert: boolean;
	eyeStrainAlert: boolean;
	batteryDrainingAlert: boolean;
	lightingAlert: boolean;
	screenTimeAlert: boolean;
}

// Notification state interface
export interface NotificationState {
	settings: NotificationSettings;
	permission: NotificationPermission;
	isInitialized: boolean;
	lastNotifications: {
		eyeStrain: number | null;
		screenDistance: number | null;
		battery: number | null;
		lighting: number | null;
		screenTime: string | null; // Date string
	};
}

// Notification actions interface
export interface NotificationActions {
	// Settings management
	updateSettings: (settings: Partial<NotificationSettings>) => Promise<void>;
	toggleSetting: (key: keyof NotificationSettings) => Promise<void>;
	resetSettings: () => void;

	// Permission management
	requestPermission: () => Promise<boolean>;
	checkPermission: () => NotificationPermission;

	// Notification sending
	sendEyeStrainNotification: () => void;
	sendScreenDistanceNotification: () => void;
	sendBatteryNotification: () => void;
	sendLightingNotification: () => void;
	sendScreenTimeNotification: () => void;

	// Generic notification
	sendNotification: (
		title: string,
		body: string,
		type?: 'info' | 'success' | 'warning' | 'error'
	) => void;

	// Initialization
	initializeNotifications: () => Promise<void>;
}

// Combined notification slice type
export interface NotificationSlice {
	notification: NotificationState & NotificationActions;
}

// Initial notification state
const initialNotificationState: NotificationState = {
	settings: {
		screenDistanceAlert: true,
		eyeStrainAlert: true,
		batteryDrainingAlert: true,
		lightingAlert: false,
		screenTimeAlert: true,
	},
	permission: typeof Notification !== 'undefined' ? Notification.permission : 'default',
	isInitialized: false,
	lastNotifications: {
		eyeStrain: null,
		screenDistance: null,
		battery: null,
		lighting: null,
		screenTime: null,
	},
};

// Cooldown period (30 minutes)
const NOTIFICATION_COOLDOWN = 30 * 60 * 1000;

// Helper function to check if notification can be sent
const canSendNotification = (lastTime: number | null): boolean => {
	if (!lastTime) return true;
	return Date.now() - lastTime >= NOTIFICATION_COOLDOWN;
};

// Helper function to send browser notification
const sendBrowserNotification = (title: string, body: string, icon?: string): void => {
	if (typeof Notification === 'undefined' || Notification.permission !== 'granted') {
		console.warn('Cannot send notification - permission not granted');
		return;
	}

	try {
		const notification = new Notification(title, {
			body,
			icon: icon || '👁️',
			badge: '👁️',
			tag: 'eye-strain-alert',
			requireInteraction: false,
			silent: false,
		});

		notification.onclick = () => {
			window.focus();
			notification.close();
		};

		// Auto-close after 10 seconds
		setTimeout(() => notification.close(), 10000);

		console.log(`✅ Browser notification sent: ${title}`);
	} catch (error) {
		console.error('Error showing browser notification:', error);
	}
};

// Create the notification slice
const createNotificationSlice: StateCreator<
	AppStoreState,
	[],
	[['zustand/persist', unknown]],
	NotificationSlice
> = (set, get) => ({
	notification: {
		...initialNotificationState,

		// Update settings
		updateSettings: async (newSettings) => {
			// Check if any setting is being enabled
			const anyEnabled = Object.values(newSettings).some((value) => value === true);

			if (anyEnabled) {
				// Auto-request permission if needed
				const { notification } = get();
				if (notification.permission === 'default') {
					const granted = await notification.requestPermission();
					if (!granted) {
						toast.error('Please allow notifications to enable alerts');
						return;
					}
				}
			}

			set((state) => ({
				notification: {
					...state.notification,
					settings: {
						...state.notification.settings,
						...newSettings,
					},
				},
			}));

			console.log('✅ Notification settings updated:', newSettings);
		},

		// Toggle individual setting
		toggleSetting: async (key) => {
			const { notification } = get();
			const willBeEnabled = !notification.settings[key];

			// If enabling and permission is default, request it
			if (willBeEnabled && notification.permission === 'default') {
				const granted = await notification.requestPermission();
				if (!granted) {
					// Don't enable the setting if permission was denied
					toast.error('Please allow notifications to enable this alert');
					return;
				}
			}

			set((state) => ({
				notification: {
					...state.notification,
					settings: {
						...state.notification.settings,
						[key]: willBeEnabled,
					},
				},
			}));

			console.log(`✅ Notification setting toggled: ${key} = ${willBeEnabled}`);
		},

		// Reset settings to default
		resetSettings: () => {
			set((state) => ({
				notification: {
					...state.notification,
					settings: initialNotificationState.settings,
				},
			}));

			console.log('🔄 Notification settings reset to default');
		},

		// Request notification permission
		requestPermission: async () => {
			if (typeof Notification === 'undefined') {
				toast.error('Notifications are not supported in this browser');
				console.error('❌ Notifications not supported');
				return false;
			}

			if (Notification.permission === 'granted') {
				console.log('✅ Notification permission already granted');
				return true;
			}

			if (Notification.permission === 'denied') {
				toast.error(
					'Notifications are blocked. Please enable them in your browser settings.'
				);
				console.error('❌ Notification permission denied by user');
				return false;
			}

			try {
				console.log('🔔 Requesting notification permission...');
				const permission = await Notification.requestPermission();

				set((state) => ({
					notification: {
						...state.notification,
						permission,
					},
				}));

				if (permission === 'granted') {
					toast.success('Notifications enabled successfully! 👁️');
					sendBrowserNotification(
						'Eye Strain Notifier',
						'Notifications are now enabled. You will receive alerts to protect your eyes.'
					);
					console.log('✅ Notification permission granted');
					return true;
				} else {
					toast.error('Notification permission denied');
					console.error('❌ Notification permission denied');
					return false;
				}
			} catch (error) {
				console.error('Error requesting notification permission:', error);
				toast.error('Failed to request notification permission');
				return false;
			}
		},

		// Check current permission
		checkPermission: () => {
			if (typeof Notification === 'undefined') {
				return 'denied';
			}
			return Notification.permission;
		},

		// Send eye strain notification
		sendEyeStrainNotification: () => {
			const { notification } = get();

			if (!notification.settings.eyeStrainAlert) {
				console.log('⏭️ Eye strain alerts disabled');
				return;
			}

			if (!canSendNotification(notification.lastNotifications.eyeStrain)) {
				console.log('⏭️ Eye strain notification on cooldown');
				return;
			}

			const title = 'Eye Strain Detected 👁️';
			const body =
				'High eye strain detected for 15 minutes. Take a break and look away from the screen.';

			// Send browser notification
			sendBrowserNotification(title, body);

			// Send toast notification
			toast.warning(body, {
				duration: 5000,
				icon: '👁️',
			});

			// Update last notification time
			set((state) => ({
				notification: {
					...state.notification,
					lastNotifications: {
						...state.notification.lastNotifications,
						eyeStrain: Date.now(),
					},
				},
			}));

			console.log(`✅ Eye strain notification sent at ${new Date().toLocaleTimeString()}`);
		},

		// Send screen distance notification
		sendScreenDistanceNotification: () => {
			const { notification } = get();

			if (!notification.settings.screenDistanceAlert) {
				console.log('⏭️ Screen distance alerts disabled');
				return;
			}

			if (!canSendNotification(notification.lastNotifications.screenDistance)) {
				console.log('⏭️ Screen distance notification on cooldown');
				return;
			}

			const title = 'Too Close to Screen 📏';
			const body =
				'You are sitting too close to the screen. Please move back to at least 30cm distance.';

			sendBrowserNotification(title, body);
			toast.warning(body, {
				duration: 5000,
				icon: '📏',
			});

			set((state) => ({
				notification: {
					...state.notification,
					lastNotifications: {
						...state.notification.lastNotifications,
						screenDistance: Date.now(),
					},
				},
			}));

			console.log(
				`✅ Screen distance notification sent at ${new Date().toLocaleTimeString()}`
			);
		},

		// Send battery notification
		sendBatteryNotification: () => {
			const { notification } = get();

			if (!notification.settings.batteryDrainingAlert) {
				console.log('⏭️ Battery alerts disabled');
				return;
			}

			if (!canSendNotification(notification.lastNotifications.battery)) {
				console.log('⏭️ Battery notification on cooldown');
				return;
			}

			const title = 'Battery Alert 🔋';
			const body =
				'Your device battery is draining quickly or running low. Consider charging soon.';

			sendBrowserNotification(title, body);
			toast.warning(body, {
				duration: 5000,
				icon: '🔋',
			});

			set((state) => ({
				notification: {
					...state.notification,
					lastNotifications: {
						...state.notification.lastNotifications,
						battery: Date.now(),
					},
				},
			}));

			console.log(`✅ Battery notification sent at ${new Date().toLocaleTimeString()}`);
		},

		// Send lighting notification
		sendLightingNotification: () => {
			const { notification } = get();

			if (!notification.settings.lightingAlert) {
				console.log('⏭️ Lighting alerts disabled');
				return;
			}

			if (!canSendNotification(notification.lastNotifications.lighting)) {
				console.log('⏭️ Lighting notification on cooldown');
				return;
			}

			const title = 'Lighting Issue 💡';
			const body =
				'Poor lighting conditions detected. Adjust your room lighting for better eye comfort.';

			sendBrowserNotification(title, body);
			toast.info(body, {
				duration: 5000,
				icon: '💡',
			});

			set((state) => ({
				notification: {
					...state.notification,
					lastNotifications: {
						...state.notification.lastNotifications,
						lighting: Date.now(),
					},
				},
			}));

			console.log(`✅ Lighting notification sent at ${new Date().toLocaleTimeString()}`);
		},

		// Send screen time notification
		sendScreenTimeNotification: () => {
			const { notification } = get();

			if (!notification.settings.screenTimeAlert) {
				console.log('⏭️ Screen time alerts disabled');
				return;
			}

			const today = new Date().toDateString();
			if (notification.lastNotifications.screenTime === today) {
				console.log('⏭️ Screen time notification already sent today');
				return;
			}

			const title = 'Screen Time Alert ⏰';
			const body =
				'You have been using your screen for over 6 hours today. Time for a longer break!';

			sendBrowserNotification(title, body);
			toast.warning(body, {
				duration: 5000,
				icon: '⏰',
			});

			set((state) => ({
				notification: {
					...state.notification,
					lastNotifications: {
						...state.notification.lastNotifications,
						screenTime: today,
					},
				},
			}));

			console.log(`✅ Screen time notification sent at ${new Date().toLocaleTimeString()}`);
		},

		// Generic notification sender
		sendNotification: (title, body, type = 'info') => {
			sendBrowserNotification(title, body);

			switch (type) {
				case 'success':
					toast.success(body);
					break;
				case 'warning':
					toast.warning(body);
					break;
				case 'error':
					toast.error(body);
					break;
				default:
					toast.info(body);
			}

			console.log(`✅ Generic notification sent: ${title}`);
		},

		// Initialize notifications
		initializeNotifications: async () => {
			const { notification } = get();

			if (notification.isInitialized) {
				console.log('⏭️ Notifications already initialized');
				return;
			}

			// Check if browser supports notifications
			if (typeof Notification === 'undefined') {
				console.warn('⚠️ Notifications not supported in this browser');
				set((state) => ({
					notification: {
						...state.notification,
						isInitialized: true,
						permission: 'denied',
					},
				}));
				return;
			}

			// Update permission state
			const currentPermission = Notification.permission;

			set((state) => ({
				notification: {
					...state.notification,
					isInitialized: true,
					permission: currentPermission,
				},
			}));

			console.log('📢 Notification system initialized', {
				permission: currentPermission,
				supported: true,
			});
		},
	},
});

export default createNotificationSlice;
