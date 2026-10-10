'use client';

import styles from './download.module.css';

import MainLayout from '@/components/landing-page/layout/main-layout';
import { macDownloadLink, windowsDownloadLink } from '@/data';
import useTranslationData from '@/hooks/use-translation-data';
import { handleWebsiteClick } from '@/utils/utility';

const WindowsIcon = () => (
	<svg viewBox="0 0 24 24" fill="currentColor" width="1em" height="1em">
		<path d="M3 5.45v6.11l7.5.04V5.45zm7.5 7.39L3 12.8v6.11l7.5 1.07zM11.75 5.2v6.58h9.5V3.38zm0 13.85l9.5 1.34V13.1h-9.5z" />
	</svg>
);
const MacIcon = () => (
	<svg viewBox="0 0 24 24" fill="currentColor" width="1em" height="1em">
		<path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z" />
	</svg>
);


export default function DownloadPage() {
	const { downloadPageText } = useTranslationData();

	return (
		<MainLayout>
				{/* Hero Section */}
				<section className={styles.hero}>
					<div className={styles.title}>{downloadPageText.hero.title}</div>
					<p className={styles.subtitle}>{downloadPageText.hero.subtitle}</p>
				</section>
				<div className={styles.section}>
					{/* macOS App */}
					<div className={styles.appCard}>
						<div className={styles.iconWrapper}>
							<MacIcon />
						</div>
							<h3 className={styles.appTitle}>{downloadPageText.desktop.macos.title}</h3>
							<p className={styles.appDescription}>
								{downloadPageText.desktop.macos.description}
							</p>
						<button className={styles.downloadButton} onClick={()=>{handleWebsiteClick(macDownloadLink)}}>
							<MacIcon />
							{downloadPageText.desktop.macos.button}
							</button>
						</div>

					<div className={styles.appCard}>
						<div className={styles.iconWrapper}>
							<WindowsIcon />
						</div>
							<h3 className={styles.appTitle}>{downloadPageText.desktop.windows.title}</h3>
							<p className={styles.appDescription}>
								{downloadPageText.desktop.windows.description}
							</p>
						<button className={styles.downloadButton}onClick={()=>handleWebsiteClick(windowsDownloadLink)}>
							<WindowsIcon />
							{downloadPageText.desktop.windows.button}
							</button>
						</div>

				</div>
		</MainLayout>
	);
}
