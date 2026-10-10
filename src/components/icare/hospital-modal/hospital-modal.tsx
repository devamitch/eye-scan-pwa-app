import { Button } from '@/components/base/buttons';
import useTranslationData from '@/hooks/use-translation-data';
import { HospitalCardData } from '@/types';
import Dialog from '@/components/base/Dialog';
import { Clock, Globe, MapPin, Phone, Star } from 'lucide-react';
import Image from 'next/image';
import React, { useEffect } from 'react';
import styles from './hospital-modal.module.css';
import { handleWebsiteClick } from '@/utils/utility';
import { ImageComponent } from '@/components/base/Image';

interface HospitalModalProps {
	isOpen: boolean;
	onClose: () => void;
	hospital: HospitalCardData | null;
}

const HospitalModal: React.FC<HospitalModalProps> = ({ isOpen, onClose, hospital }) => {
	const { hospitalModalText } = useTranslationData();

	useEffect(() => {
		console.log('HospitalModal - isOpen:', isOpen, 'hospital:', hospital);
	}, [isOpen, hospital]);

	if (!hospital) return null;



	return (
		<Dialog isOpen={isOpen} onClose={onClose}>
			<div className={styles.imageSection}>
				<div className={styles.mainImageContainer}>
					<ImageComponent
						src={hospital.image}
						alt={hospital.title}
						width={180}
						height={200}
						className={styles.mainImage}
					/>
				</div>

				{hospital.additionalImages && hospital.additionalImages.length > 0 && (
					<div className={styles.additionalImages}>
						{hospital.additionalImages.map((img, index) => (
							<div key={index} className={styles.additionalImageContainer}>
								<ImageComponent
									src={img}
									alt={`${hospital.title} ${index + 2}`}
									width={65}
									height={75}
									className={styles.additionalImage}
								/>
							</div>
						))}
					</div>
				)}
			</div>
			<div className={styles.headerSection}>
				<h2 className={styles.hospitalName}>{hospital.title}</h2>
				<div className={styles.rating}>
					<Star size={12} className={styles.starIcon} />
					<span className={styles.ratingText}>{hospital.rating}</span>
				</div>
			</div>

			<div className={styles.actionButtons}>
				<Button onClick={()=>handleWebsiteClick(hospital.website)} fullWidth variant="primary" size="large"  leftIcon={<Globe size={18} />}>
					{hospitalModalText.actionButtons.website}
				</Button>
				<Button onClick={()=>handleWebsiteClick(hospital.locationLink)} fullWidth variant="primary" size="large" leftIcon={<MapPin size={18} />}>
					{hospitalModalText.actionButtons.directions}
				</Button>
				<Button onClick={()=>handleWebsiteClick(hospital.locationLink)} fullWidth variant="primary" size="large" leftIcon={<Star size={18} />}>
					{hospitalModalText.actionButtons.reviews}
				</Button>
			</div>

			<div className={styles.detailsSection}>
				<div className={styles.detailLabel}>
					<MapPin size={20} className={styles.detailIcon} />
					{hospitalModalText.detailLabels.address}{' '}
					<p className={styles.detailText}>{hospital.address}</p>
				</div>
				<div className={styles.detailLabel}>
					<Phone size={20} className={styles.detailIcon} />
					{hospitalModalText.detailLabels.getThere}{' '}
					<p className={styles.detailText}>{hospital.phone}</p>
				</div>
				<div className={styles.detailLabel}>
					<Clock size={20} className={styles.detailIcon} />
					{hospitalModalText.detailLabels.hours}{' '}
					<p className={styles.hours}>{hospital.hours}</p>
				</div>
			</div>
		</Dialog>
	);
};

export default HospitalModal;
