'use client';


import MainLayout from '@/components/landing-page/layout/main-layout';
import useTranslationData from '@/hooks/use-translation-data';
import { ChevronDown } from 'lucide-react';
import { useState } from 'react';
import styles from './faq.module.css';

export default function FAQPage() {
	const { faqText } = useTranslationData();
	const [openIndex, setOpenIndex] = useState<number | null>(null);

	const toggleQuestion = (index: number) => {
		setOpenIndex(openIndex === index ? null : index);
	};

	return (
		<MainLayout>
			<div className={styles.container}>
				<div className={styles.header}>
					<h1 className={styles.title}>{faqText.title}</h1>
					<p className={styles.subtitle}>{faqText.subtitle}</p>
				</div>

				<div className={styles.content}>
					{faqText.questions.map(
						(item: { question: string; answer: string }, index: number) => (
							<div key={index} className={styles.faqItem}>
								<button
									className={`${styles.questionButton} ${openIndex === index ? styles.active : ''}`}
									onClick={() => toggleQuestion(index)}
									aria-expanded={openIndex === index}
									aria-controls={`answer-${index}`}
								>
									<span className={styles.question}>{item.question}</span>
									<ChevronDown
										className={`${styles.chevron} ${openIndex === index ? styles.rotate : ''}`}
										size={20}
										aria-hidden="true"
									/>
								</button>
								<div
									id={`answer-${index}`}
									className={`${styles.answerWrapper} ${openIndex === index ? styles.open : ''}`}
									role="region"
								>
									<div className={styles.answer}>
										<p>{item.answer}</p>
									</div>
								</div>
							</div>
						)
					)}
				</div>
			</div>
		</MainLayout>
	);
}
