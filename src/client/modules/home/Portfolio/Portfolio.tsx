import { JSX } from 'react';
import { Link } from '@/client/i18n/navigation';
import { getTranslations } from 'next-intl/server';
import { getFeaturedPortfolio } from '@/client/lib/portfolio';
import PortfolioList from '../../../components/PortfolioList/PortfolioList';
import './Portfolio.scss';

interface PortfolioProps {
	locale: string;
}

export default async function Portfolio({ locale }: PortfolioProps): Promise<JSX.Element | null> {
	const t = await getTranslations('HomePage.Portfolio');

	// Отримуємо featured проєкти через ISR
	const projects = await getFeaturedPortfolio(locale);

	// Empty state - не показуємо секцію якщо немає проєктів
	if (projects.length === 0) {
		return null;
	}

	return (
		<section
			className="portfolio"
			id="portfolio"
			itemScope
			itemType="https://schema.org/CollectionPage"
		>
			<div className="container">
				{/* Заголовок секції */}
				<header className="portfolio__header">
					<span className="portfolio__label">
						{t('sectionLabel')}
					</span>
					<h2 className="portfolio__title" itemProp="name">
						{t('title')}
					</h2>
					<p className="portfolio__subtitle" itemProp="description">
						{t('subtitle')}
					</p>
				</header>

				{/* Сітка з проєктами */}
				<PortfolioList projects={projects} locale={locale} />

				{/* CTA кнопки */}
				<footer className="portfolio__footer">
					<Link
						href={`/portfolio`}
						className="cta cta-with-icon"
						aria-label={t('viewAllButton')}
					>
						{t('viewAllButton')}
					</Link>
					<button
						type="button"
						data-open-modal
						className="cta cta-secondary"
						aria-label={t('orderButton')}
					>
						{t('orderButton')}
					</button>
				</footer>
			</div>
		</section>
	);
}