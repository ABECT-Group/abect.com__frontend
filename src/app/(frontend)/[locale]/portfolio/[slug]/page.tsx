import { setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { getPortfolioBySlug, getRelatedProjects } from '@/client/lib/portfolio';
import Project from '@/client/modules/project/Project';
import type { Media } from '@/payload-types';

export const dynamicParams = true;

export async function generateStaticParams({ params }: { params: { locale: string } }) {
	try {
		const { getPayload } = await import('payload');
		const { default: config } = await import('@payload-config');
		const payload = await getPayload({ config });
		const { docs } = await payload.find({
			collection: 'portfolio',
			where: { status: { equals: 'published' } },
			limit: 1000,
			locale: params.locale as 'uk' | 'en',
		});
		return docs.filter(p => p.slug).map(p => ({ slug: p.slug }));
	} catch {
		return [];
	}
}

type Params = {
	params: Promise<{
		locale: string;
		slug: string;
	}>;
};

// SEO Metadata
export async function generateMetadata({ params }: Params): Promise<Metadata> {
	const { locale, slug } = await params;
	const project = await getPortfolioBySlug(slug, locale);

	if (!project) {
		return {
			title: 'Project Not Found',
			description: 'The requested project could not be found'
		};
	}

	const ogImage = project.seo.ogImage as Media | null;
	const imageUrl = ogImage?.url || (locale === 'ua' ? 'https://agency.abect.com/seo/portfolio-og.jpg' : 'https://agency.abect.com/seo/en-portfolio-og.jpg');

	const fullUrl =
		locale === 'ua'
			? `https://agency.abect.com/portfolio/${slug}`
			: `https://agency.abect.com/${locale}/portfolio/${slug}`;

	return {
		title: project.seo.metaTitle,
		description: project.seo.metaDescription,
		keywords: project.seo.metaKeywords,
		metadataBase: new URL('https://agency.abect.com'),
		alternates: {
			canonical: fullUrl,
			languages: {
				'uk-UA': `https://agency.abect.com/portfolio/${slug}`,
				'en-US': `https://agency.abect.com/en/portfolio/${slug}`,
				'x-default': `https://agency.abect.com/en/portfolio/${slug}`
			}
		},
		authors: [{ name: 'ABECT', url: 'https://agency.abect.com' }],
		robots: {
			index: true,
			follow: true,
			'max-image-preview': 'large',
			'max-snippet': -1,
			'max-video-preview': -1
		},
		openGraph: {
			title: project.seo.metaTitle,
			description: project.seo.metaDescription,
			url: fullUrl,
			siteName: 'ABECT',
			images: [
				{
					url: imageUrl,
					width: 1200,
					height: 630,
					alt: project.title
				}
			],
			locale: locale === 'ua' ? 'uk_UA' : 'en_US',
			type: 'article',
			publishedTime: project.projectDate,
			authors: ['ABECT']
		},
		twitter: {
			card: 'summary_large_image',
			title: project.seo.metaTitle,
			description: project.seo.metaDescription,
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
export default async function ProjectPage({ params }: Params) {
	const { locale, slug } = await params;

	setRequestLocale(locale);

	// Отримуємо проект
	const project = await getPortfolioBySlug(slug, locale);

	if (!project) {
		notFound();
	}

	// Отримуємо схожі проекти
	const relatedProjects = await getRelatedProjects(project.id, project.service, locale, 3);

	return (
		<>
			{/* JSON-LD Schema.org */}
			<script
				type="application/ld+json"
				dangerouslySetInnerHTML={{
					__html: JSON.stringify({
						'@context': 'https://schema.org',
						'@type': 'CreativeWork',
						headline: project.title,
						description: project.shortDescription,
						image: (project.seo.ogImage as Media | null)?.url || (locale === 'ua' ? 'https://agency.abect.com/seo/portfolio-og.jpg' : 'https://agency.abect.com/seo/en-portfolio-og.jpg'),
						author: {
							'@type': 'Organization',
							name: 'ABECT',
							url: 'https://agency.abect.com'
						},
						publisher: {
							'@type': 'Organization',
							name: 'ABECT',
							logo: {
								'@type': 'ImageObject',
								url: 'https://agency.abect.com/logo.png'
							}
						},
						datePublished: project.projectDate,
						dateModified: project.updatedAt,
						url: locale === 'ua'
							? `https://agency.abect.com/portfolio/${slug}`
							: `https://agency.abect.com/${locale}/portfolio/${slug}`
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
								item: 'https://agency.abect.com'
							},
							{
								'@type': 'ListItem',
								position: 2,
								name: locale === 'ua' ? 'Портфоліо' : 'Portfolio',
								item: locale === 'ua'
									? 'https://agency.abect.com/portfolio'
									: `https://agency.abect.com/${locale}/portfolio`
							},
							{
								'@type': 'ListItem',
								position: 3,
								name: project.title,
								item: locale === 'ua'
									? `https://agency.abect.com/portfolio/${slug}`
									: `https://agency.abect.com/${locale}/portfolio/${slug}`
							}
						]
					})
				}}
			/>

			<Project project={project} relatedProjects={relatedProjects} locale={locale} />
		</>
	);
}
