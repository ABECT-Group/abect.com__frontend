'use client';

import { JSX } from 'react';
import { useTranslations } from 'next-intl';
import RichText from '@/client/components/RichText/RichText';
import type { Service } from '@/payload-types';
import './ServiceContent.scss';

interface ServiceContentProps {
	service: Service;
}

export default function ServiceContent({ service }: ServiceContentProps): JSX.Element {
	const t = useTranslations('ServiceDetail.content');

	return (
		<section className="service-content">
			<div className="container">
				<div className="service-content__description">
					<h2 className="service-content__title">{t('aboutTitle')}</h2>
					<RichText data={service.detailedDescription} />
				</div>

			</div>
		</section>
	);
}
