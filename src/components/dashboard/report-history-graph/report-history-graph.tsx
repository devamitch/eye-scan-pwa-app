'use client';
import { Button, IconButton } from '@/components/base/buttons';
import TitleHeader from '@/components/layout/Title/TitleHeader';
import { useEyeTrackingChart } from '@/hooks/use-report';
import useTranslationData from '@/hooks/use-translation-data';
import { Loader2, RefreshCcw } from 'lucide-react';
import { memo, useCallback, useMemo, useState } from 'react';
import styles from './report-history-graph.module.css';
import MetricChart from '../metric-cards/metric-card';
import ModalView from './modal-view/modal-view';
function ReportHistoryGraph() {
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [selectedReport, setSelectedReport] = useState<any>(null);
	const [timeFilter, setTimeFilter] = useState<'today' | 'week' | 'month' | 'year'>('today');
	const { reportHistoryText, dashboardPageText } = useTranslationData();
	const { chartData, isLoading, error, refetch, isRefetching, lastUpdated } =
		useEyeTrackingChart(timeFilter);
	const closeModal = useCallback(() => {
		setIsModalOpen(false);
		setSelectedReport(null);
	}, []);

	const handleTodayFilter = useCallback(() => setTimeFilter('today'), []);
	const handleWeekFilter = useCallback(() => setTimeFilter('week'), []);
	const handleMonthFilter = useCallback(() => setTimeFilter('month'), []);
	const handleYearFilter = useCallback(() => setTimeFilter('year'), []);

	return (
		<div className={styles.reportHistory} role="region" aria-label="Eye scan report history">
			<div className={styles.header}>
				<TitleHeader title={dashboardPageText.eyeScanReportTitle} />
			</div>

			<div className={styles.container}>
				<div className={styles.controlsContainer} role="toolbar" aria-label="Report filters and controls">
					<div className={styles.filterBadges} role="group" aria-label="Time period filters">
						<Button
							variant={timeFilter === 'today' ? 'secondary' : 'outline'}
							size="small"
							aria-label='today filter'
							onClick={handleTodayFilter}
						>
							{reportHistoryText.timeFilters.today}
						</Button>
						<Button
							variant={timeFilter === 'week' ? 'secondary' : 'outline'}
							size="small"
							aria-label='week filter'
							onClick={handleWeekFilter}
						>
							{reportHistoryText.timeFilters.week}
						</Button>
						<Button
							variant={timeFilter === 'month' ? 'secondary' : 'outline'}
							size="small"
							aria-label='month filter'
							onClick={handleMonthFilter}
						>
							{reportHistoryText.timeFilters.month}
						</Button>
						<Button
							variant={timeFilter === 'year' ? 'secondary' : 'outline'}
							aria-label='year filter'
							size="small"
							onClick={handleYearFilter}
						>
							{reportHistoryText.timeFilters.year}
						</Button>
					</div>
					
						<IconButton
							onClick={() => refetch()}
							variant="outline"
							size="small"
							disabled={isRefetching}
							icon={isRefetching || isLoading ? <Loader2 size={16} className={styles.spinner} /> : <RefreshCcw size={16} />}
							ariaLabel="Refresh"
						/>
					
				</div>

				{error ? (
					<div className={styles.errorContainer}>
						<span>Error loading charts: {error.message}</span>
						<Button onClick={() => refetch()} variant="outline" size="small">
							Retry
						</Button>
					</div>
				) : (
					<div className={styles.chartsGrid} role="group" aria-label="Eye health metric charts">
						<MetricChart
							title={reportHistoryText.chartTitles.blinkRate}
							dataKey="blinkRate"
							color="var(--lowValue)"
							data={chartData}
							lastUpdated={lastUpdated}
							reportHistoryText={reportHistoryText}
						/>
						<MetricChart
							title={reportHistoryText.chartTitles.overallHealth}
							dataKey="overallHealth"
							color="var(--modValue)"
							data={chartData}
							lastUpdated={lastUpdated}
							reportHistoryText={reportHistoryText}
						/>
						<MetricChart
							title={reportHistoryText.chartTitles.screenDistance}
							dataKey="distanceCm"
							color="var(--lightText)"
							data={chartData}
							lastUpdated={lastUpdated}
							reportHistoryText={reportHistoryText}
						/>

						<MetricChart
							title={reportHistoryText.chartTitles.screenTime}
							dataKey="screenTimeMinutes"
							color="var(--lightMetricValue)"
							data={chartData}
							lastUpdated={lastUpdated}
							reportHistoryText={reportHistoryText}
						/>
					</div>
				)}
			</div>

			<ModalView
				isModalOpen={isModalOpen}
				closeModal={closeModal}
				selectedReport={selectedReport}
			/>
		</div>
	);
}

export default memo(ReportHistoryGraph);
