'use client';

import { eyecareicon, eyescanicon, homeicon } from '@/assets/Icons';
import useTranslationData from '@/hooks/use-translation-data';
import { Link } from '@/i18n/navigation';
import { useLocale } from 'next-intl';
import { usePathname } from 'next/navigation';
import styles from './bottom-tab-bar.module.css';

export function BottomTabBar() {
	const pathname = usePathname();
	const { sidebarText } = useTranslationData();
	const locale = useLocale();

	const tabItems = [
		{
			title: sidebarText.navItems[0].title,
			url: sidebarText.navItems[0].url,
			icon: homeicon,
		},
		{
			title: sidebarText.navItems[1].title,
			url: sidebarText.navItems[1].url,
			icon: eyescanicon,
		},
		{
			title: sidebarText.navItems[2].title,
			url: sidebarText.navItems[2].url,
			icon: eyecareicon,

		},
	];

	return (
		<div className={styles.bottomTabBar}>
			{tabItems.map((item) => {
				const isActive = pathname.includes(item.url);

				return (
					<Link
						key={item.title}
						className={`${styles.tabItem} ${isActive ? styles.active : styles.inactive}`}
						href={item.url}
						locale={locale}
					>
						<div className={styles.tabContent}>
							<div
								style={{
									maskImage: `url(${item.icon.src})`,
									WebkitMaskImage: `url(${item.icon.src})`,
									maskSize: 'contain',
									WebkitMaskSize: 'contain',
									maskRepeat: 'no-repeat',
									WebkitMaskRepeat: 'no-repeat',
									maskPosition: 'center',
									WebkitMaskPosition: 'center',
									backgroundColor: 'currentColor',
									width: '24px',
									height: '24px',
								}}
							/>
							{isActive && <span className={styles.tabLabel}>{item.title}</span>}
						</div>
					</Link>
				);
			})}
		</div>
	);
}

export default BottomTabBar;
