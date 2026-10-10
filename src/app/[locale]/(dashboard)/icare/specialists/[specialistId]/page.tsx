import { specialistsData } from '@/data/hospitals-specialists-data';
import SpecialistDetailPage from './specialist-detail';

interface PageProps {
	params: {
		specialistId: string;
	};
}

// Generate static params for all categories
export async function generateStaticParams() {
	return specialistsData.map((category) => ({
		specialistId: category.id,
	}));
}

// Generate metadata for SEO
export async function generateMetadata({ params }: PageProps) {
	const category = specialistsData.find((cat) => cat.id === params.specialistId);

	if (!category) {
		return {
			title: 'Category Not Found | iCare',
		};
	}

	return {
		title: `${category.name}`,
		description: category.description,
	};
}

export default function CategoryPage({ params }: PageProps) {
	return <SpecialistDetailPage specialistId={params.specialistId} />;
}
