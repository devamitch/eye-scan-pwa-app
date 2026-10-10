import { categories } from '@/data/products-data';
import CategoryPageClient from './category-page-client';

interface PageProps {
	params: {
		category: string;
	};
}

// Generate static params for all categories
export async function generateStaticParams() {
	return categories.map((category) => ({
		category: category.id,
	}));
}

// Generate metadata for SEO
export async function generateMetadata({ params }: PageProps) {
	const category = categories.find((cat) => cat.id === params.category);

	if (!category) {
		return {
			title: 'Category Not Found | iCare',
		};
	}

	return {
		title: `${category.title} | iCare Eye Care Products`,
		description: category.description,
	};
}

export default function CategoryPage({ params }: PageProps) {
	return <CategoryPageClient categoryId={params.category} />;
}
