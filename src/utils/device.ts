export type DeviceType = 'iphone' | 'ipad' | 'android' | 'desktop';

declare global {
	interface NavigatorUAData {
		platform?: string;
	}

	interface Navigator {
		userAgentData?: NavigatorUAData;
	}
}

export function getDeviceType(): DeviceType {
	if (typeof navigator === 'undefined') return 'desktop';
	const ua = navigator.userAgent ?? '';
	const platform = navigator.userAgentData?.platform ?? '';
	
	const isIpadOS =
	  (platform === 'macOS' || /Mac OS X|Macintosh/i.test(ua)) &&
	  navigator.maxTouchPoints > 1;
	
	if (isIpadOS) return 'ipad';
	
	if (/iPad/i.test(ua)) return 'ipad';
	if (/iPhone|iPod/i.test(ua)) return 'iphone';
	if (/Android/i.test(ua)) return 'android';
	
	return 'desktop';
}

export interface EyeTrackingDeviceDefaults {
	baselineWidthPx: number;
	squintMaxOpen: number;
	squintMinOpen: number;
}

/**
 * Defaults tuned to prioritize iPhone front cameras, then Android/iPad, then desktop.
 */
export function getEyeTrackingDefaultsForDevice(deviceType: DeviceType): EyeTrackingDeviceDefaults {
	switch (deviceType) {
		case 'iphone':
			return {
				baselineWidthPx: 200,
				squintMaxOpen: 0.28,
				squintMinOpen: 0.10,
			};
		case 'android':
			return {
				baselineWidthPx: 190,
				squintMaxOpen: 0.30,
				squintMinOpen: 0.11,
			};
		case 'ipad':
			return {
				baselineWidthPx: 220,
				squintMaxOpen: 0.30,
				squintMinOpen: 0.11,
			};
		default:
			return {
				baselineWidthPx: 240,
				squintMaxOpen: 0.32,
				squintMinOpen: 0.12,
			};
	}
}

