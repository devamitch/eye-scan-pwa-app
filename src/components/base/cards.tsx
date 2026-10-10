'use client';

import React from 'react';
import  { ImageComponent } from './Image';
import styles from './card.module.css';
import { MapPin, Star } from 'lucide-react';

type CardVariant = 'text-top' | 'text-bottom' | 'text-overlay';

interface CardProps {
	/** Card title */
	title?: string;
	/** Card image URL */
	image: string;
	/** Click handler */
	onClick?: () => void;
	/** Card variant style */
	variant?: CardVariant;
	/** Additional CSS class names */
	className?: string;
	/** Accessible label for screen readers */
	ariaLabel?: string;
	/** ID of element that describes this card */
	ariaDescribedBy?: string;
	/** Optional location text */
	location?: string;
	/** Optional specialty text */
	specialty?: string;
	/** Optional rating */
	rating?: number;
	/** Optional custom content component for text-overlay variant */
	cardContent?: React.ReactNode;
}

// ====================  CARD COMPONENT ====================

export const Card: React.FC<CardProps> = ({
	title,
	image,
	onClick,
	variant = 'text-bottom',
	className = '',
	ariaLabel,
	location,
	specialty,
	rating,
	cardContent,
}) => {
	const cardClasses = [
		styles.card,
		styles[`variant-${variant}`],
		onClick ? styles.clickable : '',
		className,
	]
		.filter(Boolean)
		.join(' ');

	const handleKeyDown = (e: React.KeyboardEvent) => {
		if (onClick && (e.key === 'Enter' || e.key === ' ')) {
			if (e.key === ' ') {
				e.preventDefault();
			}
			onClick();
		}
	};

	// Render text-overlay variant differently
	if (variant === 'text-overlay') {
		return (
			<div
				className={cardClasses}
				onClick={onClick}
				onKeyDown={handleKeyDown}
				role={onClick ? 'button' : undefined}
				tabIndex={onClick ? 0 : undefined}
				aria-label={ariaLabel || `${title} card`}
				style={{
					backgroundImage: `url(${image})`,
				}}
			>
				<div className={styles.overlayContent}>
					{cardContent}
				</div>
			</div>
		);
	}

	return (
		<div
			className={cardClasses}
			onClick={onClick}
			onKeyDown={handleKeyDown}
			role={onClick ? 'button' : undefined}
			tabIndex={onClick ? 0 : undefined}
			aria-label={ariaLabel || `${title} card`}
		>
			<ImageComponent
				src={image}
				alt={title}
				width={variant === 'text-top' ? 150 : 300}
				height={variant === 'text-top' ? 150 : 200}
				className={styles.image}
					/>

			<div className={styles.content}>
			
					<div className={styles.metadata}>
							<h3 className={styles.title}>{title}</h3>
						{location && (
							<div className={styles.metadataItem}>
								<MapPin size={16} color='var(--highValue)' />
								<span>{location}</span>
							</div>
						)}
						{specialty && (
							<div className={styles.metadataItem}>
								<span>{specialty}</span>
							</div>
						)}
						{rating && (
							<div className={styles.metadataItem}>
								<Star size={16} color="var(--modValue)" fill="var(--modValue)" />
								<span>{rating}</span>
							</div>
						)}
					</div>

			</div>
		</div>
	);
};

export default Card;
