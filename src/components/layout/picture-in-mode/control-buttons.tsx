// ControlButtons.tsx
import { IconButton } from '@/components/base/buttons';
import { PiPControlHandlers } from '@/types/pip';
import {
	ArrowUpRight,
	Expand,
	ExternalLink,
	FullscreenIcon,
	Minimize,
	Minimize2,
	PictureInPicture,
	PictureInPicture2,
	PlayCircle,
	StopCircle,
} from 'lucide-react';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import styles from './picturein.module.scss';

interface ControlButtonsProps extends PiPControlHandlers {
	isActive: boolean;
	isExpanded: boolean;
	isFullScreen: boolean;
	isHovered: boolean;
	isInPiPMode: boolean;
	onTogglePiP: any;
}

export const ControlButtons = ({
	isActive,
	isExpanded,
	isFullScreen,
	isHovered,
	isInPiPMode,
	onToggleTracking,
	onToggleExpanded,
	onToggleFullScreen,
	onTogglePiP,
}: ControlButtonsProps) => {
	const pathname = usePathname();
	const [isMobile, setIsMobile] = useState(false);

	useEffect(() => {
		const checkIfMobile = () => {
			const mobile = window.innerWidth <= 600;
			setIsMobile(mobile);
		};
		
		checkIfMobile();
		window.addEventListener('resize', checkIfMobile);
		
		return () => window.removeEventListener('resize', checkIfMobile);
	}, []);

	return (
		<div
			className={`${styles.controlButtons} ${isHovered || isFullScreen ? styles.visible : ''}`}
			style={{
				visibility: 'visible',
				opacity:  1,
			}}
		>
			<IconButton
				onClick={onToggleTracking}
				variant={isActive ? 'danger' : 'primary'}
				ariaLabel={isActive ? 'Stop Tracking' : 'Start Tracking'}
				icon={isActive ? <StopCircle size={24} /> : <PlayCircle size={24} />}
			/>

			{!isMobile && (
							<IconButton
				onClick={onTogglePiP}
				variant='primary'
				ariaLabel={isInPiPMode ? 'Exit PiP Mode' : 'Enter PiP Mode'}
				icon={isInPiPMode ? <PictureInPicture size={24} /> : <PictureInPicture2 size={24} />}
			/>
			)}

			{!isMobile && (
				<IconButton
					onClick={onToggleFullScreen}
					variant="primary"
					ariaLabel={isFullScreen ? 'Exit Fullscreen' : 'Enter Fullscreen'}
					icon={isFullScreen ? <Minimize size={24} /> : <FullscreenIcon size={24} />}
				/>
			)}

			{/* PiP Toggle Button */}
			<IconButton
					onClick={onToggleExpanded}
					variant="primary"
					ariaLabel={isExpanded ? 'Collapse' : 'Expand'}
					icon={isExpanded ? (isMobile ? <ExternalLink size={24}/> : <Minimize2 size={24} /> ) : <Expand size={24} />}
				/>
		</div>
	);
};
