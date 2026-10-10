'use client';

import HospitalMap from '@/components/icare/HospitalMap';
import { hospitalsData, specialistsData } from '@/data/hospitals-specialists-data';
import {
	ArrowLeft,
	ArrowRight,
	Calendar,
	Check,
	Globe,
	GraduationCap,
	Hospital,
	Phone,
	Star,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import styles from './specialist-detail.module.css';
import TitleHeader from '@/components/layout/Title/TitleHeader';

interface SpecialistDetailPageProps {
	specialistId: string;
}

export default function SpecialistDetailPage({ specialistId }: SpecialistDetailPageProps) {
	const router = useRouter();
	const specialist = specialistsData.find((s) => s.id === specialistId);
	const hospital = specialist ? hospitalsData.find((h) => h.id === specialist.hospitalId) : null;

	if (!specialist) {
		return (
			<div className={styles.container}>
				<div className={styles.error}>
					<h2>Specialist Not Found</h2>
					<button
						onClick={() => router.push('/icare/specialists')}
						className={styles.backButton}
					>
						Back to Specialists
					</button>
				</div>
			</div>
		);
	}

	return (
		<div className={styles.container}>
		
			{/* Profile Header */}
			<div className={styles.profileHeader}>
				<div className={styles.profileImage}>
					<img src={specialist.image} alt={specialist.name} />
				</div>
				<div className={styles.profileInfo}>
					<div className={styles.specialtyTag}>
						{specialist.specialty}
					</div>
					<h1 className={styles.name}>{specialist.name}</h1>
					<p className={styles.nameKr}>{specialist.nameKr}</p>

					<div className={styles.stats}>
						<span className={styles.rating}>
							<Star size={18} fill="currentColor" className={styles.starIcon} />{' '}
							{specialist.rating}
						</span>
						<span className={styles.reviews}>({specialist.reviews} reviews)</span>
						<span className={styles.experience}>
							<Calendar size={18} /> {specialist.experience} Experience
						</span>
					</div>

					<div className={styles.fee}>
						<span className={styles.feeLabel}>Consultation Fee:</span>
						<strong>{specialist.consultationFee}</strong>
					</div>
				</div>
			</div>

			<div className={styles.mainGrid}>
				{/* Left Column: Main Content */}
				<div className={styles.leftColumn}>
					{/* About */}
					<div className={styles.section}>
					 <TitleHeader title="Biography" />
						<p className={styles.description}>{specialist.description}</p>
					</div>

					{/* Expertise */}
					<div className={styles.section}>
						<TitleHeader title="Areas of Expertise" />
						<div className={styles.expertiseList}>
							{specialist.expertise.map((item, idx) => (
								<div key={idx} className={styles.expertiseItem}>
									{item}
								</div>
							))}
						</div>
					</div>

					{/* Availability */}
					<div className={styles.section}>
						<TitleHeader title="Weekly Availability" />
						<div className={styles.availabilityList}>
							{specialist.availability.map((day, idx) => (
								<div key={idx} className={styles.availabilityDay}>
									<Calendar size={16} /> {day}
								</div>
							))}
						</div>
					</div>

					{/* Education Note (if strict section needed, can add here) */}
					<div className={styles.section}>
						<TitleHeader title="Education" />
						<p className={styles.description}>
							<GraduationCap size={18} style={{ display: 'inline', marginRight: '8px' }} />
							{specialist.education}
						</p>
					</div>
				</div>

				{/* Right Column: Sidebar */}
				<div className={styles.rightColumn}>
					{/* CTA Buttons */}
					<div className={styles.bookingCard}>
						<h3 className={styles.bookingTitle}>Book Appointment</h3>
						{hospital && (
							<div className={styles.ctaButtons}>
								<a href={`tel:${hospital.phone}`} className={styles.ctaPrimary}>
									<Phone size={18} /> Book Appointment
								</a>
								<a
									href={hospital.website}
									target="_blank"
									rel="noopener noreferrer"
									className={styles.ctaSecondary}
								>
									<Globe size={18} /> Visit Website
								</a>
							</div>
						)}
					</div>

					{/* Hospital Info Card */}
					{hospital && (
						<div className={styles.sidebarCard}>
							<h3 className={styles.sidebarTitle}>Affiliated Hospital</h3>
							<div className={styles.hospitalCard}>
								<div>
									<div className={styles.hospitalName}>{hospital.name}</div>
									<div className={styles.hospitalAddress}>{hospital.address}</div>
								</div>

								<HospitalMap
									hospitals={[hospital]}
									selectedHospital={hospital}
									height="400px"
								/>

								{/* <div className={styles.hospitalContactItem}>
									<Phone size={16} /> {hospital.phone}
								</div> */}

								<button
									onClick={() => router.push(`/icare/hospitals/${hospital.id}`)}
									className={styles.hospitalLinkBtn}
								>
									View Hospital Details
								</button>
							</div>
						</div>
					)}

					{/* Quick Info / Languages */}
					<div className={styles.sidebarCard}>
						<div className={styles.quickInfoItem}>
							<div className={styles.infoIcon}>
								<Globe size={20} />
							</div>
							<div className={styles.infoContent}>
								<div className={styles.infoLabel}>Languages Spoken</div>
								<div className={styles.languagesList}>
									{specialist.languages.map((lang, idx) => (
										<span key={idx} className={styles.languageTag}>
											{lang}
										</span>
									))}
								</div>
							</div>
						</div>

						<div className={styles.quickInfoItem}>
							<div className={styles.infoIcon}>
								<GraduationCap size={20} />
							</div>
							<div className={styles.infoContent}>
								<div className={styles.infoLabel}>Education</div>
								<div className={styles.infoValue}>{specialist.education}</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}