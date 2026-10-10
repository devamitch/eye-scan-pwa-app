'use client';

import { useEyeTrackingContext } from '@/provider/EyeTrackingProvider';
import { withLazyLoad } from '@/provider/LazyLoad';
import styles from './dashboard.module.scss';

import ReportHistoryGraph from '@/components/dashboard/report-history-graph/report-history-graph';
import EyeMetricsDisplay from '@/components/dashboard/eyetracking/eye-metric-display/eye-metrics-display';



export default function DashboardPage() {
	const { metrics } = useEyeTrackingContext();

	return (
		<div className={styles.container} role="main" aria-label="Dashboard">
			<div
				className={styles.streamSection}
				role="region"
				aria-label="Real-time eye tracking metrics"
			>
				{metrics && (
					<EyeMetricsDisplay metrics={metrics} className={styles.metricsPanel} />
				)}
			</div>
			<ReportHistoryGraph />
		</div>
	);
}
