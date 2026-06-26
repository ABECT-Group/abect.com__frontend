'use client';

import { JSX } from 'react';
import { useTranslations } from 'next-intl';
import { Link } from '@/client/i18n/navigation';
import type { Portfolio } from '@/payload-types';
import PortfolioList from '@/client/components/PortfolioList/PortfolioList';
import './RelatedProjects.scss';

interface RelatedProjectsProps {
	projects: Portfolio[];
	locale: string;
}

export default function RelatedProjects({ projects, locale }: RelatedProjectsProps): JSX.Element | null {
	const t = useTranslations('ProjectDetail.related');

	if (!projects || projects.length === 0) {
		return null;
	}

	return (
		<section className="related-projects">
			<div className="container">
				<header className="related-projects__header">
					<h2 className="related-projects__title">{t('title')}</h2>
					<p className="related-projects__subtitle">{t('subtitle')}</p>
				</header>

				<PortfolioList projects={projects} locale={locale} startRows={3} />

				<footer className="related-projects__footer">
					<Link href="/portfolio" className="cta cta-secondary">
						{t('viewAll')}
					</Link>
				</footer>
			</div>
		</section>
	);
}
