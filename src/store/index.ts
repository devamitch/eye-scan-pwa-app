// store/index.ts
import { create } from 'zustand';
import { createJSONStorage, devtools, persist } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';

// Import slices
import { deepMerge } from '@/utils/deepMerge';
import createApiSlice, { ApiSlice } from './slices/api.slice';
import createAuthSlice, { AuthSlice } from './slices/auth.slice';
import createCameraSlice, { type CameraSlice } from './slices/camera.slice';
import createEyeTrackingSlice, { type EyeTrackingSlice } from './slices/eye-tracking.slice';
import createNotificationSlice, { NotificationSlice } from './slices/notification.slice';
import createExerciseSlice, { ExerciseSlice } from './slices/exercise.slice';
import createScreenTimeSlice, { type ScreenTimeSlice } from './slices/screen-time.slice';
import createSocketSlice, { SocketSlice } from './slices/socket.slice';

// Combined store state
export type AppStoreState = ApiSlice &
	AuthSlice &
	CameraSlice &
	ScreenTimeSlice &
	EyeTrackingSlice &
	SocketSlice &
	NotificationSlice&
	ExerciseSlice;

export const useAppStore = create<AppStoreState>()(
	devtools(
		persist(
			immer((...a) => ({
				...createCameraSlice(...a),
				...createScreenTimeSlice(...a),
				...createEyeTrackingSlice(...a),
				...createAuthSlice(...a),
				...createApiSlice(...a),
				...createSocketSlice(...a),
				...createNotificationSlice(...a),
				...createExerciseSlice(...a),
			})),
			{
				name: 'a-eye-scan-storage',
				version: 2,
				storage: createJSONStorage(() => localStorage),
				merge: (persistedState, currentState) => deepMerge(currentState, persistedState),
				partialize: (state) => ({
					...state,
					camera: {
						...state.camera,
						isCameraActive: false,
						isTrackingActive: false,
						loading: false,
						cameraError: null,
						trackingError: null,
					},
					notification: {
						...state.notification,
						// Don't persist last notification times
						lastNotifications: {
							eyeStrain: null,
							screenDistance: null,
							battery: null,
							lighting: null,
							screenTime: null,
						},
					},
				}),
			}
		)
	)
);

export default useAppStore;
