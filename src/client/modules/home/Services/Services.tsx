import { JSX } from 'react';
import { getTranslations } from 'next-intl/server';
import { getFeaturedServices } from '@/client/lib/services';
import { Link } from '@/client/i18n/navigation';
import ServicesList from '../../../components/ServicesList/ServicesList';
import './Services.scss';

interface ServicesProps {
	locale: string;
}

export default async function Services({ locale }: ServicesProps): Promise<JSX.Element | null> {
	const t = await getTranslations('HomePage.Services');

	// Отримуємо featured сервіси через ISR
	const services = await getFeaturedServices(locale);

	// Empty state - не показуємо секцію якщо немає сервісів
	if (services.length === 0) {
		return null;
	}

	return (
		<section
			className="services"
			id="services"
			itemScope
			itemType="https://schema.org/Organization"
		>
			<div className="container">
				{/* Заголовок секції */}
				<header className="services__header">
					<h2 className="services__title" itemProp="name">
						{t('title')}
					</h2>
					<p className="services__subtitle" itemProp="description">
						{t('subtitle')}
					</p>
				</header>

				{/* Сітка з сервісами */}
				<ServicesList services={services} locale={locale} startRows={4} />

				{/* Footer CTA */}
				<footer className="services__footer">
					<p className="services__footer-text">{t('footerText')}</p>
					<Link href="/calculator" className="cta cta-secondary" aria-label={t('calculateAriaLabel')}>
						{t('calculateButton')}
					</Link>
				</footer>
			</div>
		</section>
	);
}
