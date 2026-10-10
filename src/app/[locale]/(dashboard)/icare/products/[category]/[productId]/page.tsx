'use client';

import { Button } from '@/components/base/buttons';
import useTranslationData from '@/hooks/use-translation-data';
import { productsData } from '@/data/products-data';
import { ExternalLink, FlaskConical, ShieldCheck, Info, Star } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import styles from './product-page.module.css';
import { use } from 'react';
import ProductDetailLoading from './loading';

const productExternalLinks = {
	default: 'http://optuspharm.com/us/sub/otc_pd.php',
	'prod-001': 'https://m.smartstore.naver.com/ouestore/products/11585336675',
	'prod-002': 'https://m.smartstore.naver.com/ouestore/products/11368976394',
	'prod-003': 'https://m.smartstore.naver.com/ouestore/products/8096581893',
};

interface ProductPageProps {
	params: Promise<{
		category: string;
		productId: string;
	}>;
}

export default function ProductPage({ params }: ProductPageProps) {
	const router = useRouter();
	const { productModalText } = useTranslationData();
	const { category, productId } = use(params);

	const product = productsData.find((p) => p.id === productId);

	if (!product) {
		return (
			<div className={styles.container}>
				<div className={styles.errorMessage}>
					<h2>Product not found</h2>
					<Button onClick={() => router.back()} variant="secondary" size="medium">
						Go Back
					</Button>
				</div>
			</div>
		);
	}

	const externalLink =
		productExternalLinks[productId as keyof typeof productExternalLinks] ||
		productExternalLinks.default;
	const hasAmazonUrl = !!product.amazonUrl;

	const renderRating = (rating: number) => {
		return (
			<div className={styles.ratingContainer}>
				{[...Array(5)].map((_, index) => (
					<Star
						key={index}
						size={20}
						className={index < rating ? styles.starFilled : styles.starEmpty}
						fill={index < rating ? 'currentColor' : 'none'}
					/>
				))}
				<span className={styles.ratingText}>({rating}/5)</span>
			</div>
		);
	};

	const renderContent = (content: string[] | string, isIngredients: boolean = false) => {
		if (Array.isArray(content)) {
			if (isIngredients) {
				return <p>{content.join(', ')}</p>;
			}
			return (
				<ul className={styles.list}>
					{content.map((item, index) => (
						<li key={index}>{item}</li>
					))}
				</ul>
			);
		}
		return <p>{content}</p>;
	};

	return (
		<div className={styles.container}>
			<div className={styles.productLayout}>
				{/* Left Section - Image and Buttons */}
				<div className={styles.leftSection}>
					<div className={styles.imageContainer}>
						<Image
							src={product.image}
							alt={product.name}
							width={2050}
							height={400}
							className={styles.productImage}
							priority
						/>
					</div>

					<div className={styles.buttonGroup}>
						<Button
							onClick={() =>
								window.open(externalLink, '_blank', 'noopener,noreferrer')
							}
							variant="secondary"
							size="large"
							leftIcon={<ExternalLink size={18} />}
							className={styles.learnMoreButton}
						>
							Learn More
						</Button>
						{hasAmazonUrl && (
							<Button
								onClick={() =>
									window.open(product.amazonUrl!, '_blank', 'noopener,noreferrer')
								}
								variant="primary"
								size="large"
								leftIcon={<ExternalLink size={18} />}
								className={styles.buyButton}
							>
								{productModalText.buyNow || 'Buy Now'}
							</Button>
						)}
					</div>
				</div>

				{/* Right Section - Product Details */}
				<div className={styles.rightSection}>
					<div className={styles.header}>
						<h1 className={styles.title}>{product.name}</h1>
						<p className={styles.description}>{product.description}</p>
						{renderRating(product.rating || 4)}
					</div>

					<div className={styles.detailsSection}>
						{product.ingredients && (
							<div className={styles.detailCard}>
								<div className={styles.detailHeader}>
									<FlaskConical size={20} className={styles.icon} />
									<h3 className={styles.detailTitle}>
										{productModalText.ingredients || 'Key Ingredients'}
									</h3>
								</div>
								<div className={styles.detailContent}>
									{renderContent(product.ingredients)}
								</div>
							</div>
						)}

						{product.indications && (
							<div className={styles.detailCard}>
								<div className={styles.detailHeader}>
									<ShieldCheck size={20} className={styles.icon} />
									<h3 className={styles.detailTitle}>
										{productModalText.indications || 'Indications'}
									</h3>
								</div>
								<div className={styles.detailContent}>
									{renderContent(product.indications)}
								</div>
							</div>
						)}

						{product.usage && (
							<div className={styles.detailCard}>
								<div className={styles.detailHeader}>
									<Info size={20} className={styles.icon} />
									<h3 className={styles.detailTitle}>
										{productModalText.usage || 'Dosage'}
									</h3>
								</div>
								<div className={styles.detailContent}>
									<p>{product.usage}</p>
								</div>
							</div>
						)}
					</div>

					{!hasAmazonUrl && (
						<div className={styles.noPurchaseBox}>
							<p>Available at local pharmacies and healthcare providers</p>
							<p>Contact your nearest pharmacy for purchase information</p>
						</div>
					)}
				</div>
			</div>
		</div>
	);
}
