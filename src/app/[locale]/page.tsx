'use client';

import { Hero2, Hero3 } from '@/assets/images';
import FeatureCards from '@/components/landing-page/feature-cards/feature-cards';
import Hero from '@/components/landing-page/hero/hero';
import MainLayout from '@/components/landing-page/layout/main-layout';
import WorkCard from '@/components/landing-page/work-card/work-card';
import useTranslationData from '@/hooks/use-translation-data';
import Image from 'next/image';
import styles from './Home.module.css';

export default function Home() {
	const {
		afterOLo,
		beforeOLo,
		benefitsOrganisationData,
		businessFeatures,
		featureData,
		homePageText,
		impactPoints,
		problemPoints,
		whoWeWorkWithData,
		downloadPageText,
	} = useTranslationData();

	return (
		<MainLayout>
			<div className={styles.mainContent}>
				<Hero />
				{/*  Why Eye Health Matters */}
				<section className={styles.featuresSection}>
					<div className={styles.twoColumnLayout}>
						<Image
							src={Hero3}
							alt={homePageText.whyEyeHealthSection.imageAlt}
							width={500}
							height={500}
							className={styles.layoutImage}
						/>
						<div className={styles.layoutContent}>
							<h2 className={styles.sectionTitle}>
								{homePageText.whyEyeHealthSection.title}
							</h2>
							<div className={styles.infoCard}>
								<h3 className={styles.subHeading}>
									{homePageText.whyEyeHealthSection.problemSubheading}
								</h3>
								<ul className={styles.checkList}>
									{problemPoints.map((point, index) => (
										<li key={index} className={styles.checkListItem}>
											{point}
										</li>
									))}
								</ul>
							</div>
							<div className={styles.infoCard}>
								<h3 className={styles.subHeading}>
									{homePageText.whyEyeHealthSection.impactSubheading}
								</h3>
								<ul className={styles.checkList}>
									{impactPoints.map((point, index) => (
										<li key={index} className={styles.checkListItem}>
											{point}
										</li>
									))}
								</ul>
							</div>
						</div>
					</div>
				</section>

				{/*  What oLo Does */}
				<section id="features" className={styles.featuresSection}>
					<h2 className={styles.sectionTitle}>{homePageText.featuresSection.title}</h2>
					<FeatureCards features={featureData} />
				</section>

				{/*  Benefits for Organizations */}
				<section id="organisation-benefits" className={styles.featuresSection}>
					<h2 className={styles.sectionTitle}>
						{homePageText.organizationBenefitsSection.title}
					</h2>
					<FeatureCards features={benefitsOrganisationData} />
				</section>

				{/*  Built for Business */}
				<section className={styles.featuresSection}>
					<h2 className={styles.sectionTitle}>
						{homePageText.builtForBusinessSection.title}
					</h2>
					<div className={styles.twoColumnLayout}>
						<Image
							src={Hero2}
							alt={homePageText.builtForBusinessSection.imageAlt}
							width={500}
							height={500}
							className={styles.layoutImage}
						/>
						<div className={styles.buisnessContent}>
							{businessFeatures.map((feature, index) => (
								<div key={index}>
									<h3 className={styles.subHeading}>{feature.title}</h3>
									<p className={styles.sectionDescription}>
										{feature.description}
									</p>
								</div>
							))}
						</div>
					</div>
				</section>

				{/*  Who We Work With */}
				<section id="who-we-work-with" className={styles.featuresSection}>
					<h2 className={styles.sectionTitle}>
						{homePageText.whoWeWorkWithSection.title}
					</h2>
					<FeatureCards features={whoWeWorkWithData} />
				</section>

				{/*  Corporate Wellness ROI */}
				<section className={styles.featuresSection}>
					<h2 className={styles.sectionTitle}>
						{homePageText.corporateWellnessSection.title}
					</h2>
					<div className={styles.twoColumnLayout}>
						<div className={styles.infoCard}>
							<h3 className={styles.subHeading}>
								{homePageText.corporateWellnessSection.beforeSubheading}
							</h3>
							<ul className={styles.checkList}>
								{beforeOLo.map((point, index) => (
									<li key={index} className={styles.checkListItem}>
										{point}
									</li>
								))}
							</ul>
						</div>
						<div className={styles.infoCard}>
							<h3 className={styles.subHeading}>
								{homePageText.corporateWellnessSection.afterSubheading}
							</h3>
							<ul className={styles.checkList}>
								{afterOLo.map((point, index) => (
									<li key={index} className={styles.checkListItem}>
										{point}
									</li>
								))}
							</ul>
						</div>
					</div>
				</section>

				{/*  How It Works */}
				<section id="trust-proof" className={styles.WorksSection}>
					<WorkCard />
				</section>
				{/*  Download Section */}
				{/* <section className={styles.downloadSection}>
							<div className={styles.downloadTitle}>
								{homePageText.downloadSection.title}
							</div>
							<p className={styles.downloadSubtitle}>
								{homePageText.downloadSection.subtitle}
							</p>
							<p className={styles.downloadDescription}>
								{homePageText.downloadSection.description}
							</p>
							<Link href="/download" className={styles.downloadButton}>
								{homePageText.downloadSection.button}
								<ChevronRight size={20} />
							</Link>
				</section> */}
			</div>
		</MainLayout>
	);
}
