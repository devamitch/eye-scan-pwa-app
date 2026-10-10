'use client';
import useTranslationData from '@/hooks/use-translation-data';
import { useLogin } from '@/hooks/use-user';
import { Link } from '@/i18n/navigation';
import {  CheckCircle, Loader2 } from 'lucide-react';
import { useState } from 'react';
import { FormProvider } from 'react-hook-form';
import { TextInput, PasswordInput } from '@/components/base/inputs';
import styles from './login-form.module.css';
import AppleSignInButton from '../apple-sign-in-button/apple-sign-in-button';
import { Button } from '@/components/base/buttons';

export default function LoginForm() {
	const { loginFormText } = useTranslationData();
	const { form, mutation: loginMutation, isPending, onSubmit } = useLogin();
	const [showResetForm, setShowResetForm] = useState(false);
	const [resetEmail, setResetEmail] = useState('');
	const [resetSuccess, setResetSuccess] = useState(false);
	const [resetError, setResetError] = useState('');
	const [isResetting, setIsResetting] = useState(false);

	// Watch form values for real-time validation
	const emailValue = form.watch('email');
	const passwordValue = form.watch('password');

	// Email validation helper
	const isValidEmail = (email: string) => {
		return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
	};

	// Password reset handler
	const handlePasswordReset = async (e: React.FormEvent) => {
		e.preventDefault();
		setResetError('');
		setResetSuccess(false);

		if (!resetEmail) {
			setResetError(loginFormText.validationErrors.emptyFields);
			return;
		}

		if (!isValidEmail(resetEmail)) {
			setResetError(loginFormText.validationErrors.invalidEmail);
			return;
		}

		setIsResetting(true);

		try {
			// TODO: Implement your password reset logic here
			// Example: await resetPassword(resetEmail);

			// Simulate API call
			await new Promise((resolve) => setTimeout(resolve, 1500));

			setResetSuccess(true);
			setTimeout(() => {
				setShowResetForm(false);
				setResetSuccess(false);
				setResetEmail('');
			}, 3000);
		} catch (error: any) {
			setResetError(error.message || 'Failed to send reset email. Please try again.');
		} finally {
			setIsResetting(false);
		}
	};

		return (
		<div className={styles.container}>
			<div className={styles.header}>
				<h2 className={styles.title}>{loginFormText.signInButton}</h2>
				<div className={styles.placeholder} />
			</div>

			<div className={styles.formWrapper}>
				<div className={styles.welcomeHeader}>
					<h2 className={styles.WelcomeTitle}>{loginFormText.title}</h2>
					<p className={styles.subtitle}>{loginFormText.subtitle}</p>
				</div>

				{!showResetForm ? (
					<FormProvider {...form}>
						<form onSubmit={onSubmit} className={styles.form}>
							{/* Email Field */}
						<TextInput
							type="email"
							id="email"
							label={loginFormText.emailLabel}
							placeholder={loginFormText.emailPlaceholder}
							value={emailValue || ''}
							onChange={(value) => form.setValue('email', value)}
							onBlur={() => form.trigger('email')}
							disabled={isPending}
							required
							autoComplete="email"
							error={form.formState.errors.email?.message}
						/>

						{/* Password Field */}
						<PasswordInput
							id="password"
							label={loginFormText.passwordLabel}
							placeholder={loginFormText.passwordPlaceholder}
							value={passwordValue || ''}
							onChange={(value) => form.setValue('password', value)}
							onBlur={() => form.trigger('password')}
							disabled={isPending}
							required
							autoComplete="current-password"
							showStrength={false}
							error={form.formState.errors.password?.message}
						/>

					{/* Forgot Password Link */}
					<div className={styles.forgotPassword}>
						<Button
							type="button"
							onClick={() => setShowResetForm(true)}
							variant="link"
							size="small"
							disabled={isPending}
							className={styles.forgotLink}
						>
							{loginFormText.forgotPasswordText}
						</Button>
					</div>

					{/* Submit Button */}
					<Button
						type="submit"
						variant="primary"
						size="large"
						fullWidth
						borderRadius='small'
						loading={isPending || loginMutation.isPending}
						disabled={isPending || loginMutation.isPending}
					>
						{loginMutation.isPending || isPending 
							? loginFormText.loadingButtonText 
							: loginFormText.signInButton}
					</Button>

					{/* Social Divider */}
							<div className={styles.socialDivider}>
								<div className={styles.dividerLine}></div>
								<span className={styles.dividerText}>
									{loginFormText.socialDividerText}
								</span>
								<div className={styles.dividerLine}></div>
							</div>

							{/* Apple Sign In */}
							<AppleSignInButton />

							{/* Create Account Link */}
							<div className={styles.linkContainer}>
								{loginFormText.createAccountText}{' '}
								<Link href="/register" className={styles.link}>
									{loginFormText.createAccountLink}
								</Link>
							</div>
						</form>
					</FormProvider>
				) : (
					/* Password Reset Form */
					<form onSubmit={handlePasswordReset} className={styles.form}>
						<h2 className={styles.resetTitle}>{loginFormText.resetTitle}</h2>
						<p className={styles.resetSubtitle}>{loginFormText.resetSubtitle}</p>

						{/* Success Message */}
						{resetSuccess && (
							<div className={styles.success}>
								<CheckCircle size={20} className={styles.successIconLarge} />
								<div className={styles.successContent}>
									<p className={styles.successTitle}>
										{loginFormText.resetSuccessTitle}
									</p>
									<p className={styles.successMessage}>
										{loginFormText.resetSuccessMessage}
									</p>
								</div>
							</div>
						)}

						{/* Reset Email Field */}
					<TextInput
						type="email"
						id="resetEmail"
						label={loginFormText.emailLabel}
						placeholder={loginFormText.emailPlaceholder}
						value={resetEmail}
						onChange={(value) => {
							setResetEmail(value);
							setResetError('');
						}}
						disabled={isResetting}
						required
						autoComplete="email"
						error={resetError}
					/>
						{/* Reset Actions */}
						<div className={styles.resetActions}>
							<Button
								type="submit"
								variant="primary"
								size="medium"
								fullWidth
								loading={isResetting}
								disabled={isResetting}
							>
								{isResetting 
									? loginFormText.resetLoadingText 
									: loginFormText.sendResetButton}
							</Button>

							<Button
								type="button"
								onClick={() => {
									setShowResetForm(false);
									setResetError('');
									setResetEmail('');
								}}
								variant="outline"
								size="medium"
								fullWidth
								disabled={isResetting}
							>
								{loginFormText.backToLoginButton}
							</Button>
						</div>
					</form>
				)}
			</div>
		</div>
	);
}
