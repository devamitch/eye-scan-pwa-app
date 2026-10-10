'use client';
import { Button } from '@/components/base/buttons';
import useTranslationData from '@/hooks/use-translation-data';
import { useEyeTrackingContext } from '@/provider/EyeTrackingProvider';
import { Eye, PlayCircle } from 'lucide-react';
import { useCallback, useState } from 'react';
import styles from './livepage.module.css';
import EyeScanModal from '@/components/dashboard/eye-scan-modal/eye-scan-modal';

const LiveDashboard = () => {
	const {
		metrics,
		isActive,
	} = useEyeTrackingContext();

	const { livePageText } = useTranslationData();
	const [isEyeScanModalOpen, setIsEyeScanModalOpen] = useState(false);

	const handleOpenEyeScan = useCallback(() => {
		setIsEyeScanModalOpen(true);
	}, []);

	const handleCloseEyeScan = useCallback(() => {
		setIsEyeScanModalOpen(false);
	}, []);

	return (
		<div className={styles.container} style={{ flex: 1 }} role="main" aria-label="Live eye tracking dashboard">
			<div className={styles.heroSection} role="region" aria-label="Welcome section">
				<div className={styles.welcomeText}>
					{/* <h1>{livePageText.hero.title}</h1> */}
					<p>{livePageText.hero.subtitle}</p>
				</div>

				<div className={styles.eyeScanSection} role="region" aria-label="Eye scan controls">
					<div className={styles.scanPrompt}>
						<div className={styles.scanIcon} aria-hidden="true">
							<Eye size={48} />
						</div>
						<h3>{livePageText.eyeScan.title}</h3>
						<p>{livePageText.eyeScan.subtitle}</p>
						<Button
							onClick={handleOpenEyeScan}
							variant="primary"
							size="large"
							disabled={!isActive}
							leftIcon={<PlayCircle size={20} />}
							ariaLabel="Start eye scan"
						>
							{livePageText.eyeScan.startButton}
						</Button>
					</div>
				</div>
			</div>
			<EyeScanModal
				isOpen={isEyeScanModalOpen}
				onClose={handleCloseEyeScan}
				currentMetrics={metrics}
			/>
		</div>
	);
};

export default LiveDashboard;
