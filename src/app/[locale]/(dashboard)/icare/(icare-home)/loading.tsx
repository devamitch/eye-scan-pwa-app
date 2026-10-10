import styles from '../../loading.module.css';

export default function IcareLoading() {
	return (
		<div className={styles.loadingContainer}>
			{[1, 2, 3].map((section) => (
				<div key={section} className={styles.section}>
					<div className={`${styles.skeleton} ${styles.skeletonLargeTitle}`}></div>
					<div className={styles.scrollContainer}>
						{[1, 2, 3, 4].map((i) => (
							<div
								key={i}
								className={`${styles.skeletonCard} ${styles.skeletonCard}`}
							></div>
						))}
					</div>
				</div>
			))}
		</div>
	);
}
