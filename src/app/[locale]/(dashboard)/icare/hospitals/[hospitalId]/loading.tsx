import styles from './hospital-loading.module.css';
import loadingStyles from '../../../loading.module.css';

export default function HospitalDetailLoading() {
	return (
		<div className={styles.container}>
			{/* Hero Skeleton */}
			<div className={styles.hero}>
				<div className={`${loadingStyles.skeleton} ${loadingStyles.skeletonFull}`}></div>
				<div className={styles.heroOverlaySkeleton}>
					<div
						className={`${loadingStyles.skeleton} ${loadingStyles.skeletonH24} ${loadingStyles.skeletonStaticBr12} ${loadingStyles.skeletonMb10} ${loadingStyles.skeletonW110}`}
					></div>
					<div
						className={`${loadingStyles.skeleton} ${loadingStyles.skeletonHeroTitle} ${loadingStyles.skeletonMb05}`}
					></div>
					<div
						className={`${loadingStyles.skeleton} ${loadingStyles.skeletonHeroSubtitle} ${loadingStyles.skeletonMb15}`}
					></div>
					<div className={styles.heroStats}>
						<div
							className={`${loadingStyles.skeleton} ${loadingStyles.skeletonH24} ${loadingStyles.skeletonStaticBr12} ${loadingStyles.skeletonW60}`}
							style={{ width: '60px' }}
						></div>
						<div
							className={`${loadingStyles.skeleton} ${loadingStyles.skeletonH24} ${loadingStyles.skeletonStaticBr12} ${loadingStyles.skeletonW110}`}
						></div>
						<div
							className={`${loadingStyles.skeleton} ${loadingStyles.skeletonH24} ${loadingStyles.skeletonStaticBr12} ${loadingStyles.skeletonW110}`}
						></div>
					</div>
				</div>
			</div>

			<div className={styles.mainGrid}>
				{/* Left Column Skeleton */}
				<div className={styles.leftColumn}>
					{/* Description Skeleton */}
					<div className={styles.section}>
						<div
							className={`${loadingStyles.skeleton} ${loadingStyles.skeletonH24} ${loadingStyles.skeletonW110} ${loadingStyles.skeletonMb10}`}
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

					{/* Specialties Skeleton */}
					<div className={styles.section}>
						<div
							className={`${loadingStyles.skeleton} ${loadingStyles.skeletonH24} ${loadingStyles.skeletonW150} ${loadingStyles.skeletonMb10}`}
						></div>
						<div className={styles.specialtiesList}>
							{[...Array(5)].map((_, i) => (
								<div
									key={i}
									className={`${loadingStyles.skeleton} ${loadingStyles.skeletonH36} ${loadingStyles.skeletonW100px}`}
									style={{ borderRadius: '100px' }}
								></div>
							))}
						</div>
					</div>

					{/* Services Skeleton */}
					<div className={styles.section}>
						<div
							className={`${loadingStyles.skeleton} ${loadingStyles.skeletonH24} ${loadingStyles.skeletonW150} ${loadingStyles.skeletonMb10}`}
						></div>
						<div className={styles.servicesGrid}>
							{[...Array(6)].map((_, i) => (
								<div key={i} className={styles.serviceItem}>
									<div
										className={`${loadingStyles.skeleton} ${loadingStyles.skeletonH24} ${loadingStyles.skeletonW24} ${loadingStyles.skeletonBr12}`}
									></div>
									<div
										className={`${loadingStyles.skeleton} ${loadingStyles.skeletonH16} ${loadingStyles.skeletonW100}`}
									></div>
								</div>
							))}
						</div>
					</div>

					{/* Specialists Skeleton */}
					<div className={styles.section}>
						<div
							className={`${loadingStyles.skeleton} ${loadingStyles.skeletonH24} ${loadingStyles.skeletonW150} ${loadingStyles.skeletonMb15}`}
						></div>
						<div className={styles.specialistsGrid}>
							{[...Array(3)].map((_, i) => (
								<div
									key={i}
									className={`${styles.specialistCardWrapper} ${loadingStyles.skeletonNoBorder} ${loadingStyles.skeletonTransparent}`}
								>
									{/* Card Image Skeleton */}
									<div
										className={`${loadingStyles.skeleton} ${loadingStyles.skeletonH220} ${loadingStyles.skeletonStaticBr20} ${loadingStyles.skeletonMb10}`}
									></div>

									{/* Info Skeleton */}
									<div className={loadingStyles.skeletonHospitalInfo}>
										<div
											className={`${loadingStyles.skeleton} ${loadingStyles.skeletonH24} ${loadingStyles.skeletonW80} ${loadingStyles.skeletonMb05}`}
										></div>
										<div
											className={`${loadingStyles.skeleton} ${loadingStyles.skeletonH20} ${loadingStyles.skeletonW60} ${loadingStyles.skeletonMb10}`}
										></div>

										<div
											className={`${loadingStyles.skeletonFlex} ${loadingStyles.skeletonMb10}`}
										>
											<div
												className={`${loadingStyles.skeleton} ${loadingStyles.skeletonH20} ${loadingStyles.skeletonW20}`}
											></div>
											<div
												className={`${loadingStyles.skeleton} ${loadingStyles.skeletonH20} ${loadingStyles.skeletonW30}`}
											></div>
											<div
												className={`${loadingStyles.skeleton} ${loadingStyles.skeletonH20} ${loadingStyles.skeletonW30}`}
											></div>
										</div>

										<div className={loadingStyles.skeletonFlex}>
											<div
												className={`${loadingStyles.skeleton} ${loadingStyles.skeletonH24} ${loadingStyles.skeletonStaticBr12} ${loadingStyles.skeletonW80}`}
											></div>
											<div
												className={`${loadingStyles.skeleton} ${loadingStyles.skeletonH24} ${loadingStyles.skeletonStaticBr12} ${loadingStyles.skeletonW110}`}
											></div>
										</div>
									</div>
								</div>
							))}
						</div>
					</div>
				</div>

				{/* Right Column Skeleton */}
				<div className={styles.rightColumn}>
					{/* Booking Card Skeleton */}
					<div className={styles.bookingCard}>
						<div
							className={`${loadingStyles.skeleton} ${loadingStyles.skeletonH24} ${loadingStyles.skeletonW150} ${loadingStyles.skeletonMb15}`}
						></div>
						<div className={styles.ctaButtons}>
							<div
								className={`${loadingStyles.skeleton} ${loadingStyles.skeletonH48} ${loadingStyles.skeletonStaticBr12} ${loadingStyles.skeletonW100} ${loadingStyles.skeletonMb10}`}
							></div>
							<div
								className={`${loadingStyles.skeleton} ${loadingStyles.skeletonH48} ${loadingStyles.skeletonStaticBr12} ${loadingStyles.skeletonW100}`}
							></div>
						</div>
					</div>

					{/* Quick Info Skeleton */}
					<div className={styles.sidebarCard}>
						{[...Array(3)].map((_, i) => (
							<div
								key={i}
								className={`${styles.quickInfoItem} ${loadingStyles.skeletonMbListItem}`}
							>
								<div
									className={`${loadingStyles.skeleton} ${loadingStyles.skeletonBrCircle} ${loadingStyles.skeletonW40px} ${loadingStyles.skeletonH40} ${loadingStyles.skeletonFlexShrink0}`}
								></div>
								<div className={loadingStyles.skeletonW100}>
									<div
										className={`${loadingStyles.skeleton} ${loadingStyles.skeletonH14} ${loadingStyles.skeletonW60} ${loadingStyles.skeletonMb05}`}
									></div>
									<div
										className={`${loadingStyles.skeleton} ${loadingStyles.skeletonH16} ${loadingStyles.skeletonW120}`}
									></div>
								</div>
							</div>
						))}
					</div>

					{/* Map Location Skeleton */}
					<div className={`${styles.mapContainer} ${loadingStyles.skeleton}`}></div>
				</div>
			</div>
		</div>
	);
}
