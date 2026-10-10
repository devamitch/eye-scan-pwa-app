import hospitalsLoadingStyles from './hospitals-loading.module.css';
import loadingStyles from '../../../loading.module.css';

export default function HospitalsLoading() {
	return (
		<div className={hospitalsLoadingStyles.container}>
			{/* Header Skeleton */}
			<div
				className={`${loadingStyles.skeleton} ${loadingStyles.skeletonLargeTitle} ${loadingStyles.skeletonMb20}`}
			></div>

			{/* Search & Filters Skeleton */}
			<div className={hospitalsLoadingStyles.searchSection}>
				<div className={hospitalsLoadingStyles.searchBar}>
					<div
						className={`${loadingStyles.skeleton} ${loadingStyles.skeletonH56} ${loadingStyles.skeletonW100}`}
						style={{ flex: 1 }}
					></div>
					<div
						className={`${loadingStyles.skeleton} ${loadingStyles.skeletonH56} ${loadingStyles.skeletonW120}`}
					></div>
				</div>

				<div className={hospitalsLoadingStyles.filters}>
					{[...Array(3)].map((_, i) => (
						<div
							key={i}
							className={`${loadingStyles.skeleton} ${loadingStyles.skeletonH48} ${loadingStyles.skeletonW150} ${loadingStyles.skeletonBr12}`}
						></div>
					))}
				</div>

				<div
					className={`${loadingStyles.skeleton} ${loadingStyles.skeletonH20} ${loadingStyles.skeletonW120} ${loadingStyles.skeletonMb10}`}
				></div>
			</div>

			{/* Hospitals Grid Skeleton */}
			<div className={hospitalsLoadingStyles.hospitalsGrid}>
				{[...Array(6)].map((_, i) => (
					<div
						key={i}
						className={`${hospitalsLoadingStyles.hospitalCard} ${loadingStyles.skeletonNoBorder} ${loadingStyles.skeletonTransparent}`}
					>
						{/* Card Image Skeleton */}
						<div
							className={`${loadingStyles.skeleton} ${loadingStyles.skeletonH220} ${loadingStyles.skeletonStaticBr20} ${loadingStyles.skeletonMb10}`}
						></div>

						{/* Hospital Info Skeleton */}
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
	);
}
