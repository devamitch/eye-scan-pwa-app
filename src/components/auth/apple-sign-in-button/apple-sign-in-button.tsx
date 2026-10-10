'use client';

import AppleSignin from 'react-apple-signin-auth';
import { useAppleLogin } from '@/hooks/use-user';

type Props = {
	disabled?: boolean;
	className?: string;
};

export default function AppleSignInButton({ disabled, className }: Props) {
	const appleLoginMutation = useAppleLogin();

	const handleAppleResponse = async (response: any) => {
		try {
			const idToken = response?.authorization?.id_token;
			if (!idToken) {
				throw new Error('No id_token returned from Apple');
			}
			appleLoginMutation.mutate(idToken);
		} catch (err: any) {
			console.error('Apple login failed', err);
			alert('Failed to sign in with Apple. Please try again.');
		}
	};

	const handleAppleError = (error: any) => {
		console.error('Apple Sign In Error:', error?.message || error?.error || error?.toString());
		if (!error.error?.includes('popup_closed_by_user')) {
			alert('Apple Sign In failed. Please try again.');
		}
	};

	return (
		<AppleSignin
			className={className}
			authOptions={{
				clientId: 'com.devamitch.olodesktop',
				scope: 'name email',
				redirectURI: 'https://olo-care.com/en/dashboard/', // ✅ Use the helper function
				usePopup: true,
				state: 'state',
				nonce: 'nonce',
			}}
			uiType="dark"
			onSuccess={handleAppleResponse}
			onError={handleAppleError}
			skipScript={false}
		/>
	);
}
