'use client';

import useTranslationData from '@/hooks/use-translation-data';
import { Mail, Clock } from 'lucide-react';
import styles from './ContactUs.module.css';

import MainLayout from '@/components/landing-page/layout/main-layout';

export default function ContactUsPage() {
	const { contactUsText } = useTranslationData();

	return (
		<MainLayout>
			<div className={styles.header}>
				<h1 className={styles.title}>{contactUsText.title}</h1>
				<p className={styles.subtitle}>{contactUsText.subtitle}</p>
			</div>

			<div className={styles.content}>
				<div className={styles.card}>
					<div className={styles.company}>
						<h2 className={styles.companyName}>{contactUsText.companyName}</h2>
					</div>

					<div className={styles.contactInfo}>
						<div className={styles.contactItem}>
							<div className={styles.iconWrapper}>
								<Mail className={styles.icon} size={24} />
							</div>
							<div className={styles.contactDetails}>
								<h3 className={styles.contactLabel}>{contactUsText.email}</h3>
								<a 
									href={`mailto:${contactUsText.emailAddress}`} 
									className={styles.contactLink}
								>
									{contactUsText.emailAddress}
								</a>
							</div>
						</div>

						<div className={styles.contactItem}>
							<div className={styles.iconWrapper}>
								<Clock className={styles.icon} size={24} />
							</div>
							<div className={styles.contactDetails}>
								<h3 className={styles.contactLabel}>{contactUsText.officeHours}</h3>
								<p className={styles.contactText}>{contactUsText.officeHoursText}</p>
							</div>
						</div>
					</div>

					<div className={styles.description}>
						<p className={styles.descriptionText}>{contactUsText.description}</p>
					</div>
				</div>
			</div>
		</MainLayout>
	);
}
