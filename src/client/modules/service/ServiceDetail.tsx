import React, { JSX } from 'react';
import type { Service, ServiceType } from '@/payload-types';

import ServiceHero from './ServiceHero/ServiceHero';
import PricingComparison from './PricingComparison/PricingComparison';
import ServiceContent from './ServiceContent/ServiceContent';
import PortfolioShowcase from './PortfolioShowcase/PortfolioShowcase';
import FAQSection from './FAQSection/FAQSection';
import RelatedServices from './RelatedServices/RelatedServices';

interface ServiceDetailProps {
	service: Service;
	relatedServices: Service[];
	locale: string;
	serviceType?: ServiceType;
}

function ServiceDetail({ service, relatedServices, locale, serviceType }: ServiceDetailProps): JSX.Element {
	return (
		<main>
			<ServiceHero service={service} locale={locale} serviceType={serviceType} />


			{service.hasWebliumOption && (
				<PricingComparison service={service} locale={locale} />
			)}

			<ServiceContent service={service} />

			{service.relatedPortfolioProjects && service.relatedPortfolioProjects.length > 0 && (
				<PortfolioShowcase projects={service.relatedPortfolioProjects} locale={locale} />
			)}

			<RelatedServices services={relatedServices} locale={locale} />

			{service.faq && service.faq.length > 0 && (
				<FAQSection faq={service.faq} />
			)}

		</main>
	);
}

export default ServiceDetail;
