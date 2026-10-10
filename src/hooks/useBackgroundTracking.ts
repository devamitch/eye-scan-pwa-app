import useAppStore from '@/store';
import { useCallback, useEffect, useRef, useState } from 'react';

// ============================================================================
// Type Definitions
// ============================================================================

interface BackgroundTrackingState {
	isCameraActive: boolean;
	isTrackingActive: boolean;
	mediaStream: MediaStream | null;
	wakeLock: WakeLockSentinel | null;
	isBackground: boolean;
	lastActivity: number;
}

interface BackgroundTrackingActions {
	startCamera: () => Promise<MediaStream | null>;
	stopCamera: () => void;
	startSession: () => void;
	endSession: () => void;
	acquireWakeLock: () => Promise<void>;
	releaseWakeLock: () => Promise<void>;
	keepMediaAlive: (stream: MediaStream | null) => void;
	stopMediaKeepAlive: () => void;
	handleVisibilityChange: () => void;
	handlePageHide: () => void;
	handlePageShow: () => void;
}

interface UseBackgroundTrackingReturn extends BackgroundTrackingState, BackgroundTrackingActions {}

// ============================================================================
// Constants
// ============================================================================

const MEDIA_KEEP_ALIVE_INTERVAL = 15000; // 15 seconds
const ACTIVITY_TIMEOUT = 30000; // 30 seconds
const BACKGROUND_THROTTLE_INTERVAL = 1000; // 1 second for background processing

// ============================================================================
// Hook Implementation
// ============================================================================

