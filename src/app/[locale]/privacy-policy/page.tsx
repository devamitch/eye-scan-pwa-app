'use client';


import MainLayout from '@/components/landing-page/layout/main-layout';
import useTranslationData from '@/hooks/use-translation-data';
import styles from './PrivacyPolicy.module.css';

export default function PrivacyPolicyPage() {
	const { privacyPolicyText } = useTranslationData();

	return (
		<MainLayout>
			<div className={styles.container}>
				<div className={styles.header}>
					<h1 className={styles.title}>{privacyPolicyText.title}</h1>
					<p className={styles.lastUpdated}>{privacyPolicyText.lastUpdated}</p>
				</div>

				<div className={styles.content}>
					<div className={styles.intro}>
						<p>{privacyPolicyText.intro}</p>
					</div>

					{/* Data Collection Section */}
					<section className={styles.section}>
						<h2 className={styles.sectionTitle}>
							{privacyPolicyText.sections.dataCollection.title}
						</h2>
						<p className={styles.sectionContent}>
							{privacyPolicyText.sections.dataCollection.content}
						</p>
						<ul className={styles.list}>
							{privacyPolicyText.sections.dataCollection.items.map(
								(item: string, index: number) => (
									<li key={index}>{item}</li>
								)
							)}
						</ul>
					</section>

					{/* Data Usage Section */}
					<section className={styles.section}>
						<h2 className={styles.sectionTitle}>
							{privacyPolicyText.sections.dataUsage.title}
						</h2>
						<p className={styles.sectionContent}>
							{privacyPolicyText.sections.dataUsage.content}
						</p>
						<ul className={styles.list}>
							{privacyPolicyText.sections.dataUsage.items.map(
								(item: string, index: number) => (
									<li key={index}>{item}</li>
								)
							)}
						</ul>
					</section>

					{/* Data Security Section */}
					<section className={styles.section}>
						<h2 className={styles.sectionTitle}>
							{privacyPolicyText.sections.dataSecurity.title}
						</h2>
						<p className={styles.sectionContent}>
							{privacyPolicyText.sections.dataSecurity.content}
						</p>
						<ul className={styles.list}>
							{privacyPolicyText.sections.dataSecurity.items.map(
								(item: string, index: number) => (
									<li key={index}>{item}</li>
								)
							)}
						</ul>
					</section>

					{/* Your Rights Section */}
					<section className={styles.section}>
						<h2 className={styles.sectionTitle}>
							{privacyPolicyText.sections.yourRights.title}
						</h2>
						<p className={styles.sectionContent}>
							{privacyPolicyText.sections.yourRights.content}
						</p>
						<ul className={styles.list}>
							{privacyPolicyText.sections.yourRights.items.map(
								(item: string, index: number) => (
									<li key={index}>{item}</li>
								)
							)}
						</ul>
					</section>

					{/* Data Retention Section */}
					<section className={styles.section}>
						<h2 className={styles.sectionTitle}>
							{privacyPolicyText.sections.dataRetention.title}
						</h2>
						<p className={styles.sectionContent}>
							{privacyPolicyText.sections.dataRetention.content}
						</p>
					</section>

					{/* Contact Section */}
					<section className={styles.section}>
						<h2 className={styles.sectionTitle}>
							{privacyPolicyText.sections.contact.title}
						</h2>
						<p className={styles.sectionContent}>
							{privacyPolicyText.sections.contact.content}
						</p>
					</section>
				</div>
			</div>
		</MainLayout>
	);
}
