'use client';

import Card from '@/components/base/cards';
import { Button, IconButton } from '@/components/base/buttons';
import ExerciseModal from '@/components/icare/exercise-modal/exercise-modal';
import TitleHeader from '@/components/layout/Title/TitleHeader';
import { exerciseCategories } from '@/data/exercise-categories-data';
import { useExercises } from '@/hooks/use-excercise';
import { useEyeTrackingContext } from '@/provider/EyeTrackingProvider';
import { ExerciseCardData } from '@/types';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import styles from './exercise-category-page.module.css';
import { ChevronLeft, Eye } from 'lucide-react';

interface ExerciseCategoryPageClientProps {
	categoryId: string;
}

export default function ExerciseCategoryPageClient({ categoryId }: ExerciseCategoryPageClientProps) {
	const router = useRouter();
	const [selectedExercise, setSelectedExercise] = useState<ExerciseCardData | null>(null);
	const [isExerciseModalOpen, setIsExerciseModalOpen] = useState(false);
	const { metrics } = useEyeTrackingContext();

	// Find the category
	const category = exerciseCategories.find((cat) => cat.id === categoryId);

	// Fetch exercises by playlist ID
	const { data: exercises, isLoading } = useExercises(category?.playlistId);

	const handleExerciseClick = (exercise: ExerciseCardData) => {
		setSelectedExercise(exercise);
		setIsExerciseModalOpen(true);
	};

	const handleCloseExerciseModal = () => {
		setIsExerciseModalOpen(false);
		setSelectedExercise(null);
	};

	const handleBackClick = () => {
		router.push('/icare');
	};

	if (!category) {
		return (
			<div className={styles.container}>
				<div className={styles.errorMessage}>
					<h2>Category not found</h2>
					<Button onClick={handleBackClick} variant="primary">
						Back to iCare
					</Button>
				</div>
			</div>
		);
	}

	return (
		<div className={styles.container}>
            	<div className={styles.header}>
				<div className={styles.categoryInfo}>
					 <h2 className={styles.categoryTitle}>{category.title}</h2>
						<p>{category.description}</p>
						</div>
				<div />
			</div>

			{isLoading && (
				<div className={styles.loadingState}>
					<p>Loading exercises...</p>
				</div>
			)}

			<div className={styles.exercisesGrid}>
				{exercises?.map((exercise, index) => (
					<div key={`${exercise.title}-${index}`} className={styles.exerciseCard}>
						<Card
							variant="text-bottom"
							title={exercise.title}
							image={exercise.image}
							onClick={() => handleExerciseClick(exercise)}
						/>
					</div>
				))}
			</div>

			{!isLoading && exercises?.length === 0 && (
				<div className={styles.emptyState}>
					<div className={styles.emptyStateContent}>
						<Eye  size={120} color='var(--metricValue)' strokeWidth={1.5} />
						<h3 className={styles.comingSoonTitle}>{category.title} Exercises Coming Soon!</h3>
						<p className={styles.comingSoonText}>We're working on adding new exercises to this category. Check back soon!</p>
					</div>
				</div>
			)}

			{/* Exercise Modal */}
			{isExerciseModalOpen && (
				<ExerciseModal
					isOpen={isExerciseModalOpen}
					onClose={handleCloseExerciseModal}
					exercise={selectedExercise}
					currentMetrics={metrics}
				/>
			)}
		</div>
	);
}
