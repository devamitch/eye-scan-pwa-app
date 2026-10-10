import { UserLoginSchema, UserRegisterSchema } from '@/lib/schema/user';
import useAppStore from '@/store';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { useFormMutation } from './use-api';
import { useMutation } from '@tanstack/react-query';
import { DeleteRequest } from '@/schema';
import { cancelDeleteAccountRequest, deleteAccountRequest } from '@/services/authService';
// Create Admin
export const useRegisterUser = () => {
	const router = useRouter();
	const register = useAppStore((state) => state.auth.register);
	return useFormMutation(
		UserRegisterSchema,
		async (data: Record<string, unknown>) => {
			const { email, password, name } = data as {
				email: string;
				password: string;
				name: string;
			};

			// Default role to USER
			const role: 'ADMIN' | 'USER' = 'USER';
			await register(email, password, name, role);
		},
		{
			onSuccess: () => {
				toast.success('Registration successful');
				router.replace("/dashboard");
			},
			onError: (error: any) => {
				toast.error(error.response?.data?.message || 'Registration failed');
			},
		}
	);
};

// Login Admin
export const useLogin = () => {
	const router = useRouter();
	const login = useAppStore((state) => state.auth.login);
	const { startScreenTime } = useAppStore((state) => state?.screenTime);

	return useFormMutation(
		UserLoginSchema,
		async (data: Record<string, unknown>) => {
			const { email, password } = data as { email: string; password: string };
			await login(email, password);
		},
		{
			mode: 'onSubmit',
			reValidateMode: 'onSubmit',
			onSuccess: () => {
				startScreenTime();
				toast.success('Login successful');
				router.replace("/dashboard");
			},
			onError: (error: any) => {
				// console.log('inithe err', error);
				toast.error(error.response?.data?.message || 'Login failed');
			},
		}
	);
};

export const useAppleLogin = () => {
	const router = useRouter();
	const appleLogin = useAppStore((state) => state.auth.appleLogin);
	const { startScreenTime } = useAppStore((state) => state?.screenTime);

	return useMutation({
		mutationFn: async (idToken: string) => {
			await appleLogin(idToken);
		},
		onSuccess: () => {
			startScreenTime();
			toast.success('Apple Login successful');
			router.push('/dashboard');
		},
		onError: (error: any) => {
			console.log('inithe err', error);
			toast.error(error?.response?.data?.message || 'Apple Login failed');
		},
	});
};
export function useDeleteRequest() {
  return useMutation({
    mutationKey: ['createDeleteRequest'],
    mutationFn: async (data: DeleteRequest) => {
      const response = await deleteAccountRequest(data);
      return response;
    },
  });
}

export const useUpdateUser = () => {
	const router = useRouter();
	const updateUserProfile = useAppStore((state) => state.auth.updateUserProfile);

	return useMutation({
		mutationKey: ['updateUser'],
		mutationFn: async (data: { name?: string; email?: string; age?: number | null; avatar?: string }) => {
			await updateUserProfile(data);
		},
		onSuccess: () => {
			toast.success('Profile updated successfully');
			router.push('/settings');
		},
		onError: (error: any) => {
			console.log('Update error', error);
			toast.error(error?.response?.data?.message || 'Failed to update profile');
		},
	});
};

export function useDeleteCancel() {
  return useMutation({
    mutationKey: ['cancelDeleteRequest'],
    mutationFn: async () => {
      const response = await cancelDeleteAccountRequest();
      return response;
    },
  });
}