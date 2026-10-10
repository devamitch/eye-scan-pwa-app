'use client';
import { Hero1 } from '@/assets/images';
import useTranslationData from '@/hooks/use-translation-data';
import { Link } from '@/i18n/navigation';
import { ArrowRight } from 'lucide-react';
import Image from 'next/image';
import styles from './hero.module.css';

function Hero() {
	const { heroText } = useTranslationData();

	return (
		<section className={styles.heroSection}>
			<div className={styles.content}>
				<p className={styles.heading}>
					<span className={styles.heroHeading}> {heroText.heading}</span>
					<span className={styles.highlight}>{heroText.highlight}</span>
					<span className={styles.subheading}>{heroText.subheading}</span>
				</p>

				<div className={styles.buttonGroup}>
					<Link href="/register" className={styles.btnsignin}>
						<p>{heroText.getStartedButton}</p>
						<ArrowRight className={styles.btnIcon} />
					</Link>
					<Link href="#trust-proof" className={styles.btnWork}>
						{heroText.learnMoreButton}
					</Link>
				</div>
			</div>
			<Image
				src={Hero1}
				alt={heroText.imageAlt}
				width={500}
				height={500}
				className={styles.image}
			/>
		</section>
	);
}

export default Hero;
