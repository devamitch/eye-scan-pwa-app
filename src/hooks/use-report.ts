import { filter_reports } from '@/lib/server/metrics';
import { useQuery } from '@tanstack/react-query';
import { useCallback, useRef } from 'react';
export type TimeFilter = 'today' | 'week' | 'month' | 'year';
export function useEyeTrackingChart(timeFilter: TimeFilter) {
	const lastUpdateRef = useRef<number>(Date.now());

const queryFn = useCallback(async () => {
		const result = await filter_reports({ filter: timeFilter });
		const data = result;
		const chartData = data.map((entry) => ({
			...entry,
			time: entry.time_bucket.replace(/'/g, ''),
			blinkRate: Math.round(entry.blinkRate),
			distanceCm:Math.round(entry.proximityScore),
			overallHealth: Math.round(entry.overallHealthScore),
			proximityScore: Math.round(entry.proximityScore),
			screenTimeMinutes: Math.round(entry.screenTimeMinutes),
		}));
		return chartData;
	}, [timeFilter]);

	const query = useQuery({
		queryKey: ['eyeTrackingSummary', timeFilter],
		queryFn,
		refetchInterval: (query) => {
			if (typeof document !== 'undefined' && document.visibilityState === 'visible') {
				return 60000;
			}
			return false;
		},
		refetchOnWindowFocus: true,
		refetchOnReconnect: true,
		refetchIntervalInBackground: false,
		staleTime: 1000 * 60, // Data considered fresh for 60s
		gcTime: 1000 * 60 * 5, // Garbage collect after 5 minutes
		retry: 2,
		notifyOnChangeProps: ['data', 'error', 'isLoading', 'isRefetching'],
	});

	return { chartData: query?.data || [], ...query, lastUpdated: lastUpdateRef.current };
}
