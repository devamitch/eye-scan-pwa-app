'use client';

import Dialog from '@/components/base/Dialog';
import { Button } from '@/components/base/buttons';
import useTranslationData from '@/hooks/use-translation-data';
import { useEyeTrackingContext } from '@/provider/EyeTrackingProvider';
import type { EyeMetrics } from '@/types/eyeTrackingHook';
import {
	AlertTriangle,
	Battery,
	Droplets,
	Eye,
	MapPin,
	Share2,
	StopCircle,
	Zap,
} from 'lucide-react';
import { useTranslations } from 'next-intl';
import type React from 'react';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { toast } from 'sonner';
import styles from './eye-scan-modal.module.css';
import { getBlinkRateStatusHelper, getStatusClassHelper, getStatusLevel } from '@/utils/statusHelper';
import CamScreen from '../eyetracking/camscreen/camscreen';

interface EyeScanModalProps {
	isOpen: boolean;
	onClose: () => void;
	currentMetrics: EyeMetrics | null;
}

const EyeScanModal: React.FC<EyeScanModalProps> = ({ isOpen, onClose, currentMetrics }) => {
	const [isScanning, setIsScanning] = useState(false);
	const [scanCompleted, setScanCompleted] = useState(false);
	const [countdown, setCountdown] = useState(30);
	const [finalMetrics, setFinalMetrics] = useState<EyeMetrics | null>(null);
	const [previousMetrics, setPreviousMetrics] = useState<EyeMetrics | null>(null);
	const [faceScreenshot, setFaceScreenshot] = useState<string | null>(null);
	const [isSharing, setIsSharing] = useState(false);

	const { livePageText, eyeMetricsDisplayText } = useTranslationData();
	const t = useTranslations();
	const { videoRef, canvasRef, startTracking, isActive } = useEyeTrackingContext();

	const isScanningRef = useRef(false);
	const resultsContainerRef = useRef<HTMLDivElement>(null);

	const strainLabels = useMemo(
		() => [
			t.raw('strainLevels.low'),
			t.raw('strainLevels.moderate'),
			t.raw('strainLevels.high'),
			t.raw('strainLevels.veryHigh'),
		],
		[t]
	);

	const getBlinkRateStatus = useCallback(
		(value: number) => getBlinkRateStatusHelper(value, strainLabels),
		[strainLabels]
	);
	const getDrynessLevel = useCallback(
		(score: number) =>
			getStatusLevel(score, [0, 0.5], [strainLabels[2], strainLabels[1], strainLabels[0]]),
		[strainLabels]
	);
	const getRednessLevel = useCallback(
		(score: number) =>
			getStatusLevel(score, [0.4, 0.6], [strainLabels[2], strainLabels[1], strainLabels[0]]),
		[strainLabels]
	);
	const getDarkCircleLevel = useCallback(
		(score: number) =>
			getStatusLevel(score, [0.3, 0.6], [strainLabels[0], strainLabels[1], strainLabels[2]]),
		[strainLabels]
	);
	const getTirednessLevel = useCallback(
		(score: number) =>
			getStatusLevel(score, [0.4, 0.6], [strainLabels[0], strainLabels[1], strainLabels[2]]),
		[strainLabels]
	);
	const getStatusClass = useCallback(
		(value: number, type: 'blinkRate' | 'perClose') =>
			getStatusClassHelper(value, type, styles),
		[]
	);
	const getBatteryStatus = (level: number) => {
		if (level <= 20) {
			return { text: t.raw('strainLevels.high'), status: 'high' };
		}
		if (level <= 50) {
			return { text: t.raw('strainLevels.moderate'), status: 'moderate' };
		}
		return { text: t.raw('strainLevels.low'), status: 'low' };
	};

	const captureScreenshot = useCallback(() => {
		const canvas = canvasRef.current;
		if (!canvas) return null;
		try {
			return canvas.toDataURL('image/jpeg', 0.8);
		} catch (error) {
			console.error('Failed to capture screenshot:', error);
			return null;
		}
	}, [canvasRef]);

	const handleStopScan = useCallback(() => {
		isScanningRef.current = false;
		setIsScanning(false);
		if (currentMetrics) {
			if (finalMetrics) {
				setPreviousMetrics(finalMetrics);
			}
			setFinalMetrics({ ...currentMetrics });
			const screenshot = captureScreenshot();
			if (screenshot) {
				setFaceScreenshot(screenshot);
			}
		}
		setScanCompleted(true);
	}, [currentMetrics, finalMetrics, captureScreenshot]);

	const handleClose = useCallback(() => {
		isScanningRef.current = false;
		setIsScanning(false);
		setScanCompleted(false);
		setCountdown(30);
		setFinalMetrics(null);
		setFaceScreenshot(null);
		onClose();
	}, [onClose]);

	const handleShare = useCallback(async () => {
		const resultsContainer = resultsContainerRef.current;
		if (!resultsContainer) {
			toast.error('Failed to capture results.');
			return;
		}

		setIsSharing(true);

		try {
			// ===== CHECK 1: React Native WebView =====
			if (!!(window as any).ReactNativeWebView) {
				console.log('📱 Detected React Native WebView');
				const html2canvas = (await import('html2canvas')).default;
				const canvas = await html2canvas(resultsContainer, {
					backgroundColor: '#f1f1ebff',
					scale: 2,
					logging: false,
					useCORS: true,
					allowTaint: true,
				});

				const dataUrl = canvas.toDataURL('image/png', 0.95);

				(window as any).ReactNativeWebView.postMessage(
					JSON.stringify({
						type: 'SHARE_IMAGE',
						image: dataUrl,
						title: 'Eye Health Scan Results',
						message: 'Check out my eye health scan results!',
					})
				);

				canvas.width = 0;
				canvas.height = 0;
				toast.success('Opening share...');
				setIsSharing(false);
				return;
			}

			// ===== CHECK 2: Browser Support =====
			console.log('🌐 Web browser detected, checking share support...');

			if (!navigator.share) {
				console.error('❌ Web Share API not available');
				toast.error(
					'Sharing is not supported on this browser. Please use Chrome or Safari on mobile.'
				);
				setIsSharing(false);
				return;
			}

			console.log('✅ Web Share API available');

			// ===== CHECK 3: HTTPS =====
			if (window.location.protocol !== 'https:' && window.location.hostname !== 'localhost') {
				console.error('❌ Not on HTTPS');
				toast.error('Sharing requires HTTPS. Please access the site via https://');
				setIsSharing(false);
				return;
			}

			console.log('✅ HTTPS confirmed');

			// ===== STEP 1: Capture screenshot FAST =====
			console.log('📸 Capturing screenshot...');
			const html2canvas = (await import('html2canvas')).default;

			const canvas = await html2canvas(resultsContainer, {
				backgroundColor: '#f1f1ebff',
				scale: 2,
				logging: false,
				useCORS: true,
				allowTaint: true,
				imageTimeout: 0,
			});

			console.log('✅ Screenshot captured');

			// ===== STEP 2: Convert to blob FAST =====
			console.log('🔄 Converting to blob...');
			const blob = await new Promise<Blob>((resolve, reject) => {
				canvas.toBlob(
					(b) => {
						if (b) {
							console.log('✅ Blob created, size:', b.size, 'bytes');
							resolve(b);
						} else {
							console.error('❌ Blob creation failed');
							reject(new Error('Blob creation failed'));
						}
					},
					'image/png',
					0.95
				);
			});

			// ===== STEP 3: Create file =====
			const fileName = `eye-scan-${Date.now()}.png`;
			const file = new File([blob], fileName, {
				type: 'image/png',
				lastModified: Date.now(),
			});

			console.log('✅ File created:', fileName, file.type, file.size);

			// ===== STEP 4: Check if file sharing is supported =====
			let canShareFiles = false;

			if (navigator.canShare) {
				canShareFiles = navigator.canShare({ files: [file] });
				console.log('Can share files:', canShareFiles);
			} else {
				console.log('⚠️ navigator.canShare not available, trying anyway...');
			}

			// ===== STEP 5: Attempt to share =====
			console.log('🚀 Attempting to share...');

			// Try with file first
			if (canShareFiles || !navigator.canShare) {
				try {
					console.log('📤 Sharing with file...');
					await navigator.share({
						title: 'Eye Health Scan Results',
						text: 'Check out my eye health scan results!',
						files: [file],
					});

					console.log('✅✅✅ SHARE SUCCESSFUL!');
					toast.success('Shared successfully!');
					setIsSharing(false);
					return;
				} catch (shareError: any) {
					console.error(
						'❌ Share with file failed:',
						shareError.name,
						shareError.message
					);

					// If user cancelled, don't show error
					if (shareError.name === 'AbortError') {
						console.log('ℹ️ User cancelled share');
						setIsSharing(false);
						return;
					}

					// If permission denied, try without file
					if (shareError.name === 'NotAllowedError') {
						console.log('⚠️ Permission denied for file, trying text only...');
						// Fall through to text-only share
					} else {
						throw shareError;
					}
				}
			}

			// Fallback: Share without file (text only)
			console.log('📤 Attempting text-only share...');
			try {
				await navigator.share({
					title: 'Eye Health Scan Results',
					text: 'Check out my eye health scan results! Visit the site to see my scan.',
					url: window.location.href,
				});

				console.log('✅ Text-only share successful');
				toast.warning('Shared! (Image not supported, link shared instead)');
			} catch (textShareError: any) {
				console.error('❌ Text share also failed:', textShareError);

				if (textShareError.name === 'AbortError') {
					console.log('ℹ️ User cancelled share');
					return;
				}

				throw textShareError;
			}
		} catch (error: any) {
			console.error('💥 SHARE FAILED:', error);
			console.error('Error name:', error.name);
			console.error('Error message:', error.message);
			console.error('Error stack:', error.stack);

			// User cancelled
			if (error.name === 'AbortError') {
				console.log('ℹ️ User cancelled share');
				return;
			}

			// Permission denied
			if (error.name === 'NotAllowedError') {
				toast.error(
					'Permission denied. Please use Chrome/Safari on mobile and ensure HTTPS.'
				);
				return;
			}

			// Not supported
			if (error.name === 'NotSupportedError') {
				toast.error(
					'File sharing not supported on this device. Please use a mobile browser.'
				);
				return;
			}

			// Other errors
			toast.error(`Failed to share: ${error.message}`);
		} finally {
			setIsSharing(false);
		}
	}, []);

	useEffect(() => {
		if (isOpen && !isScanning && !scanCompleted) {
			isScanningRef.current = true;
			setIsScanning(true);
			setScanCompleted(false);
			setCountdown(30);
			setFaceScreenshot(null);

			if (!isActive) {
				startTracking().catch((error) => {
					console.error('Failed to start scan:', error);
				});
			}
		}
	}, [isOpen, isScanning, scanCompleted, isActive, startTracking]);

	useEffect(() => {
		if (!isScanning) return;

		let currentCount = 30;
		const interval = setInterval(() => {
			currentCount -= 1;
			setCountdown(currentCount);

			if (currentCount <= 0 && isScanningRef.current) {
				handleStopScan();
			}
		}, 1000);

		return () => clearInterval(interval);
	}, [isScanning]);

	useEffect(() => {
		const handleMessage = (event: MessageEvent) => {
			try {
				const data = typeof event.data === 'string' ? JSON.parse(event.data) : event.data;

				if (data.type === 'SHARE_SUCCESS') {
					toast.success('Shared successfully!');
				} else if (data.type === 'SHARE_DISMISSED') {
					console.log('Share dismissed by user');
				} else if (data.type === 'SHARE_ERROR') {
					toast.error('Failed to share. Please try again.');
				}
			} catch (error) {
				// Ignore parsing errors from other sources
			}
		};

		window.addEventListener('message', handleMessage);
		document.addEventListener('message', handleMessage as any);

		return () => {
			window.removeEventListener('message', handleMessage);
			document.removeEventListener('message', handleMessage as any);
		};
	}, []);

	const allMetrics = useMemo(() => {
		if (!finalMetrics) return [];

		return [
			{
				icon: <Battery size={36} />,
				label: eyeMetricsDisplayText.metricLabels.batteryLevel,
				value: `${(finalMetrics.batteryLevel).toFixed(0)}%`,
				recommendedValue: '50% -70%',
				status: getBatteryStatus(finalMetrics.batteryLevel).status,
			},	
			{
				icon: <AlertTriangle size={36} />,
				label: eyeMetricsDisplayText.metricLabels.eyeStrain,
				value: finalMetrics.strainText,
				recommendedValue: eyeMetricsDisplayText.recommendedValues.eyeStrain,
				status: finalMetrics.strainText.toLowerCase(),
			},
			{
				icon: <Eye size={36} />,
				label: eyeMetricsDisplayText.metricLabels.blinkRate,
				value: finalMetrics.blinkRate.toFixed(1),
				recommendedValue: eyeMetricsDisplayText.recommendedValues.blinkRate,
				status: getBlinkRateStatus(finalMetrics.blinkRate),
			},
			{
				icon: <AlertTriangle size={36} />,
				label: eyeMetricsDisplayText.metricLabels.rednessScore,
				value: getRednessLevel(finalMetrics.rednessScore || 0).text,
				recommendedValue: eyeMetricsDisplayText.recommendedValues.rednessScore,
				status: getRednessLevel(finalMetrics.rednessScore || 0).status,
			},
			{
				icon: <Eye size={36} />,
				label: eyeMetricsDisplayText.metricLabels.squintIntensity,
				value: `${finalMetrics.squintIntensity.toFixed(1)} %`,
				recommendedValue: eyeMetricsDisplayText.recommendedValues.squintIntensity,
				status: finalMetrics.squintIntensity > 30 ? strainLabels[2] : strainLabels[0],
			},

			{
				icon: <Droplets size={36} />,
				label: eyeMetricsDisplayText.metricLabels.drynessScore,
				value: getDrynessLevel(finalMetrics.drynessScore || 0).text,
				recommendedValue: eyeMetricsDisplayText.recommendedValues.drynessScore,
				status: getDrynessLevel(finalMetrics.drynessScore || 0).status,
			},
			{
				icon: <MapPin size={36} />,
				label: eyeMetricsDisplayText.metricLabels.proximityScore,
				value: finalMetrics.proximityScore
					? finalMetrics.proximityScore.toFixed(0)
					: '0.000',
				recommendedValue: eyeMetricsDisplayText.recommendedValues.proximityScore,
				status:
					(finalMetrics.proximityScore || 0) > 0.5 ? strainLabels[2] : strainLabels[0],
			},
			{
				icon: <Zap size={36} />,
				label: eyeMetricsDisplayText.metricLabels.tiredness,
				value: getTirednessLevel(finalMetrics.tirednessScore || 0).text,
				recommendedValue: eyeMetricsDisplayText.recommendedValues.darkcircleScore,
				status: getTirednessLevel(finalMetrics.tirednessScore || 0).status,
			},
		];
	}, [
		finalMetrics,
		eyeMetricsDisplayText,
		getBlinkRateStatus,
		getRednessLevel,
		getDrynessLevel,
		getDarkCircleLevel,
		strainLabels,
	]);

	return (
		<Dialog
			isOpen={isOpen}
			onClose={handleClose}
			footer={
				scanCompleted && (
					<div className={styles.resultsFooter}>
						<Button
							onClick={handleShare}
							variant="primary"
							size="medium"
							fullWidth
							loading={isSharing}
							disabled={isSharing}
							leftIcon={!isSharing ? <Share2 size={20} /> : undefined}
						>
							{isSharing ? 'Sharing...' : 'Share Results'}
						</Button>
					</div>
				)
			}
		>
			<div className={styles.modalContainer}>
				{isScanning && (
					<div className={styles.cameraContainer}>
						<CamScreen
							oldVideoRef={videoRef}
							oldCanvasRef={canvasRef}
							isActive={isActive}
						/>
						<div className={styles.metricsOverlay}>
							{currentMetrics && (
								<div className={styles.metricsRow}>
									<div>
										<span className={styles.overlayLabel}>
											{livePageText.eyeScan.metricLabels.blinkRate}
										</span>
										<span
											className={`${styles.overlayValue} ${getStatusClass(currentMetrics.blinkRate, 'blinkRate')}`}
										>
											{currentMetrics.blinkRate.toFixed(1)} bpm
										</span>
									</div>
									<div>
										<span className={styles.overlayLabel}>
											{livePageText.eyeScan.metricLabels.eyeClosure}
										</span>
										<span
											className={`${styles.overlayValue} ${getStatusClass(currentMetrics.perClose, 'perClose')}`}
										>
										{currentMetrics.proximityScore ? (currentMetrics.proximityScore > 0 ? `${currentMetrics.proximityScore.toFixed(0)} cm` : 'N/A') : 'N/A'}
										</span>
									</div>
									<div>
										<span className={styles.overlayLabel}>
											{livePageText.eyeScan.metricLabels.strainLevel}
										</span>
										<span
											className={`${styles.overlayValue} ${styles[currentMetrics.strainText.toLowerCase()]}`}
										>
											{currentMetrics.strainText}
										</span>
									</div>
									<div>
										<span className={styles.overlayLabel}>
											{livePageText.eyeScan.metricLabels.attention}
										</span>
										<span
											className={`${styles.overlayValue} ${styles[getTirednessLevel(currentMetrics.tirednessScore).status]}`}
										>
											{getTirednessLevel(currentMetrics.tirednessScore).text}
										</span>
									</div>
								</div>
							)}
						</div>
						<div className={styles.scanControls}>
							<div className={styles.timerDisplay}>
								<span>{countdown}</span>
							</div>
						<Button 
							onClick={handleStopScan} 
							variant="danger" 
							size="medium"
							leftIcon={<StopCircle size={20} />}
						>
							{livePageText.eyeScan.stopButton}
						</Button>
						</div>
					</div>
				)}

				{scanCompleted && (
					<div className={styles.resultsContainer} ref={resultsContainerRef}>
						<div className={styles.resultsHeader}>
							<h2 className={styles.resultsTitle}>
								{livePageText.eyeScan.completedTitle}
							</h2>
							<p className={styles.resultSubtitle}>
								{livePageText.eyeScan.completedSubtitle}
							</p>
						</div>
						{faceScreenshot && (
							<div className={styles.screenshotContainer}>
								<img
									src={faceScreenshot || '/placeholder.svg'}
									alt="Face scan"
									className={styles.faceScreenshot}
								/>
							</div>
						)}
						<div className={styles.scanResults}>
							<div className={styles.metricsGrid}>
								{allMetrics.map((metric) => (
									<div key={metric.label} className={styles.metricCard}>
										<div className={styles.cardIcon}>{metric.icon}</div>
										<div className={styles.cardContent}>
											<div className={styles.metricHeader}>
												<span className={styles.metricLabel}>
													{metric.label}
												</span>
												<span className={styles.recommendedValue}>
													{metric.recommendedValue}
												</span>
											</div>
											<div
												className={styles.metricValue}
												data-status={metric.status}
											>
												{metric.value}
											</div>
										</div>
									</div>
								))}
							</div>
						</div>
					</div>
				)}
			</div>
		</Dialog>
	);
};

export default EyeScanModal;
