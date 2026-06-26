import type { ReactNode, JSX } from "react";
import { NextIntlClientProvider, hasLocale } from "next-intl";
import { notFound } from "next/navigation";
import { routing } from "@/client/i18n/routing";
import { setRequestLocale } from "next-intl/server";
import { Victor_Mono } from "next/font/google";
import Header from "@/client/components/Header/Header";
import Footer from "@/client/components/Footer/Footer";
import StarsBackground from "@/client/components/StarsBackground/StarsBackground";
import CookieBanner from "@/client/components/CookieBanner";
import Analytics from "@/client/components/Analytics/Analytics";
import { ModalProvider } from "@/client/providers/ModalProvider";
import { Metadata } from "next";

import "./globals.scss";

const victorMono = Victor_Mono({
  variable: "--font-victor-mono",
  subsets: ["cyrillic", "latin"],
});

export const metadata: Metadata = {
  verification: {
    google: "ne6y1sQrac-nHCrsgVZ2t7svM3vh_B-PK7ZjaIhiahk",
  },
};

export function generateStaticParams(): { locale: string }[] {
  return routing.locales.map((locale) => ({ locale }));
}

type LocaleLayoutProps = {
  children: ReactNode;
  params: Promise<{ locale: string }>;
};

export default async function LocaleLayout({
  children,
  params,
}: LocaleLayoutProps): Promise<JSX.Element> {
  const { locale } = await params;

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  setRequestLocale(locale);

  let messages: Record<string, string> = {};
  try {
    messages = (await import(`../../../../messages/${locale}.json`)).default as Record<string, string>;
  } catch {
    console.error(`[layout] Missing messages for locale: ${locale}, falling back to empty`);
  }

  const langCode = locale === 'ua' ? 'uk' : locale;

  return (
    <html lang={langCode}>
      <body className={victorMono.variable}>
        <NextIntlClientProvider locale={locale} messages={messages}>
          <ModalProvider>
            <Header />
            {children}
            <Footer />
            <StarsBackground />
            <CookieBanner locale={locale} />
            <Analytics />
          </ModalProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
