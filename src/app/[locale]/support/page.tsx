'use client';


import { Button } from '@/components/base/buttons';
import { TextInput, Textarea } from '@/components/base/inputs';
import MainLayout from '@/components/landing-page/layout/main-layout';
import useTranslationData from '@/hooks/use-translation-data';
import { Book, FileText, HelpCircle, Mail, MessageCircle, Send } from 'lucide-react';
import { useState } from 'react';
import styles from './SupportPage.module.css';
import Link from 'next/link';

export default function SupportPage() {
	const { supportPageText } = useTranslationData();
	const [formData, setFormData] = useState({
		name: '',
		email: '',
		subject: '',
		message: '',
	});
	const [submitted, setSubmitted] = useState(false);

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		// Handle form submission
		console.log('Form submitted:', formData);
		setSubmitted(true);
		setTimeout(() => setSubmitted(false), 3000);
	};

	const handleChange = (
		e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
	) => {
		setFormData({
			...formData,
			[e.target.name]: e.target.value,
		});
	};

	return (
		<MainLayout>
			<div className={styles.container}>
				<div className={styles.header}>
					<h1 className={styles.title}>{supportPageText.title}</h1>
					<p className={styles.subtitle}>{supportPageText.subtitle}</p>
				</div>

				<div className={styles.content}>
					{/* Contact Methods */}
					<section className={styles.contactMethods}>
						<div className={styles.methodCard}>
							<div className={styles.iconWrapper}>
								<Mail className={styles.icon} />
							</div>
							<h3 className={styles.methodTitle}>{supportPageText.email.title}</h3>
							<p className={styles.methodDescription}>
								{supportPageText.email.description}
							</p>
							<a
								href={`mailto:${supportPageText.email.address}`}
								className={styles.methodLink}
							>
								{supportPageText.email.address}
							</a>
							<p className={styles.responseTime}>
								{supportPageText.email.responseTime}
							</p>
						</div>

						<div className={styles.methodCard}>
							<div className={styles.iconWrapper}>
								<MessageCircle className={styles.icon} />
							</div>
							<h3 className={styles.methodTitle}>{supportPageText.inApp.title}</h3>
							<p className={styles.methodDescription}>
								{supportPageText.inApp.description}
							</p>
							<p className={styles.methodLink}>{supportPageText.inApp.location}</p>
							<p className={styles.responseTime}>
								{supportPageText.inApp.availability}
							</p>
						</div>

						<div className={styles.methodCard}>
							<div className={styles.iconWrapper}>
								<Book className={styles.icon} />
							</div>
							<h3 className={styles.methodTitle}>
								{supportPageText.helpCenter.title}
							</h3>
							<p className={styles.methodDescription}>
								{supportPageText.helpCenter.description}
							</p>
						<Link href="/faq" className={styles.methodLink}>
							{supportPageText.helpCenter.link}
						</Link>
							<p className={styles.responseTime}>
								{supportPageText.helpCenter.articles}
							</p>
						</div>
					</section>

					{/* Contact Form */}
					<section className={styles.formSection}>
						<h2 className={styles.sectionTitle}>{supportPageText.form.title}</h2>
						<p className={styles.sectionDescription}>
							{supportPageText.form.description}
						</p>

						<form onSubmit={handleSubmit} className={styles.form}>
							<div className={styles.formRow}>
								<div className={styles.formGroup}>
								<TextInput
									id="name"
									name="name"
									value={formData.name}
									onChange={(value) => setFormData({ ...formData, name: value })}
									placeholder={supportPageText.form.namePlaceholder}
									label={supportPageText.form.nameLabel}
									required
								/>
							</div>

							<div className={styles.formGroup}>
								<TextInput
									type="email"
									id="email"
									name="email"
									value={formData.email}
									onChange={(value) => setFormData({ ...formData, email: value })}
									placeholder={supportPageText.form.emailPlaceholder}
									label={supportPageText.form.emailLabel}
									required
								/>
							</div>
						</div>

						<div className={styles.formGroup}>
							<label htmlFor="subject" className={styles.label}>
								{supportPageText.form.subjectLabel}
							</label>
							<select
								id="subject"
								name="subject"
								value={formData.subject}
								onChange={handleChange}
								className={styles.select}
								required
							>
								<option value="">
									{supportPageText.form.subjectPlaceholder}
								</option>
								{supportPageText.form.subjectOptions.map(
									(option: string, index: number) => (
										<option key={index} value={option}>
											{option}
										</option>
									)
								)}
							</select>
						</div>

						<div className={styles.formGroup}>
							<Textarea
								id="message"
								name="message"
								value={formData.message}
								onChange={(value) => setFormData({ ...formData, message: value })}
								placeholder={supportPageText.form.messagePlaceholder}
								label={supportPageText.form.messageLabel}
								rows={6}
								required
							/>
						</div>
						<Button
							type="submit"
							variant="primary"
							size="large"
							fullWidth
							leftIcon={<Send size={20} />}
							disabled={submitted}
							className={styles.submitButton}
						>
							{submitted
								? supportPageText.form.submitted
								: supportPageText.form.submit}
						</Button>

					{submitted && (
						<div className={styles.successMessage}>
							{supportPageText.form.successMessage}
						</div>
					)}
				</form>
			</section>

			{/* Quick Links */}
			<section className={styles.quickLinks}>
				<h2 className={styles.sectionTitle}>{supportPageText.quickLinks.title}</h2>
				<div className={styles.linksGrid}>
					<Link href="/faq" className={styles.linkCard}>
						<HelpCircle className={styles.linkIcon} />
						<h3 className={styles.linkTitle}>
							{supportPageText.quickLinks.faq}
						</h3>
						<p className={styles.linkDescription}>
							{supportPageText.quickLinks.faqDescription}
						</p>
					</Link>

				<Link href="/privacy-policy" className={styles.linkCard}>
					<FileText className={styles.linkIcon} />
					<h3 className={styles.linkTitle}>
						{supportPageText.quickLinks.privacy}
					</h3>
					<p className={styles.linkDescription}>
						{supportPageText.quickLinks.privacyDescription}
					</p>
				</Link>

				<Link href="/terms-and-conditions" className={styles.linkCard}>
					<FileText className={styles.linkIcon} />
					<h3 className={styles.linkTitle}>
						{supportPageText.quickLinks.terms}
					</h3>
					<p className={styles.linkDescription}>
						{supportPageText.quickLinks.termsDescription}
					</p>
				</Link>
			</div>
		</section>

		{/* Office Hours */}
		<section className={styles.officeHours}>
			<h2 className={styles.sectionTitle}>{supportPageText.officeHours.title}</h2>
			<p className={styles.hoursText}>{supportPageText.officeHours.hours}</p>
			<p className={styles.hoursNote}>{supportPageText.officeHours.note}</p>
		</section>
	</div>
</div>
		</MainLayout>
	);
}
