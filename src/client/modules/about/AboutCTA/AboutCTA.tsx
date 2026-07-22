'use client';

import { JSX } from 'react';
import { useTranslations } from 'next-intl';
import { Send } from 'lucide-react';
import './AboutCTA.scss';

export default function AboutCTA(): JSX.Element {
	const t = useTranslations('AboutPage');

	return (
		<section className="about-cta">
			<h2 className="about-cta__title">{t('cta.title')}</h2>
			<p className="about-cta__text">{t('cta.text')}</p>
			<div className="about-cta__contacts">
				<a href="mailto:support@agency.abect.com" className="about-cta__link">
					support@agency.abect.com
				</a>
				<a href="https://t.me/+380980275819" className="about-cta__link">
					<Send size={18} />
					Telegram
				</a>
			</div>
			<button type="button" className="cta cta-primary">
				{t('cta.button')}
			</button>
		</section>
	);
}
