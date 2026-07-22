import { setRequestLocale } from 'next-intl/server';
import { getTranslations } from 'next-intl/server';
import { routing } from '@/client/i18n/routing';
import { getCalculatorConfig, defaultCalculatorConfig } from '@/client/lib/calculator';
import Calculator, { CalculatorProvider, CalculatorConfig } from '@/client/components/Calculator';
import type { Metadata } from 'next';

type Params = {
  params: Promise<{
    locale: string;
  }>;
};

// Генерація статичних параметрів для локалей
export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

// SEO Metadata
export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'Calculator.seo' });

  const title = t('title');
  const description = t('description');
  const keywords = t('keywords');

  const fullUrl =
    locale === 'ua'
      ? 'https://agency.abect.com/calculator'
      : `https://agency.abect.com/${locale}/calculator`;

  return {
    title,
    description,
    keywords,
    metadataBase: new URL('https://agency.abect.com'),
    alternates: {
      canonical: fullUrl,
      languages: {
        'uk-UA': 'https://agency.abect.com/calculator',
        'en-US': 'https://agency.abect.com/en/calculator',
        'x-default': 'https://agency.abect.com/en/calculator',
      },
    },
    authors: [{ name: 'ABECT', url: 'https://agency.abect.com' }],
    robots: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
    openGraph: {
      title,
      description,
      url: fullUrl,
      siteName: 'ABECT',
      images: [
        {
          url: locale === 'ua' ? 'https://agency.abect.com/seo/calculator-og.jpg' : 'https://agency.abect.com/seo/en-calculator-og.jpg',
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
      locale: locale === 'ua' ? 'uk_UA' : 'en_US',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [locale === 'ua' ? 'https://agency.abect.com/seo/calculator-og.jpg' : 'https://agency.abect.com/seo/en-calculator-og.jpg'],
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

// Helper to transform API config to CalculatorConfig (converts null to undefined)
function transformConfig(apiConfig: Awaited<ReturnType<typeof getCalculatorConfig>>): CalculatorConfig {
  if (!apiConfig) return defaultCalculatorConfig;

  return {
    projectTypes: (apiConfig.projectTypes || defaultCalculatorConfig.projectTypes).map((p) => ({
      slug: p.slug,
      name: p.name,
      description: p.description ?? undefined,
      icon: p.icon ?? undefined,
      hasWebliumOption: p.hasWebliumOption ?? false,
      webliumBasePrice: p.webliumBasePrice ?? undefined,
      customBasePrice: p.customBasePrice,
    })),
    pagesConfig: apiConfig.pagesConfig || defaultCalculatorConfig.pagesConfig,
    additionalServices: (apiConfig.additionalServices || defaultCalculatorConfig.additionalServices).map((s) => ({
      slug: s.slug,
      name: s.name,
      description: s.description ?? undefined,
      price: s.price,
      icon: s.icon ?? undefined,
    })),
    urgencyOptions: (apiConfig.urgencyOptions || defaultCalculatorConfig.urgencyOptions).map((u) => ({
      slug: u.slug,
      name: u.name,
      description: u.description ?? undefined,
      coefficient: u.coefficient,
      timelineText: u.timelineText ?? undefined,
    })),
    generalSettings: {
      currency: apiConfig.generalSettings?.currency || defaultCalculatorConfig.generalSettings.currency,
      showPriceFrom: apiConfig.generalSettings?.showPriceFrom ?? defaultCalculatorConfig.generalSettings.showPriceFrom,
      minimumOrderPrice: apiConfig.generalSettings?.minimumOrderPrice ?? defaultCalculatorConfig.generalSettings.minimumOrderPrice,
    },
  };
}

// Server Component
export default async function CalculatorPage({ params }: Params) {
  const { locale } = await params;

  setRequestLocale(locale);

  // Fetch calculator config
  const apiConfig = await getCalculatorConfig(locale);

  // Use API config or default (with proper type transformation)
  const config: CalculatorConfig = transformConfig(apiConfig);

  return (
    <>
      {/* JSON-LD Schema.org - WebApplication */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'WebApplication',
            name: locale === 'ua' ? 'Калькулятор вартості сайту' : 'Website Cost Calculator',
            description:
              locale === 'ua'
                ? 'Онлайн калькулятор для розрахунку вартості створення сайту'
                : 'Online calculator for estimating website development cost',
            url:
              locale === 'ua'
                ? 'https://agency.abect.com/calculator'
                : `https://agency.abect.com/${locale}/calculator`,
            applicationCategory: 'BusinessApplication',
            operatingSystem: 'Any',
            offers: {
              '@type': 'AggregateOffer',
              lowPrice: config.generalSettings.minimumOrderPrice,
              priceCurrency: config.generalSettings.currency,
              offerCount: config.projectTypes.length,
            },
            provider: {
              '@type': 'Organization',
              name: 'ABECT',
              url: 'https://agency.abect.com',
            },
          }),
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
                item: 'https://agency.abect.com',
              },
              {
                '@type': 'ListItem',
                position: 2,
                name: locale === 'ua' ? 'Калькулятор' : 'Calculator',
                item:
                  locale === 'ua'
                    ? 'https://agency.abect.com/calculator'
                    : `https://agency.abect.com/${locale}/calculator`,
              },
            ],
          }),
        }}
      />

      <CalculatorProvider initialConfig={config}>
        <Calculator config={config} />
      </CalculatorProvider>
    </>
  );
}
