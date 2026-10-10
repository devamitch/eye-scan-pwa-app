import specialistsLoadingStyles from './specialists-loading.module.css';
import loadingStyles from '../../../loading.module.css';

export default function SpecialistsLoading() {
	return (
		<div className={specialistsLoadingStyles.container}>
			{/* Header Skeleton */}
			<div
				className={`${loadingStyles.skeleton} ${loadingStyles.skeletonLargeTitle} ${loadingStyles.skeletonMb20}`}
			></div>

			{/* Categories Section Skeleton */}
			<div className={specialistsLoadingStyles.categoriesSection}>
				<div
					className={`${loadingStyles.skeleton} ${loadingStyles.skeletonSmallTitle} ${loadingStyles.skeletonMb15}`}
				></div>
				<div className={specialistsLoadingStyles.categoriesGrid}>
					{[...Array(6)].map((_, i) => (
						<div key={i} className={specialistsLoadingStyles.categoryCard}>
							<div
								className={`${loadingStyles.skeleton} ${loadingStyles.skeletonBrCircle} ${loadingStyles.skeletonW40px} ${loadingStyles.skeletonH40} ${loadingStyles.skeletonMb10}`}
								style={{ marginInline: 'auto' }}
							></div>
							<div
								className={`${loadingStyles.skeleton} ${loadingStyles.skeletonH16} ${loadingStyles.skeletonW100} ${loadingStyles.skeletonMb05}`}
							></div>
							<div
								className={`${loadingStyles.skeleton} ${loadingStyles.skeletonH14} ${loadingStyles.skeletonW40}`}
								style={{ marginInline: 'auto' }}
							></div>
						</div>
					))}
				</div>
			</div>

			{/* Search & Filters Skeleton */}
			<div className={specialistsLoadingStyles.searchSection}>
				<div className={specialistsLoadingStyles.searchBar}>
					<div
						className={`${loadingStyles.skeleton} ${loadingStyles.skeletonH56} ${loadingStyles.skeletonW100}`}
					></div>
				</div>

				<div className={specialistsLoadingStyles.filters}>
					{[...Array(2)].map((_, i) => (
						<div
							key={i}
							className={`${loadingStyles.skeleton} ${loadingStyles.skeletonH48} ${loadingStyles.skeletonW150} ${loadingStyles.skeletonBr12}`}
						></div>
					))}
				</div>

				<div
					className={`${loadingStyles.skeleton} ${loadingStyles.skeletonH20} ${loadingStyles.skeletonW140} ${loadingStyles.skeletonMt15}`}
				></div>
			</div>

			{/* Specialists Grid Skeleton */}
			<div className={specialistsLoadingStyles.specialistsGrid}>
				{[...Array(6)].map((_, i) => (
					<div
						key={i}
						className={`${specialistsLoadingStyles.specialistCard} ${loadingStyles.skeletonNoBorder} ${loadingStyles.skeletonTransparent}`}
					>
						{/* Card Image Skeleton */}
						<div
							className={`${loadingStyles.skeleton} ${loadingStyles.skeletonH220} ${loadingStyles.skeletonStaticBr20} ${loadingStyles.skeletonMb10}`}
						></div>

						{/* Specialist Info Skeleton */}
						<div className={specialistsLoadingStyles.specialistInfo}>
							<div
								className={`${loadingStyles.skeleton} ${loadingStyles.skeletonH16} ${loadingStyles.skeletonW60} ${loadingStyles.skeletonMb05}`}
							></div>
							<div
								className={`${loadingStyles.skeleton} ${loadingStyles.skeletonH20} ${loadingStyles.skeletonW100} ${loadingStyles.skeletonMb10}`}
							></div>
							<div
								className={`${loadingStyles.skeleton} ${loadingStyles.skeletonH16} ${loadingStyles.skeletonW140} ${loadingStyles.skeletonMb10}`}
							></div>

							<div
								className={`${loadingStyles.skeletonFlex} ${loadingStyles.skeletonMb15}`}
							>
								<div
									className={`${loadingStyles.skeleton} ${loadingStyles.skeletonH16} ${loadingStyles.skeletonW40}`}
								></div>
								<div
									className={`${loadingStyles.skeleton} ${loadingStyles.skeletonH16} ${loadingStyles.skeletonW80}`}
								></div>
							</div>

							<div className={loadingStyles.skeletonFlexBetween}>
								<div
									className={`${loadingStyles.skeleton} ${loadingStyles.skeletonH16} ${loadingStyles.skeletonW80}`}
								></div>
								<div
									className={`${loadingStyles.skeleton} ${loadingStyles.skeletonH20} ${loadingStyles.skeletonW60}`}
								></div>
							</div>
						</div>
					</div>
				))}
			</div>
		</div>
	);
}
