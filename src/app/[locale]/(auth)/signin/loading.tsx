import styles from '../../(dashboard)/loading.module.css';
import authStyles from './signin.module.css';

export default function SignInLoading() {
	return (
		<div className={authStyles.container}>
			<div className={authStyles.welcomeContainer}>
				<div className={authStyles.textContainer}>
					<div className={`${styles.skeleton} ${styles.skeletonLargeTitle}`}></div>
					<div className={`${styles.skeleton} ${styles.skeletonDescription}`} style={{ height: '60px', width: '80%' }}></div>
					<div className={`${styles.skeleton}`} style={{ height: '20px', width: '60%' }}></div>
				</div>
				<div className={`${styles.skeleton}`} style={{ width: '100%', height: '100%', borderRadius: '12px 0 0 12px' }}></div>
			</div>
			<div className={authStyles.formContainer}>
				<div style={{ width: '100%', maxWidth: '400px', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
					<div className={`${styles.skeleton} ${styles.skeletonExtraLargeTitle}`}></div>
					<div className={`${styles.skeleton}`} style={{ height: '50px' }}></div>
					<div className={`${styles.skeleton}`} style={{ height: '50px' }}></div>
					<div className={`${styles.skeleton}`} style={{ height: '50px', borderRadius: '25px' }}></div>
					<div className={`${styles.skeleton}`} style={{ height: '20px', width: '70%', alignSelf: 'center' }}></div>
				</div>
			</div>
		</div>
	);
}
