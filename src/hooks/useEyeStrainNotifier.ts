// hooks/useEyeStrainNotifier.ts
import { useEyeTrackingContext } from '@/provider/EyeTrackingProvider';
import useAppStore from '@/store';
import { useCallback, useEffect, useRef } from 'react';

/**
 * Configuration Constants
 */
const STRAIN_DURATION_THRESHOLD = 15 * 60 * 1000; // 15 minutes
const CLEANUP_INTERVAL = 10 * 60 * 1000; // 10 minutes cleanup

const PROXIMITY_THRESHOLD = 30; // < 30cm
const PROXIMITY_DURATION_THRESHOLD = 30 * 1000; // 30 seconds
const SCREEN_TIME_THRESHOLD = 360; // 6 hours in minutes
const BATTERY_DRAIN_THRESHOLD = 10; // 10% drain
const BATTERY_DRAIN_TIME = 15 * 60 * 1000; // 15 minutes
const BATTERY_LOW_THRESHOLD = 20; // 20% battery

const useEyeStrainNotifier = () => {
	const { metrics, isActive } = useEyeTrackingContext();
	const { screenTime, eyeTracking } = useAppStore();

	// Get notification state and actions from store
	const {
		settings: notificationSettings,
		sendEyeStrainNotification,
		sendScreenDistanceNotification,
		sendBatteryNotification,
		sendLightingNotification,
		sendScreenTimeNotification,
	} = useAppStore((state) => state.notification);

	// Refs for timing and state management
	const strainStartTime = useRef<number | null>(null);
	const proximityStartTime = useRef<number | null>(null);
	const batteryCheckStartTime = useRef<number | null>(null);
	const initialBatteryLevel = useRef<number | null>(null);
	const cleanupTimer = useRef<NodeJS.Timeout | null>(null);

	// Get battery level from store
	const batteryLevel = eyeTracking?.batteryLevel || 100;

	// Determine if eye strain is detected
	const eyeStrainDetected = Boolean(metrics?.strainText && ['High'].includes(metrics.strainText));

	// Timer reset functions
	const resetStrainTimer = useCallback(() => {
		if (strainStartTime.current) {
			console.log('🔄 Resetting eye strain timer');
		}
		strainStartTime.current = null;
	}, []);

	const resetProximityTimer = useCallback(() => {
		if (proximityStartTime.current) {
			console.log('🔄 Resetting proximity timer');
		}
		proximityStartTime.current = null;
	}, []);

	const resetBatteryTimer = useCallback(() => {
		if (batteryCheckStartTime.current) {
			console.log('🔄 Resetting battery timer');
		}
		batteryCheckStartTime.current = null;
		initialBatteryLevel.current = null;
	}, []);

	// Cleanup function
	const cleanupOldData = useCallback(() => {
		if (!eyeStrainDetected) {
			resetStrainTimer();
		}

		// Reset proximity timer if no proximity data
		if (!metrics?.proximityScore || metrics.proximityScore >= PROXIMITY_THRESHOLD) {
			resetProximityTimer();
		}

		console.log('🧹 Cleaned up notification timers');
	}, [eyeStrainDetected, resetStrainTimer, resetProximityTimer, metrics?.proximityScore]);

	// Core notification logic
	useEffect(() => {
		if (!metrics || !isActive) return;

		// 1. Eye Strain Alert (High for > 15 minutes)
		if (eyeStrainDetected && notificationSettings.eyeStrainAlert) {
			if (!strainStartTime.current) {
				strainStartTime.current = Date.now();
				console.log(
					`👁️ Eye strain detected, starting timer at ${new Date().toLocaleTimeString()}`
				);
			} else {
				const duration = Date.now() - strainStartTime.current;

				if (duration >= STRAIN_DURATION_THRESHOLD) {
					sendEyeStrainNotification();
					resetStrainTimer(); // Reset after notification
				}
			}
		} else {
			resetStrainTimer();
		}

		// 2. Screen Distance Alert (< 30cm for > 30 seconds)
		if (notificationSettings.screenDistanceAlert && metrics.proximityScore !== undefined) {
			if (metrics.proximityScore < PROXIMITY_THRESHOLD) {
				if (!proximityStartTime.current) {
					proximityStartTime.current = Date.now();
					console.log(
						`📏 Too close to screen (${metrics.proximityScore}cm), starting timer at ${new Date().toLocaleTimeString()}`
					);
				} else {
					const duration = Date.now() - proximityStartTime.current;

					if (duration >= PROXIMITY_DURATION_THRESHOLD) {
						sendScreenDistanceNotification();
						resetProximityTimer(); // Reset after notification
					}
				}
			} else {
				resetProximityTimer();
			}
		}

		// 3. Battery Alert - Using actual battery level from store
		if (notificationSettings.batteryDrainingAlert) {
			const currentBatteryLevel = batteryLevel;

			// Check for low battery using BATTERY_LOW_THRESHOLD
			if (currentBatteryLevel < BATTERY_LOW_THRESHOLD) {
				sendBatteryNotification();
			}

			// Check for rapid battery drain using BATTERY_DRAIN_THRESHOLD
			if (!batteryCheckStartTime.current) {
				batteryCheckStartTime.current = Date.now();
				initialBatteryLevel.current = currentBatteryLevel;
			} else {
				const timePassed = Date.now() - batteryCheckStartTime.current;
				const batteryDrop = (initialBatteryLevel.current || 0) - currentBatteryLevel;

				if (timePassed >= BATTERY_DRAIN_TIME) {
					// Use actual BATTERY_DRAIN_THRESHOLD
					if (batteryDrop >= BATTERY_DRAIN_THRESHOLD) {
						console.log(
							`🔋 Battery drained ${batteryDrop}% in ${Math.floor(timePassed / 60000)} minutes`
						);
						sendBatteryNotification();
					}
					// Reset for next check
					batteryCheckStartTime.current = Date.now();
					initialBatteryLevel.current = currentBatteryLevel;
				}
			}
		} else {
			resetBatteryTimer();
		}

		// 4. Lighting Alert - Using available eye metrics as alternative for lighting detection
		if (notificationSettings.lightingAlert) {
			let lightingIssue = false;

			// Use blink rate abnormalities as proxy for lighting issues
			if (metrics.blinkRate !== undefined) {
				// Abnormal blink rate can indicate strain from poor lighting
				if (metrics.blinkRate > 25 || metrics.blinkRate < 8) {
					lightingIssue = true;
					console.log(
						`💡 Abnormal blink rate detected: ${metrics.blinkRate} (normal: 8-25)`
					);
				}
			}

			// Use eye aspect ratio (squinting in poor light)
			if (metrics.eyeAspectRatio !== undefined && metrics.eyeAspectRatio < 0.2) {
				lightingIssue = true;
				console.log(`💡 Low eye aspect ratio detected: ${metrics.eyeAspectRatio}`);
			}

			// Use squint intensity
			if (metrics.squintIntensity !== undefined && metrics.squintIntensity > 0.7) {
				lightingIssue = true;
				console.log(`💡 High squint intensity detected: ${metrics.squintIntensity}`);
			}

			// Use pupil dilation (larger pupils in low light)
			if (metrics.pupilDilation !== undefined && metrics.pupilDilation > 8) {
				lightingIssue = true;
				console.log(`💡 High pupil dilation detected: ${metrics.pupilDilation}`);
			}

			if (lightingIssue) {
				sendLightingNotification();
			}
		}

		// 5. Screen Time Alert - Only using dailyScreenTime
		if (notificationSettings.screenTimeAlert && screenTime?.dailyScreenTime) {
			const screenTimeSeconds = screenTime.dailyScreenTime;
			const screenTimeHours = screenTimeSeconds / (60 * 60);

			// Daily threshold (6 hours)
			if (screenTimeHours >= SCREEN_TIME_THRESHOLD / 60) {
				console.log(
					`⏰ Screen time threshold exceeded: ${screenTimeHours.toFixed(2)} hours`
				);
				sendScreenTimeNotification();
			}
		}
	}, [
		metrics,
		isActive,
		eyeStrainDetected,
		notificationSettings,
		batteryLevel,
		sendEyeStrainNotification,
		sendScreenDistanceNotification,
		sendScreenTimeNotification,
		sendBatteryNotification,
		sendLightingNotification,
		resetStrainTimer,
		resetProximityTimer,
		resetBatteryTimer,
		screenTime,
	]);

	// Periodic cleanup
	useEffect(() => {
		cleanupTimer.current = setInterval(cleanupOldData, CLEANUP_INTERVAL);
		return () => {
			if (cleanupTimer.current) {
				clearInterval(cleanupTimer.current);
				cleanupTimer.current = null;
			}
		};
	}, [cleanupOldData]);

	// Reset all timers when tracking becomes inactive
	useEffect(() => {
		if (!isActive) {
			console.log('⏸️ Tracking inactive, resetting all timers');
			resetStrainTimer();
			resetProximityTimer();
			resetBatteryTimer();
		}
	}, [isActive, resetStrainTimer, resetProximityTimer, resetBatteryTimer]);

	return {
		eyeStrainDetected,
		notificationSettings,
		batteryLevel,
		resetStrainTimer,
		resetProximityTimer,
		resetBatteryTimer,
	};
};

export default useEyeStrainNotifier;
