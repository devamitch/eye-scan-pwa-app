'use client';

import { useBackgroundTracking } from '@/hooks/useBackgroundTracking';
import { useFullScreen } from '@/hooks/useFullScreen';
import { usePiPState } from '@/hooks/usePiPState';
import { useVideoSync } from '@/hooks/useVideoSync';
import { useEyeTrackingContext } from '@/provider/EyeTrackingProvider';
import { usePiP } from '@/provider/PiPContext';
import { usePathname } from 'next/navigation';
import { useCallback, useEffect, useRef, useState } from 'react';
import { ControlButtons } from './control-buttons';
import { FullScreenClose } from './fullscreen-close';
import styles from './picturein.module.scss';
import { StatusIndicator } from './status-indicator';

interface DocumentPictureInPicture {
	requestWindow(options?: { width?: number; height?: number }): Promise<Window>;
	readonly window: Window | null;
}

declare global {
	interface Window {
		documentPictureInPicture?: DocumentPictureInPicture;
		wakeLock?: any;
	}
}

// Browser detection utilities
const isSafari = () => {
	if (typeof navigator === 'undefined') return false;
	const ua = navigator.userAgent.toLowerCase();
	return /safari/.test(ua) && !/chrome/.test(ua) && !/chromium/.test(ua) && !/edg/.test(ua);
};

const isIOS = () => {
	if (typeof navigator === 'undefined') return false;
	return (
		/iPad|iPhone|iPod/.test(navigator.userAgent) ||
		(navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1)
	);
};

// Inspiring quotes for loading state
const LOADING_QUOTES = [
	'The eyes are the window to the soul...',
	'Focus is the gateway to success...',
	'Every blink tells a story...',
	'Tracking your journey, one gaze at a time...',
	'Where attention goes, energy flows...',
	'The future is where you look...',
	'Your focus determines your reality...',
];
const usePageVisibility = () => {
	const [isVisible, setIsVisible] = useState(() =>
		typeof document !== 'undefined' ? !document.hidden : true
	);

	useEffect(() => {
		const handleVisibilityChange = () => setIsVisible(!document.hidden);
		document.addEventListener('visibilitychange', handleVisibilityChange);
		return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
	}, []);

	return isVisible;
};

