'use client';
import useTranslationData from '@/hooks/use-translation-data';
import { useRegisterUser } from '@/hooks/use-user';
import { Link } from '@/i18n/navigation';
import { AlertCircle, Loader2 } from 'lucide-react';
import { FormProvider } from 'react-hook-form';
import { TextInput, PasswordInput, NumberInput } from '@/components/base/inputs';
import styles from './register-form.module.css';
import AppleSignInButton from '../apple-sign-in-button/apple-sign-in-button';
import { Button } from '@/components/base/buttons';
import { useState } from 'react';

export default function RegisterForm() {
	const { registerFormText } = useTranslationData();
	const { form, mutation, onSubmit, isPending } = useRegisterUser();
	const [age, setAge] = useState<number | ''>('');
	// Watch form values for real-time validation
	const nameValue = form.watch('name') as string | undefined;
	const emailValue = form.watch('email') as string | undefined;
	const passwordValue = form.watch('password') as string | undefined;
	const confirmPasswordValue = form.watch('confirmPassword') as string | undefined;

	// Password strength checker
	const getPasswordStrength = (password: string) => {
		if (!password) return { strength: 0, label: '', color: '' };

		let strength = 0;
		const checks = {
			length: password.length >= 8,
			uppercase: /[A-Z]/.test(password),
			lowercase: /[a-z]/.test(password),
			number: /[0-9]/.test(password),
			special: /[^A-Za-z0-9]/.test(password),
		};

		// Calculate strength
		if (checks.length) strength += 20;
		if (checks.uppercase) strength += 20;
		if (checks.lowercase) strength += 20;
		if (checks.number) strength += 20;
		if (checks.special) strength += 20;

		let label = '';
		let color = '';

		if (strength <= 40) {
			label = 'Weak';
			color = 'var(--highValue)';
		} else if (strength <= 60) {
			label = 'Fair';
			color = 'var(--modValue)';
		} else if (strength <= 80) {
			label = 'Good';
			color = 'var(--lightMetricValue)';
		} else {
			label = 'Strong';
			color = 'var(--metricValue)';
		}
		return { strength, label, color, checks };
	};

	return (
		<FormProvider {...form}>
			<div className={styles.container}>
				{/* <div className={styles.header}>
					<ChevronLeft
						size={36}
						className={styles.chevron}
						onClick={() => router.back()}
						style={{ cursor: 'pointer' }}
					/>
					<h2 className={styles.title}>{registerFormText.title}</h2>
					<div className={styles.placeholder} />
				</div> */}

				<div className={styles.formWrapper}>
					<div className={styles.welcomeHeader}>
						<h2 className={styles.welcomeTitle}>{registerFormText.title}</h2>
						<p className={styles.subtitle}>{registerFormText.subtitle}</p>
					</div>

					<form onSubmit={onSubmit} className={styles.form}>
						{/* Name Field */}
						<TextInput
							type="text"
							id="name"
							label={registerFormText.nameLabel}
							placeholder={registerFormText.namePlaceholder}
							value={nameValue || ''}
							onChange={(value: string) => form.setValue('name', value)}
							onBlur={() => form.trigger('name')}
							disabled={isPending}
							required
							autoComplete="name"
							error={form.formState.errors.name?.message}
						/>

						{/* Email Field */}
						<TextInput
							type="email"
							id="email"
							label={registerFormText.emailLabel}
							placeholder={registerFormText.emailPlaceholder}
							value={emailValue || ''}
							onChange={(value: string) => form.setValue('email', value)}
							onBlur={() => form.trigger('email')}
							disabled={isPending}
							required
							autoComplete="email"
							error={form.formState.errors.email?.message}
						/>
						{/* <NumberInput
							label="Age"
							value={age}
							onChange={setAge}
							placeholder={'Enter your age'}
							min={1}
							max={150}
						/> */}
						{/* Password Field */}
						<PasswordInput
							id="password"
							label={registerFormText.passwordLabel}
							placeholder={registerFormText.passwordPlaceholder}
							value={passwordValue || ''}
							onChange={(value: string) => form.setValue('password', value)}
							onBlur={() => form.trigger('password')}
							disabled={isPending}
							required
							autoComplete="new-password"
							showStrength={true}
							error={form.formState.errors.password?.message}
						/>

						{/* Confirm Password Field */}
						<PasswordInput
							id="confirmPassword"
							label={registerFormText.confirmPasswordLabel}
							placeholder={registerFormText.confirmPasswordPlaceholder}
							value={confirmPasswordValue || ''}
							onChange={(value: string) => form.setValue('confirmPassword', value)}
							onBlur={() => form.trigger('confirmPassword')}
							disabled={isPending}
							required
							autoComplete="new-password"
							showStrength={false}
							error={form.formState.errors.confirmPassword?.message}
						/>

						{/* Terms Checkbox */}
						<div className={styles.checkboxGroup}>
							<input
								id="acceptTerms"
								type="checkbox"
								className={styles.checkbox}
								disabled={isPending}
								{...form.register('acceptTerms', {
									required: 'You must accept the terms to continue',
								})}
							/>
							<label htmlFor="acceptTerms" className={styles.checkboxLabel}>
								{registerFormText.termsCheckboxText}{' '}
								<Link href="/terms-and-services" className={styles.link}>
									{registerFormText.termsLinkText}
								</Link>{' '}
								{registerFormText.andText}{' '}
								<Link href="/privacy-policy" className={styles.link}>
									{registerFormText.privacyLinkText}
								</Link>
							</label>
						</div>
						{form.formState.errors.acceptTerms && (
							<div className={styles.errorText}>
								<AlertCircle size={16} />
								<span>{form.formState.errors.acceptTerms.message}</span>
							</div>
						)}

						{/* Submit Button */}
						<Button
							type="submit"
							variant="primary"
							size="large"
							fullWidth
							borderRadius="small"
							loading={mutation.isPending || isPending}
							disabled={mutation.isPending || isPending}
						>
							{isPending || mutation.isPending
								? registerFormText.loadingButtonText
								: registerFormText.submitButtonText}
						</Button>

						{/* Social Divider */}
						<div className={styles.socialDivider}>
							<div className={styles.dividerLine}></div>
							<span className={styles.dividerText}>
								{registerFormText.socialDividerText}
							</span>
							<div className={styles.dividerLine}></div>
						</div>

						{/* Apple Sign In */}
						<AppleSignInButton />
					</form>

					{/* Sign In Link */}
					<div className={styles.linkContainer}>
						{registerFormText.signInLinkText}{' '}
						<Link href="/signin" className={styles.link}>
							{registerFormText.signInText}
						</Link>
					</div>
				</div>
			</div>
		</FormProvider>
	);
}
