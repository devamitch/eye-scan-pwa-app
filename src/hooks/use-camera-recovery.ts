import { useCallback, useRef } from 'react';

export interface CameraRecoveryHook {
  isRecovering: boolean;
  handleCameraDisconnection: (recoveryCallback: () => Promise<void>) => Promise<void>;
  monitorCameraHealth: (mediaStream: MediaStream | null, onDisconnect: () => Promise<void>) => void;
  cleanup: () => void;
}

export const useCameraRecovery = (isTrackingActive : boolean): CameraRecoveryHook => {
  const isRecoveringRef = useRef(false);
  const recoveryTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const healthCheckIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const handleCameraDisconnection = useCallback(async (recoveryCallback: () => Promise<void>) => {
    // if tracking inactive skip recovery
    if (!isTrackingActive) {
      return;
    }
    
    if (isRecoveringRef.current) {
      console.log('[Camera] Already recovering, skipping...');
      return;
    }

    isRecoveringRef.current = true;
    console.log('[Camera] 🔄 Starting camera recovery...');

    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      await recoveryCallback();
      console.log('[Camera] ✅ Camera recovered successfully');
    } catch (error) {
      console.error('[Camera] ❌ Recovery failed:', error);

      recoveryTimeoutRef.current = setTimeout(() => {
        console.log('[Camera] 🔄 Retrying recovery...');
        isRecoveringRef.current = false;
        handleCameraDisconnection(recoveryCallback);
      }, 3000);
    } finally {
      isRecoveringRef.current = false;
    }
  }, [isTrackingActive]);

  const monitorCameraHealth = useCallback((mediaStream: MediaStream | null, onDisconnect: () => Promise<void>) => {
    if (!mediaStream) return;

    const videoTrack = mediaStream.getVideoTracks()[0];
    if (!videoTrack) {
      console.warn('[Camera] No video track found');
      return;
    }

    if (videoTrack.readyState === 'ended' && isTrackingActive) {
      console.error('[Camera] Track ended - attempting recovery');
      handleCameraDisconnection(onDisconnect);
    }

    videoTrack.onended = () => {
      console.error('[Camera] Track ended event - attempting recovery');
      handleCameraDisconnection(onDisconnect);
    };
  }, [handleCameraDisconnection ,isTrackingActive]);

  const cleanup = useCallback(() => {
    if (recoveryTimeoutRef.current) {
      clearTimeout(recoveryTimeoutRef.current);
    }
    if (healthCheckIntervalRef.current) {
      clearInterval(healthCheckIntervalRef.current);
    }
  }, []);

  return {
    isRecovering: isRecoveringRef.current,
    handleCameraDisconnection,
    monitorCameraHealth,
    cleanup,
  };
};