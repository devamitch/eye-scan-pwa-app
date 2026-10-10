'use client';

import Card from '@/components/base/cards';
import HospitalMap from '@/components/icare/HospitalMap';
import TitleHeader from '@/components/layout/Title/TitleHeader';
import { hospitalsData } from '@/data/hospitals-specialists-data';
import { useSearch } from '@/hooks/use-search';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import styles from './hospitals-page.module.css';

export default function HospitalsPage() {
	const router = useRouter();
	const [selectedHospital, setSelectedHospital] = useState<(typeof hospitalsData)[0] | null>(
		null
	);
	const [showMap, setShowMap] = useState(true);

	const {
		filters,
		filteredItems: filteredHospitals,
		setSearchQuery,
		setRating,
		setLocation,
		setSortBy,
		resetFilters,
		resultCount,
		totalCount,
	} = useSearch(hospitalsData, ['name', 'nameKr', 'specialties', 'location', 'address'], {
		sortBy: 'rating',
		sortOrder: 'desc',
	});

	const handleHospitalClick = (hospitalId: string) => {
		router.push(`/icare/hospitals/${hospitalId}`);
	};

	const handleMapSelect = (hospital: (typeof hospitalsData)[0]) => {
		setSelectedHospital(hospital);
		// Scroll to hospital card
		const element = document.getElementById(`hospital-${hospital.id}`);
		element?.scrollIntoView({ behavior: 'smooth', block: 'center' });
	};

	const uniqueLocations = Array.from(new Set(hospitalsData.map((h) => h.location)));

	return (
		<div className={styles.container}>
			{/* Header */}

			<TitleHeader title="Eye Care Hospitals in Korea" />

			{/* Search & Filters */}
			<div className={styles.searchSection}>
				<div className={styles.searchBar}>
					<input
						type="text"
						placeholder="Search hospitals by name, specialty, or location..."
						value={filters.searchQuery}
						onChange={(e) => setSearchQuery(e.target.value)}
						className={styles.searchInput}
					/>
					<button onClick={() => setShowMap(!showMap)} className={styles.mapToggle}>
						{showMap ? '📋 Hide Map' : '🗺️ Show Map'}
					</button>
				</div>

				<div className={styles.filters}>
					<select
						value={filters.location || ''}
						onChange={(e) => setLocation(e.target.value || undefined)}
						className={styles.select}
					>
						<option value="">All Locations</option>
						{uniqueLocations.map((loc) => (
							<option key={loc} value={loc}>
								{loc}
							</option>
						))}
					</select>

					<select
						value={filters.rating || ''}
						onChange={(e) =>
							setRating(e.target.value ? Number(e.target.value) : undefined)
						}
						className={styles.select}
					>
						<option value="">All Ratings</option>
						<option value="4.5">4.5+ Stars</option>
						<option value="4.7">4.7+ Stars</option>
						<option value="4.8">4.8+ Stars</option>
						<option value="4.9">4.9+ Stars</option>
					</select>

					<select
						value={filters.sortBy}
						onChange={(e) => setSortBy(e.target.value as any)}
						className={styles.select}
					>
						<option value="rating">Sort by Rating</option>
						<option value="reviews">Sort by Reviews</option>
						<option value="name">Sort by Name</option>
					</select>

					{(filters.searchQuery || filters.location || filters.rating) && (
						<button onClick={resetFilters} className={styles.resetButton}>
							Reset Filters
						</button>
					)}
				</div>

				<div className={styles.resultsCount}>
					Showing {resultCount} of {totalCount} hospitals
				</div>
			</div>

			{/* Map Section */}
			{showMap && (
				<div className={styles.mapSection}>
					<HospitalMap
						hospitals={filteredHospitals}
						selectedHospital={selectedHospital}
						onHospitalSelect={handleMapSelect}
						height="400px"
					/>
				</div>
			)}

			{/* Hospitals Grid */}
			<div className={styles.hospitalsGrid}>
				{filteredHospitals.map((hospital) => (
					<div
						key={hospital.id}
						id={`hospital-${hospital.id}`}
						className={`${styles.hospitalCard} ${
							selectedHospital?.id === hospital.id ? styles.highlighted : ''
						}`}
					>
						<Card
							variant="text-bottom"
							title={hospital.name}
							image={hospital.image}
							onClick={() => handleHospitalClick(hospital.id)}
						/>
						<div className={styles.hospitalInfo}>
							<div className={styles.hospitalName}>{hospital.nameKr}</div>
							<div className={styles.hospitalLocation}>📍 {hospital.location}</div>
							<div className={styles.hospitalStats}>
								<span className={styles.rating}>⭐ {hospital.rating}</span>
								<span className={styles.reviews}>({hospital.reviews} reviews)</span>
								<span className={styles.doctors}>
									👨‍⚕️ {hospital.doctorsCount} doctors
								</span>
							</div>
							<div className={styles.specialties}>
								{hospital.specialties.slice(0, 3).map((specialty, idx) => (
									<span key={idx} className={styles.specialtyTag}>
										{specialty}
									</span>
								))}
							</div>
						</div>
					</div>
				))}
			</div>

			{filteredHospitals.length === 0 && (
				<div className={styles.emptyState}>
					<p>No hospitals found matching your criteria</p>
					<button onClick={resetFilters} className={styles.resetButton}>
						Clear Filters
					</button>
				</div>
			)}
		</div>
	);
}
