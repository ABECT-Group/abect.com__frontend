import { setRequestLocale } from 'next-intl/server';
import { routing } from '@/client/i18n/routing';
import Home from '@/client/modules/home/Home';
import { Metadata } from 'next';
import { Fragment } from 'react';

type Params = {
	params: Promise<{
		locale: string;
	}>;
};
// Генерація статичних параметрів для локалей
export function generateStaticParams() {
	return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
	const { locale } = await params;
	const isUa = locale === 'ua';

	const title = isUa
		? 'Розробка сайтів. Запуск реклами | ABECT'
		: 'Website Development. Marketing Launch - ABECT';

	const description = isUa
		? 'ABECT професійна розробка сайтів для бізнесу. Ми створюємо адаптивні, швидкі та SEO-оптимізовані сайти для вашого успіху в інтернеті. З нами Ваш бізнес вийде на новий рівень!'
		: 'ABECT provides professional website development for businesses. We build fast, responsive, and SEO-optimized websites to help your brand grow online. Take your business to the next level with us!';

	const keywords = isUa
		? 'сайт, Next.js, розробка сайтів, створення сайтів, веб-дизайн, SEO оптимізація, бізнес сайт, корпоративний сайт, інтернет-магазин, landing page, WordPress, React'
		: 'website, Next.js, web development, website creation, web design, SEO optimization, business website, corporate website, online store, landing page, WordPress, React';

	const fullUrl = locale === "ua" ? `https://agency.abect.com` : `https://agency.abect.com/${locale}`;
	const ogImage = locale === 'ua' ? 'https://agency.abect.com/seo/og.jpg' : 'https://agency.abect.com/seo/en-og.jpg';

	return {
		title,
		description,
		metadataBase: new URL('https://agency.abect.com'),
		alternates: {
			canonical: fullUrl,
			languages: {
				'uk-UA': 'https://agency.abect.com',
				'en-US': 'https://agency.abect.com/en',
				'x-default': 'https://agency.abect.com/en',
			},
		},
		authors: [{ name: 'Abect', url: 'https://agency.abect.com' }],
		robots: {
			index: true,
			follow: true,
		},
		keywords,
		openGraph: {
			title,
			description,
			url: fullUrl,
			siteName: 'Abect',
			images: [
				{
					url: ogImage,
					width: 1200,
					height: 630,
				},
			],
			locale: locale === 'ua' ? 'uk_UA' : 'en_US',
			type: 'website',
		},
		twitter: {
			card: 'summary_large_image',
			title,
			description,
			images: [ogImage],
		},
		icons: {
			icon: [
				{ url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
				{ url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
			],
			apple: '/apple-touch-icon.png',
		},
		manifest: '/site.webmanifest',
	};
}

export default async function HomePage({ params }: Params) {
	const { locale } = await params;
	const isUa = locale === 'ua';

	setRequestLocale(locale);

	const orgJsonLd = {
		'@context': 'https://schema.org',
		'@type': ['Organization', 'ProfessionalService'],
		name: 'ABECT',
		url: 'https://agency.abect.com',
		logo: 'https://agency.abect.com/seo/og.jpg',
		email: 'support@agency.abect.com',
		telephone: '+380980275819',
		priceRange: '₴₴',
		serviceType: 'Web Development',
		areaServed: ['UA', 'PL', 'DE', 'CZ'],
		contactPoint: {
			'@type': 'ContactPoint',
			telephone: '+380980275819',
			contactType: 'customer service',
			availableLanguage: ['Ukrainian', 'English'],
		},
		address: { '@type': 'PostalAddress', addressCountry: 'UA' },
		sameAs: ['https://t.me/abect_agency'],
	};

	const websiteJsonLd = {
		'@context': 'https://schema.org',
		'@type': 'WebSite',
		name: 'ABECT',
		url: 'https://agency.abect.com',
		description: isUa
			? 'Професійна розробка сайтів для бізнесу'
			: 'Professional website development for business',
		inLanguage: isUa ? 'uk-UA' : 'en-US',
	};

	return (
		<Fragment>
			<script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(orgJsonLd) }} />
			<script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }} />
			<Home locale={locale} />
		</Fragment>
	);
}