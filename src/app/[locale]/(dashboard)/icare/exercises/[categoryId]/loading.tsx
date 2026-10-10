import styles from './exercises-loading.module.css';
import loadingStyles from '../../../loading.module.css';

export default function ExerciseCategoryLoading() {
	return (
		<div className={styles.categoryContainer}>
			{/* Header Skeleton */}
			<div className={styles.header}>
				<div
					className={`${loadingStyles.skeleton} ${loadingStyles.skeletonExtraLargeTitle} ${loadingStyles.skeletonMb10}`}
				></div>
				<div
					className={`${loadingStyles.skeleton} ${loadingStyles.skeletonH16} ${loadingStyles.skeletonW100} ${loadingStyles.skeletonMb05}`}
				></div>
				<div
					className={`${loadingStyles.skeleton} ${loadingStyles.skeletonH16} ${loadingStyles.skeletonW80}`}
				></div>
			</div>

			{/* Exercises Grid Skeleton (Text-Bottom Variant) */}
			<div className={styles.exercisesGrid}>
				{[...Array(8)].map((_, i) => (
					<div
						key={i}
						className={`${loadingStyles.skeletonCardBottom} ${loadingStyles.skeletonBr20}`}
					>
						{/* Background Image Skeleton (Fills card) */}
						<div
							className={`${loadingStyles.skeleton} ${loadingStyles.skeletonFull}`}
						></div>

						{/* Content Overlay Skeleton */}
						<div className={loadingStyles.skeletonCardOverlay}>
							<div
								className={`${loadingStyles.skeleton} ${loadingStyles.skeletonH16} ${loadingStyles.skeletonW70}`}
								// style={{ background: 'rgba(255,255,255,0.2)' }}
							></div>
						</div>
					</div>
				))}
			</div>
		</div>
	);
}
