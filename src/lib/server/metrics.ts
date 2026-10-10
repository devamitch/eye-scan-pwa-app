import { URLS } from '@/constants/urls';
import api from '../api';
import {
	CreateMetricResponse,
	EyeTrackingMetrics,
	EyeTrackingSummary,
	StartSessionResponse,
} from '../schema/eyetracking';

export const create_metrics = async (data: EyeTrackingMetrics | EyeTrackingMetrics[]) =>
	(
		await api.post<{ data: CreateMetricResponse }, EyeTrackingMetrics | EyeTrackingMetrics[]>(
			URLS.eyeMetrics,
			data
		)
	).data;

export const filter_reports = async (params: { filter: string }) => {
	const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

	const response = await api.get<EyeTrackingSummary[]>(URLS.timeFilter(params.filter), {
		params: {
			timezone, // e.g., "Asia/Kolkata"
		},
	});

	return response.data;
};

export const get_screentime_last_sixhours = async () => {
	const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

	const response = await api.get<{ screenTimeMinutes: number }>(URLS.screentimeLastSixhours, {
		params: {
			timezone, // e.g., "Asia/Kolkata"
		},
	});
	return response.data;
};