const PictureInMode = () => {
	const {
		videoRef,
		canvasRef,
		isActive,
		loading,
		error,
		cameraReady,
		startTracking,
		stopTracking,
	} = useEyeTrackingContext();

	const { isPiPExpanded, setIsPiPExpanded, isFullScreen } = usePiP();
	const { isVideoReady, isHovered, updateState } = usePiPState();
	const { toggleFullScreen } = useFullScreen();
	const pathname = usePathname();
	const [loadingQuote, setLoadingQuote] = useState('');

	// Refs
	const containerRef = useRef<HTMLDivElement>(null);
	const pipWindowRef = useRef<Window | null>(null);
	const pipCanvasRef = useRef<HTMLCanvasElement | null>(null);
	const pipVideoRef = useRef<HTMLVideoElement | null>(null);
	const animationFrameRef = useRef<number>(0);
	const mediaStreamRef = useRef<MediaStream | null>(null);
	const isPiPSupportedRef = useRef(false);
	const isDocumentPiPRef = useRef(false);
	const isSafariRef = useRef(false);
	const isIOSRef = useRef(false);
	const [showLoading, setShowLoading] = useState(false);

	const updateIntervalRef = useRef<NodeJS.Timeout | null>(null);

	// State
	const [isInPiPMode, setIsInPiPMode] = useState(false);
	const [isAutoPiP, setIsAutoPiP] = useState(false);

	const isVisible = usePageVisibility();
	const { acquireWakeLock, releaseWakeLock, keepMediaAlive, stopMediaKeepAlive } =
		useBackgroundTracking();

	useVideoSync(videoRef, canvasRef, isVideoReady);

	// Initialize browser detection and PiP support
	useEffect(() => {
		isSafariRef.current = isSafari();
		isIOSRef.current = isIOS();

		const video = document.createElement('video');

		// Safari and iOS don't support Document PiP API
		if (isSafariRef.current || isIOSRef.current) {
			isPiPSupportedRef.current = !!(
				video.requestPictureInPicture && document.pictureInPictureEnabled
			);
			isDocumentPiPRef.current = false;
			console.log('[PiP] Safari/iOS detected - using standard PiP API');
		} else {
			isPiPSupportedRef.current = !!(
				window.documentPictureInPicture ||
				(video.requestPictureInPicture && document.pictureInPictureEnabled)
			);
			isDocumentPiPRef.current = !!window.documentPictureInPicture;
			console.log(
				'[PiP] Chrome/Edge detected - Document PiP available:',
				isDocumentPiPRef.current
			);
		}

		console.log('[PiP] PiP support:', isPiPSupportedRef.current);
	}, []);

	// Store and configure media stream
	useEffect(() => {
		const video = videoRef.current;
		if (!video) return;

		const handleLoadedMetadata = () => {
			if (video.srcObject) {
				mediaStreamRef.current = video.srcObject as MediaStream;
				console.log('[PiP] Media stream loaded');

				// Configure video tracks for better quality
				if (mediaStreamRef.current) {
					mediaStreamRef.current.getTracks().forEach((track) => {
						if (track.kind === 'video') {
							track.enabled = true;
							try {
								(track as any).applyConstraints({
									frameRate: { ideal: 30, max: 60 },
									width: { ideal: 1280, max: 1920 },
									height: { ideal: 720, max: 1080 },
								});
							} catch (e) {
								console.warn('[PiP] Could not apply video constraints:', e);
							}
						}
					});
				}
			}
		};

		video.addEventListener('loadedmetadata', handleLoadedMetadata);
		return () => video.removeEventListener('loadedmetadata', handleLoadedMetadata);
	}, [videoRef]);

	// Manage wake lock and media keep-alive
	useEffect(() => {
		if (isActive && !isVisible) {
			acquireWakeLock();
			if (mediaStreamRef.current) {
				keepMediaAlive(mediaStreamRef.current);
			}
		} else if (!isActive || isVisible) {
			stopMediaKeepAlive();
		}

		return () => stopMediaKeepAlive();
	}, [isActive, isVisible, acquireWakeLock, keepMediaAlive, stopMediaKeepAlive]);

	// Ensure camera access is available
	const ensureCameraAccess = useCallback(async (): Promise<boolean> => {
		console.log('[PiP] Ensuring camera access...');

		if (mediaStreamRef.current?.active) {
			console.log('[PiP] Camera already active');
			return true;
		}

		if (videoRef.current?.srcObject) {
			mediaStreamRef.current = videoRef.current.srcObject as MediaStream;
			if (mediaStreamRef.current?.active) {
				console.log('[PiP] Camera active from video element');
				return true;
			}
		}

		try {
			console.log('[PiP] Requesting camera access...');
			const stream = await navigator.mediaDevices.getUserMedia({
				video: {
					width: { ideal: 1280 },
					height: { ideal: 720 },
					frameRate: { ideal: 30 },
				},
			});

			if (videoRef.current) {
				videoRef.current.srcObject = stream;
				mediaStreamRef.current = stream;
				await videoRef.current.play();
			}

			console.log('[PiP] Camera access granted');
			return true;
		} catch (e) {
			console.error('[PiP] Failed to get camera access:', e);
			return false;
		}
	}, [videoRef]);

	// Copy canvas content to PiP window (for Document PiP API)
	const copyCanvasToPiP = useCallback(() => {
		if (!pipCanvasRef.current || !canvasRef.current || !isActive || !isInPiPMode) {
			return;
		}

		const sourceCanvas = canvasRef.current;
		const targetCanvas = pipCanvasRef.current;

		// Check if canvas has content
		if (sourceCanvas.width === 0 || sourceCanvas.height === 0) {
			animationFrameRef.current = requestAnimationFrame(copyCanvasToPiP);
			return;
		}

		// Resize target canvas if dimensions changed
		if (
			targetCanvas.width !== sourceCanvas.width ||
			targetCanvas.height !== sourceCanvas.height
		) {
			targetCanvas.width = sourceCanvas.width;
			targetCanvas.height = sourceCanvas.height;
			console.log('[PiP] Canvas resized to:', targetCanvas.width, 'x', targetCanvas.height);
		}

		const ctx = targetCanvas.getContext('2d', { alpha: true });
		if (ctx) {
			ctx.clearRect(0, 0, targetCanvas.width, targetCanvas.height);
			ctx.drawImage(sourceCanvas, 0, 0, targetCanvas.width, targetCanvas.height);
		}

		// Continue animation loop
		animationFrameRef.current = requestAnimationFrame(copyCanvasToPiP);
	}, [canvasRef, isActive, isInPiPMode]);

	// Exit PiP mode
	const exitPiPMode = useCallback(async (): Promise<boolean> => {
		console.log('[PiP] Exiting PiP mode...');

		try {
			// Cancel animation frames and intervals
			if (animationFrameRef.current) {
				cancelAnimationFrame(animationFrameRef.current);
				animationFrameRef.current = 0;
			}

			if (updateIntervalRef.current) {
				clearInterval(updateIntervalRef.current);
				updateIntervalRef.current = null;
			}

			// Handle Document PiP API
			if (pipWindowRef.current) {
				try {
					pipWindowRef.current.close();
				} catch (e) {
					console.warn('[PiP] Error closing PiP window:', e);
				}
			}
			// Handle standard PiP API
			else if (document.pictureInPictureElement) {
				try {
					await document.exitPictureInPicture();
				} catch (e) {
					console.warn('[PiP] Error exiting standard PiP:', e);
				}
			}

			// Clean up references
			pipWindowRef.current = null;
			pipCanvasRef.current = null;
			pipVideoRef.current = null;
			setIsInPiPMode(false);
			setIsAutoPiP(false);

			console.log('[PiP] Successfully exited PiP mode');
			return true;
		} catch (error) {
			console.error('[PiP] Failed to exit PiP mode:', error);
			return false;
		}
	}, []);

	// Enter PiP mode with retry logic
	const enterPiPMode = useCallback(
		async (isAutomatic = false, retryCount = 0): Promise<boolean> => {
			console.log(
				'[PiP] Attempting to enter PiP mode (automatic:',
				isAutomatic,
				'retry:',
				retryCount,
				')'
			);
			if (!videoRef.current) {
				console.warn('[PiP] Video element not available');
				return false;
			}
			const video = videoRef.current;
			if (!window.documentPictureInPicture) await video.requestPictureInPicture();

			if (!isPiPSupportedRef.current) {
				console.warn('[PiP] PiP not supported');
				return false;
			}

			if (isInPiPMode) {
				console.warn('[PiP] Already in PiP mode');
				return false;
			}

			// Ensure camera access before entering PiP
			if (!mediaStreamRef.current?.active) {
				console.log('[PiP] Camera not active, ensuring access...');
				const hasCamera = await ensureCameraAccess();
				if (!hasCamera) {
					console.error('[PiP] Failed to ensure camera access');
					return false;
				}
				// Wait for stream to stabilize
				await new Promise((r) => setTimeout(r, 500));
			}

			try {
				// Ensure video tracks are enabled
				if (mediaStreamRef.current) {
					mediaStreamRef.current.getVideoTracks().forEach((track) => {
						track.enabled = true;
					});
				}

				// Safari/iOS specific handling
				if (isSafariRef.current || isIOSRef.current) {
					console.log('[PiP] Using Safari/iOS PiP mode');
					const video = videoRef.current;

					// Set required attributes for iOS
					video.setAttribute('playsinline', 'true');
					video.setAttribute('webkit-playsinline', 'true');

					// Ensure video is playing
					if (video.paused) {
						try {
							await video.play();
						} catch (e) {
							console.warn('[PiP] Could not play video:', e);
						}
					}

					// Small delay to ensure video is ready
					await new Promise((r) => setTimeout(r, 100));

					try {
						await video.requestPictureInPicture();

						// Set up exit handler
						video.addEventListener(
							'leavepictureinpicture',
							() => {
								console.log('[PiP] Left Safari PiP mode');
								setIsInPiPMode(false);
								setIsAutoPiP(false);
								if (!isIOSRef.current) releaseWakeLock();
							},
							{ once: true }
						);

						setIsInPiPMode(true);
						if (isAutomatic) setIsAutoPiP(true);
						console.log('[PiP] Successfully entered Safari PiP mode');
						return true;
					} catch (pipError: any) {
						console.error('[PiP] Safari PiP error:', pipError);

						// Retry logic for Safari
						if (retryCount < 2) {
							console.log('[PiP] Retrying Safari PiP...');
							await new Promise((r) => setTimeout(r, 500));
							return enterPiPMode(isAutomatic, retryCount + 1);
						}
						throw pipError;
					}
				}
				// Chrome/Edge with Document PiP API
				else if (isDocumentPiPRef.current && window.documentPictureInPicture) {
					console.log('[PiP] Using Document PiP API');

					const pipWindow = await window.documentPictureInPicture.requestWindow({
						width: 400,
						height: 300,
					});
					pipWindowRef.current = pipWindow;

					// Copy all stylesheets to PiP window
					[...document.styleSheets].forEach((styleSheet) => {
						try {
							const cssRules = [...styleSheet.cssRules]
								.map((rule) => rule.cssText)
								.join('');
							const style = document.createElement('style');
							style.textContent = cssRules;
							pipWindow.document.head.appendChild(style);
						} catch (e) {
							// Cross-origin stylesheets - use link instead
							if (styleSheet.href) {
								const link = document.createElement('link');
								link.rel = 'stylesheet';
								link.type = styleSheet.type;
								link.media = styleSheet.media.toString();
								link.href = styleSheet.href;
								pipWindow.document.head.appendChild(link);
							}
						}
					});

					// Add custom styles for PiP window
					const style = pipWindow.document.createElement('style');
					style.textContent = `
						:root { color-scheme: light dark; }
						* { margin: 0; padding: 0; box-sizing: border-box; }
						html, body { 
							width: 100%; height: 100%; overflow: hidden; 
							background: #000; 
						}
						#pip-container { 
							position: relative; width: 100%; height: 100%; 
							display: flex; align-items: center; justify-content: center; 
						}
						video { 
							width: 100%; height: 100%; 
							object-fit: contain; display: block; 
							background: #000; transform: scaleX(-1);
						}
						canvas {
							position: absolute; top: 0; left: 0;
							width: 100%; height: 100%;
							object-fit: contain; transform: scaleX(-1);
							pointer-events: none; z-index: 10;
						}
						#status { 
							position: absolute; top: 8px; left: 8px; 
							padding: 6px 12px; background: rgba(0, 0, 0, 0.8); 
							color: #fff; border-radius: 6px; font-size: 12px; 
							font-family: system-ui, -apple-system, sans-serif; 
							z-index: 20; display: flex; align-items: center; gap: 8px;
							border: 1px solid rgba(255, 255, 255, 0.1);
						}
						#status-dot { 
							width: 8px; height: 8px; border-radius: 50%; 
							background: #22c55e; 
							animation: pulse 2s ease-in-out infinite; 
						}
						@keyframes pulse { 
							0%, 100% { opacity: 1; transform: scale(1); } 
							50% { opacity: 0.6; transform: scale(0.9); } 
						}
						#controls { 
							position: absolute; bottom: 12px; left: 50%; 
							transform: translateX(-50%); display: flex; gap: 8px; 
							z-index: 20; opacity: 0; transition: opacity 0.3s ease;
						}
						#pip-container:hover #controls { opacity: 1; }
						button { 
							padding: 8px 16px; background: rgba(0, 0, 0, 0.8); 
							color: white; border: 1px solid rgba(255, 255, 255, 0.2); 
							border-radius: 6px; cursor: pointer; font-size: 12px; 
							font-family: system-ui, -apple-system, sans-serif; 
							transition: all 0.2s; font-weight: 500;
						}
						button:hover { 
							background: rgba(0, 0, 0, 0.95); 
							border-color: rgba(255, 255, 255, 0.4); 
							transform: translateY(-1px);
						}
					`;
					pipWindow.document.head.appendChild(style);

					// Create PiP window content
					const container = pipWindow.document.createElement('div');
					container.id = 'pip-container';

					// Create video element
					const videoClone = pipWindow.document.createElement('video');
					videoClone.id = 'pip-video';
					videoClone.autoplay = true;
					videoClone.playsInline = true;
					videoClone.muted = true;
					videoClone.srcObject = mediaStreamRef.current;
					pipVideoRef.current = videoClone;

					// Create canvas element for eye tracking overlay
					const canvasClone = pipWindow.document.createElement('canvas');
					canvasClone.id = 'pip-canvas';
					if (canvasRef.current) {
						canvasClone.width = canvasRef.current.width;
						canvasClone.height = canvasRef.current.height;
					}
					pipCanvasRef.current = canvasClone;

					// Create status indicator
					const statusDiv = pipWindow.document.createElement('div');
					statusDiv.id = 'status';
					statusDiv.innerHTML = `
						<div id="status-dot"></div>
						<span>Eye Tracking Active</span>
					`;

					// Create controls
					const controlsContainer = pipWindow.document.createElement('div');
					controlsContainer.id = 'controls';

					const exitButton = pipWindow.document.createElement('button');
					exitButton.textContent = 'Exit PiP';
					exitButton.addEventListener('click', () => pipWindow.close());

					controlsContainer.appendChild(exitButton);

					// Assemble the window
					container.appendChild(videoClone);
					container.appendChild(canvasClone);
					container.appendChild(statusDiv);
					pipWindow.document.body.appendChild(container);
					pipWindow.document.body.appendChild(controlsContainer);

					// Start video playback
					setTimeout(async () => {
						try {
							await videoClone.play();
							console.log('[PiP] Video playing in Document PiP window');
						} catch (e) {
							console.error('[PiP] Failed to play video in PiP:', e);
						}
					}, 100);

					// Handle window close
					pipWindow.addEventListener('pagehide', async () => {
						console.log('[PiP] Document PiP window closed');
						if (animationFrameRef.current) {
							cancelAnimationFrame(animationFrameRef.current);
						}
						if (updateIntervalRef.current) {
							clearInterval(updateIntervalRef.current);
						}
						setIsInPiPMode(false);
						setIsAutoPiP(false);
						pipWindowRef.current = null;
						pipCanvasRef.current = null;
						pipVideoRef.current = null;
						await releaseWakeLock();
					});

					// Start canvas copying with both requestAnimationFrame and setInterval as backup
					// This dual approach ensures smooth updates even if RAF gets throttled
					animationFrameRef.current = requestAnimationFrame(copyCanvasToPiP);

					// Backup interval to ensure updates even if RAF is throttled
					updateIntervalRef.current = setInterval(() => {
						if (pipCanvasRef.current && canvasRef.current && isActive) {
							const sourceCanvas = canvasRef.current;
							const targetCanvas = pipCanvasRef.current;

							if (sourceCanvas.width > 0 && sourceCanvas.height > 0) {
								if (
									targetCanvas.width !== sourceCanvas.width ||
									targetCanvas.height !== sourceCanvas.height
								) {
									targetCanvas.width = sourceCanvas.width;
									targetCanvas.height = sourceCanvas.height;
								}

								const ctx = targetCanvas.getContext('2d', { alpha: true });
								if (ctx) {
									ctx.clearRect(0, 0, targetCanvas.width, targetCanvas.height);
									ctx.drawImage(
										sourceCanvas,
										0,
										0,
										targetCanvas.width,
										targetCanvas.height
									);
								}
							}
						}
					}, 33); // ~30fps backup update

					setIsInPiPMode(true);
					if (isAutomatic) setIsAutoPiP(true);
					console.log('[PiP] Successfully entered Document PiP mode');
					return true;
				}
				// Fallback to standard PiP API
				else if (videoRef.current.requestPictureInPicture) {
					console.log('[PiP] Using standard PiP API');
					await videoRef.current.requestPictureInPicture();

					videoRef.current.addEventListener(
						'leavepictureinpicture',
						() => {
							console.log('[PiP] Left standard PiP mode');
							setIsInPiPMode(false);
							setIsAutoPiP(false);
							if (!isIOSRef.current) releaseWakeLock();
						},
						{ once: true }
					);

					setIsInPiPMode(true);
					if (isAutomatic) setIsAutoPiP(true);
					console.log('[PiP] Successfully entered standard PiP mode');
					return true;
				}

				console.error('[PiP] No PiP method available');
				return false;
			} catch (error) {
				console.error('[PiP] Failed to enter PiP mode:', error);
				if (!isIOSRef.current) await releaseWakeLock();
				return false;
			}
		},
		[
			videoRef,
			isInPiPMode,
			canvasRef,
			isActive,
			copyCanvasToPiP,
			exitPiPMode,
			acquireWakeLock,
			releaseWakeLock,
			ensureCameraAccess,
		]
	);

	// Enhanced tracking controls
	const enhancedStartTracking = useCallback(async () => {
		console.log('[PiP] Starting enhanced tracking...');
		if ('wakeLock' in navigator && !isIOSRef.current) {
			await acquireWakeLock();
		}
		await startTracking();
		if (mediaStreamRef.current) {
			keepMediaAlive(mediaStreamRef.current);
		}
	}, [startTracking, acquireWakeLock, keepMediaAlive]);

	const enhancedStopTracking = useCallback(async () => {
		console.log('[PiP] Stopping enhanced tracking...');
		stopTracking();
		if (!isIOSRef.current) {
			await releaseWakeLock();
		}
		stopMediaKeepAlive();
	}, [stopTracking, releaseWakeLock, stopMediaKeepAlive]);

	// Auto PiP management on visibility change (not for iOS)
	useEffect(() => {
		if (isIOSRef.current) return;

		const handleVisibilityChange = async () => {
			if (document.hidden && isActive && !isInPiPMode) {
				console.log('[PiP] Page hidden, entering auto PiP...');
				await enterPiPMode(true);
			} else if (!document.hidden && isInPiPMode && isAutoPiP) {
				console.log('[PiP] Page visible, exiting auto PiP...');
				await exitPiPMode();
			}
		};

		document.addEventListener('visibilitychange', handleVisibilityChange);
		return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
	}, [isActive, isInPiPMode, isAutoPiP, enterPiPMode, exitPiPMode]);

	// Handle video events for standard PiP API
	useEffect(() => {
		const video = videoRef.current;
		if (!video) return;

		const handleLoadedData = () => {
			updateState({ isVideoReady: true });
			console.log('[PiP] Video data loaded');
		};

		const handleError = () => {
			updateState({ isVideoReady: false });
			console.error('[PiP] Video error');
		};

		const handleEnterPiP = () => {
			console.log('[PiP] Entered standard PiP via event');
			setIsInPiPMode(true);
		};

		const handleLeavePiP = () => {
			console.log('[PiP] Left standard PiP via event');
			setIsInPiPMode(false);
			setIsAutoPiP(false);
			if (animationFrameRef.current) {
				cancelAnimationFrame(animationFrameRef.current);
			}
			if (updateIntervalRef.current) {
				clearInterval(updateIntervalRef.current);
			}
		};

		video.addEventListener('loadeddata', handleLoadedData);
		video.addEventListener('error', handleError);
		video.addEventListener('enterpictureinpicture', handleEnterPiP);
		video.addEventListener('leavepictureinpicture', handleLeavePiP);

		return () => {
			video.removeEventListener('loadeddata', handleLoadedData);
			video.removeEventListener('error', handleError);
			video.removeEventListener('enterpictureinpicture', handleEnterPiP);
			video.removeEventListener('leavepictureinpicture', handleLeavePiP);
		};
	}, [videoRef, updateState]);

	// Auto-start tracking if needed
	useEffect(() => {
		if (isActive && videoRef.current?.srcObject === null && !loading) {
			console.log('[PiP] Auto-starting tracking...');
			enhancedStartTracking().catch((err) => {
				console.error('[PiP] Failed to auto-start tracking:', err);
				updateState({ error: 'Failed to auto-start tracking' });
			});
		}
	}, [isActive, loading, enhancedStartTracking, updateState, videoRef]);

	// Cleanup on unmount
	useEffect(() => {
		return () => {
			console.log('[PiP] Component unmounting, cleaning up...');
			stopMediaKeepAlive();
			if (animationFrameRef.current) {
				cancelAnimationFrame(animationFrameRef.current);
			}
			if (updateIntervalRef.current) {
				clearInterval(updateIntervalRef.current);
			}
			if (!isIOSRef.current) {
				releaseWakeLock();
			}
			if (isInPiPMode) {
				exitPiPMode();
			}
		};
	}, [stopMediaKeepAlive, releaseWakeLock, isInPiPMode, exitPiPMode]);

	// Event handlers
	const handleToggleTracking = useCallback(async () => {
		if (isActive) {
			await enhancedStopTracking();
			if (isAutoPiP) {
				await exitPiPMode();
			}
		} else {
			try {
				await enhancedStartTracking();
			} catch (err) {
				console.error('[PiP] Failed to start tracking:', err);
				updateState({ error: 'Failed to start tracking' });
			}
		}
	}, [
		isActive,
		isAutoPiP,
		enhancedStartTracking,
		enhancedStopTracking,
		updateState,
		exitPiPMode,
	]);

	const handleToggleFullScreen = async () => {
		await toggleFullScreen(containerRef.current);
	};

	const handleToggleExpanded = () => {
		setIsPiPExpanded(!isPiPExpanded);
	};

	const handleTogglePiP = useCallback(async () => {
		if (isInPiPMode) {
			await exitPiPMode();
		} else {
			await enterPiPMode(false);
		}
	}, [isInPiPMode, exitPiPMode, enterPiPMode]);

	const handleMouseEnter = () => updateState({ isHovered: true });
	const handleMouseLeave = () => updateState({ isHovered: false });

	useEffect(() => {
		if (!cameraReady) {
			const randomQuote = LOADING_QUOTES[Math.floor(Math.random() * LOADING_QUOTES.length)];
			setLoadingQuote(randomQuote);
			setShowLoading(true);
		} else {
			const timer = setTimeout(() => setShowLoading(false), 800);
			return () => clearTimeout(timer);
		}
	}, [cameraReady]);

	return (
		<>
			{showLoading && !isVideoReady && (
				<div className={styles.loadingOverlay}>
					<div className={styles.loadingContent}>
						<div className={styles.loadingSpinner}>
							<div className={styles.spinnerRing}></div>
							<div className={styles.spinnerRing}></div>
							<div className={styles.spinnerRing}></div>
						</div>
						<p className={styles.loadingQuote}>{loadingQuote}</p>
						<p className={styles.loadingText}>Initializing camera...</p>
					</div>
				</div>
			)}
			<div
				ref={containerRef}
				className={`${styles.cameraContainer} ${
					isPiPExpanded ? styles.expanded : styles.collapsed
				} ${isFullScreen ? styles.fullscreen : ''} ${
					pathname === '/live/' || pathname === '/live' ? styles.hidden : ''
				} ${isInPiPMode ? styles.pipMode : ''} ${!isVisible ? styles.backgroundMode : ''}`}
				onMouseEnter={handleMouseEnter}
				onMouseLeave={handleMouseLeave}
			>
				<div className={styles.glassEffect}>
					<video
						ref={videoRef}
						autoPlay
						playsInline
						muted
						className={styles.video}
						onLoadedData={() => updateState({ isVideoReady: true })}
						onError={() => updateState({ isVideoReady: false })}
						disablePictureInPicture={false}
					/>

					<canvas
						ref={canvasRef}
						className={styles.canvas}
						style={{
							display: isVideoReady && isActive ? 'block' : 'none',
							opacity: isActive ? 1 : 0,
							transition: 'opacity 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
						}}
					/>

					<ControlButtons
						isActive={isActive}
						isExpanded={isPiPExpanded}
						isFullScreen={isFullScreen}
						isHovered={isHovered}
						isInPiPMode={isInPiPMode}
						onToggleTracking={handleToggleTracking}
						onToggleExpanded={handleToggleExpanded}
						onToggleFullScreen={handleToggleFullScreen}
						onTogglePiP={handleTogglePiP}
					/>

					<StatusIndicator
						isActive={isActive}
						isExpanded={isPiPExpanded}
						isFullScreen={isFullScreen}
						isInPiPMode={isInPiPMode}
						isAutoPiP={isAutoPiP}
					/>

					<FullScreenClose isFullScreen={isFullScreen} onClose={handleToggleFullScreen} />
				</div>
			</div>
		</>
	);
};

export default PictureInMode;
