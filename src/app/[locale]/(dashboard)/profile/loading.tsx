import styles from '../loading.module.css';

export default function ProfileLoading() {
	return (
		<div className={styles.profileContainer}>
			<div className={styles.profileHeader}>
				<div className={`${styles.skeletonCircle} ${styles.skeletonAvatar}`}></div>
				<div className={styles.userInfo}>
					<div className={`${styles.skeleton} ${styles.skeletonName}`}></div>
					<div className={`${styles.skeleton} ${styles.skeletonEmail}`}></div>
				</div>
			</div>

			<div className={styles.sections}>
				<div className={styles.section}>
					<div className={`${styles.skeleton} ${styles.skeletonSectionTitle}`}></div>
					<div className={`${styles.skeletonCard} ${styles.skeletonSectionCard}`}></div>
				</div>
				<div className={styles.section}>
					<div className={`${styles.skeleton} ${styles.skeletonSectionTitle}`}></div>
					<div className={`${styles.skeletonCard} ${styles.skeletonSectionCardLarge}`}></div>
				</div>
				<div className={styles.section}>
					<div className={`${styles.skeleton} ${styles.skeletonSectionTitle}`}></div>
					<div className={`${styles.skeletonCard} ${styles.skeletonSectionCard}`}></div>
				</div>
			</div>
		</div>
	);
}
