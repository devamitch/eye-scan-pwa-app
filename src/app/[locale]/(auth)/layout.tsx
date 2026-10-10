// app/(auth)/layout.tsx
import { Authpage2 } from '@/assets/images';
import { ImageComponent } from '@/components/base/Image';
import useTranslationData from '@/hooks/use-translation-data';
import styles from './auth-layout.module.css';

export default function AuthLayout({ children }: { children: React.ReactNode }) {
	const { heroText } = useTranslationData();

	return (
		<div className={styles.container}>
			<div className={styles.welcomeContainer}>
				<div className={styles.textContainer}>
					<p className={styles.heading}>
						{heroText.heading}{' '}
						<span className={styles.highlight}>{heroText.highlight}</span>
					</p>

					<p className={styles.heroSubtitle}>{heroText.subheading}</p>

					{/* Page-specific CTA */}
					{children && (
						<div className={styles.linkSlot}>{/* CTA injected from page */}</div>
					)}
				</div>

				<ImageComponent
					src={Authpage2}
					alt="Welcome"
					width={550}
					height={550}
					className={styles.image}
					style={{ transform: 'scaleX(-1)' }}
					priority
				/>
			</div>

			<div className={styles.formContainer}>{children}</div>
		</div>
	);
}
