import styles from './products-loading.module.css';
import loadingStyles from '../../../loading.module.css';

export default function ProductCategoryLoading() {
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
					className={`${loadingStyles.skeleton} ${loadingStyles.skeletonH16} ${loadingStyles.skeletonW80} ${loadingStyles.skeletonMb15}`}
				></div>
			</div>

			{/* Products Grid Skeleton (Text-Top Variant) */}
			<div className={styles.productsGrid}>
				{[...Array(8)].map((_, i) => (
					<div
						key={i}
						className={`${loadingStyles.skeletonCardTop} ${loadingStyles.skeletonBr20}`}
					>
						{/* Title Area Skeleton */}
						<div className={loadingStyles.skeletonP16}>
							<div
								className={`${loadingStyles.skeleton} ${loadingStyles.skeletonH16} ${loadingStyles.skeletonW70}`}
							></div>
						</div>

						{/* Image Area Skeleton */}
						<div
							className={`${loadingStyles.skeleton} ${loadingStyles.skeletonCardImageTop}`}
						></div>
					</div>
				))}
			</div>
		</div>
	);
}
