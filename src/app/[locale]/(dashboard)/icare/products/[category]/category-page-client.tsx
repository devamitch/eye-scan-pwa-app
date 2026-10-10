'use client';

import Card from '@/components/base/cards';
import { productsData } from '@/data/products-data';
import { useRouter } from 'next/navigation';
import styles from './category-page.module.css';
import useTranslatedData from '@/hooks/use-translation-data';


interface CategoryPageClientProps {
	categoryId: string;
}

export default function CategoryPageClient({ categoryId }: CategoryPageClientProps) {
	const router = useRouter();
	const { categories } = useTranslatedData();
	// Find the category
	const category = categories.find((cat) => cat.id === categoryId);

	// Filter products by category
	const categoryProducts = productsData.filter(
		(product) => product.category.toLowerCase() === categoryId.toLowerCase()
	);

	const handleProductClick = (product: any) => {
		// Navigate to product page
		router.push(`/icare/products/${categoryId}/${product.id}`);
	};

	const handleBackClick = () => {
		router.push('/icare');
	};

	if (!category) {
		return (
			<div className={styles.container}>
				<div className={styles.errorMessage}>
					<h2>Category not found</h2>
					<button onClick={handleBackClick} className={styles.backButton}>
						Back to iCare
					</button>
				</div>
			</div>
		);
	}

	return (
		<div className={styles.container}>
			<div className={styles.header}>
				<div className={styles.categoryInfo}>
					 <h2 className={styles.categoryTitle}>{category.title}</h2>
						<p >{category.description}</p>
						<span className={styles.count}>{categoryProducts.length} Products</span>
					
				</div>
				<div />
			</div>

			<div className={styles.productsGrid}>
				{categoryProducts.map((product) => (
					<div key={product.id} className={styles.productCard}>
						<Card
							variant="text-top"
							title={product.name}
							image={product.image}
							onClick={() => handleProductClick(product)}
						/>
					</div>
				))}
			</div>

			{categoryProducts.length === 0 && (
				<div className={styles.emptyState}>
					<p>No products found in this category</p>
				</div>
			)}
		</div>
	);
}
