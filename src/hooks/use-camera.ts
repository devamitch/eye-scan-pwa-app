import { useCallback, useRef, useState } from 'react';
import { useBackgroundTracking } from './useBackgroundTracking';
import { EYE_TRACKING_CONSTANTS } from '@/constants/eye-tracking';

export interface CameraOptions {
  width?: { ideal: number };
  height?: { ideal: number };
  focusMode?: string;
  frameRate?: { ideal: number };
}

export interface CameraHookReturn {
  mediaStream: MediaStream | null;
  startCamera: (options?: CameraOptions) => Promise<MediaStream | null>;
  stopCamera: () => void;
  isCameraActive: boolean;
  cameraError: string | null;
  videoRef: React.RefObject<HTMLVideoElement>;
  mediaStreamRef: React.RefObject<MediaStream | null>;
  attachToVideo: (videoElement: HTMLVideoElement, stream: MediaStream) => Promise<void>;
}

export const useCamera = () => {
  const [mediaStream, setMediaStream] = useState<MediaStream | null>(null);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  
  const { acquireWakeLock, releaseWakeLock, keepMediaAlive, stopMediaKeepAlive } = useBackgroundTracking();

  const startCamera = useCallback(async (options: CameraOptions = {}) => {
    const defaultConstraints = {
      width: { ideal: 640 },
      height: { ideal: 480 },
      focusMode: 'continuous',
      frameRate: { ideal: 1.7 },
    };

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { ...defaultConstraints, ...options },
        audio: false,
      });

      // Enable track persistence
      stream.getTracks().forEach((track) => {
        track.enabled = true;
        setInterval(() => {
          if (track.readyState === 'live') {
            track.enabled = true;
          }
        }, 1000);
      });

      setMediaStream(stream);
      mediaStreamRef.current = stream;
      setIsCameraActive(true);
      setCameraError(null);
      
			if (!videoRef.current) return null;

			videoRef.current.srcObject = stream;

			await new Promise<void>((resolve) => {
				if (!videoRef.current) return resolve();
				videoRef.current.onloadedmetadata = () => resolve();
			});

			acquireWakeLock();
			await videoRef.current.play();
      keepMediaAlive(stream);

      return stream;
    } catch (error) {
      console.error('Camera error:', error);
      setCameraError(EYE_TRACKING_CONSTANTS.ERROR.CAMERA);
      setIsCameraActive(false);
      return null;
    }
  }, [acquireWakeLock, keepMediaAlive]);

  const stopCamera = useCallback(() => {
    const stream = (videoRef.current?.srcObject as MediaStream) || null;
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
    }
    
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    
    // setMediaStream(null);
    // mediaStreamRef.current = null;
    // setIsCameraActive(false);
    
    releaseWakeLock();
    stopMediaKeepAlive();
  }, [releaseWakeLock, stopMediaKeepAlive]);

  const attachToVideo = useCallback(async (videoElement: HTMLVideoElement, stream: MediaStream) => {
    videoRef.current = videoElement;
    videoElement.srcObject = stream;
    
    await new Promise<void>((resolve) => {
      if (!videoElement) return resolve();
      videoElement.onloadedmetadata = () => resolve();
    });
    
    await videoElement.play();
  }, []);

  return {
    mediaStream,
    startCamera,
    stopCamera,
    attachToVideo,
    isCameraActive,
    cameraError,
    videoRef,
    mediaStreamRef,
  };
};