import styles from '../loading.module.css';

export default function LiveLoading() {
	return (
		<div className={styles.liveContainer}>
			<div className={styles.liveHeroSkeleton}>
				{/* Welcome Text Skeleton */}
				<div
					className={styles.skeletonFlexColumn}
					style={{ alignItems: 'center', width: '100%' }}
				>
					<div
						className={`${styles.skeleton} ${styles.skeletonW60} ${styles.skeletonH20}`}
					></div>
				</div>

				{/* Eye Scan Section Skeleton */}
				<div className={styles.scanPromptSkeleton}>
					{/* Scan Icon Skeleton */}
					<div
						className={`${styles.skeleton} ${styles.skeletonCircle}`}
						style={{ width: '80px', height: '80px' }}
					></div>

					{/* Text Skeletons */}
					<div
						className={`${styles.skeleton} ${styles.skeletonW70} ${styles.skeletonH24}`}
					></div>
					<div
						className={`${styles.skeleton} ${styles.skeletonW80} ${styles.skeletonH16}`}
					></div>

					{/* Button Skeleton */}
					<div
						className={`${styles.skeleton} ${styles.skeletonW100} ${styles.skeletonH56} ${styles.skeletonBr12}`}
						style={{ maxWidth: '200px' }}
					></div>
				</div>
			</div>
		</div>
	);
}
