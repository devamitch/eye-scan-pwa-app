// ============================================================================
// Constants
// ============================================================================

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

// ============================================================================
// Utility Functions
// ============================================================================

const z = (x, m, s) => (s > 1e-6 ? (x - m) / s : 0);

const clamp01 = (value) => Math.max(0, Math.min(1, value));

const distanceBetweenPoints = (a, b) => Math.hypot(a.x - b.x, a.y - b.y);

const getSafeRectangle = (x, y, width, height, canvasWidth, canvasHeight) => {
	const rectX = Math.max(0, Math.min(canvasWidth - 1, Math.round(x)));
	const rectY = Math.max(0, Math.min(canvasHeight - 1, Math.round(y)));
	const rectWidth = Math.max(1, Math.min(canvasWidth - rectX, Math.round(width)));
	const rectHeight = Math.max(1, Math.min(canvasHeight - rectY, Math.round(height)));
	return { x: rectX, y: rectY, width: rectWidth, height: rectHeight };
};

// ============================================================================
// Core Computation Functions
// ============================================================================

function computeDryness(blinkTimes, incompleteBlinkFlags, blinkRate) {
	// IBI (Inter-Blink Interval)
	const ibis = [];
	for (let i = 1; i < blinkTimes.length; i++) {
		ibis.push((blinkTimes[i] - blinkTimes[i - 1]) / 1000);
	}
	const meanIBI = ibis.length ? ibis.reduce((a, b) => a + b, 0) / ibis.length : 0;

	// IBF (Incomplete Blink Fraction)
	const total = incompleteBlinkFlags.length;
	const incompleteCount = incompleteBlinkFlags.reduce((acc, v) => acc + (v ? 1 : 0), 0);
	const incompleteBlinkFrac = total ? incompleteCount / total : 0;

	// Dryness Score Calculation
	const BASE = {
		rate: { m: 12, s: 6 },
		incomp: { m: 0.15, s: 0.1 },
		ibi: { m: 4.0, s: 1.5 },
	};

	const drynessScore = clamp01(
		0.5 +
			0.45 * z(blinkRate, BASE.rate.m, BASE.rate.s) +
			0.35 * z(incompleteBlinkFrac, BASE.incomp.m, BASE.incomp.s) +
			0.2 * z(meanIBI, BASE.ibi.m, BASE.ibi.s)
	);

	return { meanIBI, incompleteBlinkFrac, drynessScore };
}

function computeRedness(rednessValues, blinkRate, exposureLevel = 0.5) {
	const n = rednessValues.length || 1;
	const meanR = rednessValues.reduce((a, b) => a + b, 0) / n;
	const stdR = Math.sqrt(rednessValues.reduce((a, b) => a + (b - meanR) ** 2, 0) / n);

	const normRedness = meanR / Math.max(exposureLevel, 0.1);
	const rednessIndex = normRedness + 0.5 * stdR;
	const rednessScore = clamp01(0.7 * rednessIndex + 0.3 * (blinkRate / 20));

	const BASE = { red: { m: 0.35, s: 0.15 } };
	const rednessZ = z(rednessScore, BASE.red.m, BASE.red.s);

	return { meanR, stdR, normRedness, rednessIndex, rednessScore, rednessZ };
}

function computeScreenDistance(faceSizes, baselineWidthPx, targetDistanceCm = 50) {
	const n = faceSizes.length || 1;
	const meanSize = faceSizes.reduce((a, b) => a + b, 0) / n;
	const varSum = faceSizes.reduce((a, b) => a + (b - meanSize) ** 2, 0) / n;
	const stdSize = Math.sqrt(varSum);

	const distanceCm = targetDistanceCm * (baselineWidthPx / Math.max(meanSize, 1e-6));
	const distanceVar = stdSize / Math.max(meanSize, 1e-6);

	const BASE = { dist: { m: 50, s: 10 }, v: { m: 0.05, s: 0.03 } };
	const distZ = -z(distanceCm, BASE.dist.m, BASE.dist.s);
	const varZ = z(distanceVar, BASE.v.m, BASE.v.s);
	const proximityScore = clamp01(0.5 + (0.7 * distZ + 0.3 * varZ) * -0.5);

	return { distanceCm, distanceVar, proximityScore };
}

