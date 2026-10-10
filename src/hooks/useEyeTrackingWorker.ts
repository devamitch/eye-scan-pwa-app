import { useCallback, useEffect, useRef, useState } from 'react';
import type {
	BatchProcessPayload,
	BatchProcessResult,
	ComputeDistancePayload,
	ComputeDrynessPayload,
	ComputeEARPayload,
	ComputeLuminancePayload,
	ComputeMetricsPayload,
	ComputeOverallHealthPayload,
	ComputeRednessPayload,
	DrynessResult,
	FilterLandmarksPayload,
	FilteredLandmarks,
	OverallHealthResult,
	ProcessImageDataPayload,
	ProximityResult,
	RednessResult,
	WorkerMessage,
	WorkerMessageType,
} from '../workers/eyeTracking.worker';

// ============================================================================
// Type Definitions
// ============================================================================

interface WorkerTask {
	id: string;
	type: WorkerMessageType;
	resolve: (value: any) => void;
	reject: (reason: any) => void;
	timestamp: number;
}

interface UseEyeTrackingWorkerReturn {
	// Core computations
	computeDryness: (
		blinkTimes: number[],
		incompleteBlinkFlags: boolean[],
		blinkRate: number
	) => Promise<DrynessResult>;
	computeRedness: (
		rednessValues: number[],
		blinkRate: number,
		exposureLevel?: number
	) => Promise<RednessResult>;
	computeDistance: (
		faceSizes: number[],
		baselineWidthPx: number,
		targetDistanceCm?: number
	) => Promise<ProximityResult>;
	computeLuminance: (
		imageData: ImageData,
		regions: Array<{ x: number; y: number; width: number; height: number; name: string }>
	) => Promise<number[]>;
	computeMetrics: (payload: ComputeMetricsPayload) => Promise<any>;
	processImageData: (
		imageData: ImageData,
		leftEyeRect: { x: number; y: number; w: number; h: number },
		rightEyeRect: { x: number; y: number; w: number; h: number }
	) => Promise<any>;
	computeEAR: (
		leftEye: ComputeEARPayload['leftEye'],
		rightEye: ComputeEARPayload['rightEye']
	) => Promise<number>;
	computePERCLOS: (earHistory: number[], threshold: number) => Promise<number>;
	computeOverallHealth: (
		blinkRate: number,
		percentageClosed: number,
		attentionFraction: number
	) => Promise<OverallHealthResult>;

	// Batch processing
	processBatchFrames: (payload: BatchProcessPayload) => Promise<BatchProcessResult>;
	filterLandmarks: (payload: FilterLandmarksPayload) => Promise<FilteredLandmarks>;

	// Worker management
	isReady: boolean;
	terminateWorker: () => void;
	getQueueSize: () => number;
	clearQueue: () => void;
	workerSource: 'public' | 'module' | 'none';
}

// ============================================================================
// Hook Implementation
// ============================================================================

