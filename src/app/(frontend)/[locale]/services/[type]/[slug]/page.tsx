import { setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { getServiceBySlug, getRelatedServices } from '@/client/lib/services';
import ServiceDetail from '@/client/modules/service/ServiceDetail';
import type { Media, ServiceType } from '@/payload-types';

export const dynamicParams = true;

export async function generateStaticParams({ params }: { params: { locale: string; type: string } }) {
  try {
    const { getPayload } = await import('payload');
    const { default: config } = await import('@payload-config');
    const payload = await getPayload({ config });

    const { docs: types } = await payload.find({
      collection: 'service-types',
      where: { slug: { equals: params.type } },
      limit: 1,
    });
    if (types.length === 0) return [];

    const { docs } = await payload.find({
      collection: 'services',
      where: { status: { equals: 'published' }, serviceType: { equals: types[0].id } },
      limit: 1000,
      locale: params.locale as 'uk' | 'en',
    });
    return docs.filter(s => s.slug).map(s => ({ slug: s.slug }));
  } catch {
    return [];
  }
}

type Params = {
	params: Promise<{
		locale: string;
		type: string;
		slug: string;
	}>;
};

// SEO Metadata
export async function generateMetadata({ params }: Params): Promise<Metadata> {
	const { locale, type: typeSlug, slug } = await params;
	const service = await getServiceBySlug(slug, locale);

	if (!service) {
		return {
			title: 'Service Not Found',
			description: 'The requested service could not be found'
		};
	}

	const heroImage = service.heroImage as Media | null;
	const imageUrl = heroImage?.url || (locale === 'ua' ? 'https://abect.com/seo/og.jpg' : 'https://abect.com/seo/en-og.jpg');

	const fullUrl =
		locale === 'ua'
			? `https://abect.com/services/${typeSlug}/${slug}`
			: `https://abect.com/${locale}/services/${typeSlug}/${slug}`;

	return {
		title: service.seo.metaTitle,
		description: service.seo.metaDescription,
		keywords: service.seo.metaKeywords,
		metadataBase: new URL('https://abect.com'),
		alternates: {
			canonical: fullUrl,
			languages: {
				'uk-UA': `https://abect.com/services/${typeSlug}/${slug}`,
				'en-US': `https://abect.com/en/services/${typeSlug}/${slug}`,
				'x-default': `https://abect.com/en/services/${typeSlug}/${slug}`
			}
		},
		authors: [{ name: 'ABECT', url: 'https://abect.com' }],
		robots: {
			index: true,
			follow: true,
			'max-image-preview': 'large',
			'max-snippet': -1,
			'max-video-preview': -1
		},
		openGraph: {
			title: service.seo.metaTitle,
			description: service.seo.metaDescription,
			url: fullUrl,
			siteName: 'ABECT',
			images: [
				{
					url: imageUrl,
					width: 1200,
					height: 630,
					alt: service.title
				}
			],
			locale: locale === 'ua' ? 'uk_UA' : 'en_US',
			type: 'article',
			publishedTime: service.publishedDate || service.createdAt,
			authors: ['ABECT']
		},
		twitter: {
			card: 'summary_large_image',
			title: service.seo.metaTitle,
			description: service.seo.metaDescription,
			images: [imageUrl]
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
export default async function ServicePage({ params }: Params) {
	const { locale, type: typeSlug, slug } = await params;

	setRequestLocale(locale);

	// Get service
	const service = await getServiceBySlug(slug, locale);

	if (!service) {
		notFound();
	}

	// Verify the service belongs to this type
	const serviceType = service.serviceType as ServiceType | null;
	if (!serviceType || serviceType.slug !== typeSlug) {
		notFound();
	}

	// Get related services
	const relatedServices = await getRelatedServices(service.id, serviceType.id, locale, 3);

	return (
		<>
			{/* JSON-LD Schema.org - Service */}
			<script
				type="application/ld+json"
				dangerouslySetInnerHTML={{
					__html: JSON.stringify({
						'@context': 'https://schema.org',
						'@type': 'Service',
						name: service.title,
						description: service.shortDescription,
						image: (service.heroImage as Media | null)?.url || (locale === 'ua' ? 'https://abect.com/seo/og.jpg' : 'https://abect.com/seo/en-og.jpg'),
						provider: {
							'@type': 'Organization',
							name: 'ABECT',
							url: 'https://abect.com'
						},
						offers: [
							service.hasWebliumOption && service.webliumPrice ? {
								'@type': 'Offer',
								name: 'Weblium Option',
								price: service.webliumPrice,
								priceCurrency: service.webliumPriceCurrency || 'UAH'
							} : null,
							{
								'@type': 'Offer',
								name: 'Custom Development',
								price: service.customPrice,
								priceCurrency: service.customPriceCurrency
							}
						].filter(Boolean),
						category: serviceType.name,
						url: locale === 'ua'
							? `https://abect.com/services/${typeSlug}/${slug}`
							: `https://abect.com/${locale}/services/${typeSlug}/${slug}`
					})
				}}
			/>

			{/* Breadcrumbs JSON-LD */}
			<script
				type="application/ld+json"
				dangerouslySetInnerHTML={{
					__html: JSON.stringify({
						'@context': 'https://schema.org',
						'@type': 'BreadcrumbList',
						itemListElement: [
							{
								'@type': 'ListItem',
								position: 1,
								name: locale === 'ua' ? 'Головна' : 'Home',
								item: 'https://abect.com'
							},
							{
								'@type': 'ListItem',
								position: 2,
								name: locale === 'ua' ? 'Послуги' : 'Services',
								item: locale === 'ua'
									? 'https://abect.com/services'
									: `https://abect.com/${locale}/services`
							},
							{
								'@type': 'ListItem',
								position: 3,
								name: serviceType.name,
								item: locale === 'ua'
									? `https://abect.com/services/${typeSlug}`
									: `https://abect.com/${locale}/services/${typeSlug}`
							},
							{
								'@type': 'ListItem',
								position: 4,
								name: service.title,
								item: locale === 'ua'
									? `https://abect.com/services/${typeSlug}/${slug}`
									: `https://abect.com/${locale}/services/${typeSlug}/${slug}`
							}
						]
					})
				}}
			/>

			<ServiceDetail
				service={service}
				relatedServices={relatedServices}
				locale={locale}
				serviceType={serviceType}
			/>
		</>
	);
}
