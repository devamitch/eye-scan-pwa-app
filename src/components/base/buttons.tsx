import { Loader2 } from 'lucide-react';
import React, { ButtonHTMLAttributes, ReactNode, useCallback } from 'react';
import styles from './button.module.css';

type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'outline' | 'ghost' | 'link' | 'subtle';
type ButtonSize = 'small' | 'medium' | 'large';
type BorderRadius = 'small' | 'medium' | 'large';

interface BaseButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'onClick'> {
	/** Button content */
	children: ReactNode;
	/** Button variant style */
	variant?: ButtonVariant;
	/** Button size */
	size?: ButtonSize;
	/** Border radius size: small (12px), medium (16px), large (20px) */
	borderRadius?: BorderRadius;
	/** Whether button is in loading state */
	loading?: boolean;
	/** Whether button is disabled */
	disabled?: boolean;
	/** Whether button should take full width */
	fullWidth?: boolean;
	/** Icon to display before text */
	leftIcon?: ReactNode;
	/** Icon to display after text */
	rightIcon?: ReactNode;
	/** Click handler with debounce protection */
	onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void | Promise<void>;
	/** Additional CSS class names */
	className?: string;
	/** Accessible label for screen readers */
	ariaLabel?: string;
	/** Button type attribute */
	type?: 'button' | 'submit' | 'reset';
}

interface IconButtonProps extends Omit<BaseButtonProps, 'children' | 'leftIcon' | 'rightIcon'> {
	/** Icon to display */
	icon: ReactNode;
	/** Accessible label (required for icon-only buttons) */
	ariaLabel: string;
}

// ====================  BASE BUTTON ====================

export const Button: React.FC<BaseButtonProps> = ({
	children,
	variant = 'primary',
	size = 'medium',
	borderRadius = 'large',
	loading = false,
	disabled = false,
	fullWidth = false,
	leftIcon,
	rightIcon,
	onClick,
	className = '',
	ariaLabel,
	type = 'button',
	...rest
}) => {
	const isDisabled = disabled || loading;

	const handleClick = useCallback(
		async (event: React.MouseEvent<HTMLButtonElement>) => {
			if (isDisabled || !onClick) return;

			// Prevent double clicks
			event.currentTarget.blur();

			try {
				await onClick(event);
			} catch (error) {
				console.error('Button click handler error:', error);
			}
		},
		[onClick, isDisabled]
	);

	const buttonClasses = [
		styles.button,
		styles[`variant-${variant}`],
		styles[`size-${size}`],
		styles[`border-${borderRadius}`],
		fullWidth ? styles['full-width'] : '',
		loading ? styles.loading : '',
		className,
	]
		.filter(Boolean)
		.join(' ');

	return (
		<button
			type={type}
			onClick={handleClick}
			disabled={isDisabled}
			className={buttonClasses}
			aria-label={ariaLabel}
			aria-busy={loading}
			aria-disabled={isDisabled}
			{...rest}
		>
			{loading && (
				<span className={styles['loading-spinner']} aria-hidden="true">
					<Loader2 size={size === 'small' ? 16 : size === 'large' ? 24 : 20} />
				</span>
			)}

			{!loading && leftIcon && (
				<span className={styles['icon-left']} aria-hidden="true">
					{leftIcon}
				</span>
			)}

			<span className={styles['button-text']}>{children}</span>

			{!loading && rightIcon && (
				<span className={styles['icon-right']} aria-hidden="true">
					{rightIcon}
				</span>
			)}
		</button>
	);
};

// ====================  ICON BUTTON ====================

export const IconButton: React.FC<IconButtonProps> = ({
	icon,
	variant = 'ghost',
	size = 'medium',
	borderRadius = 'large',
	loading = false,
	disabled = false,
	onClick,
	className = '',
	ariaLabel,
	type = 'button',
	...rest
}) => {
	const isDisabled = disabled || loading;

	const handleClick = useCallback(
		async (event: React.MouseEvent<HTMLButtonElement>) => {
			if (isDisabled || !onClick) return;

			event.currentTarget.blur();

			try {
				await onClick(event);
			} catch (error) {
				console.error('IconButton click handler error:', error);
			}
		},
		[onClick, isDisabled]
	);

	const buttonClasses = [
		styles.button,
		styles['icon-button'],
		styles[`variant-${variant}`],
		styles[`size-${size}`],
		styles[`border-${borderRadius}`],
		loading ? styles.loading : '',
		className,
	]
		.filter(Boolean)
		.join(' ');

	return (
		<button
			type={type}
			onClick={handleClick}
			disabled={isDisabled}
			className={buttonClasses}
			aria-label={ariaLabel}
			aria-busy={loading}
			aria-disabled={isDisabled}
			{...rest}
		>
			{loading ? (
				<span className={styles['loading-spinner']} aria-hidden="true">
					<Loader2 size={size === 'small' ? 16 : size === 'large' ? 24 : 20} />
				</span>
			) : (
				<span aria-hidden="true">{icon}</span>
			)}
		</button>
	);
};


export default {
	Button,
	IconButton,
};
