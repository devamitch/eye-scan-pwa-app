import styles from './product-detail-loading.module.css';
import loadingStyles from '../../../../loading.module.css';

export default function ProductDetailLoading() {
	return (
		<div className={styles.container}>
			<div className={styles.productLayout}>
				{/* Left Section Skeleton */}
				<div className={styles.leftSection}>
					<div className={`${styles.imageContainer} ${loadingStyles.skeleton}`}></div>

					<div className={loadingStyles.skeletonFlexColumn}>
						<div
							className={`${loadingStyles.skeleton} ${loadingStyles.skeletonH56} ${loadingStyles.skeletonW100} ${loadingStyles.skeletonBr12}`}
						></div>
						<div
							className={`${loadingStyles.skeleton} ${loadingStyles.skeletonH56} ${loadingStyles.skeletonW100} ${loadingStyles.skeletonBr12}`}
						></div>
					</div>
				</div>

				{/* Right Section Skeleton */}
				<div className={styles.rightSection}>
					<div className={styles.header}>
						<div
							className={`${loadingStyles.skeleton} ${loadingStyles.skeletonH40} ${loadingStyles.skeletonW70}`}
						></div>
						<div
							className={`${loadingStyles.skeleton} ${loadingStyles.skeletonH20} ${loadingStyles.skeletonW100}`}
						></div>
						<div
							className={`${loadingStyles.skeleton} ${loadingStyles.skeletonH20} ${loadingStyles.skeletonW80}`}
						></div>
						<div
							className={`${loadingStyles.skeleton} ${loadingStyles.skeletonH24} ${loadingStyles.skeletonW40} ${loadingStyles.skeletonMb10}`}
						></div>
					</div>

					<div className={styles.detailsSection}>
						{[1, 2, 3].map((i) => (
							<div key={i} className={styles.detailCardSkeleton}>
								<div
									className={loadingStyles.skeletonFlex}
									style={{ alignItems: 'center' }}
								>
									<div
										className={`${loadingStyles.skeleton} ${loadingStyles.skeletonW24} ${loadingStyles.skeletonH24} ${loadingStyles.skeletonBrCircle}`}
									></div>
									<div
										className={`${loadingStyles.skeleton} ${loadingStyles.skeletonH20} ${loadingStyles.skeletonW30}`}
									></div>
								</div>
								<div className={loadingStyles.skeletonFlexColumn}>
									<div
										className={`${loadingStyles.skeleton} ${loadingStyles.skeletonH16} ${loadingStyles.skeletonW100}`}
									></div>
									<div
										className={`${loadingStyles.skeleton} ${loadingStyles.skeletonH16} ${loadingStyles.skeletonW80}`}
									></div>
								</div>
							</div>
						))}
					</div>
				</div>
			</div>
		</div>
	);
}
