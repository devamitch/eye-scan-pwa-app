import LoginForm from '@/components/auth/login-form/login-form';
import useTranslationData from '@/hooks/use-translation-data';

export default function SignInPage() {
	const { loginFormText } = useTranslationData();

	return (
		<>
			<LoginForm />
			{/* <div className={styles.linkContainer}>
				{loginFormText.createAccountText}{' '}
				<Link href="/register" className={styles.link}>
					{loginFormText.createAccountLink}
				</Link>
			</div> */}
		</>
	);
}
