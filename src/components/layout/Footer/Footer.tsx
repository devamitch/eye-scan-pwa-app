'use client';

import useTranslationData from '@/hooks/use-translation-data';
import { Link } from '@/i18n/navigation';
import useAppStore from '@/store';
import styles from './Footer.module.css';

export default function Footer() {
	const { footerText } = useTranslationData();
	const { setDisclaimerAccepted, disclaimerAccepted: isOpen } = useAppStore(
		(state) => state?.auth
	);
	return (
		<footer className={styles.footer}>
			<div className={styles.copyright}>
				@{new Date().getUTCFullYear()}, {footerText.copyright}
			</div>

			<div className={styles.section}>
				<Link href="/faq" className={styles.link}>
					{footerText.faqText}
				</Link>
				<Link href="/privacy-policy" className={styles.link}>
					{footerText.privacyText}
				</Link>
				<Link href="/contact-us" className={styles.link}>
					{footerText.contactText}
				</Link>
				<Link
					href="#disclaimer"
					className={styles.link}
					onClick={() => {
						setDisclaimerAccepted(false);
					}}
				>
					{footerText.disclaimerText}
				</Link>
			</div>
		</footer>
	);
}
