'use client';

import Card from '@/components/base/cards';
import HospitalMap from '@/components/icare/HospitalMap';
import { hospitalsData, specialistsData } from '@/data/hospitals-specialists-data';
import {

	Globe,
	MapPin,
	Phone,
	Star,
	Stethoscope,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import styles from './hospital-detail.module.css';
import TitleHeader from '@/components/layout/Title/TitleHeader';

interface HospitalDetailPageProps {
	hospitalId: string;
}

export default function HospitalDetailPage({ hospitalId }: HospitalDetailPageProps) {
	const router = useRouter();
	const hospital = hospitalsData.find((h) => h.id === hospitalId);

	if (!hospital) {
		return (
			<div className={styles.container}>
				<div className={styles.error}>
					<h2>Hospital Not Found</h2>
					<button
						onClick={() => router.push('/icare/hospitals')}
						className={styles.backButton}
					>
						Back to Hospitals
					</button>
				</div>
			</div>
		);
	}

	// Get specialists at this hospital
	const hospitalSpecialists = specialistsData.filter((s) => s.hospitalId === hospital.id);

	return (
		<div className={styles.container}>
			{/* Hero Section */}
			<div className={styles.hero}>
				<img src={hospital.image} alt={hospital.name} className={styles.heroImage} />
				<div className={styles.heroOverlay}>
					<span className={styles.hospitalTag}>
						 Hospital
					</span>
					<h1 className={styles.hospitalName}>{hospital.name}</h1>
					<p className={styles.hospitalNameKr}>{hospital.nameKr}</p>
					<div className={styles.heroStats}>
						<span className={styles.rating}>
							<Star size={18} fill="currentColor" className={styles.starIcon} />{' '}
							{hospital.rating}
						</span>
						<span className={styles.reviews}>({hospital.reviews} reviews)</span>
						<span className={styles.doctors}>
							<Stethoscope size={18} className={styles.doctorIcon} />{' '}
							{hospital.doctorsCount} doctors
						</span>
					</div>
				</div>
			</div>

			<div className={styles.mainGrid}>
				{/* Left Column: Main Content */}
				<div className={styles.leftColumn}>
					{/* Description */}
					<div className={styles.section}>
						<TitleHeader title="About" />
						<p className={styles.description}>{hospital.description}</p>
					</div>

					{/* Specialties */}
					<div className={styles.section}>
						<TitleHeader title="Specialties" />
						<div className={styles.specialtiesList}>
							{hospital.specialties.map((specialty, idx) => (
								<div key={idx} className={styles.specialtyItem}>
									{specialty}
								</div>
							))}
						</div>
					</div>

					{/* Services */}
					<div className={styles.section}>
						<TitleHeader title="Facilities & Services" />
						<div className={styles.servicesGrid}>
							{hospital.services.map((service, idx) => (
								<div key={idx} className={styles.serviceItem}>
									<span>{service}</span>
								</div>
							))}
						</div>
					</div>

					{/* Specialists at this Hospital */}
					{hospitalSpecialists.length > 0 && (
						<div className={styles.section}>
							<TitleHeader title="Our Specialists" />
							<div className={styles.specialistsGrid}>
								{hospitalSpecialists.map((specialist) => (
									<div
										key={specialist.id}
										className={styles.specialistCardWrapper}
									>
										<Card
											variant="text-overlay"
											title={specialist.name}
											image={specialist.image}
											onClick={() =>
												router.push(`/icare/specialists/${specialist.id}`)
											}
											cardContent={
												<div className={styles.specialistInfo}>
													<h3 className={styles.specialistName}>{specialist.name}</h3>
													<div className={styles.specialistSpecialty}>
														{specialist.specialty}
													</div>
													<div className={styles.specialistRating}>
														<Star
															size={14}
															fill="currentColor"
															className={styles.starIconSmall}
															style={{ color: '#fbbf24' }}
														/>{' '}
														{specialist.rating}
													</div>
												</div>
											}
										/>
									</div>
								))}
							</div>
						</div>
					)}
				</div>

				{/* Right Column: Sidebar */}
				<div className={styles.rightColumn}>
					<div className={styles.bookingCard}>
						<h3 className={styles.bookingTitle}>Book Appointment</h3>
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
								<Globe size={18} /> Visit Official Website
							</a>
						</div>
					</div>

					{/* Quick Info Card */}
					<div className={styles.sidebarCard}>
						<div className={styles.quickInfoItem}>
							<div className={styles.infoIcon}>
								<MapPin size={20} />
							</div>
							<div>
								<div className={styles.infoLabel}>Location</div>
								<div className={styles.infoValue}>{hospital.address}</div>
								<div className={styles.infoValueKr}>{hospital.addressKr}</div>
							</div>
						</div>
						<div className={styles.quickInfoItem}>
							<div className={styles.infoIcon}>
								<Phone size={20} />
							</div>
							<div>
								<div className={styles.infoLabel}>Phone</div>
								<div className={styles.infoValue}>
									<a href={`tel:${hospital.phone}`}>{hospital.phone}</a>
								</div>
							</div>
						</div>
						<div className={styles.quickInfoItem}>
							<div className={styles.infoIcon}>
								<Globe size={20} />
							</div>
							<div>
								<div className={styles.infoLabel}>Website</div>
								<div className={styles.infoValue}>
									<a
										href={hospital.website}
										target="_blank"
										rel="noopener noreferrer"
									>
										Visit Website
									</a>
								</div>
							</div>
						</div>
					</div>

					{/* Opening Hours */}
					<div className={styles.sidebarCard}>
						<h3 className={styles.ctaTitle}>Opening Hours</h3>
						<div className={styles.openingHoursList}>
							<div className={styles.hoursRow}>
								<span className={styles.dayLabel}>Mon - Fri</span>
								<span className={styles.dayValue}>
									{hospital.openingHours.weekday}
								</span>
							</div>
							<div className={styles.hoursRow}>
								<span className={styles.dayLabel}>Saturday</span>
								<span className={styles.dayValue}>
									{hospital.openingHours.saturday}
								</span>
							</div>
							<div className={styles.hoursRow}>
								<span className={styles.dayLabel}>Sunday</span>
								<span className={styles.dayValue}>
									{hospital.openingHours.sunday}
								</span>
							</div>
						</div>
					</div>

					{/* Map Location */}
					<div className={styles.mapContainer}>
						<HospitalMap
							hospitals={[hospital]}
							selectedHospital={hospital}
							height="100%"
						/>
					</div>

				</div>
			</div>

			{/* Mobile Sticky Bottom Bar */}
			<div className={styles.mobileBottomBar}>
				<a href={`tel:${hospital.phone}`} className={styles.ctaPrimary}>
					<Phone size={18} /> Call Now
				</a>
				<a
					href={hospital.website}
					target="_blank"
					rel="noopener noreferrer"
					className={styles.ctaSecondary}
				>
					<Globe size={18} /> Website
				</a>
			</div>
		</div>
	);
}