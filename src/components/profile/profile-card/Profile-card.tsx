'use client';

import useTranslationData from '@/hooks/use-translation-data';
import { Link } from '@/i18n/navigation';
import { ProfileCardProps } from '@/types';
import { Pencil } from 'lucide-react';
import { useLocale } from 'next-intl';
import Image from 'next/image';
import useAppStore from '@/store';
import { Button } from '@/components/base/buttons';
import styles from './Profile-card.module.css';

function ProfileCard({ name, email, image , age }: ProfileCardProps) {
	const { profilePageText } = useTranslationData();
	const locale = useLocale();

	return (
		<div className={styles.container}>
			<div className={styles.profileContainer}>
				<Image
					src={image}
					alt="Profile Image"
					width={36}
					height={36}
					className={styles.avatar}
				/>
				<div className={styles.profileSection}>
					<div className={styles.nameContainer}>
						<h2 className={styles.title}>{name}</h2>
						
							<div className={styles.ageBadge}>
								{age} {profilePageText.profileCard.years}
							</div>
						
					</div>
					
					<p className={styles.subtitle}>{email}</p>
					<Link href="/dashboard" className={styles.link} locale={locale}>
						{profilePageText.profileCard.ctaButton}
					</Link>
				</div>
			</div>
			<Link href="/settings/updateprofile" locale={locale} className={styles.editLink}>
				<Button variant="link" size="small" rightIcon={<Pencil size={14} />}>
					<p className={styles.editText}>Edit</p>
					
				</Button>
			</Link>
		</div>
	);
}

export default ProfileCard;
