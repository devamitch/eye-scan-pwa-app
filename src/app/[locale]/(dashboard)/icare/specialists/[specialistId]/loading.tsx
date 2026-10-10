import styles from './specialist-loading.module.css';
import loadingStyles from '../../../loading.module.css';

export default function SpecialistDetailLoading() {
	return (
		<div className={styles.container}>
			{/* Profile Header Skeleton */}
			<div className={styles.profileHeader}>
				<div className={`${loadingStyles.skeleton} ${styles.profileImage}`}></div>
				<div className={styles.profileInfo}>
					<div
						className={`${loadingStyles.skeleton} ${loadingStyles.skeletonH24} ${loadingStyles.skeletonW80} ${loadingStyles.skeletonMb10}`}
						style={{ borderRadius: '100px' }}
					></div>
					<div
						className={`${loadingStyles.skeleton} ${loadingStyles.skeletonH40} ${loadingStyles.skeletonW220} ${loadingStyles.skeletonMb10}`}
					></div>
					<div
						className={`${loadingStyles.skeleton} ${loadingStyles.skeletonH20} ${loadingStyles.skeletonW160} ${loadingStyles.skeletonMb15}`}
					></div>

					<div className={styles.stats}>
						<div
							className={`${loadingStyles.skeleton} ${loadingStyles.skeletonH24} ${loadingStyles.skeletonStaticBr12} ${loadingStyles.skeletonW60}`}
							style={{ width: '50px' }}
						></div>
						<div
							className={`${loadingStyles.skeleton} ${loadingStyles.skeletonH24} ${loadingStyles.skeletonStaticBr12} ${loadingStyles.skeletonW110}`}
						></div>
						<div
							className={`${loadingStyles.skeleton} ${loadingStyles.skeletonH24} ${loadingStyles.skeletonStaticBr12} ${loadingStyles.skeletonW150}`}
						></div>
					</div>

					<div
						className={`${loadingStyles.skeleton} ${loadingStyles.skeletonH28} ${loadingStyles.skeletonW180} ${loadingStyles.skeletonMt20} ${loadingStyles.skeletonStaticBr12}`}
					></div>
				</div>
			</div>

			<div className={styles.mainGrid}>
				{/* Left Column Skeleton */}
				<div className={styles.leftColumn}>
					{/* Biography Skeleton */}
					<div className={styles.section}>
						<div
							className={`${loadingStyles.skeleton} ${loadingStyles.skeletonH24} ${loadingStyles.skeletonW110} ${loadingStyles.skeletonMb15}`}
						></div>
						<div
							className={`${loadingStyles.skeleton} ${loadingStyles.skeletonH16} ${loadingStyles.skeletonW100} ${loadingStyles.skeletonMb05}`}
						></div>
						<div
							className={`${loadingStyles.skeleton} ${loadingStyles.skeletonH16} ${loadingStyles.skeletonW100} ${loadingStyles.skeletonMb05}`}
						></div>
						<div
							className={`${loadingStyles.skeleton} ${loadingStyles.skeletonH16} ${loadingStyles.skeletonW100} ${loadingStyles.skeletonMb05}`}
						></div>
						<div
							className={`${loadingStyles.skeleton} ${loadingStyles.skeletonH16} ${loadingStyles.skeletonW80} ${loadingStyles.skeletonMb05}`}
						></div>
					</div>

					{/* Expertise Skeleton */}
					<div className={styles.section}>
						<div
							className={`${loadingStyles.skeleton} ${loadingStyles.skeletonH24} ${loadingStyles.skeletonW150} ${loadingStyles.skeletonMb15}`}
						></div>
						<div className={styles.expertiseList}>
							{[...Array(6)].map((_, i) => (
								<div key={i} className={styles.expertiseItem}>
									<div
										className={`${loadingStyles.skeleton} ${loadingStyles.skeletonH20} ${loadingStyles.skeletonW20} ${loadingStyles.skeletonBrCircle}`}
									></div>
									<div
										className={`${loadingStyles.skeleton} ${loadingStyles.skeletonH16} ${loadingStyles.skeletonW100}`}
									></div>
								</div>
							))}
						</div>
					</div>

					{/* Availability Skeleton */}
					<div className={styles.section}>
						<div
							className={`${loadingStyles.skeleton} ${loadingStyles.skeletonH24} ${loadingStyles.skeletonW180} ${loadingStyles.skeletonMb15}`}
						></div>
						<div className={styles.availabilityList}>
							{[...Array(5)].map((_, i) => (
								<div key={i} className={styles.availabilityDay}>
									<div
										className={`${loadingStyles.skeleton} ${loadingStyles.skeletonH16} ${loadingStyles.skeletonW80}`}
									></div>
								</div>
							))}
						</div>
					</div>

					{/* Education Skeleton */}
					<div className={styles.section}>
						<div
							className={`${loadingStyles.skeleton} ${loadingStyles.skeletonH24} ${loadingStyles.skeletonW110} ${loadingStyles.skeletonMb15}`}
						></div>
						<div
							className={`${loadingStyles.skeleton} ${loadingStyles.skeletonH16} ${loadingStyles.skeletonW100}`}
						></div>
					</div>
				</div>

				{/* Right Column Skeleton */}
				<div className={styles.rightColumn}>
					{/* Booking Card Skeleton */}
					<div className={styles.bookingCard}>
						<div
							className={`${loadingStyles.skeleton} ${loadingStyles.skeletonH24} ${loadingStyles.skeletonW150} ${loadingStyles.skeletonMb20}`}
						></div>
						<div
							className={`${loadingStyles.skeleton} ${loadingStyles.skeletonH48} ${loadingStyles.skeletonW100} ${loadingStyles.skeletonMb10} ${loadingStyles.skeletonStaticBr12}`}
						></div>
						<div
							className={`${loadingStyles.skeleton} ${loadingStyles.skeletonH48} ${loadingStyles.skeletonW100} ${loadingStyles.skeletonStaticBr12}`}
						></div>
					</div>

					{/* Hospital Info Skeleton */}
					<div className={styles.sidebarCard}>
						<div
							className={`${loadingStyles.skeleton} ${loadingStyles.skeletonH24} ${loadingStyles.skeletonW180} ${loadingStyles.skeletonMb15}`}
						></div>
						<div className={styles.hospitalCard}>
							<div
								className={`${loadingStyles.skeleton} ${loadingStyles.skeletonH20} ${loadingStyles.skeletonW150} ${loadingStyles.skeletonMb05}`}
							></div>
							<div
								className={`${loadingStyles.skeleton} ${loadingStyles.skeletonH14} ${loadingStyles.skeletonW100} ${loadingStyles.skeletonMb10}`}
							></div>
							<div
								className={`${styles.mapContainer} ${loadingStyles.skeleton}`}
							></div>
							<div
								className={`${loadingStyles.skeleton} ${loadingStyles.skeletonH40} ${loadingStyles.skeletonW100} ${loadingStyles.skeletonMt15}`}
								style={{ borderRadius: '12px' }}
							></div>
						</div>
					</div>

					{/* Quick Info Skeleton */}
					<div className={styles.sidebarCard}>
						{[...Array(2)].map((_, i) => (
							<div key={i} className={styles.quickInfoItem}>
								{/* <div
									className={`${loadingStyles.skeleton} ${loadingStyles.skeletonH40} ${loadingStyles.skeletonW40} ${loadingStyles.skeletonBrCircle} ${loadingStyles.skeletonFlexShrink0}`}
								></div> */}
								<div style={{ flex: 1 }}>
									<div
										className={`${loadingStyles.skeleton} ${loadingStyles.skeletonH14} ${loadingStyles.skeletonW60} ${loadingStyles.skeletonMb05}`}
									></div>
									<div
										className={`${loadingStyles.skeleton} ${loadingStyles.skeletonH16} ${loadingStyles.skeletonW100}`}
									></div>
									{i === 0 && (
										<div className={styles.languagesList}>
											{[...Array(3)].map((_, j) => (
												<div
													key={j}
													className={`${loadingStyles.skeleton} ${loadingStyles.skeletonH24} ${loadingStyles.skeletonW50}`}
													style={{ borderRadius: '12px' }}
												></div>
											))}
										</div>
									)}
								</div>
							</div>
						))}
					</div>
				</div>
			</div>
		</div>
	);
}
