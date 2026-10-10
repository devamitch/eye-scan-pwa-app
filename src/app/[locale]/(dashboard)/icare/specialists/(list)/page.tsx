'use client';

import Card from '@/components/base/cards';
import TitleHeader from '@/components/layout/Title/TitleHeader';
import { specialistsData, specialtyCategories } from '@/data/hospitals-specialists-data';
import { useSearch } from '@/hooks/use-search';
import {
	Baby,
	Calendar,
	Dna,
	Eye,
	Hospital,
	Microscope,
	Pill,
	Scan,
	Sparkles,
	Star,
	Stethoscope,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { ReactNode, useState } from 'react';
import styles from './specialists-page.module.css';

export default function SpecialistsPage() {
	const router = useRouter();
	const [selectedSpecialty, setSelectedSpecialty] = useState<string | undefined>();

	const {
		filters,
		filteredItems: filteredSpecialists,
		setSearchQuery,
		setRating,
		setSortBy,
		resetFilters,
		resultCount,
		totalCount,
	} = useSearch(specialistsData, ['name', 'nameKr', 'specialty', 'hospital', 'expertise'], {
		sortBy: 'rating',
		sortOrder: 'desc',
	});

	const handleSpecialistClick = (specialistId: string) => {
		router.push(`/icare/specialists/${specialistId}`);
	};

	const handleSpecialtyFilter = (specialtyId: string) => {
		const category = specialtyCategories.find((c) => c.id === specialtyId);
		if (category) {
			setSelectedSpecialty(category.name);
		}
	};

	const categoryIconMap: Record<string, ReactNode> = {
		'retinal-surgery': <Eye size={24} />,
		'refractive-surgery': <Microscope size={24} />,
		pediatric: <Baby size={24} />,
		glaucoma: <Pill size={24} />,
		cataract: <Scan size={24} />,
		corneal: <Eye size={24} />,
		oculoplastic: <Sparkles size={24} />,
		uveitis: <Dna size={24} />,
	};

	// Filter by selected specialty
	const displaySpecialists = selectedSpecialty
		? filteredSpecialists.filter((s) =>
				s.specialty.toLowerCase().includes(selectedSpecialty.toLowerCase())
			)
		: filteredSpecialists;

	return (
		<div className={styles.container}>
			{/* Header */}

			<TitleHeader title="Eye Care Specialists in Korea" />

			{/* Specialty Categories */}
			<div className={styles.categoriesSection}>
				<h3 className={styles.categoriesTitle}>Browse by Specialty</h3>
				<div className={styles.categoriesGrid}>
					<button
						onClick={() => setSelectedSpecialty(undefined)}
						className={`${styles.categoryCard} ${!selectedSpecialty ? styles.active : ''}`}
					>
						<span className={styles.categoryIcon}>
							<Hospital size={32} />
						</span>
						<span className={styles.categoryName}>All Specialists</span>
						<span className={styles.categoryCount}>{specialistsData.length}</span>
					</button>
					{specialtyCategories.map((category) => (
						<button
							key={category.id}
							onClick={() => handleSpecialtyFilter(category.id)}
							className={`${styles.categoryCard} ${selectedSpecialty === category.name ? styles.active : ''}`}
						>
							<span className={styles.categoryIcon}>
								{categoryIconMap[category.id] || <Stethoscope size={24} />}
							</span>
							<span className={styles.categoryName}>{category.name}</span>
							<span className={styles.categoryCount}>{category.count}</span>
						</button>
					))}
				</div>
			</div>

			{/* Search & Filters */}
			<div className={styles.searchSection}>
				<div className={styles.searchBar}>
					<input
						type="text"
						placeholder="Search specialists by name, specialty, or hospital..."
						value={filters.searchQuery}
						onChange={(e) => setSearchQuery(e.target.value)}
						className={styles.searchInput}
					/>
				</div>

				<div className={styles.filters}>
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
						<option value="experience">Sort by Experience</option>
					</select>

					{(filters.searchQuery || filters.rating || selectedSpecialty) && (
						<button
							onClick={() => {
								resetFilters();
								setSelectedSpecialty(undefined);
							}}
							className={styles.resetButton}
						>
							Reset Filters
						</button>
					)}
				</div>

				<div className={styles.resultsCount}>
					Showing {displaySpecialists.length} of {totalCount} specialists
					{selectedSpecialty && (
						<span className={styles.filterLabel}> in {selectedSpecialty}</span>
					)}
				</div>
			</div>

			{/* Specialists Grid */}
			<div className={styles.specialistsGrid}>
				{displaySpecialists.map((specialist) => (
					<div key={specialist.id} className={styles.specialistCard}>
						<Card
							variant="text-overlay"
							title={specialist.name}
							image={specialist.image}
							onClick={() => handleSpecialistClick(specialist.id)}
							cardContent={
								<div className={styles.specialistInfo}>
									<h3 className={styles.specialistName}>{specialist.name}</h3>
									<div className={styles.specialistNameKr}>
										{specialist.nameKr}
									</div>
									<div className={styles.specialistSpecialty}>
										{specialist.specialty}
									</div>
									<div className={styles.specialistHospital}>
										<Hospital size={14} className={styles.icon} />{' '}
										{specialist.hospital}
									</div>
									<div className={styles.specialistStats}>
										<span className={styles.rating}>
											<Star
												size={14}
												fill="currentColor"
												className={styles.starIcon}
											/>{' '}
											{specialist.rating}
										</span>
										<span className={styles.reviews}>
											({specialist.reviews} reviews)
										</span>
									</div>
									<div className={styles.specialistMeta}>
										<span className={styles.experience}>
											<Calendar size={14} className={styles.icon} />{' '}
											{specialist.experience}
										</span>
										<span className={styles.fee}>
											{specialist.consultationFee}
										</span>
									</div>
								</div>
							}
						/>
					</div>
				))}
			</div>

			{displaySpecialists.length === 0 && (
				<div className={styles.emptyState}>
					<p>No specialists found matching your criteria</p>
					<button
						onClick={() => {
							resetFilters();
							setSelectedSpecialty(undefined);
						}}
						className={styles.resetButton}
					>
						Clear Filters
					</button>
				</div>
			)}
		</div>
	);
}
