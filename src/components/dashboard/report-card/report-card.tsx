'use client';
import useTranslationData from '@/hooks/use-translation-data';
import useAppStore from '@/store';
import { ClipboardCheck, Eye, Frown, Laugh, Meh } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import styles from './report-card.module.css';
import { describeArc } from '@/lib/utils/describe-arc';
import Image from 'next/image';
import { eyeicon } from '@/assets/Icons';

const ReportCard = () => {
	const eyeTracking = useAppStore?.((state) => state?.eyeTracking) || {};
	const currentMetrics = eyeTracking?.currentMetrics || {};
	const history = eyeTracking?.history || [];
	const selectedTimeframe = eyeTracking?.selectedTimeframe || 'daily';
	const selectedDate = eyeTracking?.selectedDate || null;
	const getMetricsForDate = eyeTracking?.getMetricsForDate || (() => ({}));
	const { reportCardText } = useTranslationData();
	const [batteryLevel, setBatteryLevel] = useState(0);
	const lastUpdateRef = useRef(0);

	// Get metrics for the selected date or use current metrics
	const getMetricsForDisplay = () => {
		if (selectedDate) {
			const dateMetrics = getMetricsForDate?.(selectedDate);
			if (dateMetrics.length > 0) {
				// Return the most recent metrics for the selected date
				return dateMetrics[dateMetrics.length - 1];
			}
		}

		// Fallback to most recent metrics for the selected timeframe
		const recentMetrics =
			history[selectedTimeframe]?.[history[selectedTimeframe].length - 1] || currentMetrics;
		return recentMetrics;
	};

	const displayMetrics = getMetricsForDisplay?.();

	// Use battery level from metrics
	const currentBatteryLevel = Math.round(displayMetrics?.batteryLevel ?? 100);

	useEffect(() => {
		const now = Date.now();
		if (now - lastUpdateRef.current >= 5000) {
			setBatteryLevel(currentBatteryLevel);
			lastUpdateRef.current = now;
		}
	}, [currentBatteryLevel]);

	const getProgressColor = () => {
		if (batteryLevel < 50) {
			return {
				emojiBg: 'var(--vHighValue)',
				statsBg: 'var(--vHighStatsBg)',
				color: 'var(--vHighValue)',
			};
		} else if (batteryLevel < 70) {
			return {
				emojiBg: 'var(--modValue)',
				statsBg: 'var(--modStatsBg)',
				color: 'var(--modValue)',
			};
		} else {
			return {
				emojiBg: 'var(--lowValue)',
				statsBg: 'var(--goodStatsBg)',
				color: 'var(--lowValue)',
			};
		}
	};

	const { emojiBg, statsBg, color } = getProgressColor();

	// Get the timestamp for display
	const getDisplayTimestamp = () => {
		if (selectedDate) {
			const dateMetrics = getMetricsForDate?.(selectedDate);
			if (dateMetrics.length > 0) {
				return new Date(dateMetrics[dateMetrics.length - 1].timestamp).toLocaleString(
					'en-US',
					{
						day: '2-digit',
						month: 'short',
						year: 'numeric',
						hour: '2-digit',
						minute: '2-digit',
						hour12: false,
					}
				);
			}
		}

		const data = history[selectedTimeframe];
		if (data && data.length > 0) {
			return new Date(data[data.length - 1].timestamp).toLocaleString('en-US', {
				day: '2-digit',
				month: 'short',
				year: 'numeric',
				hour: '2-digit',
				minute: '2-digit',
				hour12: false,
			});
		}
		return new Date().toLocaleString('en-US', {
			day: '2-digit',
			month: 'short',
			year: 'numeric',
			hour: '2-digit',
			minute: '2-digit',
			hour12: false,
		});
	};

	// Determine condition based on battery level
	const getCondition = () => {
		if (batteryLevel < 50) {
			return reportCardText.conditions.high;
		} else if (batteryLevel < 70) {
			return reportCardText.conditions.moderate;
		} else {
			return reportCardText.conditions.normal;
		}
	};

	// Get appropriate emoji based on battery level
	const getEmoji = () => {
		if (batteryLevel >= 70) return Laugh;
		if (batteryLevel >= 50) return Meh ;
		return Frown;
	};

	const EmojiIcon = getEmoji();

	// SVG Configuration
	const radius = 132.5; // (280 - 15) / 2
	const strokeWidth = 15;
	const cx = 140;
	const cy = 140;
	// Calculate end angle based on battery level (0-100% -> 0-180deg)
	const endAngle = (batteryLevel / 100) * 180;

	return (
		<div className={styles.card} role="article" aria-label="Eye health report card">
			<div>
				<div className={styles.header}>
					
						<div className={styles.title}>
						
							
								{reportCardText.title}
						
							
						</div>
						
						{/* <Image src={eyeicon} alt="Eye" width={24} height={24} /> */}
				</div>
				<p className={styles.conditionSection}>
					 {getCondition()}
				</p>
			</div>

			<div>
				<div
					className={styles.progressWrapper}
					style={
						{
							'--progress-color': emojiBg,
						} as React.CSSProperties & Record<string, string>
					}
					aria-label={`battery level progress: ${batteryLevel} percent`}
				>
					<svg width="280" height="140" viewBox="0 0 280 140">
						<defs>
							<linearGradient
								id="progressGradient"
								x1="0"
								y1="0"
								x2="0"
								y2="140"
								gradientUnits="userSpaceOnUse"
							>
								<stop offset="0%" stopColor={emojiBg} />
								<stop offset="100%" stopColor={emojiBg} stopOpacity={0} />
							</linearGradient>
						</defs>
						<path
							d={describeArc(cx, cy, radius, 0, endAngle)}
							fill="none"
							stroke="url(#progressGradient)"
							strokeWidth={strokeWidth}
							strokeLinecap="round"
						/>
					</svg>

					<div className={styles.emojiCircle}>
						<span className={styles.emoji} aria-hidden="true">
							<EmojiIcon />
						</span>
					</div>
				</div>

				<div className={styles.statsBox} style={{ background: statsBg }}>
					<div className={styles.statsRow}>
						<span className={styles.limitLabel} style={{ color: color }}>
							0%
						</span>
						<h2 className={styles.statsValue} style={{ color: color }}>
							{batteryLevel}%
						</h2>
						<span className={styles.limitLabel} style={{ color: color }}>
							100%
						</span>
					</div>
					<p className={styles.statsFooter} style={{ color: color }}>
						{reportCardText.statsFooter}
					</p>
				</div>
			</div>
		</div>
	);
};

export default ReportCard;
