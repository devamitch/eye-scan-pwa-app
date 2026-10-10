import { strainLevels } from '@/constants/eye-tracking';
import type { EyeTrackingMetrics } from '@/store/slices/eye-tracking.slice';

export interface NeutralMetricsOptions {
	eyeAge?: number;
	faceAge?: number;
	lightIntensity?: number;
	meanIBI?: number;
	incompleteBlinkFrac?: number;
	drynessScore?: number;
}

export function createNeutralMetrics(
	options: NeutralMetricsOptions = {}
): Partial<EyeTrackingMetrics> {
	const timestamp = new Date().toISOString();

	return {
		timestamp,
		blinkRate: 0,
		perClose: 0,
		perclos: 0,
		attentionFrac: 0,
		strainLevelIdx: 0,
		strainText: strainLevels.low,
		tiredText: strainLevels.low,
		attBinary: 0 as 0 | 1,
		eyeAspectRatio: 0,
		pupilDilation: 0,
		squintIntensity: 0,
		eyeAge: options.eyeAge ?? 0,
		faceAge: options.faceAge ?? 0,
		meanIBI: options.meanIBI,
		darkCircleScore: 0,
		incompleteBlinkFrac: options.incompleteBlinkFrac,
		drynessScore: 0,
		rednessMean: 0,
		rednessStd: 0,
		rednessNorm: 0,
		rednessIndex: 0,
		rednessScore: 0,
		rednessZ: 0,
		distanceCm: 0,
		distanceVar: 0,
		proximityScore: 0,
		overallHealthScore: 0,
		faceDetected: false,
	};
}