function computeOverallHealth(blinkRate, percentageClosed, attentionFraction) {
	// Blink score (0-100): higher blink rate = better score, ideal is 15-20 blinks/min
	const blinkScore = Math.max(0, Math.min(100, (blinkRate / 20) * 100));

	// Strain score (0-100): based on blink rate deviation from ideal
	const strainLevelIdx = blinkRate < 12 ? 2 : blinkRate < 18 ? 1 : 0;
	const strainScore = Math.max(0, 100 - strainLevelIdx * 33);

	// Attention score (0-100): direct conversion from fraction
	const attentionScore = attentionFraction * 100;

	// Tired score (0-100): inverse of percentage closed
	const tiredScore = Math.max(0, 100 - percentageClosed * 2);

	// Overall health score: weighted average
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

// ============================================================================
// Image Processing Functions
// ============================================================================

function calculateMeanLuminance(imageData, x, y, width, height, canvasWidth, canvasHeight) {
	const rect = getSafeRectangle(x, y, width, height, canvasWidth, canvasHeight);

	let sum = 0;
	let count = 0;

	const startX = rect.x;
	const startY = rect.y;
	const endX = rect.x + rect.width;
	const endY = rect.y + rect.height;

	for (let y = startY; y < endY; y++) {
		for (let x = startX; x < endX; x++) {
			const index = (y * canvasWidth + x) * 4;
			const red = imageData.data[index];
			const green = imageData.data[index + 1];
			const blue = imageData.data[index + 2];

			sum +=
				EYE_TRACKING_CONSTANTS.VISUAL.LUMINANCE_WEIGHTS.RED * red +
				EYE_TRACKING_CONSTANTS.VISUAL.LUMINANCE_WEIGHTS.GREEN * green +
				EYE_TRACKING_CONSTANTS.VISUAL.LUMINANCE_WEIGHTS.BLUE * blue;
			count++;
		}
	}

	return count ? sum / count : 0;
}

function processImageData(imageData, leftEyeRect, rightEyeRect) {
	const { width, height, data } = imageData;

	const processRect = (rect) => {
		const safeRect = getSafeRectangle(rect.x, rect.y, rect.w, rect.h, width, height);

		let rs = 0,
			gs = 0,
			bs = 0,
			count = 0;

		for (let y = safeRect.y; y < safeRect.y + safeRect.height; y++) {
			for (let x = safeRect.x; x < safeRect.x + safeRect.width; x++) {
				const index = (y * width + x) * 4;
				rs += data[index];
				gs += data[index + 1];
				bs += data[index + 2];
				count++;
			}
		}

		const n = Math.max(1, count);
		const meanR = rs / n;
		const meanG = gs / n;
		const meanB = bs / n;
		const exposure = (0.2126 * meanR + 0.7152 * meanG + 0.0722 * meanB) / 255;
		const frameRedness = Math.max(0, (meanR - (meanG + meanB) / 2) / 255);

		return { meanR, meanG, meanB, exposure, frameRedness };
	};

	const leftResult = processRect(leftEyeRect);
	const rightResult = processRect(rightEyeRect);

	return {
		left: leftResult,
		right: rightResult,
		average: {
			meanR: (leftResult.meanR + rightResult.meanR) / 2,
			meanG: (leftResult.meanG + rightResult.meanG) / 2,
			meanB: (leftResult.meanB + rightResult.meanB) / 2,
			exposure: (leftResult.exposure + rightResult.exposure) / 2,
			frameRedness: (leftResult.frameRedness + rightResult.frameRedness) / 2,
		},
	};
}

// ============================================================================
// Metrics Computation Functions
// ============================================================================

function computeEAR(leftEye, rightEye) {
	const leftVertical = distanceBetweenPoints(leftEye.top, leftEye.bottom);
	const leftHorizontal = distanceBetweenPoints(leftEye.inner, leftEye.outer);
	const leftEAR = leftVertical / Math.max(leftHorizontal, 1e-6);

	const rightVertical = distanceBetweenPoints(rightEye.top, rightEye.bottom);
	const rightHorizontal = distanceBetweenPoints(rightEye.inner, rightEye.outer);
	const rightEAR = rightVertical / Math.max(rightHorizontal, 1e-6);

	return (leftEAR + rightEAR) / 2;
}

function computeMetrics(payload) {
	const {
		earHistory,
		blinkTimestamps,
		closedFrames,
		totalFrames,
		currentTime,
		darkCircleScore,
		exposureLevel,
		rednessValues,
		faceSizes,
		baselineWidthPx,
		incompleteBlinkFlags = [],
	} = payload;

	// Calculate EAR statistics
	const earMean = earHistory.length
		? earHistory.reduce((a, b) => a + b, 0) / earHistory.length
		: 0;

	const earVariance = earHistory.length
		? earHistory.reduce((a, b) => a + Math.pow(b - earMean, 2), 0) / earHistory.length
		: 0;

	const earStd = Math.sqrt(earVariance);

	// Calculate PERCLOS
	const perclos = totalFrames > 0 ? closedFrames / totalFrames : 0;

	// Calculate blink rate
	const recentWindow = 60000;
	const recentBlinks = blinkTimestamps.filter((t) => currentTime - t < recentWindow);
	const blinksPerMinute = recentBlinks.length;

	// Calculate advanced metrics
	const dryness = computeDryness(blinkTimestamps, incompleteBlinkFlags, blinksPerMinute);
	const redness = computeRedness(rednessValues, blinksPerMinute, exposureLevel);
	const proximity = computeScreenDistance(faceSizes, baselineWidthPx, 50);

	// Calculate fatigue score
	const blinkPenalty = clamp01(
		Math.abs(blinksPerMinute - EYE_TRACKING_CONSTANTS.BLINK.TARGET_PER_MIN) /
			EYE_TRACKING_CONSTANTS.BLINK.PENALTY_DIVISOR
	);

	const normalizedPerclos = clamp01(
		(perclos - EYE_TRACKING_CONSTANTS.METRICS.PERCLOS_NORMALIZATION.SUBTRACT) /
			EYE_TRACKING_CONSTANTS.METRICS.PERCLOS_NORMALIZATION.DIVIDE
	);

	const fatigueScore = clamp01(
		EYE_TRACKING_CONSTANTS.METRICS.TIREDNESS_WEIGHTS.PERCLOS * normalizedPerclos +
			EYE_TRACKING_CONSTANTS.METRICS.TIREDNESS_WEIGHTS.DARK * darkCircleScore +
			EYE_TRACKING_CONSTANTS.METRICS.TIREDNESS_WEIGHTS.BLINK * blinkPenalty
	);

	// Calculate percentage closed and attention fraction
	const percentageClosed = totalFrames > 0 ? (closedFrames / totalFrames) * 100 : 0;
	const attentionFraction = totalFrames > 0 ? 1 - closedFrames / totalFrames : 0;

	// Calculate overall health score
	const healthMetrics = computeOverallHealth(
		blinksPerMinute,
		percentageClosed,
		attentionFraction
	);

	return {
		earMean,
		earStd,
		earVariance,
		perclos,
		blinksPerMinute,
		fatigueScore,
		darkCircleScore,
		drynessScore: dryness.drynessScore,
		rednessScore: redness.rednessScore,
		proximityScore: proximity.proximityScore,
		totalBlinks: blinkTimestamps.length,
		meanIBI: dryness.meanIBI,
		incompleteBlinkFrac: dryness.incompleteBlinkFrac,
		...healthMetrics,
	};
}

function computePERCLOS(earHistory, threshold) {
	if (earHistory.length === 0) return 0;

	const closedCount = earHistory.filter((ear) => ear < threshold).length;
	return closedCount / earHistory.length;
}

function batchProcessFrames(payload) {
	const { frames, landmarks, timestamp } = payload;
	const earValues = [];
	const blinkDetections = [];

	const startTime = performance.now();

	for (let i = 0; i < frames.length; i++) {
		if (landmarks[i] && landmarks[i].length > 0) {
			const frameLandmarks = landmarks[i][0];

			// Extract eye landmarks and compute EAR
			const leftEye = {
				top: frameLandmarks[159],
				bottom: frameLandmarks[145],
				inner: frameLandmarks[133],
				outer: frameLandmarks[33],
			};

			const rightEye = {
				top: frameLandmarks[386],
				bottom: frameLandmarks[374],
				inner: frameLandmarks[362],
				outer: frameLandmarks[263],
			};

			const ear = computeEAR(leftEye, rightEye);
			earValues.push(ear);
			blinkDetections.push(ear < EYE_TRACKING_CONSTANTS.BLINK.DETECTION_THRESHOLD);
		} else {
			earValues.push(0);
			blinkDetections.push(false);
		}
	}

	const processingTime = performance.now() - startTime;

	return {
		earValues,
		blinkDetections,
		processingTime,
	};
}

function filterLandmarks(payload) {
	const { landmarks, canvasWidth, canvasHeight } = payload;

	const toPixelCoordinates = (point) => ({
		x: point.x * canvasWidth,
		y: point.y * canvasHeight,
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

	// Calculate face bounds
	const left = landmarks[33];
	const right = landmarks[263];
	const faceWidth = Math.abs(right.x - left.x) * canvasWidth;
	const faceHeight = faceWidth * 1.2; // Approximate aspect ratio

	return {
		leftEye,
		rightEye,
		faceBounds: { width: faceWidth, height: faceHeight },
	};
}

// ============================================================================
// Message Handler
// ============================================================================

self.onmessage = (event) => {
	const { type, payload, id } = event.data;

	try {
		let result;

		switch (type) {
			case 'COMPUTE_DRYNESS': {
				const { blinkTimes, incompleteBlinkFlags, blinkRate } = payload;
				result = computeDryness(blinkTimes, incompleteBlinkFlags, blinkRate);
				break;
			}

			case 'COMPUTE_REDNESS': {
				const { rednessValues, blinkRate, exposureLevel } = payload;
				result = computeRedness(rednessValues, blinkRate, exposureLevel);
				break;
			}

			case 'COMPUTE_DISTANCE': {
				const { faceSizes, baselineWidthPx, targetDistanceCm } = payload;
				result = computeScreenDistance(faceSizes, baselineWidthPx, targetDistanceCm);
				break;
			}

			case 'COMPUTE_LUMINANCE': {
				const { imageData, regions } = payload;
				result = regions.map((region) =>
					calculateMeanLuminance(
						imageData,
						region.x,
						region.y,
						region.width,
						region.height,
						imageData.width,
						imageData.height
					)
				);
				break;
			}

			case 'COMPUTE_METRICS': {
				result = computeMetrics(payload);
				break;
			}

			case 'PROCESS_IMAGE_DATA': {
				const { imageData, leftEyeRect, rightEyeRect } = payload;
				result = processImageData(imageData, leftEyeRect, rightEyeRect);
				break;
			}

			case 'COMPUTE_EAR': {
				const { leftEye, rightEye } = payload;
				result = computeEAR(leftEye, rightEye);
				break;
			}

			case 'COMPUTE_PERCLOS': {
				const { earHistory, threshold } = payload;
				result = computePERCLOS(earHistory, threshold);
				break;
			}

			case 'PROCESS_BATCH_FRAMES': {
				result = batchProcessFrames(payload);
				break;
			}

			case 'FILTER_LANDMARKS': {
				result = filterLandmarks(payload);
				break;
			}

			case 'COMPUTE_OVERALL_HEALTH': {
				const { blinkRate, percentageClosed, attentionFraction } = payload;
				result = computeOverallHealth(blinkRate, percentageClosed, attentionFraction);
				break;
			}

			default:
				throw new Error(`Unknown message type: ${type}`);
		}

		self.postMessage({
			type: `${type}_RESULT`,
			payload: result,
			id,
		});
	} catch (error) {
		self.postMessage({
			type: 'ERROR',
			payload: {
				message: error instanceof Error ? error.message : 'Unknown error',
				originalType: type,
				stack: error instanceof Error ? error.stack : undefined,
			},
			id,
		});
	}
};

// Notify that worker is ready
self.postMessage({ type: 'WORKER_READY' });
