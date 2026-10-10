'use client';

import TitleHeader from '@/components/layout/Title/TitleHeader';
import AccountDeletionDialog from '@/components/settings/account-deletion-dialog/account-deletion-dialog';
import useTranslationData from '@/hooks/use-translation-data';
import { useRouter } from '@/i18n/navigation';
import useAppStore from '@/store';
import { handleWebsiteClick } from '@/utils/utility';
import { AlertTriangle, ChevronDown, ChevronRight, ChevronUp, LogOut, Trash2 } from 'lucide-react';
import { useState } from 'react';
import styles from './SettingsPage.module.css';
import PasswordChangeDialog from '@/components/settings/password-change-dialog/password-change-dialog';
import ProfileCard from '@/components/profile/profile-card/Profile-card';
import { DummyProfileImg } from '@/assets/images';

export default function SettingsPage() {
	const { settingsPageText } = useTranslationData();
	const router = useRouter();
	const user = useAppStore((state) => state.auth.user);
	const authUser = user;
	const logout = useAppStore((state) => state.auth.logout);
	const [isPasswordDialogOpen, setIsPasswordDialogOpen] = useState(false);
	const [isDeleteAccountDialogOpen, setIsDeleteAccountDialogOpen] = useState(false);
	const [isSpecialistRegionOpen, setIsSpecialistRegionOpen] = useState(false);
	const [isProductCategoriesOpen, setIsProductCategoriesOpen] = useState(false);
	const [selectedRegion, setSelectedRegion] = useState<string[]>([]);
	const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

	// Region options
	const regionOptions = [
		{ id: 'canada', label: settingsPageText.discoveryPreferences.regions.canada },
		{ id: 'korea', label: settingsPageText.discoveryPreferences.regions.korea },
	];

	// Product category options
	const categoryOptions = [
		{ id: 'glasses', label: settingsPageText.discoveryPreferences.categories.glasses },
		{ id: 'gadgets', label: settingsPageText.discoveryPreferences.categories.gadgets },
		{ id: 'supplements', label: settingsPageText.discoveryPreferences.categories.supplements },
		{ id: 'eyedrops', label: settingsPageText.discoveryPreferences.categories.eyedrops },
	];

	const handleLogout = async () => {
		try {
			await logout();
			router.push('/signin');
		} catch (error) {
			console.error('Error signing out: ', error);
		}
	};

	const handleUserButtonClick = () => {
		router.push('/profile');
	};

	const handleNotificationSettings = () => {
		router.push('/settings/notifications');
	};

	const handlePasswordChangeClick = () => {
		setIsPasswordDialogOpen(true);
	};

	const handleClosePasswordDialog = () => {
		setIsPasswordDialogOpen(false);
	};

	const handleDeleteAccountClick = () => {
		setIsDeleteAccountDialogOpen(true);
	};

	const handleCloseDeleteAccountDialog = () => {
		setIsDeleteAccountDialogOpen(false);
	};

	const toggleSpecialistRegion = () => {
		setIsSpecialistRegionOpen(!isSpecialistRegionOpen);
	};

	const toggleProductCategories = () => {
		setIsProductCategoriesOpen(!isProductCategoriesOpen);
	};

	const handleRegionSelect = (regionId: string) => {
		setSelectedRegion((prev) =>
			prev.includes(regionId) ? prev.filter((id) => id !== regionId) : [...prev, regionId]
		);
	};

	const handleCategoryToggle = (categoryId: string) => {
		setSelectedCategories((prev) =>
			prev.includes(categoryId)
				? prev.filter((id) => id !== categoryId)
				: [...prev, categoryId]
		);
	};

	return (
		<div className={styles.container}>
			<ProfileCard
				name={authUser?.name || ''}
				email={authUser?.email || ''}
				image={authUser?.avatar || DummyProfileImg}
				age ={authUser?.age || null}
			/>
			{/* Account Settings */}
			<>
				<TitleHeader title={settingsPageText.sectionTitles.accountSettings} />
				<div className={styles.section}>
					{/* <button className={styles.button} onClick={handleUserButtonClick}>
						<span>{settingsPageText.accountSettings.profileInfo}</span>
						<ChevronRight size={21} />
					</button> */}
					<button className={styles.button} onClick={handlePasswordChangeClick}>
						<span>{settingsPageText.accountSettings.changePassword}</span>
						<ChevronRight size={21} />
					</button>
				</div>
			</>

			{/* Discovery Preferences */}
			<>
				<TitleHeader title={settingsPageText.sectionTitles.discoveryPreferences} />
				<div className={styles.section}>
					<button className={styles.button} onClick={toggleSpecialistRegion}>
						<span>{settingsPageText.discoveryPreferences.specialistRegion}</span>
						{isSpecialistRegionOpen ? (
							<ChevronUp size={21} />
						) : (
							<ChevronDown size={21} />
						)}
					</button>

					{isSpecialistRegionOpen && (
						<div className={styles.accordionContent}>
							{regionOptions.map((region) => (
								<button
									key={region.id}
									className={`${styles.optionButton} ${selectedRegion.includes(region.id) ? styles.selectedOption : ''}`}
									onClick={() => handleRegionSelect(region.id)}
								>
									<span>{region.label}</span>
								</button>
							))}
						</div>
					)}

					<button className={styles.button} onClick={toggleProductCategories}>
						<span>{settingsPageText.discoveryPreferences.productCategories}</span>
						{isProductCategoriesOpen ? (
							<ChevronUp size={21} />
						) : (
							<ChevronDown size={21} />
						)}
					</button>

					{isProductCategoriesOpen && (
						<div className={styles.accordionContent}>
							{categoryOptions.map((category) => (
								<button
									key={category.id}
									className={`${styles.optionButton} ${selectedCategories.includes(category.id) ? styles.selectedOption : ''}`}
									onClick={() => handleCategoryToggle(category.id)}
								>
									<span>{category.label}</span>
								</button>
							))}
						</div>
					)}

					<button className={styles.button} onClick={handleNotificationSettings}>
						<span>{settingsPageText.sectionTitles.notification}</span>
						<ChevronRight size={21} />
					</button>
				</div>
			</>

			{/* Help & Support */}
			<>
				<TitleHeader title={settingsPageText.sectionTitles.helpSupport} />
				<div className={styles.section}>
					<button
						className={styles.button}
						onClick={() => handleWebsiteClick('https://olo-care.com/en/faq')}
					>
						<span>{settingsPageText.helpSupport.faq}</span>
						<ChevronRight size={21} />
					</button>
					<button
						className={styles.button}
						onClick={() => handleWebsiteClick('https://olo-care.com/en/contact-us')}
					>
						<span>{settingsPageText.helpSupport.contactUs}</span>
						<ChevronRight size={21} />
					</button>
					<button
						className={styles.button}
						onClick={() => handleWebsiteClick('https://olo-care.com/en/privacy-policy')}
					>
						<p>{settingsPageText.helpSupport.termsPrivacy}</p>
						<ChevronRight size={21} />
					</button>
				</div>
			</>

			{/* Danger Zone - Account Actions */}
			<>
				<TitleHeader title={settingsPageText.deleteAccount.sectionTitle} />
				<div className={styles.section}>
					{/* Delete Account Button */}
					<button
						className={styles.deleteAccountButton}
						onClick={handleDeleteAccountClick}
					>
						<div className={styles.deleteAccountContent}>
							<div className={styles.deleteAccountIcon}>
								<Trash2 size={20} />
							</div>
							<div className={styles.deleteAccountText}>
								<span className={styles.deleteAccountTitle}>
									{settingsPageText.deleteAccount.deleteButton}
								</span>
								<span className={styles.deleteAccountSubtitle}>
									{settingsPageText.deleteAccount.deleteSubtitle}
								</span>
							</div>
						</div>
						<ChevronRight size={21} />
					</button>

					{/* Delete Account Warning */}
					<div className={styles.deleteWarning}>
						<AlertTriangle size={16} />
						<p>{settingsPageText.deleteAccount.warningText}</p>
					</div>
				</div>
			</>

			{/* Logout Button */}
			<>
				<button onClick={handleLogout} className={styles.Logoutbutton}>
					<LogOut size={21} />
					{settingsPageText.logOut}
				</button>
			</>

			{/* Dialogs */}
			<PasswordChangeDialog
				isOpen={isPasswordDialogOpen}
				onClose={handleClosePasswordDialog}
			/>

			<AccountDeletionDialog
				isOpen={isDeleteAccountDialogOpen}
				onClose={handleCloseDeleteAccountDialog}
			/>
		</div>
	);
}
