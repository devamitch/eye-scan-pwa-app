'use client';

import React, { useState } from 'react';
import styles from './Image.module.css';
import Image from 'next/image';

interface ImageProps {
	src: string;
	alt: string;
	width?: number;
	height?: number;
	className?: string;
}

export const ImageComponent: React.FC<ImageProps> = ({ src, alt, width, height, className = '' }) => {
	const [isLoaded, setIsLoaded] = useState(false);

	const handleLoad = () => {
		setIsLoaded(true);
	};

	

	return (
		<div >
			{!isLoaded  && (
				<div className={styles.loader}>
					<div className={styles.spinner}></div>
				</div>
			)}
				<Image
					src={src}
					alt={alt}
					width={width}
					height={height}
					loading="lazy"
                   onLoad={handleLoad}
					className={`${className} ${isLoaded ? styles.loaded : ''}`}
				/>

		</div>
	);
};

export default ImageComponent;
