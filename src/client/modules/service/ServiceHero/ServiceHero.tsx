'use client';

import { JSX, useState } from 'react';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { Clock, CheckCircle } from 'lucide-react';
import Breadcrumbs from '@/client/components/Breadcrumbs/Breadcrumbs';
import type { Service, Media, ServiceType } from '@/payload-types';
import './ServiceHero.scss';

interface ServiceHeroProps {
	service: Service;
	locale: string;
	serviceType?: ServiceType;
}

export default function ServiceHero({ service, locale, serviceType }: ServiceHeroProps): JSX.Element {
	const t = useTranslations('ServiceDetail');
	const [activeTab, setActiveTab] = useState<'weblium' | 'custom'>(
		service.hasWebliumOption ? 'weblium' : 'custom'
	);

	// Get image URL
	const heroImage = service.heroImage as Media | null;
	const imageUrl = heroImage?.url;

	// Get service type from prop or from service relationship
	const type = serviceType || (service.serviceType as ServiceType | null);
	const typeName = type?.name || '';
	const typeSlug = type?.slug || '';

	// Active data based on selected tab
	const activePrice = activeTab === 'weblium' ? service.webliumPrice : service.customPrice;
	const activeCurrency = activeTab === 'weblium' ? service.webliumPriceCurrency : service.customPriceCurrency;
	const activeTimeline = activeTab === 'weblium' ? service.webliumTimeline : service.customTimeline;
	const activeFeatures = activeTab === 'weblium' ? service.webliumFeatures : service.customFeatures;

	return (
		<section className="service-hero">
			<div className="container">
				<div className="service-hero__wrapper">
					<Breadcrumbs
						chapter='services'
						slug={service.title}
						categorySlug={typeSlug}
						categoryName={typeName}
					/>

					{/* Hero Content */}
					<div className="service-hero__content">
						{/* Left: Info */}
						<div className="service-hero__info">
							{/* Badge */}
							<div className="service-hero__meta">
								{typeName && (
									<span className="service-hero__badge">
										{typeName}
									</span>
								)}
								{service.featured && (
									<span className="service-hero__featured">
										★ {t('featured')}
									</span>
								)}
							</div>

							{/* Title */}
							<h1 className="service-hero__title">{service.title}</h1>

							{/* Short Description */}
							<p className="service-hero__description">{service.shortDescription}</p>

							{/* Pricing Tabs */}
							{service.hasWebliumOption && (
								<div className="service-hero__tabs">
									<button
										type="button"
										className={`service-hero__tab ${activeTab === 'weblium' ? 'service-hero__tab--active' : ''}`}
										onClick={() => setActiveTab('weblium')}
									>
										<span className="service-hero__tab-label">Weblium</span>
										<span className="service-hero__tab-price">
											{locale === 'ua' ? 'від' : 'from'} {service.webliumPrice} {service.webliumPriceCurrency}
										</span>
									</button>
									<button
										type="button"
										className={`service-hero__tab ${activeTab === 'custom' ? 'service-hero__tab--active' : ''}`}
										onClick={() => setActiveTab('custom')}
									>
										<span className="service-hero__tab-label">Custom</span>
										<span className="service-hero__tab-price">
											{locale === 'ua' ? 'від' : 'from'} {service.customPrice} {service.customPriceCurrency}
										</span>
									</button>
								</div>
							)}

							{/* Active Option Details */}
							<div className="service-hero__details">
								<div className="service-hero__detail-item">
									<Clock size={20} />
									<span>
										<strong>{t('timeline')}:</strong> {activeTimeline}
									</span>
								</div>

								{!service.hasWebliumOption && (
									<div className="service-hero__detail-item">
										<strong>{t('price')}:</strong> {activePrice} {activeCurrency}
									</div>
								)}
							</div>

							{/* Features */}
							<div className="service-hero__features">
								<h3 className="service-hero__features-title">{t('included')}</h3>
								<ul className="service-hero__features-list">
									{activeFeatures?.slice(0, 5).map((item, index) => (
										<li key={index}>
											<CheckCircle size={18} />
											<span>{item.feature}</span>
										</li>
									))}
								</ul>
							</div>

							{/* CTA Button */}
							<button type="button" data-open-modal className="service-hero__cta cta">
								{t('orderButton')}
							</button>
						</div>

						{/* Right: Hero Image (if exists) */}
						{imageUrl && (
							<div className="service-hero__image">
								<Image
									src={imageUrl}
									alt={service.title}
									width={800}
									height={600}
									priority
									sizes="(max-width: 768px) 100vw, 50vw"
									className="service-hero__image--img"
								/>
							</div>
						)}
					</div>
				</div>
			</div>
		</section>
	);
}
