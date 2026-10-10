import RegisterForm from '@/components/auth/register-form/register-form';
import useTranslationData from '@/hooks/use-translation-data';

export default function RegisterPage() {
	const { registerFormText } = useTranslationData();

	return (
		<>
			<RegisterForm />
			{/* <div className={styles.linkContainer}>
				{registerFormText.signInLinkText}{' '}
				<Link href="/signin" className={styles.link}>
					{registerFormText.signInText}
				</Link>
			</div> */}
		</>
	);
}
