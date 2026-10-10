'use client';

import { Button } from '@/components/base/buttons';
import Dialog from '@/components/base/Dialog';
import { useDeleteCancel } from '@/hooks/use-user';
import { useAppStore } from '@/store';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import styles from './deletion-request-dialog.module.css';

export function DeletionRequestDialog() {
	const user = useAppStore((state) => state.auth.user);
	const updateUser = useAppStore((state) => state.auth.updateUser);
	const logout = useAppStore((state) => state.auth.logout);
	const router = useRouter();
	
	const [isCancelling, setIsCancelling] = useState(false);
	const deleteCancelMutation = useDeleteCancel();

	const isDialogOpen = !!user?.delete_requested_at;

	const requestDate = user?.delete_requested_at ? new Date(user.delete_requested_at) : new Date();
	const formattedDate = requestDate.toLocaleDateString('en-US', {
		year: 'numeric',
		month: 'long',
		day: 'numeric',
	});

	const handleCancelDeletion = async () => {
		setIsCancelling(true);
		
		try {
			console.log('Cancelling deletion request...');
			await deleteCancelMutation.mutateAsync();
			updateUser({ delete_requested_at: null});
		} catch (error) {
			console.error('Failed to cancel deletion request:', error);
		} finally {
			setIsCancelling(false);
		}
	};

	const handleProceedWithDeletion = () => {
		logout();
		router.push('/signin');
	};

	return (
		<Dialog isOpen={isDialogOpen} onClose={() => {}}>
			<div className={styles.container}>
				<h2 className={styles.title}>Account Deletion Requested</h2>
				<p className={styles.description}>
					You requested account deletion on {formattedDate}. Do you wish to proceed with the deletion or cancel the request?
				</p>

				<div className={styles.buttonContainer}>
					<Button
						onClick={handleCancelDeletion}
						disabled={isCancelling}
						variant="primary"
						size="large"
						fullWidth
						loading={isCancelling}
					>
						Cancel Deletion & Stay with Us
					</Button>

					<Button
						onClick={handleProceedWithDeletion}
						variant="danger"
						size="large"
						fullWidth
					>
						Proceed with Deletion
					</Button>
				</div>
			</div>
		</Dialog>
	);
}