import styles from './dashboard-loading.module.css';
import loadingStyles from '../loading.module.css';

export default function DashboardLoading() {
	return (
		<div className={styles.container}>
			{/* Eye Metrics Display Skeleton */}
			<div className={styles.streamSectionSkeleton}>
				<div
					className={`${styles.metricsPanelSkeleton} ${loadingStyles.skeletonTransparent}`}
				>
					<div className={styles.metricsLayout}>
						{/* Left Column - Desktop Only */}
						<div className={styles.leftMetricsSkeleton}>
							{[1, 2, 3, 4].map((i) => (
								<div key={i} className={styles.metricCardSkeleton}>
									<div className={loadingStyles.skeletonFlexBetween}>
										<div
											className={`${loadingStyles.skeleton} ${loadingStyles.skeletonW40} ${loadingStyles.skeletonH16}`}
										></div>
										<div
											className={`${loadingStyles.skeleton} ${loadingStyles.skeletonW24} ${loadingStyles.skeletonH24} ${loadingStyles.skeletonBrCircle}`}
										></div>
									</div>
									<div
										className={`${loadingStyles.skeleton} ${loadingStyles.skeletonW60} ${loadingStyles.skeletonH32} ${loadingStyles.skeletonMt10}`}
									></div>
								</div>
							))}
						</div>

						{/* Center Report Card - Full Width on Mobile, Center on Desktop */}
						<div className={styles.centerReportSkeleton}>
							<div
								className={`${styles.reportCardSkeleton} ${loadingStyles.skeleton}`}
							></div>
						</div>

						{/* Right Column - Desktop Only */}
						<div className={styles.rightMetricsSkeleton}>
							{[1, 2, 3, 4].map((i) => (
								<div key={i} className={styles.metricCardSkeleton}>
									<div className={loadingStyles.skeletonFlexBetween}>
										<div
											className={`${loadingStyles.skeleton} ${loadingStyles.skeletonW40} ${loadingStyles.skeletonH16}`}
										></div>
										<div
											className={`${loadingStyles.skeleton} ${loadingStyles.skeletonW24} ${loadingStyles.skeletonH24} ${loadingStyles.skeletonBrCircle}`}
										></div>
									</div>
									<div
										className={`${loadingStyles.skeleton} ${loadingStyles.skeletonW60} ${loadingStyles.skeletonH32} ${loadingStyles.skeletonMt10}`}
									></div>
								</div>
							))}
						</div>

						{/* Mobile Metrics Grid - Shown only on small screens via CSS */}
						<div className={styles.mobileMetricsGrid}>
							{[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
								<div key={i} className={styles.metricCardSkeleton}>
									<div
										className={`${loadingStyles.skeleton} ${loadingStyles.skeletonW60} ${loadingStyles.skeletonH14} ${loadingStyles.skeletonMb05}`}
									></div>
									<div
										className={`${loadingStyles.skeleton} ${loadingStyles.skeletonW80} ${loadingStyles.skeletonH24}`}
									></div>
								</div>
							))}
						</div>
					</div>
				</div>
			</div>

			{/* Report History Graph Skeleton */}
			<div className={styles.historySectionSkeleton}>
				<div
					className={`${loadingStyles.skeleton} ${loadingStyles.skeletonLargeTitle} ${loadingStyles.skeletonMb10}`}
				></div>

				<div className={loadingStyles.skeletonFlex} style={{ gap: '0.5rem' }}>
					{[1, 2, 3, 4].map((i) => (
						<div
							key={i}
							className={`${loadingStyles.skeleton} ${loadingStyles.skeletonH36} ${loadingStyles.skeletonW60} ${loadingStyles.skeletonBr12}`}
						></div>
					))}
				</div>

				<div className={styles.chartsGrid}>
					{[1, 2, 3, 4].map((i) => (
						<div
							key={i}
							className={`${styles.chartCardSkeleton} ${loadingStyles.skeleton}`}
						></div>
					))}
				</div>
			</div>
		</div>
	);
}