export function useEyeTrackingWorker(): UseEyeTrackingWorkerReturn {
	const workerRef = useRef<Worker | null>(null);
	const taskQueueRef = useRef<Map<string, WorkerTask>>(new Map());
	const [isReady, setIsReady] = useState(false);
	const [workerSource, setWorkerSource] = useState<'public' | 'module' | 'none'>('none');
	const messageIdCounterRef = useRef(0);

	// Initialize worker with fallback strategy
	useEffect(() => {
		let isMounted = true;
		const workerCleanup = () => {
			if (workerRef.current) {
				workerRef.current.terminate();
				workerRef.current = null;
			}
			taskQueueRef.current.clear();
			if (isMounted) {
				setIsReady(false);
				setWorkerSource('none');
			}
		};

		const initializeWorker = async () => {
			try {
				// Strategy 1: Try public folder first (most reliable)
				console.log('🔄 Attempting to load worker from public folder...');
				try {
					const publicWorker = new Worker('/workers/eyeTracking.worker.js');

					// Test if worker is working by setting up a simple message handler
					const workerTest = new Promise<boolean>((resolve) => {
						const testTimeout = setTimeout(() => {
							resolve(false);
						}, 2000);

						const messageHandler = (event: MessageEvent) => {
							if (event.data.type === 'WORKER_READY') {
								clearTimeout(testTimeout);
								publicWorker.removeEventListener('message', messageHandler);
								resolve(true);
							}
						};

						publicWorker.addEventListener('message', messageHandler);

						// Send a test message to check if worker responds
						publicWorker.postMessage({ type: 'PING' });
					});

					const isWorkerWorking = await workerTest;

					if (isWorkerWorking && isMounted) {
						workerRef.current = publicWorker;
						setWorkerSource('public');
						console.log('✅ Web Worker loaded from public folder');
						setupWorkerMessageHandlers();
						return;
					} else {
						publicWorker.terminate();
					}
				} catch (publicError) {
					console.warn(
						'❌ Public folder worker failed, trying module import:',
						publicError
					);
				}

				// Strategy 2: Fallback to module worker
				console.log('🔄 Attempting to load worker as module...');
				try {
					const moduleWorker = new Worker(
						new URL('@/workers/eyeTracking.worker.ts', import.meta.url),
						{ type: 'module' }
					);

					// Test module worker
					const moduleTest = new Promise<boolean>((resolve) => {
						const testTimeout = setTimeout(() => {
							resolve(false);
						}, 2000);

						const messageHandler = (event: MessageEvent) => {
							if (event.data.type === 'WORKER_READY') {
								clearTimeout(testTimeout);
								moduleWorker.removeEventListener('message', messageHandler);
								resolve(true);
							}
						};

						moduleWorker.addEventListener('message', messageHandler);
						moduleWorker.postMessage({ type: 'PING' });
					});

					const isModuleWorking = await moduleTest;

					if (isModuleWorking && isMounted) {
						workerRef.current = moduleWorker;
						setWorkerSource('module');
						console.log('✅ Web Worker loaded as module');
						setupWorkerMessageHandlers();
						return;
					} else {
						moduleWorker.terminate();
					}
				} catch (moduleError) {
					console.error('❌ Module worker also failed:', moduleError);
				}

				// Strategy 3: Last resort - inline worker as blob
				console.log('🔄 Creating inline worker as fallback...');
				try {
					const inlineWorkerScript = `
// Inline fallback worker with updated functions
const EYE_TRACKING_CONSTANTS = {
	BLINK: {
		DETECTION_THRESHOLD: 6.0,
		TARGET_PER_MIN: 18,
		PENALTY_DIVISOR: 12,
		WINDOW_MS: 60000,
	},
	METRICS: {
		UPDATE_INTERVAL: 500,
		PERCLOS_NORMALIZATION: {
			SUBTRACT: 0.1,
			DIVIDE: 0.3,
		},
		TIREDNESS_WEIGHTS: {
			PERCLOS: 0.5,
			DARK: 0.35,
			BLINK: 0.15,
		},
		EYE_AGE_WEIGHTS: {
			PERCLOS: 0.5,
			DARK: 0.3,
			BLINK: 0.2,
		},
		DARK_CIRCLE: {
			SUBTRACT: 0.05,
			DIVIDE: 0.25,
		},
		HISTORY_LIMIT: 49,
	},
	VISUAL: {
		LUMINANCE_WEIGHTS: {
			RED: 0.299,
			GREEN: 0.587,
			BLUE: 0.114,
		},
		CLAMP_ONE: 1,
		UNDER_EYE: {
			WIDTH_MULTIPLIER: 1.1,
			HEIGHT_MULTIPLIER: 0.45,
			Y_OFFSET: 0.12,
		},
		CHEEK: {
			WIDTH_MULTIPLIER: 0.9,
			HEIGHT_MULTIPLIER: 0.9,
			Y_OFFSET: 0.2,
		},
		FOREHEAD: {
			WIDTH_MULTIPLIER: 0.9,
			HEIGHT_MULTIPLIER: 0.6,
			Y_OFFSET: 0.8,
		},
	},
	AGE: {
		MIN_EYE: 0,
		MAX_EYE: 100,
		MIN_FACE: 0,
		MAX_FACE: 180,
		FACE_ATTENTION_IMPACT: 5,
		ABSOLUTE_MAX: 120,
	},
	PERCENTAGE: {
		ATTENTION_THRESHOLD: 0.7,
		PERCLOS_THRESHOLDS: {
			MODERATE: 8,
			HIGH: 20,
			VERY_HIGH: 35,
		},
	},
	RANDOM: {
		EYE_ASPECT: {
			BASE: 0.25,
			BLINK_FACTOR: 0.01,
			RANGE: 0.05,
		},
		PUPIL: {
			MIN: 2.0,
			BASE: 3.5,
			PERCLOS_FACTOR: 0.02,
			RANGE: 0.3,
		},
		SQUINT: {
			LOW: {
				MIN: 5,
				RANGE: 8,
			},
			HIGH: {
				MIN: 25,
				RANGE: 15,
			},
		},
	},
	FALLBACK: {
		BLINK_RATE: 15,
		EYE_AGE: 30,
		FACE_AGE: 30,
	},
	ERROR: {
		CAMERA: 'Failed to access camera',
		TRACKING: 'Failed to start eye tracking',
		INIT: 'Failed to initialize eye tracking model. Please refresh the page.',
	},
};

const clamp01 = (value) => Math.max(0, Math.min(1, value));
const distanceBetweenPoints = (a, b) => Math.hypot(a.x - b.x, a.y - b.y);

function computeEAR(leftEye, rightEye) {
    const leftVertical = distanceBetweenPoints(leftEye.top, leftEye.bottom);
    const leftHorizontal = distanceBetweenPoints(leftEye.inner, leftEye.outer);
    const leftEAR = leftVertical / Math.max(leftHorizontal, 1e-6);

    const rightVertical = distanceBetweenPoints(rightEye.top, rightEye.bottom);
    const rightHorizontal = distanceBetweenPoints(rightEye.inner, rightEye.outer);
    const rightEAR = rightVertical / Math.max(rightHorizontal, 1e-6);

    return (leftEAR + rightEAR) / 2;
}

function computePERCLOS(earHistory, threshold) {
    if (earHistory.length === 0) return 0;
    const closedCount = earHistory.filter((ear) => ear < threshold).length;
    return closedCount / earHistory.length;
}

function computeOverallHealth(blinkRate, percentageClosed, attentionFraction) {
    const blinkScore = Math.max(0, Math.min(100, (blinkRate / 20) * 100));
    const strainLevelIdx = (blinkRate < 12 ? 2 : blinkRate < 18 ? 1 : 0);
    const strainScore = Math.max(0, 100 - strainLevelIdx * 33);
    const attentionScore = attentionFraction * 100;
    const tiredScore = Math.max(0, 100 - percentageClosed * 2);
    const overallHealthScore = Math.round(
        (blinkScore + strainScore + attentionScore + tiredScore) / 4
    );

    return {
        overallHealthScore,
        blinkScore,
        strainScore,
        attentionScore,
        tiredScore,
    };
}

self.onmessage = function(event) {
    const { type, payload, id } = event.data;
    
    try {
        let result;
        switch (type) {
            case 'COMPUTE_EAR':
                result = computeEAR(payload.leftEye, payload.rightEye);
                break;
            case 'COMPUTE_PERCLOS':
                result = computePERCLOS(payload.earHistory, payload.threshold);
                break;
            case 'COMPUTE_OVERALL_HEALTH':
                result = computeOverallHealth(
                    payload.blinkRate,
                    payload.percentageClosed,
                    payload.attentionFraction
                );
                break;
            case 'COMPUTE_METRICS':
                const { earHistory, blinkTimestamps, currentTime } = payload;
                const earMean = earHistory.length ? earHistory.reduce((a, b) => a + b, 0) / earHistory.length : 0;
                const recentBlinks = blinkTimestamps.filter(t => currentTime - t < 60000);
                const blinksPerMinute = recentBlinks.length;
                const percentageClosed = payload.totalFrames > 0 ? (payload.closedFrames / payload.totalFrames) * 100 : 0;
                const attentionFraction = payload.totalFrames > 0 ? 1 - payload.closedFrames / payload.totalFrames : 0;
                const healthMetrics = computeOverallHealth(blinksPerMinute, percentageClosed, attentionFraction);
                result = {
                    earMean,
                    blinksPerMinute,
                    fatigueScore: clamp01(earMean * 2),
                    drynessScore: 0.5,
                    rednessScore: 0.5,
                    proximityScore: 0.5,
                    ...healthMetrics,
                };
                break;
            case 'FILTER_LANDMARKS':
                const { landmarks, canvasWidth, canvasHeight } = payload;
                const toPixelCoordinates = (point) => ({
                    x: point.x * canvasWidth,
                    y: point.y * canvasHeight,
                });
                result = {
                    leftEye: {
                        inner: toPixelCoordinates(landmarks[133]),
                        outer: toPixelCoordinates(landmarks[33]),
                        top: toPixelCoordinates(landmarks[159]),
                        bottom: toPixelCoordinates(landmarks[145]),
                    },
                    rightEye: {
                        inner: toPixelCoordinates(landmarks[362]),
                        outer: toPixelCoordinates(landmarks[263]),
                        top: toPixelCoordinates(landmarks[386]),
                        bottom: toPixelCoordinates(landmarks[374]),
                    },
                    faceBounds: { width: 200, height: 240 }
                };
                break;
            default:
                result = { error: 'Unsupported operation in fallback worker' };
        }
        
        self.postMessage({ type: type + '_RESULT', payload: result, id });
    } catch (error) {
        self.postMessage({ 
            type: 'ERROR', 
            payload: { message: error.message, originalType: type },
            id 
        });
    }
};

// Notify ready
self.postMessage({ type: 'WORKER_READY' });
console.log('✅ Inline fallback worker ready');
`;

					const blob = new Blob([inlineWorkerScript], { type: 'application/javascript' });
					const blobUrl = URL.createObjectURL(blob);
					const inlineWorker = new Worker(blobUrl);

					const inlineTest = new Promise<boolean>((resolve) => {
						const testTimeout = setTimeout(() => {
							resolve(false);
						}, 1000);

						const messageHandler = (event: MessageEvent) => {
							if (event.data.type === 'WORKER_READY') {
								clearTimeout(testTimeout);
								inlineWorker.removeEventListener('message', messageHandler);
								resolve(true);
							}
						};

						inlineWorker.addEventListener('message', messageHandler);
					});

					const isInlineWorking = await inlineTest;

					if (isInlineWorking && isMounted) {
						workerRef.current = inlineWorker;
						setWorkerSource('public'); // Treat inline as public for simplicity
						console.log('✅ Inline fallback worker loaded');
						setupWorkerMessageHandlers();
						// Clean up blob URL when worker is terminated
						inlineWorker.addEventListener('error', () => URL.revokeObjectURL(blobUrl));
						return;
					} else {
						inlineWorker.terminate();
						URL.revokeObjectURL(blobUrl);
					}
				} catch (inlineError) {
					console.error('❌ All worker initialization strategies failed:', inlineError);
				}

				// If we get here, all strategies failed
				if (isMounted) {
					console.error(
						'🚨 Unable to initialize Web Worker. Eye tracking computations will run on main thread.'
					);
					setWorkerSource('none');
					setIsReady(false);
				}
			} catch (error) {
				console.error('🚨 Worker initialization completely failed:', error);
				if (isMounted) {
					setWorkerSource('none');
					setIsReady(false);
				}
			}
		};

		const setupWorkerMessageHandlers = () => {
			if (!workerRef.current) return;

			workerRef.current.onmessage = (event: MessageEvent<WorkerMessage>) => {
				const { type, payload, id } = event.data;

				if (type === 'ERROR') {
					console.error('Worker error:', payload);
					if (id) {
						const task = taskQueueRef.current.get(id);
						if (task) {
							task.reject(new Error(payload?.message || 'Worker error'));
							taskQueueRef.current.delete(id);
						}
					}
					return;
				}

				if (type === 'WORKER_READY') {
					console.log(`✅ Web Worker ready (source: ${workerSource})`);
					if (isMounted) {
						setIsReady(true);
					}
					return;
				}

				if (id) {
					const task = taskQueueRef.current.get(id);
					if (task) {
						task.resolve(payload);
						taskQueueRef.current.delete(id);
					}
				}
			};

			workerRef.current.onerror = (error) => {
				console.error('Worker runtime error:', error);
				if (isMounted) {
					setIsReady(false);
				}
			};

			workerRef.current.onmessageerror = (error) => {
				console.error('Worker message error:', error);
			};
		};

		initializeWorker();

		// Cleanup on unmount
		return () => {
			isMounted = false;
			workerCleanup();
		};
	}, []);

	// Generic function to send messages to worker
	const sendMessage = useCallback(
		<T>(type: WorkerMessageType, payload: any, timeout: number = 10000): Promise<T> => {
			return new Promise((resolve, reject) => {
				if (!workerRef.current) {
					reject(new Error('Worker not initialized'));
					return;
				}

				if (!isReady && type !== 'INIT') {
					reject(new Error('Worker not ready'));
					return;
				}

				const id = `${type}_${messageIdCounterRef.current++}_${Date.now()}`;
				const task: WorkerTask = {
					id,
					type,
					resolve,
					reject,
					timestamp: Date.now(),
				};

				taskQueueRef.current.set(id, task);

				// Set timeout for task
				const timeoutId = setTimeout(() => {
					if (taskQueueRef.current.has(id)) {
						taskQueueRef.current.delete(id);
						reject(new Error(`Worker task timeout: ${type}`));
					}
				}, timeout);

				// Clean up timeout when task completes
				const originalResolve = task.resolve;
				const originalReject = task.reject;

				task.resolve = (value) => {
					clearTimeout(timeoutId);
					originalResolve(value);
				};

				task.reject = (reason) => {
					clearTimeout(timeoutId);
					originalReject(reason);
				};

				try {
					workerRef.current.postMessage({ type, payload, id });
				} catch (error) {
					clearTimeout(timeoutId);
					taskQueueRef.current.delete(id);
					reject(error);
				}
			});
		},
		[isReady]
	);

	// Compute dryness metrics
	const computeDryness = useCallback(
		(blinkTimes: number[], incompleteBlinkFlags: boolean[], blinkRate: number) => {
			const payload: ComputeDrynessPayload = {
				blinkTimes,
				incompleteBlinkFlags,
				blinkRate,
			};
			return sendMessage<DrynessResult>('COMPUTE_DRYNESS', payload);
		},
		[sendMessage]
	);

	// Compute redness metrics
	const computeRedness = useCallback(
		(rednessValues: number[], blinkRate: number, exposureLevel: number = 0.5) => {
			const payload: ComputeRednessPayload = {
				rednessValues,
				blinkRate,
				exposureLevel,
			};
			return sendMessage<RednessResult>('COMPUTE_REDNESS', payload);
		},
		[sendMessage]
	);

	// Compute screen distance
	const computeDistance = useCallback(
		(faceSizes: number[], baselineWidthPx: number, targetDistanceCm: number = 50) => {
			const payload: ComputeDistancePayload = {
				faceSizes,
				baselineWidthPx,
				targetDistanceCm,
			};
			return sendMessage<ProximityResult>('COMPUTE_DISTANCE', payload);
		},
		[sendMessage]
	);

	// Compute luminance for multiple regions
	const computeLuminance = useCallback(
		(
			imageData: ImageData,
			regions: Array<{ x: number; y: number; width: number; height: number; name: string }>
		) => {
			const payload: ComputeLuminancePayload = {
				imageData,
				regions,
			};
			return sendMessage<number[]>('COMPUTE_LUMINANCE', payload);
		},
		[sendMessage]
	);

	// Compute comprehensive metrics
	const computeMetrics = useCallback(
		(payload: ComputeMetricsPayload) => {
			return sendMessage('COMPUTE_METRICS', payload);
		},
		[sendMessage]
	);

	// Process image data for redness and exposure
	const processImageData = useCallback(
		(
			imageData: ImageData,
			leftEyeRect: { x: number; y: number; w: number; h: number },
			rightEyeRect: { x: number; y: number; w: number; h: number }
		) => {
			const payload: ProcessImageDataPayload = {
				imageData,
				leftEyeRect,
				rightEyeRect,
			};
			return sendMessage('PROCESS_IMAGE_DATA', payload);
		},
		[sendMessage]
	);

	// Compute Eye Aspect Ratio
	const computeEAR = useCallback(
		(leftEye: ComputeEARPayload['leftEye'], rightEye: ComputeEARPayload['rightEye']) => {
			const payload: ComputeEARPayload = {
				leftEye,
				rightEye,
			};
			return sendMessage<number>('COMPUTE_EAR', payload);
		},
		[sendMessage]
	);

	// Compute PERCLOS
	const computePERCLOS = useCallback(
		(earHistory: number[], threshold: number) => {
			return sendMessage<number>('COMPUTE_PERCLOS', {
				earHistory,
				threshold,
			});
		},
		[sendMessage]
	);

	// Compute overall health score
	const computeOverallHealth = useCallback(
		(blinkRate: number, percentageClosed: number, attentionFraction: number) => {
			const payload: ComputeOverallHealthPayload = {
				blinkRate,
				percentageClosed,
				attentionFraction,
			};
			return sendMessage<OverallHealthResult>('COMPUTE_OVERALL_HEALTH', payload);
		},
		[sendMessage]
	);

	// Batch process frames
	const processBatchFrames = useCallback(
		(payload: BatchProcessPayload) => {
			return sendMessage<BatchProcessResult>('PROCESS_BATCH_FRAMES', payload, 30000);
		},
		[sendMessage]
	);

	// Filter landmarks
	const filterLandmarks = useCallback(
		(payload: FilterLandmarksPayload) => {
			return sendMessage<FilteredLandmarks>('FILTER_LANDMARKS', payload);
		},
		[sendMessage]
	);

	// Terminate worker manually
	const terminateWorker = useCallback(() => {
		if (workerRef.current) {
			workerRef.current.terminate();
			workerRef.current = null;
			setIsReady(false);
			setWorkerSource('none');
			taskQueueRef.current.clear();
		}
	}, []);

	// Get current queue size
	const getQueueSize = useCallback(() => {
		return taskQueueRef.current.size;
	}, []);

	// Clear all pending tasks
	const clearQueue = useCallback(() => {
		taskQueueRef.current.forEach((task) => {
			task.reject(new Error('Task queue cleared'));
		});
		taskQueueRef.current.clear();
	}, []);

	return {
		computeDryness,
		computeRedness,
		computeDistance,
		computeLuminance,
		computeMetrics,
		processImageData,
		computeEAR,
		computePERCLOS,
		computeOverallHealth,
		processBatchFrames,
		filterLandmarks,
		isReady,
		terminateWorker,
		getQueueSize,
		clearQueue,
		workerSource,
	};
}
