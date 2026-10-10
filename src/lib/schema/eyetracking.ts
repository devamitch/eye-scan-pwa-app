import { z } from 'zod';

export const EyeTrackingMetricsSchema = z.object({
	timestamp: z.string(),
	blinkRate: z.number(),
	perClose: z.number(),
	attentionFrac: z.number(),
	strainLevelIdx: z.union([z.literal(0), z.literal(1), z.literal(2)]),
	strainText: z.string(),
	tiredText: z.string(),
	attBinary: z.union([z.literal(0), z.literal(1)]),
	eyeAspectRatio: z.number(),
	pupilDilation: z.number(),
	squintIntensity: z.number(),
	eyeAge: z.number(),
	faceAge: z.number(),
});
export const startSessionResponseSchema = z.object({
	id: z.string(),
	start_time: z.string(),
	end_time: z.string().nullable(),
	duration_minutes: z.number(),
	user_id: z.string(),	
})
export const CreateMetricResponseSchema = z.object({
	status: z.number(),
	message: z.string(),
	data: z.array(z.string()),
});
export const EyeTrackingSummarySchema = z.object({
	interval: z.string()?.optional(),
	totalBlinks: z.number()?.optional(),
	totalAttention: z.number()?.optional(),
	averageStrain: z.number()?.optional(),
	maxEyeAge: z.number()?.optional(),
	//
	time_bucket: z.string(),
	blinkRate: z.number(),
	distanceCm: z.number(),
	overallHealthScore: z.number(),
	screenTimeMinutes: z.number(),
	proximityScore: z.any(),
});

export type EyeTrackingSummary = z.infer<typeof EyeTrackingSummarySchema>;
export type CreateMetricResponse = z.infer<typeof CreateMetricResponseSchema>;
export type EyeTrackingMetrics = z.infer<typeof EyeTrackingMetricsSchema>;
export type StartSessionResponse = z.infer<typeof startSessionResponseSchema>;