export const useBackgroundTracking = () => {
	// Refs for managing state without re-renders
	const wakeLockRef = useRef<WakeLockSentinel | null>(null);
	const mediaKeepAliveIntervalRef = useRef<NodeJS.Timeout | null>(null);
	const backgroundThrottleRef = useRef<NodeJS.Timeout | null>(null);
	const activityMonitorRef = useRef<NodeJS.Timeout | null>(null);
	const mediaStreamRef = useRef<MediaStream | null>(null);
	const videoRef = useRef<HTMLVideoElement | null>(null);
	const canvasRef = useRef<HTMLCanvasElement | null>(null);

	// State
	const [isCameraActive, setIsCameraActive] = useState(false);
	const [isTrackingActive, setIsTrackingActive] = useState(false);
	const [mediaStream, setMediaStream] = useState<MediaStream | null>(null);
	const [isBackground, setIsBackground] = useState(false);
	const [lastActivity, setLastActivity] = useState(Date.now());

	// Store integration
	const storeState = useAppStore();

	const setCameraState = useCallback(
		(state: Partial<{ isCameraActive: boolean; cameraError: string | null }>) => {
			storeState?.camera?.setCameraState?.(state);
		},
		[storeState?.camera?.setCameraState]
	);

	const setTrackingState = useCallback(
		(state: Partial<{ isTrackingActive: boolean; trackingError: string | null }>) => {
			storeState?.camera?.setTrackingState?.(state);
		},
		[storeState?.camera?.setTrackingState]
	);

	// ============================================================================
	// Wake Lock Management
	// ============================================================================

	const acquireWakeLock = useCallback(async (): Promise<void> => {
		if (!('wakeLock' in navigator)) {
			console.warn('Screen Wake Lock API not supported');
			return;
		}

		try {
			wakeLockRef.current = await (navigator as any).wakeLock.request('screen');
			console.log('✅ Screen Wake Lock acquired for background tracking');

			// Handle wake lock release
			wakeLockRef.current.addEventListener('release', () => {
				console.log('🔓 Screen Wake Lock was released');
				wakeLockRef.current = null;
			});
		} catch (err: any) {
			console.warn(`❌ Screen Wake Lock error: ${err.message}`);
			wakeLockRef.current = null;
		}
	}, []);

	const releaseWakeLock = useCallback(async (): Promise<void> => {
		if (wakeLockRef.current) {
			try {
				await wakeLockRef.current.release();
				wakeLockRef.current = null;
				console.log('✅ Screen Wake Lock released');
			} catch (err: any) {
				console.warn(`❌ Error releasing Wake Lock: ${err.message}`);
			}
		}
	}, []);

	// ============================================================================
	// Media Stream Management with Performance Optimization
	// ============================================================================

	const keepMediaAlive = useCallback((stream: MediaStream | null) => {
		if (!stream) return;

		mediaStreamRef.current = stream;

		// Clear any existing interval
		if (mediaKeepAliveIntervalRef.current) {
			clearInterval(mediaKeepAliveIntervalRef.current);
		}

		const videoTracks = stream.getVideoTracks();
		if (videoTracks.length === 0) return;

		console.log('🔧 Starting media keep-alive for background tracking');

		// Periodic reactivation to prevent background suspension
		mediaKeepAliveIntervalRef.current = setInterval(() => {
			// Use requestIdleCallback for better performance if available
			const callback = () => {
				videoTracks.forEach((track) => {
					if (track.readyState === 'live' && !track.enabled) {
						track.enabled = true;
						console.log('🔄 Reactivated video track in background');
					}
				});

				// Update activity timestamp
				setLastActivity(Date.now());
			};

			if ('requestIdleCallback' in window) {
				requestIdleCallback(callback);
			} else {
				callback();
			}
		}, MEDIA_KEEP_ALIVE_INTERVAL);
	}, []);

	const stopMediaKeepAlive = useCallback(() => {
		if (mediaKeepAliveIntervalRef.current) {
			clearInterval(mediaKeepAliveIntervalRef.current);
			mediaKeepAliveIntervalRef.current = null;
			console.log('🛑 Stopped media keep-alive');
		}
	}, []);

	// ============================================================================
	// Camera Management with Better Error Handling
	// ============================================================================

	const startCamera = useCallback(
		async (
			constraints: MediaStreamConstraints = {
				video: {
					width: { ideal: 640 },
					height: { ideal: 480 },
					frameRate: { ideal: 30 },
					facingMode: 'user',
				},
				audio: false,
			}
		): Promise<MediaStream | null> => {
			try {
				console.log('🎬 Starting camera with constraints:', constraints);

				const stream = await navigator.mediaDevices.getUserMedia(constraints);

				// Configure tracks for background operation
				stream.getTracks().forEach((track) => {
					track.enabled = true;

					// Add event listeners for track state changes
					track.addEventListener('ended', () => {
						console.warn(`📹 Track ended: ${track.kind}`, track.readyState);
					});

					track.addEventListener('mute', () => {
						console.warn(`🔇 Track muted: ${track.kind}`);
					});

					track.addEventListener('unmute', () => {
						console.log('🔊 Track unmuted');
					});
				});

				setMediaStream(stream);
				mediaStreamRef.current = stream;

				if (videoRef.current) {
					videoRef.current.srcObject = stream;
					await new Promise<void>((resolve) => {
						if (!videoRef.current) return resolve();
						videoRef.current.onloadedmetadata = () => resolve();
					});
					await videoRef.current.play();
				}

				setIsCameraActive(true);
				setCameraState({ isCameraActive: true, cameraError: null });

				// Start media keep-alive
				keepMediaAlive(stream);

				console.log('✅ Camera started successfully');
				return stream;
			} catch (error) {
				console.error('❌ Camera error:', error);
				setCameraState({
					isCameraActive: false,
					cameraError: 'Failed to access camera. Please check permissions.',
				});
				return null;
			}
		},
		[setCameraState, keepMediaAlive]
	);

	const stopCamera = useCallback(() => {
		console.log('🛑 Stopping camera and cleaning up...');

		// Stop media keep-alive
		stopMediaKeepAlive();

		// Stop all media tracks
		if (mediaStreamRef.current) {
			mediaStreamRef.current.getTracks().forEach((track) => {
				track.stop();
				console.log(`⏹️ Stopped ${track.kind} track`);
			});
			mediaStreamRef.current = null;
		}

		if (videoRef.current) {
			videoRef.current.srcObject = null;
		}

		if (mediaStream) {
			mediaStream.getTracks().forEach((track) => track.stop());
			setMediaStream(null);
		}

		// Clear intervals
		if (backgroundThrottleRef.current) {
			clearInterval(backgroundThrottleRef.current);
			backgroundThrottleRef.current = null;
		}

		if (activityMonitorRef.current) {
			clearInterval(activityMonitorRef.current);
			activityMonitorRef.current = null;
		}

		setIsCameraActive(false);
		setCameraState({ isCameraActive: false, cameraError: null });

		console.log('✅ Camera stopped and cleaned up');
	}, [mediaStream, stopMediaKeepAlive, setCameraState]);

	// ============================================================================
	// Session Management
	// ============================================================================

	const startSession = useCallback(() => {
		console.log('🚀 Starting tracking session');
		setIsTrackingActive(true);
		setTrackingState({ isTrackingActive: true, trackingError: null });

		// Acquire wake lock for background operation
		acquireWakeLock();

		// Start activity monitoring
		startActivityMonitoring();

		console.log('✅ Tracking session started');
	}, [setTrackingState, acquireWakeLock]);

	const endSession = useCallback(() => {
		console.log('🛑 Ending tracking session');
		setIsTrackingActive(false);
		setTrackingState({ isTrackingActive: false, trackingError: null });

		// Release wake lock
		releaseWakeLock();

		// Stop activity monitoring
		stopActivityMonitoring();

		console.log('✅ Tracking session ended');
	}, [setTrackingState, releaseWakeLock]);

	// ============================================================================
	// Activity Monitoring
	// ============================================================================

	const startActivityMonitoring = useCallback(() => {
		if (activityMonitorRef.current) {
			clearInterval(activityMonitorRef.current);
		}

		activityMonitorRef.current = setInterval(() => {
			const now = Date.now();
			const timeSinceLastActivity = now - lastActivity;

			if (timeSinceLastActivity > ACTIVITY_TIMEOUT && isTrackingActive) {
				console.log('🕒 No activity detected, but keeping tracking alive');
				// Force update activity to prevent timeout
				setLastActivity(now);
			}
		}, 10000); // Check every 10 seconds
	}, [lastActivity, isTrackingActive]);

	const stopActivityMonitoring = useCallback(() => {
		if (activityMonitorRef.current) {
			clearInterval(activityMonitorRef.current);
			activityMonitorRef.current = null;
		}
	}, []);

	const updateActivity = useCallback(() => {
		setLastActivity(Date.now());
	}, []);

	// ============================================================================
	// Background/Visibility Management
	// ============================================================================

	const handleVisibilityChange = useCallback(() => {
		const isHidden = document.hidden;
		setIsBackground(isHidden);

		if (isHidden) {
			console.log('🌙 Page is now in background - reducing processing');
			// Page is hidden (minimized or tab switched)
			if (isTrackingActive && mediaStreamRef.current) {
				console.log('🔍 Continuing tracking in background with reduced load');

				// Ensure media tracks stay active
				mediaStreamRef.current.getTracks().forEach((track) => {
					if (track.readyState === 'live') {
						track.enabled = true;
					}
				});
			}
		} else {
			console.log('☀️ Page is now in foreground - restoring full processing');
			// Page is visible
			updateActivity();
		}
	}, [isTrackingActive, updateActivity]);

	const handlePageHide = useCallback(() => {
		console.log('📄 Page is being hidden');
		setIsBackground(true);
	}, []);

	const handlePageShow = useCallback(() => {
		console.log('📄 Page is being shown');
		setIsBackground(false);
		updateActivity();
	}, [updateActivity]);

	// ============================================================================
	// Background Processing Throttle
	// ============================================================================

	const startBackgroundThrottle = useCallback(() => {
		if (backgroundThrottleRef.current) {
			clearInterval(backgroundThrottleRef.current);
		}

		// Only run in background to save resources
		backgroundThrottleRef.current = setInterval(() => {
			if (isBackground && isTrackingActive) {
				// Minimal background processing using idle callback
				if ('requestIdleCallback' in window) {
					requestIdleCallback(() => {
						updateActivity();
					});
				} else {
					updateActivity();
				}
			}
		}, BACKGROUND_THROTTLE_INTERVAL);
	}, [isBackground, isTrackingActive, updateActivity]);

	// ============================================================================
	// Effects and Event Listeners
	// ============================================================================

	useEffect(() => {
		// Set up visibility change listeners
		document.addEventListener('visibilitychange', handleVisibilityChange);
		document.addEventListener('pagehide', handlePageHide);
		document.addEventListener('pageshow', handlePageShow);

		// Start background processing throttle
		startBackgroundThrottle();

		// Cleanup on unmount
		return () => {
			document.removeEventListener('visibilitychange', handleVisibilityChange);
			document.removeEventListener('pagehide', handlePageHide);
			document.removeEventListener('pageshow', handlePageShow);

			stopMediaKeepAlive();
			stopActivityMonitoring();

			if (backgroundThrottleRef.current) {
				clearInterval(backgroundThrottleRef.current);
			}

			// Release wake lock if still active
			if (wakeLockRef.current) {
				releaseWakeLock();
			}

			// Stop camera if still active
			if (isCameraActive) {
				stopCamera();
			}

			console.log('🧹 Background tracking cleanup completed');
		};
	}, [
		handleVisibilityChange,
		handlePageHide,
		handlePageShow,
		startBackgroundThrottle,
		stopMediaKeepAlive,
		stopActivityMonitoring,
		releaseWakeLock,
		stopCamera,
		isCameraActive,
	]);

	// Effect to handle background state changes
	useEffect(() => {
		if (isBackground) {
			console.log('🔍 Entering background mode - throttling computations');
			// Reduce processing intensity in background
			// This is where you might throttle frame processing rates
		} else {
			console.log('🎯 Returning to foreground mode - full processing');
			// Restore normal processing
			updateActivity();
		}
	}, [isBackground, updateActivity]);

	// Effect to handle tracking state changes
	useEffect(() => {
		if (isTrackingActive) {
			console.log('🎯 Tracking activated');
			startActivityMonitoring();
		} else {
			console.log('⏸️ Tracking deactivated');
			stopActivityMonitoring();
		}
	}, [isTrackingActive, startActivityMonitoring, stopActivityMonitoring]);

	// ============================================================================
	// Return Interface
	// ============================================================================

	return {
		// State
		isCameraActive,
		isTrackingActive,
		mediaStream,
		wakeLock: wakeLockRef.current,
		isBackground,
		lastActivity,

		// Actions
		setCameraState,
		startCamera,
		stopCamera,
		startSession,
		endSession,
		acquireWakeLock,
		releaseWakeLock,
		keepMediaAlive,
		stopMediaKeepAlive,
		handleVisibilityChange,
		handlePageHide,
		handlePageShow,
		setMediaStream,
		videoRef,
	};
};

// ============================================================================
// Export Default
// ============================================================================

export default useBackgroundTracking;
