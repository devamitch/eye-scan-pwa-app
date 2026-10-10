import Dialog from '@/components/base/Dialog';
import useTranslationData from '@/hooks/use-translation-data';
import useAppStore from '@/store';
import { ExerciseCardData } from '@/types';
import dynamic from 'next/dynamic';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import styles from './exercise-modal.module.css';
import { Button } from '@/components/base/buttons';
import { CheckCircle, RotateCcw } from 'lucide-react';
import { getStatusLevel } from '@/utils/statusHelper';
import { useTranslations } from 'next-intl';

// Dynamic import for GumletPlayer to avoid SSR issues
const GumletPlayer = dynamic(
	() => import('@gumlet/react-embed-player').then((mod) => ({ default: mod.GumletPlayer })),
	{
		ssr: false,
		loading: () => (
			<div
				style={{
					width: '100%',
					height: '400px',
					display: 'flex',
					alignItems: 'center',
					justifyContent: 'center',
					backgroundColor: '#000',
					color: '#fff',
				}}
			>
				Loading player...
			</div>
		),
	}
);

interface ExerciseModalProps {
	isOpen: boolean;
	onClose: () => void;
	exercise: ExerciseCardData | null;
	currentMetrics: EyeMetrics | null;
}

const ExerciseModal: React.FC<ExerciseModalProps> = ({
	isOpen,
	onClose,
	exercise,
	currentMetrics,
}) => {
	// Zustand store
	const {
		startExercise,
		updateExerciseProgress,
		completeExercise,
		pauseExercise,
		restartExercise,
		getExerciseProgress,
	} = useAppStore((state) => state.exercise);

	// Local state
	const [videoEnded, setVideoEnded] = useState(false);
	const [isVideoReady, setIsVideoReady] = useState(false);
	const [currentTime, setCurrentTime] = useState(0);

	const { exerciseModalText } = useTranslationData();
	const t = useTranslations();

	const strainLabels = useMemo(
		() => [
			t.raw('strainLevels.low'),
			t.raw('strainLevels.moderate'),
			t.raw('strainLevels.high'),
			t.raw('strainLevels.veryHigh'),
		],
		[t]
	);

	const getTirednessLevel = useCallback(
		(score: number) =>
			getStatusLevel(score, [0.4, 0.6], [strainLabels[0], strainLabels[1], strainLabels[2]]),
		[strainLabels]
	);

	// Load existing progress when modal opens
	useEffect(() => {
		if (isOpen && exercise) {
			const progress = getExerciseProgress(exercise.videoUrl);

			if (!progress || progress.isCompleted || progress.currentTime === 0) {
				// Start new exercise
				const metrics = currentMetrics
					? {
							blinkRate: currentMetrics.blinkRate,
							proximityScore: currentMetrics.proximityScore,
							strainText: currentMetrics.strainText,
							tirednessScore: currentMetrics.tirednessScore,
							timestamp: new Date().toISOString(),
						}
					: null;

				startExercise(exercise.videoUrl, exercise.title, metrics);
			}
		}
	}, [isOpen, exercise]);

	// Reset video state when modal closes
	useEffect(() => {
		if (!isOpen) {
			setVideoEnded(false);
			setIsVideoReady(false);
		}
	}, [isOpen]);

	// Gumlet player event handlers
	const handlePlayerReady = () => {
		setIsVideoReady(true);
	};

	const handleTimeUpdate = (time: number) => {
		setCurrentTime(time);
		if (exercise) {
			updateExerciseProgress(exercise.videoUrl, time, 0);
		}
	};

	const handleVideoEnd = () => {
		if (!exercise) return;

		setVideoEnded(true);

		const metrics = currentMetrics
			? {
					blinkRate: currentMetrics.blinkRate,
					proximityScore: currentMetrics.proximityScore,
					strainText: currentMetrics.strainText,
					tirednessScore: currentMetrics.tirednessScore,
					timestamp: new Date().toISOString(),
				}
			: null;

		completeExercise(exercise.videoUrl, metrics);
	};

	const handleExerciseComplete = () => {
		if (!exercise || !currentMetrics) return;

		const metrics = {
			blinkRate: currentMetrics.blinkRate,
			proximityScore: currentMetrics.proximityScore,
			strainText: currentMetrics.strainText,
			tirednessScore: currentMetrics.tirednessScore,
			timestamp: new Date().toISOString(),
		};

		completeExercise(exercise.videoUrl, metrics);
		setVideoEnded(true);
	};

	const handleRestartExercise = () => {
		if (!exercise) return;

		setVideoEnded(false);

		const metrics = currentMetrics
			? {
					blinkRate: currentMetrics.blinkRate,
					proximityScore: currentMetrics.proximityScore,
					strainText: currentMetrics.strainText,
					tirednessScore: currentMetrics.tirednessScore,
					timestamp: new Date().toISOString(),
				}
			: null;

		restartExercise(exercise.videoUrl, metrics);
	};

	const handleClose = () => {
		if (exercise && currentTime > 0 && !videoEnded) {
			pauseExercise(exercise.videoUrl, currentTime);
		}

		setVideoEnded(false);
		setCurrentTime(0);
		setIsVideoReady(false);
		onClose();
	};

	if (!exercise) return null;

	const progress = getExerciseProgress(exercise.videoUrl);
	const metricsComparison = progress
		? {
				before: progress.metricsBeforeExercise,
				after: progress.metricsAfterExercise,
				improvement: progress.improvement,
			}
		: null;

	const getStatusClass = (value: number, type: string) => {
		switch (type) {
			case 'blinkRate':
				return value < 10 ? styles.high : value < 15 ? styles.moderate : styles.low;
			case 'perClose':
				return value > 40
					? styles.veryHigh
					: value > 20
						? styles.high
						: value > 5
							? styles.moderate
							: styles.low;
			default:
				return styles.normal;
		}
	};

	const MetricsDisplay: React.FC<{ metrics: any; title: string }> = ({ metrics, title }) => (
		<div className={styles.metricsSection}>
			<h4 className={styles.metricsTitle}>{title}</h4>
			<div className={styles.metricsGrid}>
				<div className={styles.metricItem}>
					<span className={styles.metricLabel}>
						{exerciseModalText.metricLabels.blinkRate}
					</span>
					<span
						className={`${styles.metricValue} ${getStatusClass(metrics.blinkRate, 'blinkRate')}`}
					>
						{metrics.blinkRate.toFixed(1)}
						{exerciseModalText.units.bpm}
					</span>
				</div>

				<div className={styles.metricItem}>
					<span className={styles.metricLabel}>
						{exerciseModalText.metricLabels.screenDistance}
					</span>
					<span
						className={`${styles.metricValue} ${getStatusClass(metrics.proximityScore || 0, 'perClose')}`}
					>
						{metrics.proximityScore ? (metrics.proximityScore > 0 ? `${metrics.proximityScore.toFixed(0)} cm` : 'N/A') : 'N/A'}
					</span>
				</div>

				<div className={styles.metricItem}>
					<span className={styles.metricLabel}>
						{exerciseModalText.metricLabels.strainLevel}
					</span>
					<span
						className={`${styles.metricValue} ${styles[metrics.strainText.toLowerCase()]}`}
					>
						{metrics.strainText}
					</span>
				</div>

				<div className={styles.metricItem}>
					<span className={styles.metricLabel}>
						{exerciseModalText.metricLabels.tiredness}
					</span>
					<span
						className={`${styles.metricValue} ${styles[getTirednessLevel(metrics.tirednessScore || 0).status]}`}
					>
						{getTirednessLevel(metrics.tirednessScore || 0).text}
					</span>
				</div>
			</div>
		</div>
	);

	return (
		<Dialog
			isOpen={isOpen}
			onClose={handleClose}
			footer={
				<div className={styles.exerciseButton}>
					{!videoEnded ? (
						<Button
							onClick={handleExerciseComplete}
							variant="primary"
							size="medium"
							fullWidth
							leftIcon={<CheckCircle size={20} />}
						>
							{exerciseModalText.buttons.markComplete}
						</Button>
					) : (
						<Button
							onClick={handleRestartExercise}
							variant="danger"
							size="medium"
							fullWidth
							leftIcon={<RotateCcw size={20} />}
						>
							{exerciseModalText.buttons.restart}
						</Button>
					)}
				</div>
			}
		>
			<div>
				<div className={styles.videoContainer}>
					<GumletPlayer
						videoID={exercise.videoUrl}
						title={exercise.title}
						style={{ height: '100%', width: '100%', objectFit: 'contain' }}
						schemaOrgVideoObject={{
							'@context': 'https://schema.org',
							'@type': 'VideoObject',
							name: 'Gumlet',
							description: '',
							embedUrl: 'https://play.gumlet.io/embed/64bfb0913ed6e5096d66dc1e',
						}}
						preload={true}
						autoplay={true}
						loop={true}
						muted={false}
						playsinline={true}
						onReady={handlePlayerReady}
						onTimeUpdate={handleTimeUpdate}
						onEnded={handleVideoEnd}
					/>
				</div>
			</div>

			<div className={styles.metricsContainer}>
				{!videoEnded && currentMetrics && (
					<div className={styles.metricsGrid}>
						<div className={styles.metricItem}>
							<span className={styles.metricLabel}>
								{exerciseModalText.metricLabels.blinkRate}
							</span>
							<span
								className={`${styles.metricValue} ${getStatusClass(currentMetrics.blinkRate, 'blinkRate')}`}
							>
								{currentMetrics.blinkRate.toFixed(1)}
								{exerciseModalText.units.bpm}
							</span>
						</div>

						<div className={styles.metricItem}>
							<span className={styles.metricLabel}>
							{exerciseModalText.metricLabels.screenDistance}
							</span>
							<span
								className={`${styles.metricValue} ${getStatusClass(currentMetrics.proximityScore || 0, 'perClose')}`}
							>
								{currentMetrics.proximityScore ? (currentMetrics.proximityScore > 0 ? `${currentMetrics.proximityScore.toFixed(0)} cm` : 'N/A') : 'N/A'}
							</span>
						</div>

						<div className={styles.metricItem}>
							<span className={styles.metricLabel}>
								{exerciseModalText.metricLabels.strainLevel}
							</span>
							<span
								className={`${styles.metricValue} ${styles[currentMetrics.strainText.toLowerCase()]}`}
							>
								{currentMetrics.strainText}
							</span>
						</div>

						<div className={styles.metricItem}>
							<span className={styles.metricLabel}>
								{exerciseModalText.metricLabels.tiredness}
							</span>
							<span
								className={`${styles.metricValue} ${styles[getTirednessLevel(currentMetrics.tirednessScore).status]}`}
							>
								{getTirednessLevel(currentMetrics.tirednessScore).text}
							</span>
						</div>
					</div>
				)}

				{videoEnded && metricsComparison?.before && metricsComparison?.after && (
					<div className={styles.comparisonSection}>
						<h3 className={styles.comparisonTitle}>Exercise Results Comparison</h3>
						<div className={styles.comparisonGrid}>
							<MetricsDisplay
								metrics={metricsComparison.before}
								title="Before Exercise"
							/>
							<MetricsDisplay
								metrics={metricsComparison.after}
								title="After Exercise"
							/>
						</div>

						{metricsComparison.improvement && (
							<div className={styles.improvementSection}>
								<h4 className={styles.improvementTitle}>Improvement</h4>
								<div className={styles.improvementGrid}>
									<div className={styles.improvementItem}>
										<span>{exerciseModalText.metricLabels.blinkRate}:</span>
										<span
											className={
												metricsComparison.improvement.blinkRate > 0
													? styles.positive
													: styles.negative
											}
										>
											{metricsComparison.improvement.blinkRate > 0 ? '+' : ''}
											{metricsComparison.improvement.blinkRate.toFixed(1)}
										</span>
									</div>
									<div className={styles.improvementItem}>
										<span>{exerciseModalText.metricLabels.screenDistance}:</span>
										<span
											className={
												metricsComparison.improvement.proximityScore > 0
													? styles.positive
													: styles.negative
											}
										>
											{metricsComparison.improvement.proximityScore > 0 ? '+' : ''}
											{metricsComparison.improvement.proximityScore?.toFixed(1) || '0.0'} cm
										</span>
									</div>
								</div>
							</div>
						)}
					</div>
				)}
			</div>
		</Dialog>
	);
};

export default ExerciseModal;
