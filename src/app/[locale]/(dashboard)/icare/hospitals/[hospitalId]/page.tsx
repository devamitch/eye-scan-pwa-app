import { hospitalsData } from '@/data/hospitals-specialists-data';
import HospitalDetailPage from './hospital-detail';

interface PageProps {
	params: {
		hospitalId: string;
	};
}

// Generate static params for all categories
export async function generateStaticParams() {
	return hospitalsData.map((category) => ({
		hospitalId: category.id,
	}));
}

// Generate metadata for SEO
export async function generateMetadata({ params }: PageProps) {
	const category = hospitalsData.find((cat) => cat.id === params.hospitalId);

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
	return <HospitalDetailPage hospitalId={params.hospitalId} />;
}
