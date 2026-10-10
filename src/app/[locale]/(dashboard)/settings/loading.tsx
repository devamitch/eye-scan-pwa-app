import styles from '../loading.module.css';

export default function SettingsLoading() {
	return (
		<div className={styles.settingsContainer}>
			<div className={`${styles.skeleton} ${styles.skeletonExtraLargeTitle}`}></div>

			{[1, 2, 3, 4, 5].map((i) => (
				<div key={i} className={styles.settingsSection}>
					<div className={`${styles.skeleton} ${styles.skeletonSmallTitle}`}></div>
					<div className={`${styles.skeletonRounded} ${styles.skeletonSectionContent}`}></div>
				</div>
			))}
		</div>
	);
}
