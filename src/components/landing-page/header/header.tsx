'use client';
import useTranslationData from '@/hooks/use-translation-data';
import { Link } from '@/i18n/navigation';
import styles from './header.module.css';
import { useRouter } from 'next/navigation';
import { Download } from 'lucide-react';
import LanguageSwitcher from '@/components/layout/language-switcher/language-switcher';

function Header() {
	const { headerText } = useTranslationData();
		const router = useRouter();

	return (
		<header className={styles.header}>
			<span className={styles.logoText} onClick={() => router.push('/')}>{headerText.logoText}</span>
			<div className={styles.navLinks}>
				<LanguageSwitcher />
				<Link href="/download">
					<button className={styles.downloadButton}><Download size={16} />{headerText.downloadButton}</button>
				</Link>
				<Link href="/signin">
					<button className={styles.signInButton}>{headerText.signInButton}</button>
				</Link>
				<Link href="/register">
					<button className={styles.startButton}>{headerText.getStartedButton}</button>
				</Link>
				
			</div>
		</header>
	);
}

export default Header;
