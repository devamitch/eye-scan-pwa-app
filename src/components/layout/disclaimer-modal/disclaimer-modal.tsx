'use client';

import Dialog from '@/components/base/Dialog';
import { Button } from '@/components/base/buttons';
import { useTranslatedData } from '@/hooks/use-translation-data';
import useAppStore from '@/store';
import { AlertTriangle, CheckCircle, Eye, Info, Shield } from 'lucide-react';
import React, { useState } from 'react';
import styles from './disclaimer-modal.module.css';

interface DisclaimerModalProps {
	showAcceptButton?: boolean; // True for first-time after login, false for settings view
}

const DisclaimerModal: React.FC<DisclaimerModalProps> = ({ showAcceptButton = true }) => {
	const [hasScrolledToBottom, setHasScrolledToBottom] = useState(false);
	const [isAccepting, setIsAccepting] = useState(false);

	const { setDisclaimerAccepted, disclaimerAccepted: isOpen } = useAppStore(
		(state) => state?.auth
	);
	const { disclaimerModalText } = useTranslatedData();



	const onAccept = () => {
		// Set disclaimer accepted in the store
		setDisclaimerAccepted(true);
	};
	const onClose = () => {
		setDisclaimerAccepted(true);
	};

	const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
		const element = e.currentTarget;
		const isAtBottom = element.scrollHeight - element.scrollTop <= element.clientHeight + 10;

		if (isAtBottom && !hasScrolledToBottom) {
			setHasScrolledToBottom(true);
		}
	};

	const handleAccept = () => {
		setIsAccepting(true);
		try {
			onAccept();
			onClose();
		} catch (error) {
			console.error('Error accepting disclaimer:', error);
		} finally {
			setIsAccepting(false);
		}
	};

	const handleClose = () => {
		if (!showAcceptButton) {
			// In settings, can close anytime
			onClose();
		}
		// In first-time mode, can only close via Accept button
	};

	// useEffect(() => {
	// 	if (!isOpen) {
	// 		setHasScrolledToBottom(false);
	// 		setIsAccepting(false);
	// 	}
	// }, [isOpen]);

	return (
		<Dialog
			isOpen={!isOpen}
			onClose={handleClose}
			// closeOnOverlayClick={!showAcceptButton}
			footer={
				showAcceptButton ? (
					<div className={styles.footer}>
						<Button
							onClick={handleAccept}
							variant="primary"
							size="medium"
							fullWidth
							loading={isAccepting}
							disabled={!hasScrolledToBottom || isAccepting}
							leftIcon={!isAccepting ? <CheckCircle size={20} /> : undefined}
						>
							{isAccepting 
								? disclaimerModalText.buttons.accepting 
								: disclaimerModalText.buttons.acceptButton}
						</Button>
						{!hasScrolledToBottom && (
							<p className={styles.scrollHint}>
								{disclaimerModalText.buttons.scrollHint}
							</p>
						)}
					</div>
				) : (
					<div className={styles.footer}>
						<Button 
							onClick={onClose} 
							variant="outline" 
							size="medium"
							fullWidth
						>
							{disclaimerModalText.buttons.closeButton}
						</Button>
					</div>
				)
			}
		>
			<div className={styles.modalContainer}>
				{/* Header */}
				<div className={styles.header}>
					<div className={styles.iconContainer}>
						<AlertTriangle size={48} className={styles.alertIcon} />
					</div>
					<h2 className={styles.title}>{disclaimerModalText.header.title}</h2>
					<p className={styles.subtitle}>{disclaimerModalText.header.subtitle}</p>
				</div>

				{/* Scrollable Content */}
				<div className={styles.content} onScroll={handleScroll}>
					{/* Main Disclaimer */}
					<div className={styles.section}>
						<div className={styles.sectionHeader}>
							<Shield size={24} className={styles.sectionIcon} />
							<h3 className={styles.sectionTitle}>{disclaimerModalText.sections.medicalDisclaimer.title}</h3>
						</div>
						<div className={styles.disclaimerBox}>
							<p className={styles.emphasizedText}>
								<strong>{disclaimerModalText.sections.medicalDisclaimer.emphasizedText}</strong>
							</p>
							<p className={styles.bodyText}>
								{disclaimerModalText.sections.medicalDisclaimer.bodyText}
							</p>
						</div>
					</div>

					{/* What oLo Is */}
					<div className={styles.section}>
						<div className={styles.sectionHeader}>
							<Eye size={24} className={styles.sectionIcon} />
							<h3 className={styles.sectionTitle}>{disclaimerModalText.sections.whatOloDoes.title}</h3>
						</div>
						<ul className={styles.list}>
							{disclaimerModalText.sections.whatOloDoes.items.map((item: string, index: number) => (
								<li key={index}>{item}</li>
							))}
						</ul>
					</div>

					{/* What oLo Is NOT */}
					<div className={styles.section}>
						<div className={styles.sectionHeader}>
							<AlertTriangle size={24} className={styles.sectionIcon} />
							<h3 className={styles.sectionTitle}>{disclaimerModalText.sections.whatOloDoesNot.title}</h3>
						</div>
						<div className={styles.warningBox}>
							<ul className={styles.list}>
								{disclaimerModalText.sections.whatOloDoesNot.items.map((item: string, index: number) => (
									<li key={index}>{item}</li>
								))}
							</ul>
						</div>
					</div>

					{/* Professional Consultation */}
					<div className={styles.section}>
						<div className={styles.sectionHeader}>
							<Info size={24} className={styles.sectionIcon} />
							<h3 className={styles.sectionTitle}>{disclaimerModalText.sections.seekProfessionalCare.title}</h3>
						</div>
						<div className={styles.infoBox}>
							<p className={styles.bodyText}>
								<strong>{disclaimerModalText.sections.seekProfessionalCare.bodyText}</strong>
							</p>
							<ul className={styles.list}>
								{disclaimerModalText.sections.seekProfessionalCare.items.map((item: string, index: number) => (
									<li key={index}>{item}</li>
								))}
							</ul>
							<p className={styles.bodyText}>
								{disclaimerModalText.sections.seekProfessionalCare.warningText}
							</p>
						</div>
					</div>

					{/* Accuracy & Limitations */}
					<div className={styles.section}>
						<div className={styles.sectionHeader}>
							<Info size={24} className={styles.sectionIcon} />
							<h3 className={styles.sectionTitle}>{disclaimerModalText.sections.accuracyLimitations.title}</h3>
						</div>
						<p className={styles.bodyText}>
							{disclaimerModalText.sections.accuracyLimitations.bodyText}
						</p>
						<ul className={styles.list}>
							{disclaimerModalText.sections.accuracyLimitations.items.map((item: string, index: number) => (
								<li key={index}>{item}</li>
							))}
						</ul>
						<p className={styles.bodyText}>
							{disclaimerModalText.sections.accuracyLimitations.warningText}
						</p>
					</div>

					{/* Privacy & Data */}
					<div className={styles.section}>
						<div className={styles.sectionHeader}>
							<Shield size={24} className={styles.sectionIcon} />
							<h3 className={styles.sectionTitle}>{disclaimerModalText.sections.privacyData.title}</h3>
						</div>
						<div className={styles.infoBox}>
							<p className={styles.bodyText}>
								<strong>{disclaimerModalText.sections.privacyData.bodyText}</strong>
							</p>
							<ul className={styles.list}>
								{disclaimerModalText.sections.privacyData.items.map((item: string, index: number) => (
									<li key={index}>{item}</li>
								))}
							</ul>
							<p className={styles.bodyText}>
								{disclaimerModalText.sections.privacyData.privacyPolicyText}{' '}
								<a
									href="https://AuraCore.medical/privacy"
									target="_blank"
									rel="noopener noreferrer"
									className={styles.link}
								>
									{disclaimerModalText.sections.privacyData.privacyPolicyLink}
								</a>{' '}
								{disclaimerModalText.sections.privacyData.privacyPolicyEnd}
							</p>
						</div>
					</div>

					{/* Terms of Use */}
					<div className={styles.section}>
						<div className={styles.sectionHeader}>
							<Info size={24} className={styles.sectionIcon} />
							<h3 className={styles.sectionTitle}>{disclaimerModalText.sections.termsOfUse.title}</h3>
						</div>
						<p className={styles.bodyText}>{disclaimerModalText.sections.termsOfUse.bodyText}</p>
						<ul className={styles.list}>
							{disclaimerModalText.sections.termsOfUse.items.map((item: string, index: number) => (
								<li key={index}>{item}</li>
							))}
						</ul>
					</div>

					{/* Liability */}
					<div className={styles.section}>
						<div className={styles.warningBox}>
							<p className={styles.bodyText}>
								<strong>{disclaimerModalText.sections.liability.text}</strong>
							</p>
						</div>
					</div>

					{/* Contact */}
					<div className={styles.section}>
						<div className={styles.sectionHeader}>
							<Info size={24} className={styles.sectionIcon} />
							<h3 className={styles.sectionTitle}>{disclaimerModalText.sections.contact.title}</h3>
						</div>
						<p className={styles.bodyText}>
							{disclaimerModalText.sections.contact.bodyText}
						</p>
						<ul className={styles.contactList}>
							<li>
								{disclaimerModalText.sections.contact.email}{' '}
								<a href="mailto:amit98ch@gmail.com" className={styles.link}>
									{disclaimerModalText.sections.contact.emailAddress}
								</a>
							</li>
							<li>
								{disclaimerModalText.sections.contact.helpCenter}{' '}
								<a
									href="https://help.AuraCore.medical"
									target="_blank"
									rel="noopener noreferrer"
									className={styles.link}
								>
									{disclaimerModalText.sections.contact.helpCenterUrl}
								</a>
							</li>
							<li>
								{disclaimerModalText.sections.contact.terms}{' '}
								<a
									href="https://AuraCore.medical/terms"
									target="_blank"
									rel="noopener noreferrer"
									className={styles.link}
								>
									{disclaimerModalText.sections.contact.termsUrl}
								</a>
							</li>
						</ul>
					</div>

					{/* Final Notice */}
					{showAcceptButton && (
						<div className={styles.finalNotice}>
							<p className={styles.emphasizedText}>
								<strong>
									{disclaimerModalText.finalNotice}
								</strong>
							</p>
						</div>
					)}
				</div>
			</div>
		</Dialog>
	);
};

export default DisclaimerModal;
