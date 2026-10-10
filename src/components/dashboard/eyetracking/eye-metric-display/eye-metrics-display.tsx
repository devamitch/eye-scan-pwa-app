'use client';

import useTranslationData from '@/hooks/use-translation-data';
import { AlertTriangle, Droplets, Eye, MapPin, ScanEye, Sun, Zap } from 'lucide-react';
import { useTranslations } from 'next-intl';
import React, { useEffect, useState } from 'react';
import styles from './eye-metrics-display.module.css';
import MetricInfoPopup from './metric-info-popup';
import ReportCard from '../../report-card/report-card';
import ProductivityHealth from '../../productivity-health/productivity-health';
import Image from 'next/image';
import { alerticon, eyeblink, eyeicon } from '@/assets/Icons';
import useAppStore from '@/store';

interface EyeMetricsDisplayProps {
	metrics: EyeMetrics;
	className?: string;
	faceAge?: number;
	eyeAge?: number;
}

const MetricCard: React.FC<{
	icon: React.ReactNode;
	labelKey: string;
	metricKey: string;
	value: string | number;
	recommendedValue: string;
	status?: string;
	isNew?: boolean;
	onClick: (metricKey: string) => void;
	t: any;
}> = ({ icon, labelKey, metricKey, value, recommendedValue, status, onClick, t }) => (
	<div
		className={`${styles.metricCard} ${styles.clickable}`}
		onClick={() => onClick(metricKey)}
		role="button"
		tabIndex={0}
		aria-label={`View details for ${t(`eyeMetrics.labels.${labelKey}`)}`}
		onKeyDown={(e) => {
			if (e.key === 'Enter' || e.key === ' ') {
				onClick(metricKey);
			}
		}}
	>
		<div className={styles.cardHeader}>
			<div className={styles.headerText}>
				<span className={styles.metricLabel}>{t(`eyeMetrics.labels.${labelKey}`)}</span>
				<span className={styles.recommendedValue}>{recommendedValue}</span>
			</div>
			<div className={styles.cardIcon} aria-hidden="true">
				{icon}
			</div>
		</div>
		<div className={styles.metricValue} data-status={status}>
			{value}
		</div>
	</div>
);

