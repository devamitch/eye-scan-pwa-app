'use client';

import Card from '@/components/base/cards';
import { Button } from '@/components/base/buttons';
import TitleHeader from '@/components/layout/Title/TitleHeader';
import { hospitalsData, specialistsData } from '@/data/hospitals-specialists-data';
import { exerciseCategories } from '@/data/exercise-categories-data';
import { categories as categoriesData, Category } from '@/data/products-data';
import useTranslationData, { useTranslatedData } from '@/hooks/use-translation-data';
import { useRouter } from 'next/navigation';
import { useRef } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import styles from '../IcarePage.module.css';
import { ChevronRight } from 'lucide-react';
import IcareLoading from './loading';

export default function ICarePage() {
	const router = useRouter();
	const { icarePageText } = useTranslationData();

const { categories } = useTranslatedData();

	// Navigation handlers
	const handleExerciseCategoryClick = (categoryId: string) => {
		router.push(`/icare/exercises/${categoryId}`);
	};
	const handleCategoryClick = (categoryId: string) => {
		router.push(`/icare/products/${categoryId}`);
	};

	const handleHospitalClick = (hospitalId: string) => {
		router.push(`/icare/hospitals/${hospitalId}`);
	};

	const handleSpecialistClick = (specialistId: string) => {
		router.push(`/icare/specialists/${specialistId}`);
	};

	const handleViewAllHospitals = () => {
		router.push('/icare/hospitals');
	};

	const handleViewAllSpecialists = () => {
		router.push('/icare/specialists');
	};

	return (
		<div className={styles.container}>
			{/* Eye Exercises Section */}
			<>
				<TitleHeader title={icarePageText.sectionTitles.eyeExercises} />
				<div className={styles.mainSection}>
					<Swiper
						modules={[Pagination]}
						spaceBetween={16}
						slidesPerView={1}
						pagination={{ clickable: true }}
						breakpoints={{
							768: {
								slidesPerView: 3,
							},
						}}
						className={styles.swiperContainer}
					>
						{exerciseCategories.map((category) => (
							<SwiperSlide key={category.id}>
								<div className={styles.cardWrapper}>
									<Card
										title={category.title}
										image={category.image}
										onClick={() => handleExerciseCategoryClick(category.id)}
									/>
								</div>
							</SwiperSlide>
						))}
					</Swiper>
				</div>
			</>

			{/* Product Categories Section */}
			<>
				<TitleHeader title={icarePageText.sectionTitles.eyeProducts} />
				<div className={styles.mainSection}>
					<Swiper
						modules={[Pagination]}
						spaceBetween={16}
						slidesPerView={1}
						pagination={{ clickable: true }}
						breakpoints={{
							768: {
								slidesPerView: 2,
							},
						}}
						className={styles.swiperContainer}
					>
						{categories.map((category: Category) => (
							<SwiperSlide key={category.id}>
								<div className={styles.cardWrapper}>
									<Card
										title={category.title}
										image={category.image}
										onClick={() => handleCategoryClick(category.id)}
									/>
								</div>
							</SwiperSlide>
						))}
					</Swiper>
				</div>
			</>

			{/* Korean Hospitals Section */}
			<>
				<div className={styles.sectionHeader}>
					<TitleHeader title="Eye Care Hospitals" />
					<Button onClick={handleViewAllHospitals} size="medium" variant="link">
						View All <ChevronRight size={16} />
					</Button>
				</div>
				<div className={styles.mainSection}>
					<Swiper
						modules={[Pagination]}
						spaceBetween={16}
						slidesPerView={1}
						pagination={{ clickable: true }}
						breakpoints={{
							768: {
								slidesPerView: 4,
							},
						}}
						className={styles.swiperContainer}
					>
						{hospitalsData.slice(0, 6).map((hospital) => (
							<SwiperSlide key={hospital.id}>
								<div className={styles.cardWrapper}>
									<Card
										variant="text-bottom"
										title={hospital.name}
										image={hospital.image}
										location={hospital.location}
										rating={hospital.rating}
										onClick={() => handleHospitalClick(hospital.id)}
									/>
								</div>
							</SwiperSlide>
						))}
					</Swiper>
				</div>
			</>

			{/* Eye Specialists Section */}
			<>
				<div className={styles.sectionHeader}>
					<TitleHeader title={icarePageText.sectionTitles.eyeSpecialists} />
					<Button onClick={handleViewAllSpecialists} size="medium" variant="link">
						View All <ChevronRight size={16} />
					</Button>
				</div>
				<div className={styles.mainSection}>
					<Swiper
						modules={[Pagination]}
						spaceBetween={16}
						slidesPerView={1}
						pagination={{ clickable: true }}
						breakpoints={{
							768: {
								slidesPerView: 4,
							},
						}}
						className={styles.swiperContainer}
					>
						{specialistsData.slice(0, 6).map((specialist) => (
							<SwiperSlide key={specialist.id}>
								<div className={styles.cardWrapper}>
									<Card
										variant="text-bottom"
										title={specialist.name}
										image={specialist.image}
										specialty={specialist.specialty}
										rating={specialist.rating}
										onClick={() => handleSpecialistClick(specialist.id)}
									/>
								</div>
							</SwiperSlide>
						))}
					</Swiper>
				</div>
			</>
		</div>
	);
}
