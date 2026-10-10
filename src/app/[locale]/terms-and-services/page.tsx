'use client';


import MainLayout from '@/components/landing-page/layout/main-layout';
import useTranslationData from '@/hooks/use-translation-data';
import styles from './TermsPage.module.css';

export default function TermsPage() {
	const { termsPageText } = useTranslationData();

	return (
		<MainLayout>
			<div className={styles.container}>
				<div className={styles.header}>
					<h1 className={styles.title}>{termsPageText.title}</h1>
					<p className={styles.lastUpdated}>{termsPageText.lastUpdated}</p>
				</div>

				<div className={styles.content}>
					<div className={styles.intro}>
						<p>{termsPageText.intro}</p>
					</div>

					{/* Acceptance of Terms */}
					<section className={styles.section}>
						<h2 className={styles.sectionTitle}>
							{termsPageText.sections.acceptance.title}
						</h2>
						<p className={styles.sectionContent}>
							{termsPageText.sections.acceptance.content}
						</p>
					</section>

					{/* Description of Service */}
					<section className={styles.section}>
						<h2 className={styles.sectionTitle}>
							{termsPageText.sections.description.title}
						</h2>
						<p className={styles.sectionContent}>
							{termsPageText.sections.description.content}
						</p>
						<ul className={styles.list}>
							{termsPageText.sections.description.items.map(
								(item: string, index: number) => (
									<li key={index}>{item}</li>
								)
							)}
						</ul>
					</section>

					{/* Medical Disclaimer */}
					<section className={styles.section}>
						<h2 className={styles.sectionTitle}>
							{termsPageText.sections.medicalDisclaimer.title}
						</h2>
						<p className={styles.sectionContent}>
							{termsPageText.sections.medicalDisclaimer.content}
						</p>
						<ul className={styles.list}>
							{termsPageText.sections.medicalDisclaimer.items.map(
								(item: string, index: number) => (
									<li key={index}>{item}</li>
								)
							)}
						</ul>
					</section>

					{/* User Responsibilities */}
					<section className={styles.section}>
						<h2 className={styles.sectionTitle}>
							{termsPageText.sections.userResponsibilities.title}
						</h2>
						<p className={styles.sectionContent}>
							{termsPageText.sections.userResponsibilities.content}
						</p>
						<ul className={styles.list}>
							{termsPageText.sections.userResponsibilities.items.map(
								(item: string, index: number) => (
									<li key={index}>{item}</li>
								)
							)}
						</ul>
					</section>

					{/* Privacy and Data */}
					<section className={styles.section}>
						<h2 className={styles.sectionTitle}>
							{termsPageText.sections.privacyData.title}
						</h2>
						<p className={styles.sectionContent}>
							{termsPageText.sections.privacyData.content}
						</p>
					</section>

					{/* Intellectual Property */}
					<section className={styles.section}>
						<h2 className={styles.sectionTitle}>
							{termsPageText.sections.intellectualProperty.title}
						</h2>
						<p className={styles.sectionContent}>
							{termsPageText.sections.intellectualProperty.content}
						</p>
					</section>

					{/* Limitation of Liability */}
					<section className={styles.section}>
						<h2 className={styles.sectionTitle}>
							{termsPageText.sections.limitation.title}
						</h2>
						<p className={styles.sectionContent}>
							{termsPageText.sections.limitation.content}
						</p>
					</section>

					{/* Termination */}
					<section className={styles.section}>
						<h2 className={styles.sectionTitle}>
							{termsPageText.sections.termination.title}
						</h2>
						<p className={styles.sectionContent}>
							{termsPageText.sections.termination.content}
						</p>
					</section>

					{/* Changes to Terms */}
					<section className={styles.section}>
						<h2 className={styles.sectionTitle}>
							{termsPageText.sections.changes.title}
						</h2>
						<p className={styles.sectionContent}>
							{termsPageText.sections.changes.content}
						</p>
					</section>

					{/* Governing Law */}
					<section className={styles.section}>
						<h2 className={styles.sectionTitle}>
							{termsPageText.sections.governingLaw.title}
						</h2>
						<p className={styles.sectionContent}>
							{termsPageText.sections.governingLaw.content}
						</p>
					</section>

					{/* Contact */}
					<section className={styles.section}>
						<h2 className={styles.sectionTitle}>
							{termsPageText.sections.contact.title}
						</h2>
						<p className={styles.sectionContent}>
							{termsPageText.sections.contact.content}
						</p>
					</section>
				</div>
			</div>
		</MainLayout>
	);
}
