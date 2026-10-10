'use client';
import { DummyProfileImg } from '@/assets/images';
import Card from '@/components/base/cards';
import ExerciseModal from '@/components/icare/exercise-modal/exercise-modal';
import TitleHeader from '@/components/layout/Title/TitleHeader';
import ProfileCard from '@/components/profile/profile-card/Profile-card';
import { EYE_TRACKING_CONSTANTS } from '@/constants/eye-tracking';
import { exerciseCategories } from '@/data/exercise-categories-data';
import useTranslationData from '@/hooks/use-translation-data';
import { useRouter } from '@/i18n/navigation';
import { useEyeTrackingContext } from '@/provider/EyeTrackingProvider';
import useAppStore from '@/store';
import { ExerciseCardData } from '@/types';
import { LogOut } from 'lucide-react';
import { useCallback, useMemo, useState } from 'react';
import 'swiper/css';
import 'swiper/css/pagination';
import { Pagination } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import { useShallow } from 'zustand/react/shallow';
import styles from './ProfilePage.module.css';

export default function ProfilePage() {
	const logout = useAppStore((state) => state.auth.logout);
	const authUser = useAppStore((state) => state.auth.user);
	const [selectedExercise, setSelectedExercise] = useState<ExerciseCardData | null>(null);
	const [isExerciseModalOpen, setIsExerciseModalOpen] = useState(false);
	const PlaceholderImage = DummyProfileImg;
	const { ExerciseData, mockReportBrief, profilePageText, icarePageText } = useTranslationData();
	const { getMetricsHistory } = useEyeTrackingContext();
	const { settingsPageText } = useTranslationData();
	const { metrics } = useEyeTrackingContext();
	const router = useRouter();
	const chronologicalAge = useAppStore(
		useShallow((state) => state.auth.user?.age ?? EYE_TRACKING_CONSTANTS.FALLBACK.EYE_AGE)
	);
	const handleLogout = async () => {
		try {
			await logout();
			router.push('/signin');
		} catch (error) {
			console.error('Error signing out: ', error);
		}
	};

	const DefaultchartData = [
		{ v: 15, high: false },
		{ v: 20, high: true },
		{ v: 18, high: false },
		{ v: 28, high: true },
		{ v: 12, high: false },
		{ v: 22, high: true },
		{ v: 10, high: false },
	];

	const generateChartData = useCallback(
		(history: EyeMetrics[]) => {
			if (!history || history.length === 0) {
				return DefaultchartData;
			}

			const recentData = history.slice(-7);
			return recentData.map((metric) => ({
				v: Math.round(metric.blinkRate || 15),
				high: (metric.blinkRate || 15) > 20 || metric.strainLevelIdx > 1,
			}));
		},
		[DefaultchartData]
	);

	const metricsHistory = useMemo(() => getMetricsHistory() || [], [getMetricsHistory]);
	const chartData = useMemo(
		() => generateChartData(metricsHistory),
		[generateChartData, metricsHistory]
	);

	const handleExerciseClick = (exercise: ExerciseCardData) => {
		setSelectedExercise(exercise);
		setIsExerciseModalOpen(true);
	};

	const handleCloseExerciseModal = () => {
		setIsExerciseModalOpen(false);
		setSelectedExercise(null);
	};

	const handleExerciseCategoryClick = (categoryId: string) => {
		router.push(`/icare/exercises/${categoryId}`);
	};

	return (
		<div className={styles.container}>
			<ProfileCard
				name={authUser?.name || ''}
				email={authUser?.email || ''}
				image={authUser?.avatar || PlaceholderImage}
				age={chronologicalAge ?? null}
			/>
			<>
				{/* <TitleHeader title={profilePageText.sectionTitles.recentEyeScan} />
				<RecentScan report={mockReportBrief} chartData={chartData} /> */}
			</>
			<>
				{/* <TitleHeader title={profilePageText.sectionTitles.scanHistory} />
				<Link href="/dashboard" className={styles.Historysection}>
					<h2 className={styles.title}>{profilePageText.scanHistory.title}</h2>
					<p className={styles.description}>{profilePageText.scanHistory.description}</p>
				</Link> */}
			</>
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

			<button onClick={handleLogout} className={styles.Logoutbutton}>
				<LogOut size={21} />
				{settingsPageText.logOut}
			</button>

			<ExerciseModal
				isOpen={isExerciseModalOpen}
				onClose={handleCloseExerciseModal}
				exercise={selectedExercise}
				currentMetrics={metrics}
			/>
		</div>
	);
}
