/** Results */
export interface DrynessResult {
	meanIBI: number; // seconds
	incompleteBlinkFrac: number; // 0..1
	drynessScore: number; // higher = drier
}

export interface RednessResult {
	meanR: number;
	stdR: number;
	normRedness: number;
	rednessIndex: number;
	rednessScore: number;
	rednessZ: number;
}

export interface ProximityResult {
	distanceCm: number;
	distanceVar: number;
	proximityScore: number; // higher = closer/unstable
}

export interface Point {
	x: number;
	y: number;
}

export interface EyeKeypoints {
	top: Point;
	bottom: Point;
	inner: Point;
	outer: Point;
}

export interface Rectangle {
	x: number;
	y: number;
	width: number;
	height: number;
}

export interface DrawingColors {
	background: string;
	text: string;
	highlight: string;
	faceMesh: string;
	rightEye: string;
	leftEye: string;
	rightIris: string;
	leftIris: string;
	rightEyebrow: string;
	leftEyebrow: string;
	lips: string;
	faceOval: string;
}

export type ColorScheme = 'default' | 'minimal';

export interface EyeTrackingOptions {
	colorScheme?: ColorScheme;
	colors?: Partial<DrawingColors>;
	drawFaceMesh?: boolean;
	drawEyes?: boolean;
	drawIris?: boolean;
	drawEyebrows?: boolean;
	drawLips?: boolean;
	drawFaceOval?: boolean;
	blinkDetectionThreshold?: number;
	metricsUpdateInterval?: number;
	videoConstraints?: MediaTrackConstraints;
}

export interface EyeTrackingMetrics {
	timestamp: string;
	blinkRate: number;
	perClose: number;
	perclos: number;
	attentionFrac: number;
	strainLevelIdx: 0 | 1 | 2;
	strainText: string;
	tiredText: string;
	attBinary: number;
	eyeAspectRatio: number;
	pupilDilation: number;
	squintIntensity: number;
	darkCircleScore: number;
	tirednessScore: number;
	eyeAgeIndex: number;
	eyeAge: number;
	faceAge: number;
	meanIBI: number;
	incompleteBlinkFrac: number;
	drynessScore: number;
	rednessMean: number;
	rednessStd: number;
	rednessNorm: number;
	rednessIndex: number;
	rednessScore: number;
	rednessZ: number;
	distanceCm: number;
	distanceVar: number;
	proximityScore: number;
	overallHealthScore: number;
	batteryLevel: number;
	faceDetected: boolean;
	lightIntensity: number;
}

// Backward compatibility type alias
export type EyeMetrics = EyeTrackingMetrics;

export interface EyeTrackingState {
	isTrackingActive: boolean;
	trackingError: string | null;
}

export interface CameraState {
	isCameraActive: boolean;
	cameraError: string | null;
}

export interface UseEyeTrackingReturn {
	videoRef: React.RefObject<HTMLVideoElement>;
	canvasRef: React.RefObject<HTMLCanvasElement>;
	metrics: EyeTrackingMetrics | null;
	isActive: boolean;
	cameraReady: boolean;
	streamData: any[];
	loading: boolean;
	startTracking: () => Promise<void>;
	stopTracking: () => Promise<void>;
	getMetricsHistory: () => EyeTrackingMetrics[];
	getStreamData: () => any[];
	isInitialized: boolean;
	drawingColors: DrawingColors;
	updateDrawingOptions: (newOptions: Partial<EyeTrackingOptions>) => void;
	colorSchemes: any;
	stream: MediaStream | null;
}

// Worker message types
export interface WorkerMessage {
	type: WorkerMessageType;
	payload: any;
	id?: string;
}

export type WorkerMessageType =
	| 'COMPUTE_DRYNESS'
	| 'COMPUTE_REDNESS'
	| 'COMPUTE_DISTANCE'
	| 'COMPUTE_METRICS'
	| 'PROCESS_FRAME_DATA'
	| 'COMPUTE_EAR'
	| 'COMPUTE_PERCLOS'
	| 'ERROR';

export interface ComputeDrynessPayload {
	blinkTimes: number[];
	incompleteBlinkFlags: boolean[];
	blinkRate: number;
}

export interface ComputeRednessPayload {
	rednessValues: number[];
	blinkRate: number;
	exposureLevel?: number;
}

export interface ComputeDistancePayload {
	faceSizes: number[];
	baselineWidthPx: number;
	targetDistanceCm?: number;
}

export interface ComputeMetricsPayload {
	blinkTimestamps: number[];
	closedSamples: Array<{ timestamp: number; closed: boolean }>;
	totalFrames: number;
	closedFrames: number;
	facePresentFrames: number;
	rednessValues: number[];
	faceSizes: number[];
	exposureLevel: number;
	baselineWidthPx: number;
	darkCircleScore: number;
	blinkRate: number;
	lastValidEyeAge: number;
	lastValidFaceAge: number;
}

export interface ProcessFrameDataPayload {
	imageData: ImageData;
	leftEyeRect: { x: number; y: number; w: number; h: number };
	rightEyeRect: { x: number; y: number; w: number; h: number };
}

export interface ComputeEARPayload {
	leftEye: EyeKeypoints;
	rightEye: EyeKeypoints;
}
