import { setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { getPostBySlug, getRelatedPosts } from '@/client/lib/blog';
import Article from '@/client/modules/article/Article';
import type { Media, User, Category } from '@/payload-types';

export const dynamicParams = true;

export async function generateStaticParams({ params }: { params: { locale: string; category: string } }) {
	try {
		const { getPayload } = await import('payload');
		const { default: config } = await import('@payload-config');
		const payload = await getPayload({ config });

		const { docs: cats } = await payload.find({
			collection: 'categories',
			where: { slug: { equals: params.category } },
			limit: 1,
		});
		if (cats.length === 0) return [];

		const { docs } = await payload.find({
			collection: 'posts',
			where: { status: { equals: 'published' }, category: { equals: cats[0].id } },
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
		category: string;
		slug: string;
	}>;
};

// SEO Metadata
export async function generateMetadata({ params }: Params): Promise<Metadata> {
	const { locale, slug } = await params;
	const post = await getPostBySlug(slug, locale);

	if (!post) {
		return {
			title: 'Article Not Found',
			description: 'The requested article could not be found'
		};
	}

	const cover = post.cover as Media | null;
	const imageUrl = cover?.url || (locale === 'ua' ? 'https://agency.abect.com/seo/blog-og.jpg' : 'https://agency.abect.com/seo/en-blog-og.jpg');

	const category = post.category as Category | null;
	const categorySlug = category?.slug || 'uncategorized';

	const fullUrl =
		locale === 'ua'
			? `https://agency.abect.com/blog/${categorySlug}/${slug}`
			: `https://agency.abect.com/${locale}/blog/${categorySlug}/${slug}`;

	const author = post.author as User | null;
	const authorName = author ? `${author.firstName} ${author.lastName}` : 'ABECT';

	return {
		title: post.seo.metaTitle,
		description: post.seo.metaDescription,
		keywords: post.seo.metaKeywords,
		metadataBase: new URL('https://agency.abect.com'),
		alternates: {
			canonical: fullUrl,
			languages: {
				'uk-UA': `https://agency.abect.com/blog/${categorySlug}/${slug}`,
				'en-US': `https://agency.abect.com/en/blog/${categorySlug}/${slug}`,
				'x-default': `https://agency.abect.com/en/blog/${categorySlug}/${slug}`
			}
		},
		authors: [{ name: authorName, url: 'https://agency.abect.com' }],
		robots: {
			index: true,
			follow: true,
			'max-image-preview': 'large',
			'max-snippet': -1,
			'max-video-preview': -1
		},
		openGraph: {
			title: post.seo.metaTitle,
			description: post.seo.metaDescription,
			url: fullUrl,
			siteName: 'ABECT',
			images: [
				{
					url: imageUrl,
					width: 1200,
					height: 630,
					alt: post.title
				}
			],
			locale: locale === 'ua' ? 'uk_UA' : 'en_US',
			type: 'article',
			publishedTime: post.date,
			authors: [authorName]
		},
		twitter: {
			card: 'summary_large_image',
			title: post.seo.metaTitle,
			description: post.seo.metaDescription,
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
export default async function ArticlePage({ params }: Params) {
	const { locale, category: categorySlug, slug } = await params;

	setRequestLocale(locale);

	// Отримуємо статтю
	const post = await getPostBySlug(slug, locale);

	if (!post) {
		notFound();
	}

	// Перевіряємо чи категорія в URL відповідає категорії статті
	const postCategory = post.category as Category | null;
	const postCategorySlug = postCategory?.slug || 'uncategorized';

	// Якщо категорія не співпадає - 404
	if (categorySlug !== postCategorySlug) {
		notFound();
	}

	// Отримуємо category ID для related posts
	const categoryId = typeof post.category === 'object'
		? post.category.id
		: post.category;

	// Отримуємо схожі статті
	const relatedPosts = await getRelatedPosts(post.id, categoryId, locale, 3);

	// Отримуємо дані для Schema.org
	const cover = post.cover as Media | null;
	const author = post.author as User | null;
	const category = post.category as Category | null;
	const authorName = author ? `${author.firstName} ${author.lastName}` : 'ABECT';

	return (
		<>
			{/* JSON-LD Schema.org BlogPosting */}
			<script
				type="application/ld+json"
				dangerouslySetInnerHTML={{
					__html: JSON.stringify({
						'@context': 'https://schema.org',
						'@type': 'BlogPosting',
						headline: post.title,
						description: post.description,
						image: cover?.url || (locale === 'ua' ? 'https://agency.abect.com/seo/blog-og.jpg' : 'https://agency.abect.com/seo/en-blog-og.jpg'),
						author: {
							'@type': 'Person',
							name: authorName
						},
						publisher: {
							'@type': 'Organization',
							name: 'ABECT',
							logo: {
								'@type': 'ImageObject',
								url: 'https://agency.abect.com/logo.png'
							}
						},
						datePublished: post.date,
						dateModified: post.updatedAt,
						url: locale === 'ua'
							? `https://agency.abect.com/blog/${categorySlug}/${slug}`
							: `https://agency.abect.com/${locale}/blog/${categorySlug}/${slug}`,
						articleSection: category?.name,
						keywords: category?.name,
						wordCount: post.readTime * 200,
						timeRequired: `PT${Math.ceil(post.readTime / 60)}M`
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
								name: locale === 'ua' ? 'Блог' : 'Blog',
								item: locale === 'ua'
									? 'https://agency.abect.com/blog'
									: `https://agency.abect.com/${locale}/blog`
							},
							{
								'@type': 'ListItem',
								position: 3,
								name: category?.name || 'Category',
								item: locale === 'ua'
									? `https://agency.abect.com/blog/${categorySlug}`
									: `https://agency.abect.com/${locale}/blog/${categorySlug}`
							},
							{
								'@type': 'ListItem',
								position: 4,
								name: post.title,
								item: locale === 'ua'
									? `https://agency.abect.com/blog/${categorySlug}/${slug}`
									: `https://agency.abect.com/${locale}/blog/${categorySlug}/${slug}`
							}
						]
					})
				}}
			/>

			<Article post={post} relatedPosts={relatedPosts} locale={locale} />
		</>
	);
}