const EyeMetricsDisplay: React.FC<EyeMetricsDisplayProps> = ({ metrics, className = '' }) => {
	const [showPopup, setShowPopup] = useState(false);
	const [selectedMetric, setSelectedMetric] = useState<any>(null);
	const { eyeMetricsDisplayText } = useTranslationData();
	const t = useTranslations();
	const userAge = useAppStore((state) => state.auth.user?.age);

	const getMetricInfoData = (metricKey: string) => {
		return {
			metricKey,
			title: t(`metricInfoData.${metricKey}.title`),
			description: t(`metricInfoData.${metricKey}.description`),
			healthy: t(`metricInfoData.${metricKey}.healthy`),
			whyItMatters: t(`metricInfoData.${metricKey}.whyItMatters`),
			quickWin: t(`metricInfoData.${metricKey}.quickWin`),
			recommendedAdjustments: t(`metricInfoData.${metricKey}.recommendedAdjustments`, { defaultValue: '' }),
		};
	};

	const getStatus = (value: number, type: string) => {
		switch (type) {
			case 'blinkRate':
				return value < 10
					? t.raw('strainLevels.high')
					: value < 15
						? t.raw('strainLevels.moderate')
						: t.raw('strainLevels.low');
			case 'perClose':
				return value > 40
					? t.raw('strainLevels.veryHigh')
					: value > 20
						? t.raw('strainLevels.high')
						: value > 5
							? t.raw('strainLevels.moderate')
							: t.raw('strainLevels.low');
			case 'strain':
				return metrics.strainText.toLowerCase();
			case 'tiredness':
				return metrics.tiredText.toLowerCase().replace(' ', '-');
			default:
				return t.raw('strainLevels.low');
		}
	};

	// Helper function to get recommended value status for blink rate
	// blinkrate: 15-25 normal, <15 suboptimal, >25 optimal
	const getBlinkRateStatus = (value: number): string => {
		if (value >= 15 && value <= 25) return t.raw('eyeMetrics.recommendedValueStatus.normal');
		if (value < 15) return t.raw('eyeMetrics.recommendedValueStatus.suboptimal');
		return t.raw('eyeMetrics.recommendedValueStatus.optimal');
	};

	// Helper function to get recommended value status for screen distance
	// screen distance: 30-45 normal, <30 suboptimal, >45 optimal
	const getScreenDistanceStatus = (value: number): string => {
		if (value >= 30 && value <= 45) return t.raw('eyeMetrics.recommendedValueStatus.normal');
		if (value < 30) return t.raw('eyeMetrics.recommendedValueStatus.suboptimal');
		return t.raw('eyeMetrics.recommendedValueStatus.optimal');
	};

	// Helper function to get recommended value status for squint intensity
	// squint intensity: 8-15 normal, >15 optimal, <8 suboptimal
	const getSquintIntensityStatus = (value: number): string => {
		if (value >= 8 && value <= 15) return t.raw('eyeMetrics.recommendedValueStatus.normal');
		if (value < 8) return t.raw('eyeMetrics.recommendedValueStatus.optimal');
		return t.raw('eyeMetrics.recommendedValueStatus.suboptimal');
	};
	const getStrainText = (text: string) => {
		if (text === 'Low') {
			return t.raw('strainLevels.low');
		} else if (text === 'Moderate') {
			return t.raw('strainLevels.moderate');
		} else if (text === 'High') {
			return t.raw('strainLevels.high');
		} else if (text === 'Very High') {
			return t.raw('strainLevels.veryHigh');
		} else {
			return text;
		}
	};
	const getBatteryStatus = (level: number) => {
		if (level <= 20) {
			return { text: t.raw('strainLevels.high'), status: 'high' };
		}
		if (level <= 50) {
			return { text: t.raw('strainLevels.moderate'), status: 'moderate' };
		}
		return { text: t.raw('strainLevels.low'), status: 'low' };
	};

	const getDrynessLevel = (score: number) => {
		if (score < 0) {
			const text = t.raw('strainLevels.high');
			return { text, status: text.toLowerCase().replace(' ', '-') };
		}
		if (score <= 0.5) {
			const text = t.raw('strainLevels.moderate');
			return { text, status: text.toLowerCase().replace(' ', '-') };
		}
		const text = t.raw('strainLevels.low');
		return { text, status: text.toLowerCase().replace(' ', '-') };
	};

	const getRednessLevel = (score: number) => {
		if (score < 0.4) {
			const text = t.raw('strainLevels.high');
			return { text, status: text.toLowerCase().replace(' ', '-') };
		}
		if (score <= 0.6) {
			const text = t.raw('strainLevels.moderate');
			return { text, status: text.toLowerCase().replace(' ', '-') };
		}
		const text = t.raw('strainLevels.low');
		return { text, status: text.toLowerCase().replace(' ', '-') };
	};

	// const getDarkCircleLevel = (score: number) => {
	// 	if (score < 0.3) {
	// 		const text = t.raw('strainLevels.low');
	// 		return { text, status: text.toLowerCase().replace(' ', '-') };
	// 	}
	// 	if (score <= 0.6) {
	// 		const text = t.raw('strainLevels.moderate');
	// 		return { text, status: text.toLowerCase().replace(' ', '-') };
	// 	}
	// 	const text = t.raw('strainLevels.high');
	// 	return { text, status: text.toLowerCase().replace(' ', '-') };
	// };
	const getLightIntensityLevel = (intensity: number) => {
		if (intensity < 100) {
			const text = t.raw('strainLevels.low');
			return { text, status: 'light-low' };
		}
		if (intensity >= 100 && intensity <= 500) {
			const text = t.raw('strainLevels.moderate');
			return { text, status: 'light-moderate' };
		}
		const text = t.raw('strainLevels.high');
		return { text, status: 'light-high' };
	};

	const handleMetricClick = (metricKey: string) => {
		const info = getMetricInfoData(metricKey);
		setSelectedMetric(info);
		setShowPopup(true);
	};

	const leftMetrics = [
		{
			icon: <Image src={eyeicon} alt="Eye" width={36} height={36} />,
			labelKey: 'eyeAge',
			metricKey: 'eyeAge',
			value: !userAge ? '-' : (metrics.eyeAge != null ? `${(metrics.eyeAge).toFixed(0)} ${eyeMetricsDisplayText.units.years}` : '-'),
			recommendedValue: eyeMetricsDisplayText.recommendedValues.eyeAge,
			status: 'low',
		},
		{
			icon: <Image src={eyeblink} alt="Eye" width={36} height={36} />,
			labelKey: 'blinkRate',
			metricKey: 'blinkRate',
			value: metrics.blinkRate.toFixed(1),
			recommendedValue: getBlinkRateStatus(metrics.blinkRate),
			status: getStatus(metrics.blinkRate, 'blinkRate'),
		},
		{
			icon: <Image src={eyeblink} alt="Eye" width={36} height={36} />,
			labelKey: 'squintIntensity',
			metricKey: 'squintIntensity',
			value: `${metrics.squintIntensity.toFixed(1)} %`,
			recommendedValue: getSquintIntensityStatus(metrics.squintIntensity),
			status: metrics.squintIntensity > 0 ? t.raw('strainLevels.low') : t.raw('strainLevels.high'),

		},
		{
			icon: <MapPin size={36} />,
			labelKey: 'proximityScore',
			metricKey: 'screenDistance',
			value: `${metrics.proximityScore ? (metrics.proximityScore > 0 ? `${metrics.proximityScore.toFixed(0)} cm` : 'Too Close') : 'Too Close'}`,
			recommendedValue: getScreenDistanceStatus(metrics.proximityScore) ,
			status:
				(metrics.proximityScore || 0) > 0.5
					? t.raw('strainLevels.high')
					: t.raw('strainLevels.low'),
		},
	];

	const rightMetrics = [
		{
			icon: <Image src={alerticon} alt="Eye" width={36} height={36} />,
			labelKey: 'eyeStrain',
			metricKey: 'eyeStrain',
			value: getStrainText(metrics.strainText),
				recommendedValue: eyeMetricsDisplayText.recommendedValues.eyeAge,
			status: getStatus(0, 'strain'),
		},
		{
			icon: <Image src={alerticon} alt="Eye" width={36} height={36} />,
			labelKey: 'rednessScore',
			metricKey: 'rednessScore',
			value: getRednessLevel(metrics.rednessScore || 0).text,
				recommendedValue: eyeMetricsDisplayText.recommendedValues.eyeAge,
			status: getRednessLevel(metrics.rednessScore || 0).status,
		},
		{
			icon: <Droplets size={36} />,
			labelKey: 'drynessScore',
			metricKey: 'drynessScore',
			value: getDrynessLevel(metrics.drynessScore || 0).text,
				recommendedValue: eyeMetricsDisplayText.recommendedValues.eyeAge,
			status: getDrynessLevel(metrics.drynessScore || 0).status,
		},

		// {
		// 	icon: <Zap size={36} />,
		// 	labelKey: 'darkCircleScore',
		// 	metricKey: 'darkCircleScore',
		// 	value: getDarkCircleLevel(metrics.darkCircleScore || 0).text,
		// 	recommendedValue: eyeMetricsDisplayText.recommendedValues.darkcircleScore,
		// 	status: getDarkCircleLevel(metrics.darkCircleScore || 0).status,
		// },
		{
			icon: <Sun size={36} />,
			labelKey: 'lightIntensity',
			metricKey: 'lightIntensity',
			value: getLightIntensityLevel(metrics.lightIntensity ?? 0).text,
			recommendedValue: eyeMetricsDisplayText.recommendedValues.lightIntensity,
			status: getLightIntensityLevel(metrics.lightIntensity ?? 0).status,
		},
	];

	const allMetrics = [
		{
			icon: <Image src={eyeicon} alt="Eye" width={36} height={36} />,
			labelKey: 'eyeAge',
			metricKey: 'eyeAge',
			value: !userAge ? '-' : (metrics.eyeAge != null ? `${(metrics.eyeAge).toFixed(0)} ${eyeMetricsDisplayText.units.years}` : '-'),
			recommendedValue: eyeMetricsDisplayText.recommendedValues.eyeAge,
			status: 'low',
		},
		{
			icon: <Image src={alerticon} alt="Eye" width={36} height={36} />,
			labelKey: 'eyeStrain',
			metricKey: 'eyeStrain',
			value: getStrainText(metrics.strainText),
				recommendedValue: eyeMetricsDisplayText.recommendedValues.eyeAge,
			status: getStatus(0, 'strain'),
		},
		{
			icon: <Image src={eyeblink} alt="Eye" width={36} height={36} />,
			labelKey: 'blinkRate',
			metricKey: 'blinkRate',
			value: metrics.blinkRate.toFixed(1),
			recommendedValue: getBlinkRateStatus(metrics.blinkRate),
			status: getStatus(metrics.blinkRate, 'blinkRate'),
		},
		{
			icon: <Image src={alerticon} alt="Eye" width={36} height={36} />,
			labelKey: 'rednessScore',
			metricKey: 'rednessScore',
			value: getRednessLevel(metrics.rednessScore || 0).text,
			recommendedValue: eyeMetricsDisplayText.recommendedValues.eyeAge,
			status: getRednessLevel(metrics.rednessScore || 0).status,
		},

		{
			icon: <Image src={eyeblink} alt="Eye" width={36} height={36} />,
			labelKey: 'squintIntensity',
			metricKey: 'squintIntensity',
			value: `${metrics.squintIntensity.toFixed(1)} %`,
			recommendedValue: getSquintIntensityStatus(metrics.squintIntensity),
			status:
				metrics.squintIntensity < 20
					? t.raw('strainLevels.low')
					: t.raw('strainLevels.high'),
		},

		{
			icon: <Droplets size={36} />,
			labelKey: 'drynessScore',
			metricKey: 'drynessScore',
			value: getDrynessLevel(metrics.drynessScore || 0).text,
				recommendedValue: eyeMetricsDisplayText.recommendedValues.eyeAge,
			status: getDrynessLevel(metrics.drynessScore || 0).status,
		},
		{
			icon: <MapPin size={36} />,
			labelKey: 'proximityScore',
			metricKey: 'screenDistance',
			value: `${metrics.proximityScore ? (metrics.proximityScore > 0 ? `${metrics.proximityScore.toFixed(0)} cm` : 'Too Close') : 'Too Close'}`,
			recommendedValue: getScreenDistanceStatus(metrics.proximityScore) ,
			status:
				(metrics.proximityScore || 0) > 0.5
					? t.raw('strainLevels.high')
					: t.raw('strainLevels.low'),
		},

		// {
		// 	icon: <Zap size={36} />,
		// 	labelKey: 'darkCircleScore',
		// 	metricKey: 'darkCircleScore',
		// 	value: getDarkCircleLevel(metrics.darkCircleScore || 0).text,
		// 	recommendedValue: eyeMetricsDisplayText.recommendedValues.darkcircleScore,
		// 	status: getDarkCircleLevel(metrics.darkCircleScore || 0).status,
		// },
		{
			icon: <Sun size={36} />,
			labelKey: 'lightIntensity',
			metricKey: 'lightIntensity',
			value: getLightIntensityLevel(metrics.lightIntensity ?? 0).text,
			recommendedValue: eyeMetricsDisplayText.recommendedValues.lightIntensity,
			status: getLightIntensityLevel(metrics.lightIntensity ?? 0).status,
		},
	];

	return (
		<div
			className={`${styles.container} ${className}`}
			role="region"
			aria-label="Eye health metrics dashboard"
		>
			<div className={styles.metricsLayout}>
				<div className={styles.leftMetrics} role="group" aria-label="Primary eye metrics">
					{leftMetrics.map((metric, index) => (
						<MetricCard
							key={metric.metricKey}
							icon={metric.icon}
							labelKey={metric.labelKey}
							metricKey={metric.metricKey}
							value={metric.value}
							recommendedValue={metric.recommendedValue}
							status={metric.status}
							onClick={handleMetricClick}
							t={t}
						/>
					))}
				</div>

				<div
					className={styles.centerReport}
					role="region"
					aria-label="Eye health report summary"
				>
					<ReportCard />
					{/* <ProductivityHealth /> */}
				</div>
				<div
					className={styles.rightMetrics}
					role="group"
					aria-label="Secondary eye metrics"
				>
					{rightMetrics.map((metric, index) => (
						<MetricCard
							key={metric.metricKey}
							icon={metric.icon}
							labelKey={metric.labelKey}
							metricKey={metric.metricKey}
							value={metric.value}
							recommendedValue={metric.recommendedValue}
							status={metric.status}
							onClick={handleMetricClick}
							t={t}
						/>
					))}
				</div>
				<div className={styles.metrics} role="group" aria-label="All eye health metrics">
					{allMetrics.map((metric) => (
						<MetricCard
							key={metric.metricKey}
							icon={metric.icon}
							labelKey={metric.labelKey}
							metricKey={metric.metricKey}
							value={metric.value}
							recommendedValue={metric.recommendedValue}
							status={metric.status}
							onClick={handleMetricClick}
							t={t}
						/>
					))}
				</div>
			</div>
			<MetricInfoPopup
				isOpen={showPopup}
				onClose={() => setShowPopup(false)}
				metricInfo={selectedMetric}
			/>
		</div>
	);
};

export default EyeMetricsDisplay;
