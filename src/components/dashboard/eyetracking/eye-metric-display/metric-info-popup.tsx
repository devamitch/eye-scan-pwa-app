'use client';
import Dialog from '@/components/base/Dialog';
import useTranslationData from '@/hooks/use-translation-data';
import { useExercises } from '@/hooks/use-excercise';
import { useEyeTrackingContext } from '@/provider/EyeTrackingProvider';
import { ExerciseCardData } from '@/types';
import React, { useState } from 'react';
import styles from './metric-info-popup.module.css';
import ExerciseModal from '@/components/icare/exercise-modal/exercise-modal';
import Card from '@/components/base/cards';

interface MetricInfo {
	metricKey?: string;
	title: string;
	description: string;
	healthy: string;
	whyItMatters: string;
	quickWin: string;
	recommendedAdjustments?: string;
}

interface MetricInfoPopupProps {
	isOpen: boolean;
	onClose: () => void;
	metricInfo: MetricInfo | null;
}

const MetricInfoPopup: React.FC<MetricInfoPopupProps> = ({ isOpen, onClose, metricInfo }) => {
	const { metricInfoPopupText } = useTranslationData();
	const { data: exercises } = useExercises();
	const { metrics } = useEyeTrackingContext();
	
	// Exercise modal state
	const [selectedExercise, setSelectedExercise] = useState<ExerciseCardData | null>(null);
	const [isExerciseModalOpen, setIsExerciseModalOpen] = useState(false);
	
	// Handle exercise click
	const handleExerciseClick = (exercise: ExerciseCardData) => {
		setSelectedExercise(exercise);
		setIsExerciseModalOpen(true);
	};
	
	// Handle exercise modal close
	const handleCloseExerciseModal = () => {
		setIsExerciseModalOpen(false);
		setSelectedExercise(null);
	};
	
	if (!metricInfo) return null;
	
	const firstTwoExercises = exercises?.slice(0, 2) || [];

	return (
		<Dialog isOpen={isOpen} onClose={onClose}>
			<div className={styles.container}>
				<div className={styles.header}>
					<h2 className={styles.title}>{metricInfo.title}</h2>
					<p className={styles.description}>{metricInfo.description}</p>
				</div>
				
				<div className={styles.content}>
					<div className={styles.section}>
						<h3 className={styles.sectionTitle}>{metricInfoPopupText.sectionTitles.healthyRange}</h3>
						<p className={styles.sectionText}>{metricInfo.healthy}</p>
					</div>
					
					<div className={styles.section}>
						<h3 className={styles.sectionTitle}>{metricInfoPopupText.sectionTitles.whyItMatters}</h3>
						<p className={styles.sectionText}>{metricInfo.whyItMatters}</p>
					</div>
					
					<div className={styles.section}>
						<h3 className={styles.sectionTitle}>{metricInfoPopupText.sectionTitles.quickWin}</h3>
						<p className={styles.quickWin}>{metricInfo.quickWin}</p>
					</div>
					{/* Recommended Adjustments dont show exercise if lightIntensity is selected*/}
					{metricInfo.metricKey === 'lightIntensity' && metricInfo.recommendedAdjustments ? (
						<div className={styles.section}>
							<h3 className={styles.sectionTitle}>Recommended Adjustments</h3>
							<p className={styles.sectionText}>{metricInfo.recommendedAdjustments}</p>
						</div>
					) : (
						firstTwoExercises.length > 0 && (
							<div className={styles.section}>
								<h3 className={styles.sectionTitle}>Recommended Eye Exercises</h3>
								<p className={styles.sectionText}>Try these exercises to help improve your eye health:</p>
								<div className={styles.exercisesGrid}>
									{firstTwoExercises.map((exercise, index) => (
										<Card
											key={`${exercise.title}-${index}`}
											variant="text-bottom"
											title={exercise.title}
											image={exercise.image}
											onClick={() => handleExerciseClick(exercise)}
										/>
									))}
								</div>
							</div>
						)
					)}
				</div>
			</div>
			
			{/* Exercise Modal */}
			{isExerciseModalOpen && (
				<ExerciseModal
					isOpen={isExerciseModalOpen}
					onClose={handleCloseExerciseModal}
					exercise={selectedExercise}
					currentMetrics={metrics}
				/>
			)}
		</Dialog>
	);
};

export default MetricInfoPopup;