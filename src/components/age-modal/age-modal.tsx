'use client';
import React, { useState, useEffect } from 'react';
import Dialog from '@/components/base/Dialog';
import { NumberInput } from '@/components/base/inputs';
import { Button } from '@/components/base/buttons';
import useAppStore from '@/store';
import { useUpdateUser } from '@/hooks/use-user';
import styles from './age-modal.module.css';

const AgeModal: React.FC = () => {
	const { user } = useAppStore((state) => state.auth);
	const updateUserMutation = useUpdateUser();
	const [age, setAge] = useState<number | ''>('');
	
	// Modal is open if user exists but age is null
	const isOpen = user !== null && user.age === null;

	// Reset age when modal closes/opens
	useEffect(() => {
		if (isOpen) {
			setAge('');
		}
	}, [isOpen]);

	const handleNext = async () => {
		if (age && typeof age === 'number' && user) {
			// Update user with existing name, email, and new age
			updateUserMutation.mutate({
				name: user.name,
				email: user.email,
				age: age,
			});
		}
	};

	const handleClose = () => {
		// Prevent closing if age is not set
		if (user && user.age === null) {
			return;
		}
	};

	return (
		<Dialog isOpen={isOpen} onClose={handleClose}>
			<div className={styles.ageModalContainer}>
				<h2 className={styles.title}>What is your chronological age?</h2>
				
				<div className={styles.inputContainer}>
					<NumberInput
						value={age}
						onChange={setAge}
						placeholder="Enter your age"
						min={1}
						max={120}
						required
						label="Age"
						name="age"
						id="age-input"
					/>
				</div>

				<div className={styles.buttonContainer}>
					<Button
						onClick={handleNext}
						disabled={!age || age < 1 || updateUserMutation.isPending}
						loading={updateUserMutation.isPending}
						fullWidth
						variant="primary"
					>
						Next
					</Button>
				</div>
			</div>
		</Dialog>
	);
};

export default AgeModal;
