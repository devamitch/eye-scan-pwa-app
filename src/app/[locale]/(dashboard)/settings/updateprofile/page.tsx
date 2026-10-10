'use client';

import { DummyProfileImg } from '@/assets/images';
import { Button } from '@/components/base/buttons';
import { NumberInput, TextInput } from '@/components/base/inputs';
import useTranslationData from '@/hooks/use-translation-data';
import { useUpdateUser } from '@/hooks/use-user';
import { useRouter } from '@/i18n/navigation';
import useAppStore from '@/store';
import { Pencil } from 'lucide-react';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { useShallow } from 'zustand/react/shallow';
import styles from './update-profile.module.css';

export default function UpdateProfilePage() {
	const { user } = useAppStore(useShallow((state) => state.auth));
	const router = useRouter();
	const { settingsPageText } = useTranslationData();
	const updateUserMutation = useUpdateUser();

	// Form state
	const [name, setName] = useState('');
	const [email, setEmail] = useState('');
	const [age, setAge] = useState<number | ''>('');
	const [imagePreview, setImagePreview] = useState<string>(user?.avatar || DummyProfileImg.src);
	const [hasChanges, setHasChanges] = useState(false);
	const [isInitialized, setIsInitialized] = useState(false);

	// Initialize form with user data only once
	useEffect(() => {
		if (user && !isInitialized) {
			setName(user.name || '');
			setEmail(user.email || '');
			setAge(user.age || '');
			setImagePreview(user.avatar || DummyProfileImg.src);
			setIsInitialized(true);
		}
	}, [user, isInitialized]);

	// Check if there are any changes
	useEffect(() => {
		const nameChanged = name !== (user?.name || '');
		const emailChanged = email !== (user?.email || '');
		const ageChanged = age !== (user?.age || '');

		setHasChanges(nameChanged || emailChanged || ageChanged);
	}, [name, email, age, user]);

	const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (file) {
			const reader = new FileReader();
			reader.onloadend = () => {
				setImagePreview(reader.result as string);
				setHasChanges(true);
			};
			reader.readAsDataURL(file);
		}
	};

	const handleSaveChanges = async () => {
		updateUserMutation.mutate({
			name,
			email,
			age: age === '' ? null : age,
		});
	};

	return (
		<div className={styles.container}>
			<div className={styles.content}>
				{/* Profile Image */}
				<div className={styles.imageContainer}>
					<div className={styles.imageWrapper}>
						<Image
							src={imagePreview}
							alt="Profile"
							width={120}
							height={120}
							className={styles.profileImage}
						/>
						<label htmlFor="image-upload" className={styles.editIcon}>
							<Pencil size={16} />
						</label>
						<input
							id="image-upload"
							type="file"
							accept="image/*"
							onChange={handleImageChange}
							className={styles.fileInput}
						/>
					</div>
				</div>

				{/* Form Fields */}
				<div className={styles.formSection}>
					<TextInput
						label="Name"
						value={name}
						onChange={setName}
						placeholder={user?.name || 'Enter your name'}
						required
					/>

					<TextInput
						label="Email"
						type="email"
						value={email}
						onChange={setEmail}
						placeholder={user?.email || 'Enter your email'}
						required
					/>

					<NumberInput
						label="Age"
						value={age}
						onChange={setAge}
						placeholder={user?.age?.toString() || 'Enter your age'}
						min={1}
						max={150}
					/>
				</div>

				<div className={styles.buttonContainer}>
					<Button
						variant="primary"
						size="large"
						fullWidth
						disabled={!hasChanges || updateUserMutation.isPending}
						loading={updateUserMutation.isPending}
						onClick={handleSaveChanges}
					>
						Save Changes
					</Button>
				</div>
			</div>
		</div>
	);
}
