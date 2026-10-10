import { useEyeTrackingContext } from '@/provider/EyeTrackingProvider';
import { useEffect, useRef } from 'react';
import styles from './CameraPreview.module.css';

interface CameraPreviewProps {
	onClick?: () => void;
}

export default function CameraPreview({ onClick }: CameraPreviewProps) {
	const context = useEyeTrackingContext();
	const { videoRef: oldVideoRef, canvasRef: oldCanvasRef, isActive } = context || {};
	const previewVideoRef = useRef<HTMLVideoElement>(null);
	const previewCanvasRef = useRef<HTMLCanvasElement>(null);
	const animationFrameRef = useRef<number>(0);
	const mediaStreamRef = useRef<MediaStream | null>(null);
	const lastFrameTimeRef = useRef<number>(0);
	const targetFPS = 30;

	// Set up video stream from the main video element
	useEffect(() => {
		const video = previewVideoRef.current;
		const oldVideo = oldVideoRef?.current;

		if (!video || !oldVideo) return;

		const setupVideoStream = () => {
			const stream = oldVideo.srcObject as MediaStream;
			if (!stream) return;

			video.srcObject = stream;
			mediaStreamRef.current = stream;

			// Configure video tracks for better quality
			if (mediaStreamRef.current) {
				mediaStreamRef.current.getVideoTracks().forEach((track) => {
					if (track.kind === 'video') {
						track.enabled = true;
						const settings = track.getSettings();
						if (settings.width && settings.height) {
							console.log('[CameraPreview] Video track settings:', settings);
						}
					}
				});
			}

			// Ensure video plays
			if (video.paused) {
				video.play().catch((err) => {
					console.warn('[CameraPreview] Video play failed:', err);
				});
			}
		};

		const handleLoadedMetadata = () => {
			setupVideoStream();
		};

		oldVideo.addEventListener('loadedmetadata', handleLoadedMetadata);

		// Setup immediately if stream is already available
		if (oldVideo.srcObject && oldVideo.readyState >= 1) {
			setupVideoStream();
		}

		return () => {
			oldVideo.removeEventListener('loadedmetadata', handleLoadedMetadata);
		};
	}, [oldVideoRef]);

	// Copy canvas content from main canvas to preview canvas
	useEffect(() => {
		const video = previewVideoRef.current;
		const canvas = previewCanvasRef.current;
		const oldCanvas = oldCanvasRef?.current;

		if (!isActive || !canvas || !oldCanvas || !video) return;

		const updateCanvasSize = () => {
			if (video.videoWidth && video.videoHeight) {
				canvas.width = video.videoWidth;
				canvas.height = video.videoHeight;
			}
		};

		const handleVideoReady = () => {
			updateCanvasSize();
			// Ensure video is playing
			if (video.paused) {
				video.play().catch((err) => {
					console.warn('[CameraPreview] Canvas video play failed:', err);
				});
			}
		};

		video.addEventListener('loadedmetadata', handleVideoReady);
		video.addEventListener('loadeddata', handleVideoReady);

		// Set canvas size immediately if video is ready
		if (video.readyState >= 2) {
			updateCanvasSize();
		}

		const ctx = canvas.getContext('2d', {
			alpha: false,
			desynchronized: true,
			willReadFrequently: false,
		});

		if (!ctx) return;

		ctx.imageSmoothingEnabled = true;
		ctx.imageSmoothingQuality = 'medium';

		const drawCanvas = (currentTime: number) => {
			const elapsed = currentTime - lastFrameTimeRef.current;
			const targetInterval = 1000 / targetFPS;

			if (elapsed >= targetInterval) {
				lastFrameTimeRef.current = currentTime - (elapsed % targetInterval);

				if (canvas.width > 0 && canvas.height > 0 && oldCanvas.width > 0 && oldCanvas.height > 0) {
					ctx.clearRect(0, 0, canvas.width, canvas.height);
					ctx.drawImage(oldCanvas, 0, 0, canvas.width, canvas.height);
				}
			}

			animationFrameRef.current = requestAnimationFrame(drawCanvas);
		};

		animationFrameRef.current = requestAnimationFrame(drawCanvas);

		return () => {
			if (animationFrameRef.current) {
				cancelAnimationFrame(animationFrameRef.current);
			}
			video.removeEventListener('loadedmetadata', handleVideoReady);
			video.removeEventListener('loadeddata', handleVideoReady);
		};
	}, [isActive, oldCanvasRef]);

	if (!context) {
		return null;
	}

	return (
		<button
			className={`${styles.cameraPreview} ${isActive ? styles.active : styles.inactive}`}
			onClick={onClick}
			title="Open Camera View"
		>
			<div className={styles.videoContainer}>
				<video
					ref={previewVideoRef}
					autoPlay
					playsInline
					muted
					className={styles.video}
					style={{ display: !isActive ? 'block' : 'none' }}
				/>
				<canvas
					ref={previewCanvasRef}
					className={styles.canvas}
					style={{ display: isActive ? 'block' : 'none' }}
				/>
			</div>
		</button>
	);
}
