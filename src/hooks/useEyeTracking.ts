import { COLOR_SCHEMES, EYE_TRACKING_CONSTANTS, strainLevels } from '@/constants/eye-tracking';
import useAppStore from '@/store';
import { DrawingColors, EyeKeypoints, EyeTrackingOptions } from '@/types/eyeTrackingHook';
import { getDeviceType, getEyeTrackingDefaultsForDevice } from '@/utils/device';
import { DrawingUtils, FaceLandmarker } from '@/utils/mediapipe';
import { calculateEyeAgeIndex } from '@/utils/metrics-calculations';
import { createNeutralMetrics } from '@/utils/neutralMetrics';

import { useShallow } from 'zustand/react/shallow';

import {
	blinkPenaltyAbs,
	calculateBlinkPenalty,
	calculateEyeAge,
	calculateFaceAge,
	calculateLandmarkDistance,
	calculateMeanLuminance,
	clamp01,
	getUnderEyeAndReferenceRectangles,
	normalizePerclos,
	perclosNorm,
} from '@/utils/tracking-utils/calculateFunctions';
import {
	computeDryness,
	computeRedness,
	computeScreenDistance,
} from '@/utils/tracking-utils/computationFunctions';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useCamera } from './use-camera';
import { useCameraRecovery } from './use-camera-recovery';
import { useMediaPipe } from './use-mediaPipe';
import useBackgroundTracking from './useBackgroundTracking';
export const useEyeTracking = (options: EyeTrackingOptions = {}) => {
	// ========== STORE STATE ==========
	const storeState = useAppStore();

	// const isCameraActive = storeState?.camera?.isCameraActive ?? false;
	const isTrackingActive = storeState?.camera?.isTrackingActive ?? false;
	const loading = storeState?.camera?.loading ?? false;
	const currentMetrics = storeState?.eyeTracking?.currentMetrics ?? null;
	const metricsHistory = storeState?.eyeTracking?.metricsHistory ?? [];

	const getLastBlinkRate = useMemo(
		() => storeState?.eyeTracking?.getLastBlinkRate?.() ?? 0,
		[storeState?.eyeTracking]
	);
	const getLastMetrics = useMemo(
		() => storeState?.eyeTracking?.getLastMetrics?.() ?? (() => null),
		[storeState?.eyeTracking]
	);
	// ========== STORE ACTIONS ==========
	const setCameraState = useMemo(
		() =>
			storeState?.camera?.setCameraState ??
			(() => console.warn('setCameraState is not available')),
		[storeState?.camera?.setCameraState]
	);

	const setTrackingState = useMemo(
		() =>
			storeState?.camera?.setTrackingState ??
			(() => console.warn('setTrackingState is not available')),
		[storeState?.camera?.setTrackingState]
	);

	const setLoading = useMemo(
		() => storeState?.camera?.setLoading ?? (() => console.warn('setLoading is not available')),
		[storeState?.camera?.setLoading]
	);

	const startSession = useMemo(
		() =>
			storeState?.eyeTracking?.startSession ??
			(() => console.warn('startSession is not available')),
		[storeState?.eyeTracking?.startSession]
	);

	const endSession = useMemo(
		() =>
			storeState?.eyeTracking?.endSession ??
			(() => console.warn('endSession is not available')),
		[storeState?.eyeTracking?.endSession]
	);

	const updateStoreMetrics = useMemo(
		() =>
			storeState?.eyeTracking?.updateMetrics ??
			(() => console.warn('updateStoreMetrics is not available')),
		[storeState?.eyeTracking?.updateMetrics]
	);
	const chronologicalAge = useAppStore(
		useShallow((state) => state.auth.user?.age ?? EYE_TRACKING_CONSTANTS.FALLBACK.EYE_AGE)
	);
	console.log('chronologicalAge', chronologicalAge);

	// Add this ref after line 84
	const chronologicalAgeRef = useRef(chronologicalAge);

	// Keep it updated
	useEffect(() => {
		chronologicalAgeRef.current = chronologicalAge;
	}, [chronologicalAge]);

	console.log('chronologicalAgeRef.current', chronologicalAgeRef.current);
	// ========== LOCAL STATE ==========
	// const [mediaStream, setMediaStream] = useState<MediaStream | null>(null);
	const [isScanning, setIsScanning] = useState(true);
	const [isInitialized, setIsInitialized] = useState(false);

	// ========== REFS - DOM ==========
	// const videoRef = useRef<HTMLVideoElement>(null);
	const canvasRef = useRef<HTMLCanvasElement>(null);

	// ========== REFS - MEDIAPIPE ==========
	// const faceLandmarkerRef = useRef<FaceLandmarker | null>(null);
	const drawingUtilsRef = useRef<DrawingUtils | null>(null);

	// ========== REFS - ANIMATION & INTERVALS ==========
	const animationFrameIdRef = useRef<number | null>(null);
	const metricsIntervalIdRef = useRef<number | null>(null);

	// ========== REFS - TRACKING DATA ==========
	const totalFramesRef = useRef(0);
	const closedFramesRef = useRef(0);
	const facePresentFramesRef = useRef(0);
	const previousEyesClosedRef = useRef(false);
	const closedSamplesRef = useRef<Array<{ timestamp: number; closed: boolean }>>([]);
	const darkCircleScoreRef = useRef(0);
	const streamDataRef = useRef<any[]>([]);
	const isCancelledRef = useRef(false);

	// ========== REFS - BLINK DETECTION ==========
	const blinkTimestampsRef = useRef<number[]>([]);
	const incompleteBlinkFlagsRef = useRef<boolean[]>([]);
	const inBlinkRef = useRef<boolean>(false);
	const blinkStartTsRef = useRef<number>(0);
	const blinkMaxPerCloseRef = useRef<number>(0);

	// ========== REFS - REDNESS & DISTANCE ==========
	const rednessValuesRef = useRef<number[]>([]);
	const faceSizesRef = useRef<number[]>([]);
	const exposureLevelRef = useRef<number>(0.5);
	const roomExposureRef = useRef<number>(0.5); // Room lighting exposure

	// Device-tuned defaults
	const deviceType = useMemo(() => getDeviceType(), []);
	const deviceDefaults = useMemo(() => getEyeTrackingDefaultsForDevice(deviceType), [deviceType]);
	const baselineWidthPxRef = useRef<number>(deviceDefaults.baselineWidthPx);

	const latestOpennessRef = useRef<number>(0); // vertical/horizontal eye openness
	const squintSmoothedRef = useRef<number>(0);
	const squintMaxOpenRef = useRef<number>(deviceDefaults.squintMaxOpen);
	const squintMinOpenRef = useRef<number>(deviceDefaults.squintMinOpen);

	// ========== REFS - FACE DETECTION ==========
	const noFaceFramesRef = useRef<number>(0);
	const isFaceDetectedRef = useRef<boolean>(true);

	// ========== REFS - METRICS BUFFER ==========
	const lastDrynessRef = useRef<{
		meanIBI: number;
		incompleteBlinkFrac: number;
		drynessScore: number;
	} | null>(null);

	// ========== REFS - VALIDATION ==========
	const lastValidBlinkRateRef = useRef<number>(
		getLastBlinkRate || EYE_TRACKING_CONSTANTS.FALLBACK.BLINK_RATE
	);
	const lastValidEyeAgeRef = useRef<number>(
		getLastMetrics?.eyeAge || EYE_TRACKING_CONSTANTS.FALLBACK.EYE_AGE
	);
	const lastValidFaceAgeRef = useRef<number>(
		getLastMetrics?.faceAge || EYE_TRACKING_CONSTANTS.FALLBACK.FACE_AGE
	);
	const blinkIntervalIdRef = useRef<number | null>(null);
	const lastEyeAgeUpdateRef = useRef<number>(Date.now());

	// ========== REFS - SESSION =========
	const scanningTimerRef = useRef<NodeJS.Timeout | null>(null);

	// ✅ ========== CAMERA RECOVERY REFS ==========
	// const mediaStreamRef = useRef<MediaStream | null>(null);
	const recoveryTimeoutRef = useRef<NodeJS.Timeout | null>(null);
	const healthCheckIntervalRef = useRef<NodeJS.Timeout | null>(null);

	// ✅ ===============OPTIONS===========================
	const {
		colorScheme = 'minimal',
		colors = {},
		drawFaceMesh = true,
		drawEyes = false,
		drawIris = false,
		metricsUpdateInterval = EYE_TRACKING_CONSTANTS.METRICS.UPDATE_INTERVAL,
		blinkDetectionThreshold = EYE_TRACKING_CONSTANTS.BLINK.DETECTION_THRESHOLD,
	} = options;
	const drawingColors: DrawingColors = useMemo(
		() => ({ ...COLOR_SCHEMES[colorScheme], ...colors }),
		[colorScheme, colors]
	);

	// ✅ ===============HOOKS===========================
	const { keepMediaAlive, stopMediaKeepAlive } = useBackgroundTracking();
	// ========== EXTERNAL HOOKS ==========
	const { mediaStream, startCamera, stopCamera, isCameraActive, videoRef, mediaStreamRef } =
		useCamera();

	const { monitorCameraHealth } = useCameraRecovery(isTrackingActive);

	const { initializeFaceLandmarker, faceLandmarkerRef } = useMediaPipe();
	const recoverCameraAndTracking = useCallback(async (): Promise<void> => {
		// Clean up existing tracking
		if (animationFrameIdRef.current) {
			cancelAnimationFrame(animationFrameIdRef.current);
			animationFrameIdRef.current = null;
		}

		if (metricsIntervalIdRef.current) {
			clearInterval(metricsIntervalIdRef.current);
			metricsIntervalIdRef.current = null;
		}

		// Wait before restarting
		await new Promise((resolve) => setTimeout(resolve, 1000));

		// Restart camera
		const stream = await startCamera();
		if (stream) {
			mediaStreamRef.current = stream;
			console.log('[Camera] ✅ Camera restarted successfully');

			// Restart tracking
			await startTracking();
		} else {
			throw new Error('Failed to restart camera - no stream received');
		}
	}, [startCamera, mediaStreamRef]);

	// ========== CALL BACK FUNCTIONS ==========
	const blinkMetrics = useCallback(() => {
		const timestamp = new Date().toLocaleTimeString();
		const now = Date.now();
		const oneMinuteAgo = now - EYE_TRACKING_CONSTANTS.BLINK.WINDOW_MS;
		blinkTimestampsRef.current = blinkTimestampsRef.current.filter((t) => t > oneMinuteAgo);
		const raw = blinkTimestampsRef.current.length;
		const blinkRate = raw === 0 ? lastValidBlinkRateRef.current : raw;
		if (raw !== 0) lastValidBlinkRateRef.current = blinkRate;

		closedSamplesRef.current = closedSamplesRef.current.filter(
			(s) => s.timestamp > now - EYE_TRACKING_CONSTANTS.PERCLOS.WINDOW_MS
		);
		let perclos = 0;
		if (closedSamplesRef.current.length > 1) {
			let closedMs = 0;
			const arr = closedSamplesRef.current;
			for (let i = 0; i < arr.length - 1; i++) {
				const dt = arr[i + 1].timestamp - arr[i].timestamp;
				if (arr[i].closed) closedMs += dt;
			}
			const totalMs = arr[arr.length - 1].timestamp - arr[0].timestamp;
			perclos = totalMs > 0 ? closedMs / totalMs : 0;
		}

		const perClose =
			totalFramesRef.current > 0
				? (closedFramesRef.current / totalFramesRef.current) * 100
				: 0;
		const attentionFrac =
			totalFramesRef.current > 0 ? facePresentFramesRef.current / totalFramesRef.current : 0;

		let strainText: string;
		if (blinkRate < 12) {
			strainText = strainLevels.high;
		} else if (blinkRate < 18) {
			strainText = strainLevels.moderate;
		} else {
			strainText = strainLevels.low;
		}

		let tiredText: string;
		if (perClose > EYE_TRACKING_CONSTANTS.PERCENTAGE.PERCLOS_THRESHOLDS.VERY_HIGH) {
			tiredText = strainLevels.veryHigh;
		} else if (perClose > EYE_TRACKING_CONSTANTS.PERCENTAGE.PERCLOS_THRESHOLDS.HIGH) {
			tiredText = strainLevels.high;
		} else if (perClose > EYE_TRACKING_CONSTANTS.PERCENTAGE.PERCLOS_THRESHOLDS.MODERATE) {
			tiredText = strainLevels.moderate;
		} else {
			tiredText = strainLevels.low;
		}

		const bp = blinkPenaltyAbs(blinkRate);
		const dark = darkCircleScoreRef.current;
		const tiredness = clamp01(
			EYE_TRACKING_CONSTANTS.METRICS.TIREDNESS_WEIGHTS.PERCLOS * perclosNorm(perclos) +
				EYE_TRACKING_CONSTANTS.METRICS.TIREDNESS_WEIGHTS.DARK * dark +
				EYE_TRACKING_CONSTANTS.METRICS.TIREDNESS_WEIGHTS.BLINK * bp
		);
		const eyeAgeIdx = clamp01(
			EYE_TRACKING_CONSTANTS.METRICS.EYE_AGE_WEIGHTS.PERCLOS * perclosNorm(perclos) +
				EYE_TRACKING_CONSTANTS.METRICS.EYE_AGE_WEIGHTS.DARK * dark +
				EYE_TRACKING_CONSTANTS.METRICS.EYE_AGE_WEIGHTS.BLINK * bp
		);
		const eyeAge = calculateEyeAgeIndex(blinkRate, perclos, dark);
		const squint =
			perClose > 15
				? EYE_TRACKING_CONSTANTS.RANDOM.SQUINT.HIGH.MIN +
					Math.random() * EYE_TRACKING_CONSTANTS.RANDOM.SQUINT.HIGH.RANGE
				: EYE_TRACKING_CONSTANTS.RANDOM.SQUINT.LOW.MIN +
					Math.random() * EYE_TRACKING_CONSTANTS.RANDOM.SQUINT.LOW.RANGE;
		const faceAge = calculateFaceAge(
			eyeAge,
			attentionFrac,
			squint,
			lastValidFaceAgeRef.current
		);

		const metrics = {
			blinkRate,
		};

		streamDataRef.current = [
			...streamDataRef.current.slice(-EYE_TRACKING_CONSTANTS.METRICS.HISTORY_LIMIT),
			metrics,
		];
		if (isFaceDetectedRef.current) {
			updateStoreMetrics(metrics);
		}

		totalFramesRef.current = 0;
		closedFramesRef.current = 0;
		facePresentFramesRef.current = 0;
	}, [updateStoreMetrics]);
	const processFrame = useCallback(
		(
			video: HTMLVideoElement,
			canvas: HTMLCanvasElement,
			faceLandmarker: any,
			context: CanvasRenderingContext2D,
			drawingUtils: any
		) => {
			if (canvas.width !== video.videoWidth || canvas.height !== video.videoHeight) {
				canvas.width = video.videoWidth;
				canvas.height = video.videoHeight;
				drawingUtilsRef.current = new DrawingUtils(context);
			}

			const currentTime = performance.now();
			const results = faceLandmarker.detectForVideo(video, currentTime);

			context.save();
			context.clearRect(0, 0, canvas.width, canvas.height);
			context.drawImage(video, 0, 0, canvas.width, canvas.height);
			totalFramesRef.current += 1;

			if (results.faceLandmarks && results.faceLandmarks.length > 0) {
				const landmarks = results.faceLandmarks[0];
				facePresentFramesRef.current += 1;

				noFaceFramesRef.current = 0;
				isFaceDetectedRef.current = true;

				if (drawFaceMesh) {
					drawingUtils.drawConnectors(
						landmarks,
						FaceLandmarker.FACE_LANDMARKS_TESSELATION,
						{
							color: drawingColors.faceMesh,
							lineWidth: 0.5,
						}
					);
				}

				if (drawEyes) {
					drawingUtils.drawConnectors(
						landmarks,
						FaceLandmarker.FACE_LANDMARKS_RIGHT_EYE,
						{
							color: drawingColors.rightEye,
							lineWidth: 0.5,
						}
					);
					drawingUtils.drawConnectors(landmarks, FaceLandmarker.FACE_LANDMARKS_LEFT_EYE, {
						color: drawingColors.leftEye,
						lineWidth: 0.5,
					});
				}

				if (drawIris) {
					drawingUtils.drawConnectors(
						landmarks,
						FaceLandmarker.FACE_LANDMARKS_RIGHT_IRIS,
						{
							color: drawingColors.rightIris,
							lineWidth: 0.5,
						}
					);
					drawingUtils.drawConnectors(
						landmarks,
						FaceLandmarker.FACE_LANDMARKS_LEFT_IRIS,
						{
							color: drawingColors.leftIris,
							lineWidth: 0.5,
						}
					);
				}

				const leftHorizontal = calculateLandmarkDistance(landmarks[33], landmarks[133]);
				const leftVertical = calculateLandmarkDistance(landmarks[159], landmarks[145]);
				const rightHorizontal = calculateLandmarkDistance(landmarks[362], landmarks[263]);
				const rightVertical = calculateLandmarkDistance(landmarks[386], landmarks[374]);

				const leftRatio = leftVertical > 0 ? leftHorizontal / leftVertical : 0;
				const rightRatio = rightVertical > 0 ? rightHorizontal / rightVertical : 0;
				const averageRatio = (leftRatio + rightRatio) / 2;

				// Track normalized eye openness (vertical / horizontal)
				const leftOpenness = leftHorizontal > 0 ? leftVertical / leftHorizontal : 0;
				const rightOpenness = rightHorizontal > 0 ? rightVertical / rightHorizontal : 0;
				const avgOpenness =
					leftOpenness > 0 && rightOpenness > 0 ? (leftOpenness + rightOpenness) / 2 : 0;
				if (avgOpenness > 0) latestOpennessRef.current = avgOpenness;

				const eyesClosed = averageRatio > blinkDetectionThreshold;

				closedSamplesRef.current.push({
					timestamp: Date.now(),
					closed: eyesClosed,
				});

				if (
					closedSamplesRef.current.length > EYE_TRACKING_CONSTANTS.PERCLOS.SAMPLES_LIMIT
				) {
					const keepAfterTimestamp =
						Date.now() -
						EYE_TRACKING_CONSTANTS.PERCLOS.WINDOW_MS *
							EYE_TRACKING_CONSTANTS.PERCLOS.WINDOW_MULTIPLIER;
					closedSamplesRef.current = closedSamplesRef.current.filter(
						(sample) => sample.timestamp > keepAfterTimestamp
					);
				}

				try {
					const toPixelCoordinates = (point: any) => ({
						x: point.x * canvas.width,
						y: point.y * canvas.height,
					});

					const leftEye = {
						inner: toPixelCoordinates(landmarks[133]),
						outer: toPixelCoordinates(landmarks[33]),
						top: toPixelCoordinates(landmarks[159]),
						bottom: toPixelCoordinates(landmarks[145]),
					};

					const rightEye = {
						inner: toPixelCoordinates(landmarks[362]),
						outer: toPixelCoordinates(landmarks[263]),
						top: toPixelCoordinates(landmarks[386]),
						bottom: toPixelCoordinates(landmarks[374]),
					};

					const leftRectangles = getUnderEyeAndReferenceRectangles(
						leftEye as EyeKeypoints
					);
					const rightRectangles = getUnderEyeAndReferenceRectangles(
						rightEye as EyeKeypoints
					);

					const leftUnderEyeLuminance = calculateMeanLuminance(
						context,
						leftRectangles.underEye.x,
						leftRectangles.underEye.y,
						leftRectangles.underEye.width,
						leftRectangles.underEye.height
					);

					const rightUnderEyeLuminance = calculateMeanLuminance(
						context,
						rightRectangles.underEye.x,
						rightRectangles.underEye.y,
						rightRectangles.underEye.width,
						rightRectangles.underEye.height
					);

					const leftCheekLuminance = calculateMeanLuminance(
						context,
						leftRectangles.cheek.x,
						leftRectangles.cheek.y,
						leftRectangles.cheek.width,
						leftRectangles.cheek.height
					);

					const rightCheekLuminance = calculateMeanLuminance(
						context,
						rightRectangles.cheek.x,
						rightRectangles.cheek.y,
						rightRectangles.cheek.width,
						rightRectangles.cheek.height
					);

					const averageUnderEyeLuminance =
						(leftUnderEyeLuminance + rightUnderEyeLuminance) / 2;
					const averageCheekLuminance = (leftCheekLuminance + rightCheekLuminance) / 2;
					const relativeDifference =
						(averageCheekLuminance - averageUnderEyeLuminance) /
						Math.max(averageCheekLuminance, 1);

					darkCircleScoreRef.current = clamp01(
						(relativeDifference - EYE_TRACKING_CONSTANTS.METRICS.DARK_CIRCLE.SUBTRACT) /
							EYE_TRACKING_CONSTANTS.METRICS.DARK_CIRCLE.DIVIDE
					);
					// Calculate room and under-eye exposure using single loop
					const fullFrameImg = context.getImageData(0, 0, canvas.width, canvas.height);
					const leftRect = leftRectangles.underEye;
					const rightRect = rightRectangles.underEye;

					// Single loop: calculate room + under-eye exposure
					let roomRs = 0,
						roomGs = 0,
						roomBs = 0;
					let leftRs = 0,
						leftGs = 0,
						leftBs = 0,
						leftCount = 0;
					let rightRs = 0,
						rightGs = 0,
						rightBs = 0,
						rightCount = 0;

					for (let i = 0; i < fullFrameImg.data.length; i += 4) {
						const pixelIndex = i / 4;
						const x = pixelIndex % canvas.width;
						const y = Math.floor(pixelIndex / canvas.width);

						const r = fullFrameImg.data[i];
						const g = fullFrameImg.data[i + 1];
						const b = fullFrameImg.data[i + 2];

						// Room exposure (all pixels)
						roomRs += r;
						roomGs += g;
						roomBs += b;

						// Left under-eye (check if pixel is in region)
						if (
							x >= leftRect.x &&
							x < leftRect.x + leftRect.width &&
							y >= leftRect.y &&
							y < leftRect.y + leftRect.height
						) {
							leftRs += r;
							leftGs += g;
							leftBs += b;
							leftCount++;
						}

						// Right under-eye (check if pixel is in region)
						if (
							x >= rightRect.x &&
							x < rightRect.x + rightRect.width &&
							y >= rightRect.y &&
							y < rightRect.y + rightRect.height
						) {
							rightRs += r;
							rightGs += g;
							rightBs += b;
							rightCount++;
						}
					}

					// Calculate exposures
					const roomN = fullFrameImg.data.length / 4;
					const roomExposure =
						(0.2126 * (roomRs / roomN) +
							0.7152 * (roomGs / roomN) +
							0.0722 * (roomBs / roomN)) /
						255;
					const minLux = 10;
					const maxLux = 2000;
					const roomLux =
						minLux * Math.pow(maxLux / minLux, Math.min(1, Math.max(0, roomExposure)));
					roomExposureRef.current =
						0.8 * roomExposureRef.current +
						0.2 * Math.min(maxLux, Math.max(minLux, roomLux));

					const leftMeanR = leftCount ? leftRs / leftCount : 0;
					const leftMeanG = leftCount ? leftGs / leftCount : 0;
					const leftMeanB = leftCount ? leftBs / leftCount : 0;
					const leftExposure =
						(0.2126 * leftMeanR + 0.7152 * leftMeanG + 0.0722 * leftMeanB) / 255;

					const rightMeanR = rightCount ? rightRs / rightCount : 0;
					const rightMeanG = rightCount ? rightGs / rightCount : 0;
					const rightMeanB = rightCount ? rightBs / rightCount : 0;
					const rightExposure =
						(0.2126 * rightMeanR + 0.7152 * rightMeanG + 0.0722 * rightMeanB) / 255;

					// Average both eyes for under-eye exposure (use for redness normalization)
					const underEyeExposure = (leftExposure + rightExposure) / 2;
					exposureLevelRef.current =
						0.8 * exposureLevelRef.current +
						0.2 * Math.min(1, Math.max(0, underEyeExposure));

					// Calculate redness from both eyes
					const leftRedness = Math.max(
						0,
						(leftMeanR - (leftMeanG + leftMeanB) / 2) / 255
					);
					const rightRedness = Math.max(
						0,
						(rightMeanR - (rightMeanG + rightMeanB) / 2) / 255
					);
					const frameRedness = (leftRedness + rightRedness) / 2;
					rednessValuesRef.current.push(frameRedness);
					if (rednessValuesRef.current.length > 600) rednessValuesRef.current.shift();
				} catch (error) {
					console.debug('ROI calculation error:', error);
				}

				if (eyesClosed && !previousEyesClosedRef.current) {
					blinkTimestampsRef.current.push(Date.now());
				}

				if (eyesClosed) closedFramesRef.current += 1;
				previousEyesClosedRef.current = eyesClosed;

				const nowMs = performance.now();
				const FULL_CLOSE_RATIO = blinkDetectionThreshold * 1.4;

				if (!inBlinkRef.current && eyesClosed) {
					inBlinkRef.current = true;
					blinkStartTsRef.current = nowMs;
					blinkMaxPerCloseRef.current = averageRatio;
				} else if (inBlinkRef.current && eyesClosed) {
					if (averageRatio > blinkMaxPerCloseRef.current)
						blinkMaxPerCloseRef.current = averageRatio;
				} else if (inBlinkRef.current && !eyesClosed) {
					inBlinkRef.current = false;
					const dur = nowMs - blinkStartTsRef.current;
					if (dur >= 50 && dur <= 600) {
						blinkTimestampsRef.current.push(nowMs);
						const incomplete = blinkMaxPerCloseRef.current < FULL_CLOSE_RATIO;
						incompleteBlinkFlagsRef.current.push(incomplete);
						const cutoff = nowMs - 120_000;
						while (
							blinkTimestampsRef.current.length &&
							blinkTimestampsRef.current[0] < cutoff
						) {
							blinkTimestampsRef.current.shift();
							incompleteBlinkFlagsRef.current.shift();
						}
					}
				}
				const L_OUT = 33,
					R_OUT = 263;
				const left = landmarks[L_OUT],
					right = landmarks[R_OUT];
				const interOcularPx = Math.hypot(
					(right.x - left.x) * canvas.width,
					(right.y - left.y) * canvas.height
				);
				faceSizesRef.current.push(interOcularPx);
				if (faceSizesRef.current.length > 600) faceSizesRef.current.shift();
			} else {
				// ❌ NO FACE DETECTED
				noFaceFramesRef.current += 1;
				isFaceDetectedRef.current = false;
				console.log('no face detected');
			}

			context.restore();
		},
		[drawFaceMesh, drawEyes, drawIris, blinkDetectionThreshold, drawingColors]
	);
	// ============================================
	const updateAllMetrics = useCallback(async () => {
		// // ✅ Skip calculation if no face detected
		if (!isFaceDetectedRef.current) {
			console.log('[Metrics] Skipping calculation - no face detected');
			const neutralMetrics = createNeutralMetrics({
				eyeAge: lastValidEyeAgeRef.current,
				faceAge: lastValidFaceAgeRef.current,
				meanIBI: lastDrynessRef.current?.meanIBI,
				incompleteBlinkFrac: lastDrynessRef.current?.incompleteBlinkFrac,
			});
			updateStoreMetrics(neutralMetrics);
			return;
		}
		const timestamp = new Date().toLocaleTimeString();
		const now = Date.now();
		const oneMinuteAgo = now - EYE_TRACKING_CONSTANTS.BLINK.WINDOW_MS;

		blinkTimestampsRef.current = blinkTimestampsRef.current.filter((t) => t > oneMinuteAgo);
		const raw = blinkTimestampsRef.current.length;
		const blinkRate = raw === 0 ? lastValidBlinkRateRef.current : raw;
		if (raw !== 0) lastValidBlinkRateRef.current = blinkRate;

		closedSamplesRef.current = closedSamplesRef.current.filter(
			(sample) => sample.timestamp > now - EYE_TRACKING_CONSTANTS.PERCLOS.WINDOW_MS
		);

		let perclos = 0;
		if (closedSamplesRef.current.length > 1) {
			let closedMilliseconds = 0;
			const samples = closedSamplesRef.current;

			for (let i = 0; i < samples.length - 1; i++) {
				const timeDifference = samples[i + 1].timestamp - samples[i].timestamp;
				if (samples[i].closed) closedMilliseconds += timeDifference;
			}

			const totalMilliseconds = samples[samples.length - 1].timestamp - samples[0].timestamp;
			perclos = totalMilliseconds > 0 ? closedMilliseconds / totalMilliseconds : 0;
		}

		const percentageClosed =
			totalFramesRef.current > 0
				? (closedFramesRef.current / totalFramesRef.current) * 100
				: 0;

		const redWindow = Math.max(1, Math.min(rednessValuesRef.current.length, 300));
		const redVals = rednessValuesRef.current.slice(-redWindow);

		const red = computeRedness(redVals, blinkRate, exposureLevelRef.current);

		const sizeWindow = Math.max(1, Math.min(faceSizesRef.current.length, 30));
		const sizes = faceSizesRef.current.slice(-sizeWindow);
		const prox = computeScreenDistance(sizes, baselineWidthPxRef.current, 50);

		const attentionFraction =
			totalFramesRef.current > 0 ? facePresentFramesRef.current / totalFramesRef.current : 0;

		let strainText: string;

		if (blinkRate < 12) {
			strainText = strainLevels.high;
		} else if (blinkRate < 18) {
			strainText = strainLevels.moderate;
		} else {
			strainText = strainLevels.low;
		}

		let tiredText: string;
		if (percentageClosed > EYE_TRACKING_CONSTANTS.PERCENTAGE.PERCLOS_THRESHOLDS.VERY_HIGH) {
			tiredText = strainLevels.veryHigh;
		} else if (percentageClosed > EYE_TRACKING_CONSTANTS.PERCENTAGE.PERCLOS_THRESHOLDS.HIGH) {
			tiredText = strainLevels.high;
		} else if (
			percentageClosed > EYE_TRACKING_CONSTANTS.PERCENTAGE.PERCLOS_THRESHOLDS.MODERATE
		) {
			tiredText = strainLevels.moderate;
		} else {
			tiredText = strainLevels.low;
		}

		const blinkPenalty = calculateBlinkPenalty(blinkRate);
		const darkCircleValue = darkCircleScoreRef.current;
		const tiredness = clamp01(
			EYE_TRACKING_CONSTANTS.METRICS.TIREDNESS_WEIGHTS.PERCLOS * normalizePerclos(perclos) +
				EYE_TRACKING_CONSTANTS.METRICS.TIREDNESS_WEIGHTS.DARK * darkCircleValue +
				EYE_TRACKING_CONSTANTS.METRICS.TIREDNESS_WEIGHTS.BLINK * blinkPenalty
		);

		const eyeAgeIndex = clamp01(
			EYE_TRACKING_CONSTANTS.METRICS.EYE_AGE_WEIGHTS.PERCLOS * normalizePerclos(perclos) +
				EYE_TRACKING_CONSTANTS.METRICS.EYE_AGE_WEIGHTS.DARK * darkCircleValue +
				EYE_TRACKING_CONSTANTS.METRICS.EYE_AGE_WEIGHTS.BLINK * blinkPenalty
		);

		let eyeAge = lastValidEyeAgeRef.current;
		if (now - lastEyeAgeUpdateRef.current >= 6000) {
			// const chronologicalAgeUser =
			//  storeState.auth.user?.age ?? EYE_TRACKING_CONSTANTS.FALLBACK.EYE_AGE;
			console.log('[EyeTracking] Using chronological age:', chronologicalAgeRef.current);
			eyeAge = calculateEyeAge(
				blinkRate,
				perclos,
				darkCircleValue,
				lastValidEyeAgeRef.current,
				chronologicalAgeRef.current
			);
			if (eyeAge !== lastValidEyeAgeRef.current) {
				lastValidEyeAgeRef.current = eyeAge;
			}
			lastEyeAgeUpdateRef.current = now;
		}

		// Map normalized openness (vertical / horizontal) -> squint (5–40). Smaller openness => higher squint.
		const openness = latestOpennessRef.current;
		const maxOpen = squintMaxOpenRef.current; // device-tuned default
		const minOpen = squintMinOpenRef.current; // device-tuned default

		let squintIntensity = 0;
		if (openness && openness > 0) {
			const normalized = Math.max(0, Math.min(1, (maxOpen - openness) / (maxOpen - minOpen)));
			const squintRaw = Math.max(5, Math.min(40, 5 + normalized * 35));
			// Smooth to reduce jitter
			const smoothed = squintSmoothedRef.current * 0.9 + squintRaw * 0.1;
			squintSmoothedRef.current = smoothed;
			squintIntensity = smoothed;
		} else {
			// Fallback to previous behavior if no openness available
			squintIntensity =
				percentageClosed > 15
					? EYE_TRACKING_CONSTANTS.RANDOM.SQUINT.HIGH.MIN +
						Math.random() * EYE_TRACKING_CONSTANTS.RANDOM.SQUINT.HIGH.RANGE
					: EYE_TRACKING_CONSTANTS.RANDOM.SQUINT.LOW.MIN +
						Math.random() * EYE_TRACKING_CONSTANTS.RANDOM.SQUINT.LOW.RANGE;
		}

		const faceAge = calculateFaceAge(
			eyeAge,
			attentionFraction,
			squintIntensity,
			lastValidFaceAgeRef.current
		);
		if (faceAge !== lastValidFaceAgeRef.current) {
			lastValidFaceAgeRef.current = faceAge;
		}
		const drynessNow = computeDryness(
			blinkTimestampsRef.current,
			incompleteBlinkFlagsRef.current,
			blinkRate
		);
		lastDrynessRef.current = drynessNow;
		const blinkScore = Math.max(0, Math.min(100, (blinkRate / 20) * 100));
		const strainScore = Math.max(
			0,
			100 - ((blinkRate < 12 ? 2 : blinkRate < 18 ? 1 : 0) as 0 | 1 | 2) * 33
		);
		const attentionScore = attentionFraction * 100;
		const tiredScore = Math.max(0, 100 - percentageClosed * 2);
		const overallHealthScore = Math.round(
			(blinkScore + strainScore + attentionScore + tiredScore) / 4
		);

		const metrics: EyeMetrics = {
			timestamp,
			blinkRate,
			perClose: percentageClosed,
			perclos,
			attentionFrac: attentionFraction,
			strainLevelIdx: (blinkRate < 12 ? 2 : blinkRate < 18 ? 1 : 0) as 0 | 1 | 2,
			strainText,
			tiredText,
			attBinary:
				attentionFraction >= EYE_TRACKING_CONSTANTS.PERCENTAGE.ATTENTION_THRESHOLD ? 1 : 0,
			eyeAspectRatio:
				EYE_TRACKING_CONSTANTS.RANDOM.EYE_ASPECT.BASE +
				blinkRate * EYE_TRACKING_CONSTANTS.RANDOM.EYE_ASPECT.BLINK_FACTOR +
				Math.random() * EYE_TRACKING_CONSTANTS.RANDOM.EYE_ASPECT.RANGE,
			pupilDilation: Math.max(
				EYE_TRACKING_CONSTANTS.RANDOM.PUPIL.MIN,
				EYE_TRACKING_CONSTANTS.RANDOM.PUPIL.BASE -
					percentageClosed * EYE_TRACKING_CONSTANTS.RANDOM.PUPIL.PERCLOS_FACTOR +
					Math.random() * EYE_TRACKING_CONSTANTS.RANDOM.PUPIL.RANGE
			),
			squintIntensity: squintIntensity,
			darkCircleScore: darkCircleValue,
			tirednessScore: tiredness,
			eyeAgeIndex: eyeAgeIndex,
			eyeAge,
			faceAge,
			meanIBI: lastDrynessRef.current?.meanIBI ?? 0,
			incompleteBlinkFrac: lastDrynessRef.current?.incompleteBlinkFrac ?? 0,
			drynessScore: lastDrynessRef.current?.drynessScore ?? 0,
			rednessMean: red.meanR,
			rednessStd: red.stdR,
			rednessNorm: red.normRedness,
			rednessIndex: red.rednessIndex,
			rednessScore: red.rednessScore,
			rednessZ: red.rednessZ,
			distanceCm: prox.distanceCm,
			distanceVar: prox.distanceVar,
			proximityScore: prox.proximityScore,
			lightIntensity: roomExposureRef.current,
			overallHealthScore,
			faceDetected: facePresentFramesRef.current > 0,
		};

		streamDataRef.current = [
			...streamDataRef.current.slice(-EYE_TRACKING_CONSTANTS.METRICS.HISTORY_LIMIT),
			metrics,
		];
		updateStoreMetrics(metrics);

		totalFramesRef.current = 0;
		closedFramesRef.current = 0;
		facePresentFramesRef.current = 0;
	}, [chronologicalAgeRef.current, updateStoreMetrics]);

	useEffect(() => {
		if (mediaStream) {
			keepMediaAlive(mediaStream);
		} else {
			stopMediaKeepAlive();
		}
	}, [keepMediaAlive, stopMediaKeepAlive, mediaStream]);

	const startTracking = useCallback(async () => {
		console.log('[useEyeTracking] Starting tracking');
		if (loading) return;

		setLoading(true);
		const isCancelled = false;

		try {
			if (!faceLandmarkerRef.current) {
				const initialized = await initializeFaceLandmarker();
				if (!initialized) throw new Error('Face landmarker initialization failed');
			}

			await startCamera();
			setCameraState({ isCameraActive: true, cameraError: null });

			const renderFrame = async () => {
				if (isCancelled) return;

				const video = videoRef.current;
				const canvas = canvasRef.current;
				const faceLandmarker = faceLandmarkerRef.current;

				if (
					video &&
					canvas &&
					faceLandmarker &&
					video.readyState === video.HAVE_ENOUGH_DATA
				) {
					const context = canvas.getContext('2d');
					if (!context) return;

					const drawingUtils = drawingUtilsRef.current || new DrawingUtils(context);

					// Use the extracted processFrame function
					processFrame(video, canvas, faceLandmarker, context, drawingUtils);
				}

				if (!isCancelled) {
					animationFrameIdRef.current = requestAnimationFrame(renderFrame);
				}
			};

			renderFrame();

			metricsIntervalIdRef.current = window.setInterval(
				updateAllMetrics,
				metricsUpdateInterval
			);

			blinkIntervalIdRef.current = window.setInterval(
				blinkMetrics,
				options.metricsUpdateInterval ??
					EYE_TRACKING_CONSTANTS.METRICS.UPDATE_BLINK_INTERVAL
			);

			// ✅ Start monitoring camera health
			monitorCameraHealth(mediaStream, recoverCameraAndTracking);

			setTrackingState({ isTrackingActive: true, trackingError: null });
			startSession();
		} catch (error) {
			console.error('Tracking error:', error);
			setTrackingState({
				isTrackingActive: false,
				trackingError: EYE_TRACKING_CONSTANTS.ERROR.TRACKING,
			});
			endSession();
		} finally {
			setLoading(false);
			setIsInitialized(true);
		}
	}, [
		loading,
		setLoading,
		startCamera,
		setCameraState,
		updateAllMetrics,
		metricsUpdateInterval,
		setTrackingState,
		startSession,
		initializeFaceLandmarker,
		endSession,
		blinkMetrics,
		monitorCameraHealth,
		options.metricsUpdateInterval,
		faceLandmarkerRef,
		mediaStream,
		recoverCameraAndTracking,
		videoRef,
		processFrame,
	]);
	const stopTracking = useCallback(async () => {
		if (animationFrameIdRef.current != null) {
			cancelAnimationFrame(animationFrameIdRef.current);
		}

		if (metricsIntervalIdRef.current != null) {
			clearInterval(metricsIntervalIdRef.current);
		}

		// ✅ Clean up health check
		if (healthCheckIntervalRef.current != null) {
			clearInterval(healthCheckIntervalRef.current);
		}

		if (blinkIntervalIdRef.current != null) {
			clearInterval(blinkIntervalIdRef.current);
		}

		if (scanningTimerRef.current != null) {
			clearTimeout(scanningTimerRef.current);
			scanningTimerRef.current = null;
		}
		stopCamera();
		setTrackingState({ isTrackingActive: false, trackingError: null });
		endSession();
		setIsScanning(false);
	}, [endSession, setTrackingState, stopCamera]);

	const getMetricsHistory = () => {
		return metricsHistory;
	};

	const getStreamData = useCallback(() => {
		return streamDataRef.current;
	}, []);

	const updateDrawingOptions = useCallback((newOptions: Partial<EyeTrackingOptions>) => {
		console.log('Drawing options updated. Restart tracking to apply changes.', newOptions);
	}, []);

	// ✅ Auto-start tracking (fixed infinite loop)
	useEffect(() => {
		startTracking();
		return () => {
			if (animationFrameIdRef.current != null) {
				cancelAnimationFrame(animationFrameIdRef.current);
			}

			if (metricsIntervalIdRef.current != null) {
				clearInterval(metricsIntervalIdRef.current);
			}

			// ✅ Cleanup recovery timeout
			if (recoveryTimeoutRef.current) {
				clearTimeout(recoveryTimeoutRef.current);
			}
			if (scanningTimerRef.current) {
				clearTimeout(scanningTimerRef.current);
			}
			if (blinkIntervalIdRef.current != null) {
				clearInterval(blinkIntervalIdRef.current);
			}
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []); // ✅ Empty array - only run once

	// ✅ Cleanup on unmount
	useEffect(() => {
		return () => {
			if (animationFrameIdRef.current) {
				cancelAnimationFrame(animationFrameIdRef.current);
			}
			if (metricsIntervalIdRef.current) {
				clearInterval(metricsIntervalIdRef.current);
			}
			stopCamera();
		};
	}, [stopCamera]);

	// ✅ ========== WEB SYSTEM EVENT LISTENERS ==========
	useEffect(() => {
		const handleVisibilityChange = async () => {
			if (document.hidden) {
				console.log('[System] 💤 Page hidden - pausing metrics');
				if (metricsIntervalIdRef.current) {
					clearInterval(metricsIntervalIdRef.current);
				}
			} else {
				console.log('[System] ☀️ Page visible - checking camera');
				if (isTrackingActive) {
					metricsIntervalIdRef.current = window.setInterval(
						updateAllMetrics,
						metricsUpdateInterval
					);
				}
				await new Promise((resolve) => setTimeout(resolve, 1000));
				monitorCameraHealth(mediaStream, recoverCameraAndTracking);
			}
		};

		const handleFocus = () => {
			console.log('[System] 🔓 Window focused - checking camera');
			setTimeout(() => {
				monitorCameraHealth(mediaStream, recoverCameraAndTracking);
			}, 1000);
		};

		const handleBlur = () => {
			console.log('[System] 🔒 Window blurred');
		};

		document.addEventListener('visibilitychange', handleVisibilityChange);
		window.addEventListener('focus', handleFocus);
		window.addEventListener('blur', handleBlur);

		return () => {
			document.removeEventListener('visibilitychange', handleVisibilityChange);
			window.removeEventListener('focus', handleFocus);
			window.removeEventListener('blur', handleBlur);
		};
	}, [
		monitorCameraHealth,
		mediaStream,
		recoverCameraAndTracking,
		isTrackingActive,
		updateAllMetrics,
		metricsUpdateInterval,
	]);

	// ✅ ========== PERIODIC HEALTH CHECK ==========
	useEffect(() => {
		healthCheckIntervalRef.current = setInterval(() => {
			monitorCameraHealth(mediaStream, recoverCameraAndTracking);
		}, 5000);

		return () => {
			if (healthCheckIntervalRef.current) {
				clearInterval(healthCheckIntervalRef.current);
			}
		};
	}, [monitorCameraHealth, mediaStream, recoverCameraAndTracking]);

	return {
		videoRef,
		canvasRef,
		metrics: currentMetrics,
		isActive: isTrackingActive,
		isFaceDetected: isFaceDetectedRef.current,
		cameraReady: isCameraActive,
		streamData: streamDataRef.current,
		loading,
		isScanning,
		startTracking,
		stopTracking,
		getMetricsHistory,
		getStreamData,
		isInitialized,
		drawingColors,
		updateDrawingOptions,
		colorSchemes: COLOR_SCHEMES,
		stream: mediaStream,
	};
};
