import styles from '../loading.module.css';

export default function HistoryLoading() {
	return (
		<div className={styles.loadingContainer}>
			<div className={styles.header}>
				<div className={`${styles.skeleton} ${styles.skeletonLargeTitle}`}></div>
				<div className={styles.filters}>
					<div className={`${styles.skeletonRounded} ${styles.skeletonFilter}`}></div>
					<div className={`${styles.skeletonRounded} ${styles.skeletonFilter}`}></div>
					<div className={`${styles.skeletonRounded} ${styles.skeletonFilter}`}></div>
				</div>
			</div>

			<div className={`${styles.skeletonCard} ${styles.skeletonChart}`}></div>

			<div className={styles.table}>
				{[1, 2, 3, 4, 5].map((i) => (
					<div key={i} className={`${styles.skeletonRounded} ${styles.skeletonTableRow}`}></div>
				))}
			</div>
		</div>
	);
}
