import { exerciseCategories } from '@/data/exercise-categories-data';
import ExerciseCategoryPageClient from './exercise-category-page-client';

interface PageProps {
	params: {
		categoryId: string;
	};
}

// Generate static params for all exercise categories
export async function generateStaticParams() {
	return exerciseCategories.map((category) => ({
		categoryId: category.id,
	}));
}

// Generate metadata for SEO
export async function generateMetadata({ params }: PageProps) {
	const category = exerciseCategories.find((cat) => cat.id === params.categoryId);

	if (!category) {
		return {
			title: 'Category Not Found | iCare',
		};
	}

	return {
		title: `${category.title} | iCare Eye Exercises`,
		description: category.description,
	};
}

export default function ExerciseCategoryPage({ params }: PageProps) {
	return <ExerciseCategoryPageClient categoryId={params.categoryId} />;
}
