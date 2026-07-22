import { setRequestLocale } from 'next-intl/server';
import { getTranslations } from 'next-intl/server';
import { routing } from '@/client/i18n/routing';
import ContactsPage from '@/client/modules/contacts/ContactsPage/ContactsPage';
import { Fragment } from 'react';
import type { Metadata } from 'next';

type Params = {
	params: Promise<{
		locale: string;
	}>;
};

// Генерация статичних параметров для локалей
export function generateStaticParams() {
	return routing.locales.map((locale) => ({ locale }));
}

// SEO Metadata
export async function generateMetadata({ params }: Params): Promise<Metadata> {
	const { locale } = await params;
	const t = await getTranslations({ locale, namespace: 'ContactsPage.seo' });

	const title = t('title');
	const description = t('description');
	const keywords = t('keywords');

	const fullUrl =
		locale === 'ua'
			? 'https://agency.abect.com/contacts'
			: `https://agency.abect.com/${locale}/contacts`;

	return {
		title,
		description,
		keywords,
		metadataBase: new URL('https://agency.abect.com'),
		alternates: {
			canonical: fullUrl,
			languages: {
				'uk-UA': 'https://agency.abect.com/contacts',
				'en-US': 'https://agency.abect.com/en/contacts',
				'x-default': 'https://agency.abect.com/en/contacts'
			}
		},
		authors: [{ name: 'ABECT', url: 'https://agency.abect.com' }],
		robots: {
			index: true,
			follow: true,
			'max-image-preview': 'large',
			'max-snippet': -1
		},
		openGraph: {
			title,
			description,
			url: fullUrl,
			siteName: 'ABECT',
			images: [
				{
					url: locale === 'ua' ? 'https://agency.abect.com/seo/contacts-og.jpg' : 'https://agency.abect.com/seo/en-contacts-og.jpg',
					width: 1200,
					height: 630,
					alt: title
				}
			],
			locale: locale === 'ua' ? 'uk_UA' : 'en_US',
			type: 'website'
		},
		twitter: {
			card: 'summary_large_image',
			title,
			description,
			images: [locale === 'ua' ? 'https://agency.abect.com/seo/contacts-og.jpg' : 'https://agency.abect.com/seo/en-contacts-og.jpg']
		},
		icons: {
			icon: [
				{ url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
				{ url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' }
			],
			apple: '/apple-touch-icon.png'
		},
		manifest: '/site.webmanifest'
	};
}

// Server Component
export default async function ContactsServerPage({ params }: Params) {
	const { locale } = await params;

	setRequestLocale(locale);

	const pageUrl = locale === 'ua' ? 'https://agency.abect.com/contacts' : 'https://agency.abect.com/en/contacts';
	const breadcrumbJsonLd = {
		'@context': 'https://schema.org',
		'@type': 'BreadcrumbList',
		itemListElement: [
			{ '@type': 'ListItem', position: 1, name: locale === 'ua' ? 'Головна' : 'Home', item: 'https://agency.abect.com' },
			{ '@type': 'ListItem', position: 2, name: locale === 'ua' ? 'Контакти' : 'Contacts', item: pageUrl },
		],
	};

	return (
		<Fragment>
			<script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
			<ContactsPage locale={locale} />
		</Fragment>
	);
}
